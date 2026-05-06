import { useState, useCallback } from 'react';
import { useFolderStore } from '../../stores/useFolderStore.js';
import { useUIStore } from '../../stores/useUIStore.js';

export default function PathInput() {
  const [inputPath, setInputPath] = useState('');
  const addFolder = useFolderStore((s) => s.addFolder);
  const setShowPicker = useUIStore((s) => s.setShowFolderPicker);

  const handleBrowse = useCallback(async () => {
    if (!window.electronAPI) return;
    const folderPath = await window.electronAPI.selectFolder();
    if (folderPath) {
      const files = await window.electronAPI.scanImages(folderPath);
      setShowPicker(true, folderPath, files.map((f) => ({ absolutePath: f.absolutePath })));
    }
  }, [setShowPicker]);

  const handleAdd = useCallback(() => {
    if (inputPath.trim()) {
      addFolder(inputPath.trim(), inputPath.trim().split(/[/\\]/).pop() || inputPath.trim(), []);
      setInputPath('');
    }
  }, [inputPath, addFolder]);

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <input
        type="text"
        value={inputPath}
        onChange={(e) => setInputPath(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
        placeholder="输入路径…"
        style={{
          flex: 1,
          padding: '4px 8px',
          fontSize: 11,
          border: '1px solid var(--rule)',
          borderRadius: 4,
          background: 'var(--paper)',
          color: 'var(--ink)',
          fontFamily: 'var(--font-mono)',
          outline: 'none',
        }}
      />
      <button
        onClick={handleBrowse}
        title="浏览文件夹"
        style={{
          width: 26, height: 26,
          border: '1px solid var(--rule)',
          borderRadius: 4,
          background: 'var(--paper)',
          cursor: 'pointer',
          fontSize: 14,
          color: 'var(--ink-2)',
        }}
      >＋</button>
    </div>
  );
}
