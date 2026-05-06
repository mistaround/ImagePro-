import { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore.js';
import { useFolderStore } from '../../stores/useFolderStore.js';
import { useAppStore } from '../../stores/useAppStore.js';
import ResizablePanel from '../shared/ResizablePanel.js';
import FavoritesList from './FavoritesList.js';
import TagQuickFilter from './TagQuickFilter.js';
import FolderTree from './FolderTree.js';
import SelectedFoldersList from './SelectedFoldersList.js';
import PathInput from './PathInput.js';
import AliasEditInput from '../dialogs/AliasEditInput.js';

export default function LeftSidebar() {
  const width = useUIStore((s) => s.leftSidebarWidth);
  const setWidth = useUIStore((s) => s.setLeftWidth);
  const collapsed = useUIStore((s) => s.leftSidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleLeftSidebar);
  const mode = useAppStore((s) => s.mode);
  const folders = useFolderStore((s) => s.folders);
  const favorites = useFolderStore((s) => s.favorites);
  const updateAlias = useFolderStore((s) => s.updateAlias);
  const addFavorite = useFolderStore((s) => s.addFavorite);
  const removeFavorite = useFolderStore((s) => s.removeFavorite);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const selectedLabel = mode === 'preview'
    ? (folders.length > 0 ? `当前文件夹` : '未选择')
    : `已选 ${folders.length}/8`;

  return (
    <ResizablePanel
      width={width}
      onWidthChange={setWidth}
      collapsed={collapsed}
      onToggleCollapse={toggle}
      side="left"
    >
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Section title="★ 收藏路径">
          <FavoritesList />
        </Section>

        <Section title="● tag 快速筛选">
          <TagQuickFilter />
        </Section>

        <Section title="▾ 文件夹树" grow>
          <FolderTree />
        </Section>

        <Section title={selectedLabel}>
          {folders.map((f, i) => (
            <div key={f.path} style={{ padding: '3px 12px', display: 'flex', gap: 6, alignItems: 'center' }}>
              <button
                onClick={() => {
                  if (favorites.includes(f.path)) {
                    removeFavorite(f.path);
                  } else {
                    addFavorite(f.path);
                  }
                }}
                title={favorites.includes(f.path) ? '取消收藏' : '添加收藏'}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, padding: 0, lineHeight: 1,
                  color: favorites.includes(f.path) ? 'var(--tag-yellow)' : 'var(--ink-3)',
                  flexShrink: 0,
                }}
              >{favorites.includes(f.path) ? '★' : '☆'}</button>
              {editingIndex === i ? (
                <AliasEditInput
                  initialValue={f.alias}
                  onSave={(alias) => { updateAlias(i, alias); setEditingIndex(null); }}
                  onCancel={() => setEditingIndex(null)}
                />
              ) : (
                <span
                  style={{ flex: 1, fontSize: 12, cursor: 'text', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  onClick={() => setEditingIndex(i)}
                >{f.alias}</span>
              )}
              <span style={{ color: 'var(--ink-3)', fontSize: 10, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{f.fileCount}</span>
            </div>
          ))}
          {folders.length === 0 && (
            <div style={{ padding: '4px 12px', color: 'var(--ink-3)', fontSize: 11 }}>尚未选择文件夹</div>
          )}
        </Section>

        <div style={{ padding: 8, borderTop: '1px dashed var(--ink-3)', flexShrink: 0 }}>
          <PathInput />
        </div>
      </div>
    </ResizablePanel>
  );
}

function Section({ title, children, grow }: { title: string; children: React.ReactNode; grow?: boolean }) {
  return (
    <div style={{
      borderBottom: '1px dashed var(--ink-3)',
      display: 'flex',
      flexDirection: 'column',
      flex: grow ? 1 : 'none',
      minHeight: 0,
    }}>
      <div style={{
        padding: '6px 12px',
        color: 'var(--ink-2)',
        fontSize: 11,
        letterSpacing: 0.5,
        flexShrink: 0,
      }}>{title}</div>
      <div style={{ overflow: grow ? 'auto' : 'hidden', paddingBottom: 4, flex: grow ? 1 : 'none', minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}
