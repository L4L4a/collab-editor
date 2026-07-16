import { Server, Socket } from 'socket.io';
import { publisher, subscriber, getRoomKey } from './redis';

interface JoinRoomPayload {
  roomId: string;
  username: string;
}

// track who's in each room
const rooms = new Map<string, Set<string>>();

export function setupSocket(io: Server) {
  subscriber.subscribe('code-update', (message) => {
    const { roomId, code, senderId } = JSON.parse(message);

    // broadcast to everyone in the room except the sender
    io.to(roomId).except(senderId).emit('code-changed', { code });
  });

  io.on('connection', (socket: Socket) => {
    console.log(`user connected: ${socket.id}`);

    socket.on('join-room', async ({ roomId, username }: JoinRoomPayload) => {
      socket.join(roomId);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      rooms.get(roomId)!.add(username);

      // send them whatever code is already in the room
      const savedCode = await publisher.get(getRoomKey(roomId));
      if (savedCode) {
        socket.emit('code-changed', { code: savedCode });
      }

      // tell everyone else someone joined
      io.to(roomId).emit('room-users', Array.from(rooms.get(roomId)!));
      console.log(`${username} joined room ${roomId}`);
    });

    socket.on('code-update', async ({ roomId, code }: { roomId: string; code: string }) => {
      // save latest code to redis so new joiners get it
      await publisher.set(getRoomKey(roomId), code);

      // publish so all server instances pick it up
      await publisher.publish('code-update', JSON.stringify({
        roomId,
        code,
        senderId: socket.id
      }));
    });

    socket.on('disconnect', () => {
      // clean up user from whichever room they were in
      rooms.forEach((users, roomId) => {
        users.forEach(username => {
          if (users.has(username)) {
            users.delete(username);
            io.to(roomId).emit('room-users', Array.from(users));
          }
        });
      });
      console.log(`user disconnected: ${socket.id}`);
    });
  });
}