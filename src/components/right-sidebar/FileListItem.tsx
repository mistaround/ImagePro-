import { useTagStore } from '../../stores/useTagStore.js';
import { TAG_COLORS } from '../../types/tags.js';

interface FileListItemProps {
  name: string;
  active: boolean;
  filePath: string;
  onClick: () => void;
  compact?: boolean;
  onCtrlClick?: () => void;
  onAltClick?: () => void;
}

export default function FileListItem({
  name, active, filePath, onClick, compact, onCtrlClick, onAltClick,
}: FileListItemProps) {
  const tag = useTagStore((s) => s.tags[filePath]);
  const thumbSize = compact ? 22 : 24;

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      onCtrlClick?.();
    } else if (e.altKey) {
      onAltClick?.();
    } else {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: compact ? '2px 10px' : '3px 10px',
        background: active ? 'rgba(47,95,179,0.12)' : 'transparent',
        borderLeft: active ? '2px solid var(--accent-blue)' : '2px solid transparent',
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--ink)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: thumbSize,
        height: thumbSize,
        flexShrink: 0,
        borderRadius: 2,
        background: '#ece7dc',
        border: active ? '1.5px solid var(--accent-blue)' : '1px solid var(--rule)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 6px)',
        }} />
      </div>
      <span style={{
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>{name}</span>
      {tag && (
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: TAG_COLORS[tag - 1],
          border: '0.5px solid rgba(0,0,0,0.3)',
          flexShrink: 0,
        }} />
      )}
    </div>
  );
}
