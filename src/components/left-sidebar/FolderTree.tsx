import { useState, useEffect, useCallback } from 'react';
import { useFolderStore } from '../../stores/useFolderStore.js';

interface TreeNode {
  label: string;
  path: string;
  children?: TreeNode[];
  checked?: boolean;
}

export default function FolderTree() {
  const favorites = useFolderStore((s) => s.favorites);
  const [tree, setTree] = useState<TreeNode[]>([]);

  useEffect(() => {
    const nodes: TreeNode[] = favorites.map((p) => ({
      label: p.split(/[/\\]/).pop() || p,
      path: p,
    }));
    setTree(nodes);
  }, [favorites]);

  if (favorites.length === 0) {
    return (
      <div style={{ padding: '4px 12px', color: 'var(--ink-3)', fontSize: 11 }}>
        暂无收藏 · 收藏文件夹后显示
      </div>
    );
  }

  return (
    <div style={{ padding: '2px 8px 4px' }}>
      {tree.map((node, i) => (
        <TreeNodeView key={node.path} node={node} depth={0} />
      ))}
    </div>
  );
}

function TreeNodeView({ node, depth }: { node: TreeNode; depth: number }) {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState<TreeNode[] | null>(null);
  const [loading, setLoading] = useState(false);
  const addFolder = useFolderStore((s) => s.addFolder);

  const loadChildren = useCallback(async () => {
    if (children !== null) return;
    if (!window.electronAPI) return;
    setLoading(true);
    try {
      const files = await window.electronAPI.scanImages(node.path);
      // Group by subdirectory
      const subdirs = new Map<string, TreeNode>();
      for (const f of files) {
        const dir = f.absolutePath.substring(0, f.absolutePath.lastIndexOf('\\'));
        if (dir !== node.path && !subdirs.has(dir)) {
          subdirs.set(dir, { label: dir.split(/[/\\]/).pop() || dir, path: dir });
        }
      }
      const result = [...subdirs.values()].sort((a, b) => a.label.localeCompare(b.label));
      setChildren(result);
    } catch {
      setChildren([]);
    } finally {
      setLoading(false);
    }
  }, [node.path, children]);

  const handleClick = async () => {
    if (children === null) {
      setOpen(true);
      await loadChildren();
      setOpen(true);
    } else {
      setOpen(!open);
    }
  };

  const handleDoubleClick = async () => {
    if (!window.electronAPI) return;
    const files = await window.electronAPI.scanImages(node.path);
    const alias = node.path.split(/[/\\]/).pop() || node.path;
    const imageFiles = files.map((f) => ({
      absolutePath: f.absolutePath,
      filename: f.filename,
    }));
    addFolder(node.path, alias, imageFiles.map((f) => ({
      filename: f.filename,
      baseName: f.filename.replace(/\.[^.]+$/, ''),
      extension: f.filename.match(/\.[^.]+$/)?.[0] || '',
      absolutePath: f.absolutePath,
      relativePath: '',
      size: 0,
      mtimeMs: 0,
      width: 0,
      height: 0,
    })));
  };

  return (
    <div>
      <div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        title="双击添加文件夹"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 4px',
          paddingLeft: 4 + depth * 14,
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
          color: 'var(--ink)',
        }}
      >
        <span style={{ width: 10, color: 'var(--ink-3)' }}>
          {loading ? '…' : open ? '▾' : '▸'}
        </span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.label}
        </span>
      </div>
      {open && children && children.map((child, i) => (
        <TreeNodeView key={child.path} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}
