import { useAppStore } from '../../stores/useAppStore.js';
import { useFolderStore } from '../../stores/useFolderStore.js';
import { useImageStore } from '../../stores/useImageStore.js';
import { computeSameNameGroups } from '../../utils/file-matching.js';
import FileListItem from './FileListItem.js';

interface SameNameFileListProps {
  alias: string;
  totalFiles: number;
  synced?: boolean;
}

export default function SameNameFileList({ alias, totalFiles, synced }: SameNameFileListProps) {
  const selectedIndex = useAppStore((s) => s.selectedIndex);
  const setSelectedIndex = useAppStore((s) => s.setSelectedIndex);
  const folders = useFolderStore((s) => s.folders);
  const setSelectionsForAll = useImageStore((s) => s.setSelectionsForAll);

  // Show 30 or total rows depending on mode
  const visibleCount = synced ? Math.max(30, Math.min(totalFiles, 200)) : Math.min(totalFiles, 30);

  // Compute same-name groups for display
  const getFileNames = () => {
    if (!synced || folders.length === 0) return [];
    const folderFiles: Record<string, { absolutePath: string; filename: string; baseName: string }[]> = {};
    for (const folder of folders) {
      folderFiles[folder.path] = (folder.files || []).map((f) => ({
        absolutePath: f.absolutePath,
        filename: f.filename || f.absolutePath.split(/[/\\]/).pop() || '',
        baseName: f.filename ? f.filename.replace(/\.[^.]+$/, '') : (f.absolutePath.split(/[/\\]/).pop() || '').replace(/\.[^.]+$/, ''),
      }));
    }
    const groups = computeSameNameGroups(folderFiles, folders.map((f) => f.path));
    return groups.slice(0, visibleCount).map((g) => {
      const firstFile = Object.values(g).find((f) => f !== null);
      return firstFile?.filename || '---';
    });
  };

  const fileNames = synced ? getFileNames() : [];

  const handleClick = (index: number) => {
    setSelectedIndex(index);
  };

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
        {synced
          ? fileNames.map((name, i) => (
              <FileListItem
                key={i}
                name={name}
                active={i === selectedIndex}
                filePath={`${folders[0]?.path || ''}/${name}`}
                onClick={() => handleClick(i)}
              />
            ))
          : folders[0]?.files?.slice(0, visibleCount).map((f, i) => (
              <FileListItem
                key={f.absolutePath}
                name={f.filename || f.absolutePath.split(/[/\\]/).pop() || ''}
                active={i === selectedIndex}
                filePath={f.absolutePath}
                onClick={() => handleClick(i)}
              />
            ))
        }
      </div>
    </div>
  );
}
