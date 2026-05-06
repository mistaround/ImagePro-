import { useFolderStore } from '../../stores/useFolderStore.js';
import { useImageStore } from '../../stores/useImageStore.js';
import FileListItem from './FileListItem.js';

export default function FreeModeFileList() {
  const folders = useFolderStore((s) => s.folders);
  const setSelection = useImageStore((s) => s.setSelection);

  if (folders.length === 0) return null;

  return (
    <>
      {folders.map((folder, fi) => (
        <div key={folder.path} style={{ borderBottom: '1px dashed var(--ink-3)' }}>
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
              {folder.alias}
            </span>
            <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>{folder.fileCount}</span>
          </div>
          <div>
            {Array.from({ length: Math.min(8, folder.fileCount || 8) }).map((_, i) => {
              const filePath = `${folder.path}/${String(i + 40).padStart(4, '0')}.png`;
              return (
                <FileListItem
                  key={i}
                  name={`${String(i + 40).padStart(4, '0')}.png`}
                  active={false}
                  filePath={filePath}
                  onClick={() => setSelection(folder.path, filePath)}
                  compact
                />
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
