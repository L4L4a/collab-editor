import { useEffect, useState } from 'react';
import { socket } from './socket';
import Editor from './components/Editor';
import Toolbar from './components/Toolbar';
import UserPresence from './components/UserPresence';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export default function App() {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('// start coding...\n');
  const [users, setUsers] = useState<string[]>([]);
  const [aiOutput, setAiOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    socket.on('room-users', (roomUsers: string[]) => {
      setUsers(roomUsers);
    });

    return () => {
      socket.off('room-users');
    };
  }, []);

  function joinRoom() {
    if (!roomId.trim() || !username.trim()) return;
    socket.connect();
    socket.emit('join-room', { roomId, username });
    setJoined(true);
  }

  async function handleAiAction(action: 'explain' | 'fix') {
    if (!code.trim()) return;
    setIsLoading(true);
    setAiOutput('');

    try {
      const res = await axios.post(`${SERVER_URL}/ai`, { code, action });
      setAiOutput(res.data.result);
    } catch (err) {
      setAiOutput('something went wrong, try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (!joined) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#1e1e1e',
        gap: '12px',
      }}>
        <h2 style={{ color: '#fff', marginBottom: '8px' }}>Collab Editor</h2>
        <input
          placeholder="Room ID"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Your name"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={inputStyle}
        />
        <button onClick={joinRoom} style={buttonStyle}>
          Join Room
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#1e1e1e', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toolbar roomId={roomId} onAiAction={handleAiAction} isLoading={isLoading} />

      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 16px', borderBottom: '1px solid #333' }}>
        <UserPresence users={users} />
      </div>

      <Editor roomId={roomId} code={code} onChange={setCode} />

      {aiOutput && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#2d2d2d',
          border: '1px solid #444',
          borderRadius: '8px',
          padding: '16px',
          maxWidth: '400px',
          color: '#fff',
          fontSize: '13px',
          lineHeight: '1.6',
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, color: '#4f46e5' }}>✨ AI</span>
            <button
              onClick={() => setAiOutput('')}
              style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
            >✕</button>
          </div>
          {aiOutput}
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '6px',
  border: '1px solid #444',
  backgroundColor: '#2d2d2d',
  color: '#fff',
  fontSize: '14px',
  width: '260px',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 24px',
  backgroundColor: '#4f46e5',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  cursor: 'pointer',
  width: '260px',
};