import { useFolderStore } from '../../stores/useFolderStore.js';
import { useImageStore } from '../../stores/useImageStore.js';
import FileListItem from './FileListItem.js';

export default function FreeModeFileList() {
  const folders = useFolderStore((s) => s.folders);
  const setSelection = useImageStore((s) => s.setSelection);
  const setSelectionsForAll = useImageStore((s) => s.setSelectionsForAll);

  if (folders.length === 0) return null;

  // Get files for each folder
  const getFolderFiles = (folderPath: string) => {
    const folder = folders.find((f) => f.path === folderPath);
    if (!folder || !folder.files || folder.files.length === 0) {
      // Return placeholder files
      return Array.from({ length: 8 }).map((_, i) => ({
        filename: `${String(i + 40).padStart(4, '0')}.png`,
        absolutePath: `${folderPath}/${String(i + 40).padStart(4, '0')}.png`,
      }));
    }
    return (folder.files || []).slice(0, 8).map((f) => ({
      filename: f.filename || f.absolutePath.split(/[/\\]/).pop() || '',
      absolutePath: f.absolutePath,
    }));
  };

  const handleClick = (folderPath: string, filePath: string) => {
    setSelection(folderPath, filePath);
  };

  const handleCtrlClick = (folderPath: string, fileIndex: number) => {
    // Index-based sync: find the same index across all folders
    for (const folder of folders) {
      const files = getFolderFiles(folder.path);
      if (files[fileIndex]) {
        setSelection(folder.path, files[fileIndex].absolutePath);
      }
    }
  };

  const handleAltClick = (folderPath: string, fileName: string) => {
    // Name-based sync: find the same filename across all folders
    const baseName = fileName.replace(/\.[^.]+$/, '');
    for (const folder of folders) {
      const files = getFolderFiles(folder.path);
      const match = files.find((f) => f.filename.replace(/\.[^.]+$/, '') === baseName);
      if (match) {
        setSelection(folder.path, match.absolutePath);
      }
    }
  };

  return (
    <>
      {folders.map((folder) => {
        const files = getFolderFiles(folder.path);
        return (
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
              <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>{folder.fileCount || files.length}</span>
            </div>
            <div>
              {files.map((file, i) => (
                <FileListItem
                  key={file.absolutePath}
                  name={file.filename}
                  active={false}
                  filePath={file.absolutePath}
                  onClick={() => handleClick(folder.path, file.absolutePath)}
                  onCtrlClick={() => handleCtrlClick(folder.path, i)}
                  onAltClick={() => handleAltClick(folder.path, file.filename)}
                  compact
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
