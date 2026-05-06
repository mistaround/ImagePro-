import { useFolderStore } from '../../stores/useFolderStore.js';

export default function FavoritesList() {
  const favorites = useFolderStore((s) => s.favorites);
  const removeFavorite = useFolderStore((s) => s.removeFavorite);

  if (favorites.length === 0) {
    return (
      <div style={{ padding: '4px 12px', color: 'var(--ink-3)', fontSize: 11 }}>
        暂无收藏 · 选中文件夹后点 ★ 收藏
      </div>
    );
  }

  return (
    <>
      {favorites.map((path) => (
        <div key={path} style={{
          padding: '3px 12px',
          display: 'flex',
          gap: 6,
          alignItems: 'center',
        }}>
          <span style={{ color: 'var(--tag-yellow)', width: 14, flexShrink: 0 }}>★</span>
          <span style={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
          }}>{path}</span>
          <button
            onClick={() => removeFavorite(path)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ink-3)', fontSize: 10, padding: 0,
            }}
          >✕</button>
        </div>
      ))}
    </>
  );
}
