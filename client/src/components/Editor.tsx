import MonacoEditor from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import { socket } from '../socket';

interface Props {
  roomId: string;
  code: string;
  onChange: (code: string) => void;
}

export default function Editor({ roomId, code, onChange }: Props) {
  const isRemoteChange = useRef(false);

  useEffect(() => {
    socket.on('code-changed', ({ code: incoming }: { code: string }) => {
      isRemoteChange.current = true;
      onChange(incoming);
    });

    return () => {
      socket.off('code-changed');
    };
  }, [onChange]);

  function handleEditorChange(value: string | undefined) {
    if (!value) return;

    // don't emit back if this change came from another user
    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      return;
    }

    onChange(value);
    socket.emit('code-update', { roomId, code: value });
  }

  return (
    <MonacoEditor
      height="calc(100vh - 100px)"
      defaultLanguage="javascript"
      theme="vs-dark"
      value={code}
      onChange={handleEditorChange}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 2,
      }}
    />
  );
}