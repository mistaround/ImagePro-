import { useAppStore } from '../../stores/useAppStore.js';
import { useTagStore } from '../../stores/useTagStore.js';
import FileListItem from './FileListItem.js';

interface SameNameFileListProps {
  alias: string;
  totalFiles: number;
  synced?: boolean;
}

export default function SameNameFileList({ alias, totalFiles, synced }: SameNameFileListProps) {
  const selectedIndex = useAppStore((s) => s.selectedIndex);
  const setSelectedIndex = useAppStore((s) => s.setSelectedIndex);

  // Show 30 rows in same-name mode to fill the space
  const visibleCount = synced ? 30 : totalFiles;

  return (
    <div style={{ borderBottom: '1px dashed var(--ink-3)' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        background: 'rgba(0,0,0,0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}>
        <span style={{ flex: 1, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>
          {synced ? '⚓ ' : ''}{alias}
        </span>
        <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>{totalFiles}</span>
      </div>
      <div>
        {Array.from({ length: visibleCount }).map((_, i) => (
          <FileListItem
            key={i}
            name={`${String(i + 40).padStart(4, '0')}.png`}
            active={i === selectedIndex}
            filePath={`/demo/${alias}/${String(i + 40).padStart(4, '0')}.png`}
            onClick={() => setSelectedIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
