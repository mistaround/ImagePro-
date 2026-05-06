import { useRef, useEffect, useCallback, useState } from 'react';
import { useFolderStore } from '../../stores/useFolderStore.js';
import { useImageStore } from '../../stores/useImageStore.js';
import { useTagStore } from '../../stores/useTagStore.js';
import { useImageLoader } from '../../hooks/useImageLoader.js';
import { useResizeObserver } from '../../hooks/useResizeObserver.js';
import { TAG_COLORS } from '../../types/tags.js';
import FilterChipsRow from './FilterChipsRow.js';
import BatchActionBar from './BatchActionBar.js';

export default function PreviewMode() {
  const folders = useFolderStore((s) => s.folders);
  const selections = useImageStore((s) => s.currentSelections);
  const setSelection = useImageStore((s) => s.setSelection);
  const tags = useTagStore((s) => s.tags);
  const setTag = useTagStore((s) => s.setTag);
  const clearTag = useTagStore((s) => s.clearTag);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ref: containerRef, size } = useResizeObserver();
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const folder = folders[0];
  const files = folder?.files || [];
  const currentPath = folder ? selections[folder.path] : undefined;
  const currentIndex = currentPath ? files.findIndex((f) => f.absolutePath === currentPath) : -1;
  const currentFile = files[currentIndex];
  const tag = currentPath ? tags[currentPath] : undefined;
  const currentFileName = currentFile?.filename || '';

  const { image, loading } = useImageLoader(currentPath || null);

  useEffect(() => {
    if (folder && files.length > 0 && !currentPath) {
      setSelection(folder.path, files[0].absolutePath);
    }
  }, [folder, files, currentPath, setSelection]);

  // Reset zoom/pan when switching images
  useEffect(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, [currentPath]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0 || size.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#2a2724';
    ctx.fillRect(0, 0, size.width, size.height);

    if (image) {
      const iw = image.naturalWidth;
      const ih = image.naturalHeight;

      if (iw > 0 && ih > 0) {
        const scaleX = size.width / iw;
        const scaleY = size.height / ih;
        const fitScale = Math.min(scaleX, scaleY) * zoom;

        const drawW = iw * fitScale;
        const drawH = ih * fitScale;

        const cx = panX + size.width / 2;
        const cy = panY + size.height / 2;
        const dx = cx - drawW / 2;
        const dy = cy - drawH / 2;

        ctx.drawImage(image, dx, dy, drawW, drawH);
      }
    } else if (loading) {
      ctx.fillStyle = 'rgba(250,248,243,0.85)';
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('加载中...', size.width / 2, size.height / 2);
    } else {
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let x = -size.height; x < size.width; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + size.height, size.height);
        ctx.stroke();
      }
    }
  }, [image, loading, zoom, panX, panY, size]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const newZoom = Math.max(0.1, Math.min(10, zoom + delta * zoom));
    const scale = newZoom / zoom;
    setZoom(newZoom);
    setPanX((prev) => cx - scale * (cx - prev));
    setPanY((prev) => cy - scale * (cy - prev));
  }, [zoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT') return;
    setDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPanX((prev) => prev + dx);
    setPanY((prev) => prev + dy);
  }, [dragging]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0 && folder) {
      setSelection(folder.path, files[currentIndex - 1].absolutePath);
    }
  }, [currentIndex, folder, files, setSelection]);

  const handleNext = useCallback(() => {
    if (currentIndex < files.length - 1 && folder) {
      setSelection(folder.path, files[currentIndex + 1].absolutePath);
    }
  }, [currentIndex, folder, files, setSelection]);

  const handleTag = useCallback((color: 1 | 2 | 3 | 4) => {
    if (!currentPath) return;
    if (tags[currentPath] === color) {
      clearTag(currentPath);
    } else {
      setTag(currentPath, color);
    }
  }, [currentPath, tags, setTag, clearTag]);

  if (!folder) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--grid-bg)', color: 'var(--ink-3)', fontSize: 14, minHeight: 0,
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
      <div style={{ flex: 1, padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, position: 'relative' }}>
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            width: '100%', height: '100%', position: 'relative',
            cursor: dragging ? 'grabbing' : 'grab', overflow: 'hidden',
          }}
        >
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

          {/* Navigation arrows */}
          {currentIndex > 0 && (
            <button onClick={handlePrev} style={{
              position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
              width: 36, height: 36, borderRadius: '50%',
              border: '1px solid var(--rule)', background: 'rgba(0,0,0,0.5)',
              color: 'var(--paper)', fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 5,
            }}>←</button>
          )}
          {currentIndex < files.length - 1 && (
            <button onClick={handleNext} style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              width: 36, height: 36, borderRadius: '50%',
              border: '1px solid var(--rule)', background: 'rgba(0,0,0,0.5)',
              color: 'var(--paper)', fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 5,
            }}>→</button>
          )}

          {/* Tag chip */}
          {tag && (
            <span style={{
              position: 'absolute', top: 10, right: 10,
              width: 18, height: 18,
              background: TAG_COLORS[tag - 1],
              border: '1px solid rgba(0,0,0,.3)',
              borderRadius: 3, zIndex: 5,
            }} />
          )}

          {/* Tag buttons */}
          <div style={{
            position: 'absolute', top: 10, left: 10, display: 'flex', gap: 4, zIndex: 5,
          }}>
            {([1, 2, 3, 4] as const).map((color) => (
              <button
                key={color}
                onClick={() => handleTag(color)}
                title={`Tag ${color}`}
                style={{
                  width: 18, height: 18, borderRadius: 3,
                  background: TAG_COLORS[color - 1],
                  border: tag === color ? '2px solid white' : '1px solid rgba(0,0,0,0.4)',
                  cursor: 'pointer', padding: 0, opacity: tag && tag !== color ? 0.4 : 1,
                }}
              />
            ))}
          </div>

          {/* File info */}
          <span style={{
            position: 'absolute', bottom: 10, left: 10,
            color: 'rgba(250,248,243,0.85)',
            fontSize: 10, fontFamily: 'var(--font-mono)',
            background: 'rgba(0,0,0,0.4)',
            padding: '2px 6px', borderRadius: 3,
            zIndex: 5, pointerEvents: 'none',
          }}>{currentFileName} · {Math.round(zoom * 100)}% · {currentIndex + 1}/{files.length}</span>
        </div>
      </div>
      <BatchActionBar />
    </div>
  );
}
