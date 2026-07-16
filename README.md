<div align="center">

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Laptop.png" alt="Laptop" width="80" />

# Collab Editor

**Real-time collaborative code editing — with AI built in.**

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

</div>

---

## What is this?

Collab Editor is a browser-based code editor where multiple people can write code in the same room at the same time — changes sync instantly across every connected user. Think Google Docs, but for code.

On top of that, there's an AI layer powered by Groq that can explain what your code does or detect and fix bugs on demand.

---

## Features

- 🔄 **Real-time sync** — every keystroke broadcasts to all users in the room instantly via WebSockets
- 👥 **Live presence** — see exactly who's in your room at any moment
- 🧠 **VS Code editor** — Monaco Editor (the same engine that powers VS Code) runs in the browser
- ✨ **AI Explain** — get a plain-English breakdown of any code in the editor
- 🔧 **AI Fix** — let Groq's LLaMA model detect bugs and return a corrected version
- 🏠 **Room-based sessions** — share a room ID with anyone and start coding together instantly

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Editor | Monaco Editor |
| Real-time | Socket.IO, WebSockets |
| Backend | Node.js, Express |
| Pub/Sub & State | Redis |
| AI | Groq API (LLaMA 3.1 8B) |
| Deploy | Render (server), Netlify (client) |

---

## Architecture
┌─────────────────────┐        ┌──────────────────────┐
│   React Client      │        │   Express Server      │
│                     │        │                       │
│  Monaco Editor  ────┼──────▶ │   Socket.IO           │
│  Socket.IO client   │        │   /ai endpoint        │
│  UserPresence       │◀───────┼─                      │
└─────────────────────┘        └──────────┬────────────┘
│
┌───────────▼────────────┐
│   Redis                 │
│                         │
│  pub/sub (code-update)  │
│  room state persistence │
└─────────────────────────┘

When a user types, the change is:
1. Emitted to the server via Socket.IO
2. Saved to Redis under `room:{id}:code`
3. Published to the `code-update` channel
4. Broadcast to every other user in the room

New users who join mid-session get the latest code instantly from Redis.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Redis instance ([Redis Cloud free tier](https://redis.io/try-free) works)
- A [Groq API key](https://console.groq.com)

### Setup

Clone the repo:
```bash
git clone https://github.com/L4L4a/collab-editor.git
cd collab-editor
```

**Server**
```bash
cd server
npm install
npm run dev
```

**Client**
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`, enter a room ID and your name — share the room ID with anyone to start collaborating.

---

## Demo

> Enter any room ID → share it → code together in real time.

| Join Screen | Editor |
|---|---|
| Enter a room ID and your name | Live sync, presence badges, AI buttons |

---

<div align="center">

Built by [Elvis Kenneth](https://github.com/L4L4a)

</div>
