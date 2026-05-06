import { useAppStore } from '../../stores/useAppStore.js';
import { useFolderStore } from '../../stores/useFolderStore.js';
import { useViewportStore } from '../../stores/useViewportStore.js';
import { useUIStore } from '../../stores/useUIStore.js';

export default function StatusBar() {
  const selectedIndex = useAppStore((s) => s.selectedIndex);
  const totalCount = useAppStore((s) => s.totalCount);
  const pairingMode = useAppStore((s) => s.pairingMode);
  const folders = useFolderStore((s) => s.folders);
  const viewports = useViewportStore((s) => s.viewports);
  const zoomAll = useViewportStore((s) => s.zoomAll);
  const resetAll = useViewportStore((s) => s.resetAll);
  const focusedIdx = useUIStore((s) => s.focusedFolderIndex);

  const n = folders.length;
  const syncLabel = pairingMode === 'name' ? '同名匹配' : '独立选图';

  // Get zoom for focused cell or average
  const focusedFolder = folders[focusedIdx];
  const focusedVp = focusedFolder ? viewports[focusedFolder.path] : null;
  const zoomPercent = focusedVp ? Math.round(focusedVp.zoom * 100) : 100;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
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
        onClick={() => zoomAll(-0.1)}
        title="缩小全部"
        style={zoomBtnStyle}
      >⊝</button>
      <span
        onClick={() => resetAll()}
        title="重置缩放 (0 键)"
        style={{
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
          minWidth: 38,
          textAlign: 'center',
        }}
      >{zoomPercent}%</span>
      <button
        onClick={() => zoomAll(0.1)}
        title="放大全部"
        style={zoomBtnStyle}
      >⊕</button>

      <Divider />

      <span style={{ color: 'var(--ink-3)', fontSize: 10 }}>
        滚轮缩放本格 · Ctrl+滚轮缩放全部
      </span>

      <div style={{ flex: 1 }} />

      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
        {n} 格 · {syncLabel}
      </span>
    </div>
  );
}

const zoomBtnStyle: React.CSSProperties = {
  width: 20, height: 20,
  border: '1px solid var(--rule)',
  borderRadius: 3,
  background: 'var(--paper)',
  cursor: 'pointer',
  fontSize: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  color: 'var(--ink-2)',
  fontFamily: 'var(--font-mono)',
};

function Divider() {
  return <div style={{ width: 1, background: 'var(--ink-3)', alignSelf: 'stretch', opacity: 0.4 }} />;
}
