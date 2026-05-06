import { useFolderStore } from '../../stores/useFolderStore.js';
import { useUIStore } from '../../stores/useUIStore.js';

export default function FavoritesList() {
  const favorites = useFolderStore((s) => s.favorites);
  const removeFavorite = useFolderStore((s) => s.removeFavorite);
  const setShowPicker = useUIStore((s) => s.setShowFolderPicker);

  if (favorites.length === 0) {
    return (
      <div style={{ padding: '4px 12px', color: 'var(--ink-3)', fontSize: 11 }}>
        暂无收藏 · 选中文件夹后点 ☆ 收藏
      </div>
    );
  }

  const handleClick = async (dirPath: string) => {
    if (!window.electronAPI) return;
    const files = await window.electronAPI.scanImages(dirPath);
    setShowPicker(true, dirPath, files.map((f) => ({ absolutePath: f.absolutePath })));
  };

  return (
    <>
      {favorites.map((dirPath) => (
        <div key={dirPath} style={{
          padding: '3px 12px',
          display: 'flex',
          gap: 6,
          alignItems: 'center',
        }}>
          <span
            onClick={() => handleClick(dirPath)}
            title="点击加载此文件夹"
            style={{ color: 'var(--tag-yellow)', width: 14, flexShrink: 0, cursor: 'pointer' }}
          >★</span>
          <span
            onClick={() => handleClick(dirPath)}
            title={dirPath}
            style={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >{dirPath.split(/[/\\]/).pop() || dirPath}</span>
          <button
            onClick={() => removeFavorite(dirPath)}
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
