import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectRedis } from './redis';
import { setupSocket } from './socket';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// allowing the client dev server and prod url
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;

async function start() {
  await connectRedis();
  setupSocket(io);

  httpServer.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
}

start();