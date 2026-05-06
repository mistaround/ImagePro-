import { useFolderStore } from '../../stores/useFolderStore.js';

export default function SelectedFoldersList() {
  const folders = useFolderStore((s) => s.folders);

  if (folders.length === 0) {
    return (
      <div style={{ padding: '4px 12px', color: 'var(--ink-3)', fontSize: 11 }}>
        尚未选择文件夹
      </div>
    );
  }

  return (
    <>
      {folders.map((f, i) => (
        <div key={f.path} style={{ padding: '3px 12px', display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{
            width: 14, height: 14,
            border: '1px solid var(--rule)',
            borderRadius: 2,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            background: 'var(--paper)',
          }}>✓</span>
          <span style={{ flex: 1, fontSize: 12 }}>{f.alias}</span>
          <span style={{ color: 'var(--ink-3)', fontSize: 10, fontFamily: 'var(--font-mono)' }}>{f.fileCount}</span>
        </div>
      ))}
    </>
  );
}
