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
  const totalCount = useAppStore((s) => s.totalCount);
  const folders = useFolderStore((s) => s.folders);

  return (
    <ResizablePanel
      width={width}
      onWidthChange={setWidth}
      collapsed={collapsed}
      onToggleCollapse={toggle}
      side="right"
    >

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
            <SameNameFileList alias={folders[0]?.alias || '当前文件夹'} totalFiles={folders[0]?.fileCount || 0} />
          ) : pairingMode === 'name' ? (
            <SameNameFileList alias="同名匹配" totalFiles={totalCount} synced />
          ) : (
            <FreeModeFileList />
          )}
        </div>
    </ResizablePanel>
  );
}
