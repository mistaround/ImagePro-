import { useAppStore } from '../../stores/useAppStore.js';
import { useFolderStore } from '../../stores/useFolderStore.js';
import { useViewportStore } from '../../stores/useViewportStore.js';

export default function StatusBar() {
  const selectedIndex = useAppStore((s) => s.selectedIndex);
  const totalCount = useAppStore((s) => s.totalCount);
  const pairingMode = useAppStore((s) => s.pairingMode);
  const folders = useFolderStore((s) => s.folders);
  const resetAll = useViewportStore((s) => s.resetAll);

  const n = folders.length;
  const syncLabel = pairingMode === 'name' ? '同名匹配' : '独立选图';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '4px 14px',
      borderTop: '1px solid #333',
      background: 'var(--toolbar-bg)',
      fontSize: 11,
      color: 'var(--ink-2)',
      minHeight: 28,
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: 'var(--font-mono)' }}>
        {String(selectedIndex + 1).padStart(4, '0')} / {totalCount}
      </span>

      <Divider />

      <button
        onClick={() => resetAll()}
        title="重置缩放 (0)"
        style={{
          border: '1px solid var(--rule)',
          borderRadius: 3,
          background: 'var(--paper)',
          cursor: 'pointer',
          fontSize: 10,
          padding: '1px 6px',
          fontFamily: 'var(--font-mono)',
        }}
      >⊝ 100% ⊕</button>

      <span style={{ color: 'var(--ink-3)' }}>
        滚轮缩放本格 · Ctrl+滚轮缩放全部
      </span>

      <div style={{ flex: 1 }} />

      <span style={{ fontFamily: 'var(--font-mono)' }}>
        {n} 格 · {syncLabel}
      </span>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, background: 'var(--ink-3)', alignSelf: 'stretch', opacity: 0.4 }} />;
}
