import { useState } from 'react';

interface TreeNode {
  label: string;
  children?: TreeNode[];
  checked?: boolean;
}

const defaultTree: TreeNode[] = [
  {
    label: 'D:\\aigc', children: [
      {
        label: 'test_set_A', children: [
          { label: 'baseline', checked: true },
          { label: 'exp_v1', checked: true },
          { label: 'exp_v2', checked: true },
          { label: 'exp_v3', checked: true },
          { label: 'exp_v4_wip' },
        ],
      },
      { label: 'test_set_B', children: [] },
      { label: 'archive', children: [] },
    ],
  },
  { label: 'C:\\Users\\me\\Downloads', children: [] },
];

export default function FolderTree() {
  return (
    <div style={{ padding: '2px 8px 4px' }}>
      {defaultTree.map((node, i) => (
        <TreeNodeView key={i} node={node} depth={0} />
      ))}
    </div>
  );
}

function TreeNodeView({ node, depth }: { node: TreeNode; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const [checked, setChecked] = useState(node.checked || false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        onClick={() => {
          if (hasChildren) setOpen(!open);
          else setChecked(!checked);
        }}
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
          {hasChildren ? (open ? '▾' : '▸') : ''}
        </span>
        {!hasChildren && (
          <span style={{
            width: 11, height: 11,
            border: '1px solid var(--rule)',
            borderRadius: 2,
            background: checked ? 'var(--ink)' : 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 7,
            color: 'var(--paper)',
          }}>{checked ? '✓' : ''}</span>
        )}
        <span>{node.label}</span>
      </div>
      {open && hasChildren && node.children!.map((child, i) => (
        <TreeNodeView key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}
