import { useCallback } from 'react';
import { useTagStore } from '../../stores/useTagStore.js';
import { useFolderStore } from '../../stores/useFolderStore.js';

export default function BatchActionBar() {
  const tags = useTagStore((s) => s.tags);
  const folders = useFolderStore((s) => s.folders);

  const getTaggedPaths = useCallback((): string[] => {
    const taggedPaths: string[] = [];
    for (const folder of folders) {
      for (const file of folder.files || []) {
        if (tags[file.absolutePath]) {
          taggedPaths.push(file.absolutePath);
        }
      }
    }
    return taggedPaths;
  }, [tags, folders]);

  const handleCopy = useCallback(async () => {
    const paths = getTaggedPaths();
    if (paths.length === 0) return;
    if (window.electronAPI) {
      await window.electronAPI.copyFiles(paths.map((from) => ({ from, to: '' })));
    }
  }, [getTaggedPaths]);

  const handleMove = useCallback(async () => {
    const paths = getTaggedPaths();
    if (paths.length === 0) return;
    if (window.electronAPI) {
      await window.electronAPI.moveFiles(paths.map((from) => ({ from, to: '' })));
    }
  }, [getTaggedPaths]);

  const handleDelete = useCallback(async () => {
    const paths = getTaggedPaths();
    if (paths.length === 0) return;
    if (window.electronAPI) {
      await window.electronAPI.deleteFiles(paths);
    }
  }, [getTaggedPaths]);

  const taggedCount = getTaggedPaths().length;

  return (
    <div style={{
      padding: '8px 14px',
      borderTop: '1px solid #333',
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      background: 'var(--toolbar-bg)',
    }}>
      <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>
        {taggedCount > 0 ? `已 tag ${taggedCount} 张` : '无 tag 文件'}
      </span>
      <div style={{ flex: 1 }} />
      <button
        onClick={handleCopy}
        disabled={taggedCount === 0}
        style={btnStyle}
      >复制选中</button>
      <button
        onClick={handleMove}
        disabled={taggedCount === 0}
        style={btnStyle}
      >移动</button>
      <button
        onClick={handleDelete}
        disabled={taggedCount === 0}
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
