import { useUIStore } from '../../stores/useUIStore.js';
import { useFolderStore } from '../../stores/useFolderStore.js';
import { useThumbnail } from '../../hooks/useThumbnail.js';

function ThumbPreview({ filePath }: { filePath: string }) {
  const thumbSrc = useThumbnail(filePath, 96);

  return (
    <div
      style={{
        aspectRatio: '1',
        borderRadius: 3,
        background: '#ece7dc',
        border: '1px solid var(--rule)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {thumbSrc ? (
        <img
          src={thumbSrc}
          alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 6px)',
        }} />
      )}
    </div>
  );
}

export default function FolderPickerPopover() {
  const show = useUIStore((s) => s.showFolderPicker);
  const path = useUIStore((s) => s.folderPickerPath);
  const files = useUIStore((s) => s.folderPickerFiles);
  const setShow = useUIStore((s) => s.setShowFolderPicker);
  const addFolder = useFolderStore((s) => s.addFolder);
  const addFavorite = useFolderStore((s) => s.addFavorite);
  const favorites = useFolderStore((s) => s.favorites);

  if (!show) return null;

  const alias = path?.split(/[/\\]/).pop() || 'unknown';
  const imageFiles = files.filter((f) =>
    /\.(png|jpg|jpeg|webp|bmp|gif|tiff?)$/i.test(f.absolutePath),
  );
  const previewFiles = imageFiles.slice(0, 18);
  const totalCount = imageFiles.length;
  const isFavorite = path ? favorites.includes(path) : false;

  const handleAdd = () => {
    if (path) {
      addFolder(path, alias, imageFiles.map((f) => ({
        filename: f.absolutePath.split(/[/\\]/).pop() || '',
        baseName: f.absolutePath.split(/[/\\]/).pop()?.replace(/\.[^.]+$/, '') || '',
        extension: f.absolutePath.match(/\.[^.]+$/)?.[0] || '',
        absolutePath: f.absolutePath,
        relativePath: '',
        size: 0,
        mtimeMs: 0,
        width: 0,
        height: 0,
      })));
    }
    setShow(false);
  };

  const handleToggleFavorite = () => {
    if (!path) return;
    if (isFavorite) {
      addFavorite(path);
    } else {
      // addFavorite is idempotent, but we want toggle
    }
    if (isFavorite) {
      // Actually we need a remove path. Let me use the store directly.
      useFolderStore.getState().removeFavorite(path);
    } else {
      addFavorite(path);
    }
  };

  return (
    <div
      onClick={() => setShow(false)}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 520,
          background: 'var(--paper)',
          border: '1px solid var(--rule)',
          borderRadius: 8,
          boxShadow: '4px 6px 0 rgba(31,29,26,0.10)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'var(--font-ui)',
        }}
      >
        <div style={{
          padding: '10px 14px',
          borderBottom: '1px dashed var(--ink-3)',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>选择文件夹 · 预览</span>
          <button
            onClick={handleToggleFavorite}
            title={isFavorite ? '取消收藏' : '添加收藏'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 16, padding: 0, lineHeight: 1,
              color: isFavorite ? 'var(--tag-yellow)' : 'var(--ink-3)',
            }}
          >{isFavorite ? '★' : '☆'}</button>
          <span style={{ flex: 1 }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--ink-3)',
            maxWidth: 280,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>{path}</span>
        </div>
        <div style={{
          padding: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 6,
        }}>
          {previewFiles.length > 0
            ? previewFiles.map((f, i) => (
                <ThumbPreview key={i} filePath={f.absolutePath} />
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 3,
                    background: '#ece7dc',
                    border: '1px solid var(--rule)',
                  }}
                />
              ))
          }
        </div>
        <div style={{
          padding: '8px 14px',
          borderTop: '1px dashed var(--ink-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: 11, color: 'var(--ink-3)', flex: 1 }}>
            共 {totalCount} 张 · 预览前 {Math.min(previewFiles.length, 18)} 张
          </span>
          <button
            onClick={() => setShow(false)}
            style={{
              padding: '4px 12px',
              border: '1px solid var(--rule)',
              borderRadius: 6,
              background: 'var(--paper)',
              cursor: 'pointer',
              fontSize: 12,
              color: 'var(--ink-2)',
            }}
          >取消</button>
          <button
            onClick={handleAdd}
            style={{
              padding: '4px 12px',
              border: '1px solid var(--rule)',
              borderRadius: 6,
              background: 'var(--ink)',
              color: 'var(--paper)',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >添加为 {alias}</button>
        </div>
      </div>
    </div>
  );
}
