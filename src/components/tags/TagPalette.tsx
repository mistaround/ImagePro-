import { useState } from 'react';
import { useTagStore } from '../../stores/useTagStore.js';
import { TAG_COLORS } from '../../types/tags.js';
import TagRenamePopover from './TagRenamePopover.js';

export default function TagPalette() {
  const tagMeta = useTagStore((s) => s.tagMeta);
  const [showRename, setShowRename] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'flex', gap: 6, alignItems: 'center' }}>
      {[1, 2, 3, 4].map((key) => (
        <span
          key={key}
          onClick={() => setShowRename(true)}
          title={`${tagMeta[key]?.label} (${key})`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            border: '1px solid var(--rule)',
            borderRadius: 999,
            background: 'var(--paper)',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
          }}
        >
          <span style={{
            width: 10, height: 10, borderRadius: 2,
            background: TAG_COLORS[key - 1],
            border: '1px solid rgba(0,0,0,0.3)',
          }} />
          {key}
        </span>
      ))}
      {showRename && <TagRenamePopover onClose={() => setShowRename(false)} />}
    </div>
  );
}
