interface Props {
  users: string[];
}

export default function UserPresence({ users }: Props) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {users.map((user) => (
        <div
          key={user}
          title={user}
          style={{
            backgroundColor: '#4f46e5',
            color: 'white',
            borderRadius: '999px',
            padding: '4px 10px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          {user}
        </div>
      ))}
    </div>
  );
}