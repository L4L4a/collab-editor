import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

console.log('connecting to redis:', redisUrl);

export const publisher = createClient({ url: redisUrl });
export const subscriber = createClient({ url: redisUrl });

export async function connectRedis() {
  await publisher.connect();
  await subscriber.connect();
  console.log('redis connected');
}

export function getRoomKey(roomId: string) {
  return `room:${roomId}:code`;
}