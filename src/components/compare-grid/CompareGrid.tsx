import { useFolderStore } from '../../stores/useFolderStore.js';
import { usePeekStore } from '../../stores/usePeekStore.js';
import { gridLayoutFor } from '../../utils/grid-layout.js';
import GridCell from './GridCell.js';

export default function CompareGrid() {
  const folders = useFolderStore((s) => s.folders);
  const n = folders.length;
  const layout = gridLayoutFor(n);
  const peek = usePeekStore();

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
        const isPeekTarget = peek.targetFolderPath === folders[i]?.path;
        const isPeekSource = peek.sourceFolderPath === folders[i]?.path;
        return (
          <GridCell
            key={i}
            idx={i}
            n={n}
            folder={folders[i]}
            isPeekTarget={isPeekTarget}
            isPeekSource={isPeekSource}
          />
        );
      })}
    </div>
  );
}
