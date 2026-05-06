import { useTagStore } from '../../stores/useTagStore.js';
import { TAG_COLORS } from '../../types/tags.js';

interface TagRenamePopoverProps {
  onClose: () => void;
}

export default function TagRenamePopover({ onClose }: TagRenamePopoverProps) {
  const tagMeta = useTagStore((s) => s.tagMeta);
  const setTagMeta = useTagStore((s) => s.setTagMeta);

  return (
    <div style={{
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: 6,
      zIndex: 100,
    }}>
      <div style={{
        width: 280,
        background: 'var(--paper)',
        border: '1px solid var(--rule)',
        borderRadius: 8,
        padding: 14,
        boxShadow: '4px 6px 0 rgba(31,29,26,0.10)',
        fontFamily: 'var(--font-ui)',
      }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>tag 命名</div>
        {[1, 2, 3, 4].map((key) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              width: 16, height: 16, borderRadius: 2,
              background: TAG_COLORS[key - 1],
              border: '1px solid rgba(0,0,0,0.3)',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, width: 24, color: 'var(--ink-3)' }}>{key}</span>
            <input
              type="text"
              value={tagMeta[key]?.label || ''}
              onChange={(e) => setTagMeta(key, e.target.value)}
              style={{
                flex: 1,
                padding: '3px 8px',
                fontSize: 12,
                border: '1px solid var(--rule)',
                borderRadius: 4,
                background: 'var(--paper)',
                outline: 'none',
              }}
            />
          </div>
        ))}
        <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 6 }}>
          快捷键：1234 = 给当前选中图打 tag · Ctrl+1234 = 全部
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <button
            onClick={onClose}
            style={{
              padding: '4px 16px',
              border: '1px solid var(--rule)',
              borderRadius: 6,
              background: 'var(--ink)',
              color: 'var(--paper)',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >完成</button>
        </div>
      </div>
    </div>
  );
}
