import { useFolderStore } from '../../stores/useFolderStore.js';
import { useTagStore } from '../../stores/useTagStore.js';
import FilterChipsRow from './FilterChipsRow.js';
import BatchActionBar from './BatchActionBar.js';

export default function PreviewMode() {
  const folders = useFolderStore((s) => s.folders);

  if (folders.length === 0) {
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
          <div style={{ fontSize: 48, marginBottom: 16 }}>🖼</div>
          <div>在左侧选择一个文件夹进入预览</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1f1d1a', minHeight: 0 }}>
      <FilterChipsRow />
      <div style={{
        flex: 1,
        padding: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 0,
        position: 'relative',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          maxWidth: 720,
          position: 'relative',
          backgroundColor: '#2a2724',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 9px)',
            borderRadius: 4,
          }} />
          <span style={{
            color: 'rgba(250,248,243,0.85)',
            fontSize: 13,
            fontFamily: 'var(--font-mono)',
            zIndex: 1,
          }}>0042.png · 1024×1024</span>

          {/* Tag chip */}
          <span style={{
            position: 'absolute', top: 10, right: 10,
            width: 18, height: 18,
            background: 'var(--tag-red)',
            border: '1px solid rgba(0,0,0,.3)',
            borderRadius: 3,
          }} />

          {/* File info overlay */}
          <span style={{
            position: 'absolute', bottom: 10, left: 10,
            color: 'rgba(250,248,243,0.85)',
            fontSize: 10, fontFamily: 'var(--font-mono)',
            background: 'rgba(0,0,0,0.4)',
            padding: '2px 6px', borderRadius: 3,
          }}>0042.png · 100%</span>
        </div>
      </div>
      <BatchActionBar />
    </div>
  );
}
