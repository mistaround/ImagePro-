import { useEffect } from 'react';
import { useFolderStore } from '../../stores/useFolderStore.js';
import { useImageStore } from '../../stores/useImageStore.js';
import { usePeekStore } from '../../stores/usePeekStore.js';
import { useAppStore } from '../../stores/useAppStore.js';
import { gridLayoutFor } from '../../utils/grid-layout.js';
import { computeSameNameGroups } from '../../utils/file-matching.js';
import GridCell from './GridCell.js';

export default function CompareGrid() {
  const folders = useFolderStore((s) => s.folders);
  const pairingMode = useAppStore((s) => s.pairingMode);
  const selectedIndex = useAppStore((s) => s.selectedIndex);
  const setTotalCount = useAppStore((s) => s.setTotalCount);
  const currentSelections = useImageStore((s) => s.currentSelections);
  const setSelectionsForAll = useImageStore((s) => s.setSelectionsForAll);
  const peek = usePeekStore();

  const n = folders.length;
  const layout = gridLayoutFor(n);

  // Compute same-name groups
  useEffect(() => {
    if (pairingMode === 'name' && folders.length > 0) {
      const folderFiles: Record<string, { absolutePath: string; filename: string; baseName: string }[]> = {};
      for (const folder of folders) {
        folderFiles[folder.path] = (folder.files || []).map((f) => ({
          absolutePath: f.absolutePath,
          filename: f.filename || f.absolutePath.split(/[/\\]/).pop() || '',
          baseName: f.filename ? f.filename.replace(/\.[^.]+$/, '') : (f.absolutePath.split(/[/\\]/).pop() || '').replace(/\.[^.]+$/, ''),
        }));
      }
      const groups = computeSameNameGroups(folderFiles, folders.map((f) => f.path));
      setTotalCount(groups.length);

      // Set selections for current index
      if (groups.length > 0 && selectedIndex < groups.length) {
        const group = groups[Math.min(selectedIndex, groups.length - 1)];
        const selections: Record<string, string> = {};
        for (const [folderPath, file] of Object.entries(group)) {
          if (file) selections[folderPath] = file.absolutePath;
        }
        setSelectionsForAll(selections);
      }
    }
  }, [pairingMode, folders, selectedIndex, setTotalCount, setSelectionsForAll]);

  if (n === 0) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--grid-bg)',
        color: 'var(--ink-3)',
        fontSize: 14,
        minHeight: 0,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
          <div>在左侧选择文件夹开始对比</div>
          <div style={{ fontSize: 11, marginTop: 8, color: 'var(--ink-3)' }}>
            最多可选择 8 个文件夹
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      padding: 0,
      background: '#1f1d1a',
      display: 'grid',
      gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
      gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
      gap: 2,
      minHeight: 0,
    }}>
      {Array.from({ length: n }).map((_, i) => {
        const folder = folders[i];
        const isPeekTarget = peek.peekAll
          ? peek.sourceFolderPath !== folder.path
          : peek.targetFolderPath === folder.path;
        const isPeekSource = peek.sourceFolderPath === folder.path;
        return (
          <GridCell
            key={i}
            idx={i}
            n={n}
            folder={folder}
            isPeekTarget={isPeekTarget}
            isPeekSource={isPeekSource}
          />
        );
      })}
    </div>
  );
}
