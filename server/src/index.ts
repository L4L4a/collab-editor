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

app.post('/ai', async (req, res) => {
  const { code, action } = req.body;

  const prompt = action === 'explain'
    ? `Explain what this code does in simple terms:\n\n${code}`
    : `Fix any bugs in this code and return the corrected version with a brief explanation:\n\n${code}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
      }),
    });

    const data = await response.json() as any;
    const result = data.choices[0].message.content;
    res.json({ result });
  } catch (err) {
    console.error('ai route error:', err);
    res.status(500).json({ error: 'ai request failed' });
  }
});

start();