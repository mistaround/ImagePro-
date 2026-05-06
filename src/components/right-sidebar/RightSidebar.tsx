import { useUIStore } from '../../stores/useUIStore.js';
import { useAppStore } from '../../stores/useAppStore.js';
import { useFolderStore } from '../../stores/useFolderStore.js';
import ResizablePanel from '../shared/ResizablePanel.js';
import SameNameFileList from './SameNameFileList.js';
import FreeModeFileList from './FreeModeFileList.js';

export default function RightSidebar() {
  const width = useUIStore((s) => s.rightSidebarWidth);
  const setWidth = useUIStore((s) => s.setRightWidth);
  const collapsed = useUIStore((s) => s.rightSidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleRightSidebar);
  const mode = useAppStore((s) => s.mode);
  const pairingMode = useAppStore((s) => s.pairingMode);
  const folders = useFolderStore((s) => s.folders);

  if (collapsed) {
    return (
      <div style={{
        width: 36,
        flexShrink: 0,
        borderLeft: '1px solid #333',
        background: 'var(--sidebar-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 0',
        gap: 8,
      }}>
        <button
          onClick={toggle}
          title="展开"
          style={{
            width: 24, height: 24,
            border: '1px solid var(--rule)',
            borderRadius: 4,
            background: 'var(--paper)',
            cursor: 'pointer',
            fontSize: 12,
            color: 'var(--ink-2)',
          }}
        >«</button>
      </div>
    );
  }

  return (
    <div style={{
      width,
      flexShrink: 0,
      display: 'flex',
      position: 'relative',
    }}>
      <div
        onMouseDown={(e) => {
          const startX = e.clientX;
          const startWidth = width;
          const move = (ev: MouseEvent) => {
            const dx = startX - ev.clientX;
            setWidth(Math.max(200, Math.min(450, startWidth + dx)));
          };
          const up = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
          };
          window.addEventListener('mousemove', move);
          window.addEventListener('mouseup', up);
        }}
        style={{
          position: 'absolute',
          left: -3,
          top: 0,
          bottom: 0,
          width: 6,
          cursor: 'col-resize',
          zIndex: 10,
        }}
      />
      <div style={{
        flex: 1,
        borderLeft: '1px solid #333',
        background: 'var(--sidebar-bg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}>
        <div style={{
          padding: '8px 12px',
          borderBottom: '1px dashed var(--ink-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexShrink: 0,
        }}>
          <span style={{ flex: 1, fontWeight: 600, fontSize: 12 }}>图片区</span>
          <button
            onClick={toggle}
            title="收起"
            style={{
              width: 22, height: 22,
              border: '1px solid var(--rule)',
              borderRadius: 4,
              background: 'var(--paper)',
              cursor: 'pointer',
              fontSize: 11,
              color: 'var(--ink-2)',
            }}
          >»</button>
        </div>

        <div style={{
          padding: '6px 12px',
          display: 'flex',
          gap: 6,
          borderBottom: '1px dashed var(--ink-3)',
          flexShrink: 0,
        }}>
          <input
            type="text"
            placeholder="🔍 文件名…"
            style={{
              flex: 1,
              padding: '3px 8px',
              fontSize: 11,
              border: '1px solid var(--rule)',
              borderRadius: 4,
              background: 'var(--paper)',
              color: 'var(--ink)',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
            }}
          />
          <button style={{
            width: 24, height: 24,
            border: '1px solid var(--rule)',
            borderRadius: 4,
            background: 'var(--paper)',
            cursor: 'pointer',
            fontSize: 12,
            color: 'var(--ink-2)',
          }}>↕</button>
        </div>

        <div style={{ overflow: 'auto', flex: 1 }}>
          {mode === 'preview' ? (
            <SameNameFileList alias={folders[0]?.alias || '当前文件夹'} totalFiles={248} />
          ) : pairingMode === 'name' ? (
            <SameNameFileList alias="同名匹配" totalFiles={200} synced />
          ) : (
            <FreeModeFileList />
          )}
        </div>
      </div>
    </div>
  );
}
