import { useCallback } from 'react';

export default function BatchActionBar() {
  const handleCopy = useCallback(async () => {
    if (window.electronAPI) {
      await window.electronAPI.copyFiles([]);
    }
  }, []);

  const handleMove = useCallback(async () => {
    if (window.electronAPI) {
      await window.electronAPI.moveFiles([]);
    }
  }, []);

  const handleDelete = useCallback(async () => {
    if (window.electronAPI) {
      await window.electronAPI.deleteFiles([]);
    }
  }, []);

  return (
    <div style={{
      padding: '8px 14px',
      borderTop: '1px solid #333',
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      background: 'var(--toolbar-bg)',
    }}>
      <div style={{ flex: 1 }} />
      <button
        onClick={handleCopy}
        style={btnStyle}
      >复制选中</button>
      <button
        onClick={handleMove}
        style={btnStyle}
      >移动</button>
      <button
        onClick={handleDelete}
        style={{
          ...btnStyle,
          borderColor: 'var(--tag-red)',
          color: 'var(--tag-red)',
        }}
      >删除</button>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 12px',
  border: '1px solid var(--rule)',
  borderRadius: 6,
  background: 'var(--paper)',
  fontSize: 12,
  color: 'var(--ink)',
  cursor: 'pointer',
  fontFamily: 'var(--font-ui)',
};
