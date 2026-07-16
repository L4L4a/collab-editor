interface Props {
  roomId: string;
  onAiAction: (action: 'explain' | 'fix') => void;
  isLoading: boolean;
}

export default function Toolbar({ roomId, onAiAction, isLoading }: Props) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      backgroundColor: '#1e1e1e',
      borderBottom: '1px solid #333',
    }}>
      <div style={{ color: '#888', fontSize: '13px' }}>
        room: <span style={{ color: '#fff', fontWeight: 600 }}>{roomId}</span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => onAiAction('explain')}
          disabled={isLoading}
          style={{
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '13px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? 'thinking...' : '✨ Explain'}
        </button>

        <button
          onClick={() => onAiAction('fix')}
          disabled={isLoading}
          style={{
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '13px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? 'thinking...' : '🔧 Fix'}
        </button>
      </div>
    </div>
  );
}