import { useRef, useEffect, useCallback, useState } from 'react';
import { useViewportStore } from '../../stores/useViewportStore.js';
import { useImageStore } from '../../stores/useImageStore.js';
import { usePeekStore } from '../../stores/usePeekStore.js';
import { useTagStore } from '../../stores/useTagStore.js';
import { useFolderStore } from '../../stores/useFolderStore.js';
import { useUIStore } from '../../stores/useUIStore.js';
import { useImageLoader } from '../../hooks/useImageLoader.js';
import { useResizeObserver } from '../../hooks/useResizeObserver.js';
import { TAG_COLORS } from '../../types/tags.js';
import AliasEditInput from '../dialogs/AliasEditInput.js';

interface GridCellProps {
  idx: number;
  n: number;
  folder: { path: string; alias: string; colorIndex: number; files?: { absolutePath: string; filename: string }[] };
  isPeekTarget: boolean;
  isPeekSource: boolean;
}

export default function GridCell({ idx, n, folder, isPeekTarget, isPeekSource }: GridCellProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ref: containerRef, size } = useResizeObserver();
  const [error, setError] = useState<string | null>(null);
  const [editingAlias, setEditingAlias] = useState(false);

  const viewports = useViewportStore((s) => s.viewports);
  const vp = viewports[folder.path] || { zoom: 1, panX: 0, panY: 0 };
  const zoomCell = useViewportStore((s) => s.zoomCell);
  const panCell = useViewportStore((s) => s.panCell);
  const zoomAll = useViewportStore((s) => s.zoomAll);
  const panAll = useViewportStore((s) => s.panAll);

  const currentSelection = useImageStore((s) => s.currentSelections[folder.path]);
  const setSelection = useImageStore((s) => s.setSelection);

  const startPeek = usePeekStore((s) => s.startPeek);
  const stopPeek = usePeekStore((s) => s.stopPeek);
  const peekActive = usePeekStore((s) => s.active);
  const peekSourcePath = usePeekStore((s) => s.sourceFolderPath);

  const tags = useTagStore((s) => s.tags);
  const tag = currentSelection ? tags[currentSelection] : undefined;
  const updateAlias = useFolderStore((s) => s.updateAlias);
  const folders = useFolderStore((s) => s.folders);
  const setFocusedFolder = useUIStore((s) => s.setFocusedFolderIndex);

  // Set initial selection to first file
  useEffect(() => {
    if (folder.files && folder.files.length > 0 && !currentSelection) {
      setSelection(folder.path, folder.files[0].absolutePath);
    }
  }, [folder.path, folder.files, currentSelection, setSelection]);

  // Get current file info
  const currentFile = currentSelection
    ? folder.files?.find((f) => f.absolutePath === currentSelection)
    : null;
  const currentFileName = currentFile?.filename || '0042.png';

  // Load the current image
  const { image, loading } = useImageLoader(currentSelection || null);

  const otherFolders = folders.filter((_, i) => i !== idx);

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

    // Background
    ctx.fillStyle = '#2a2724';
    ctx.fillRect(0, 0, size.width, size.height);

    if (image) {
      const iw = image.naturalWidth;
      const ih = image.naturalHeight;

      if (iw > 0 && ih > 0) {
        // Contain fit
        const scaleX = size.width / iw;
        const scaleY = size.height / ih;
        const fitScale = Math.min(scaleX, scaleY) * vp.zoom;

        const drawW = iw * fitScale;
        const drawH = ih * fitScale;

        // Center + pan
        const cx = vp.panX + size.width / 2;
        const cy = vp.panY + size.height / 2;
        const dx = cx - drawW / 2;
        const dy = cy - drawH / 2;

        ctx.drawImage(image, dx, dy, drawW, drawH);
      }
    } else {
      // Placeholder pattern + label
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let x = -size.height; x < size.width; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + size.height, size.height);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(250,248,243,0.85)';
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(loading ? '加载中...' : `图 ${idx + 1}`, size.width / 2, size.height / 2);
    }

    // Peek overlay
    if (isPeekTarget && peekActive && peekSourcePath) {
      ctx.fillStyle = 'rgba(231, 181, 40, 0.15)';
      ctx.fillRect(0, 0, size.width, size.height);
    }
  }, [image, loading, vp.zoom, vp.panX, vp.panY, isPeekTarget, peekActive, peekSourcePath, idx, size]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    if (e.ctrlKey || e.metaKey) {
      zoomAll(delta);
    } else {
      zoomCell(folder.path, delta, cx, cy);
    }
  }, [folder.path, zoomCell, zoomAll]);

  const [dragging, setDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Don't start drag on buttons
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT') return;
    setDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    setFocusedFolder(idx);
  }, [idx, setFocusedFolder]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    if (e.ctrlKey || e.metaKey) {
      panAll(dx, dy);
    } else {
      panCell(folder.path, dx, dy);
    }
  }, [dragging, folder.path, panCell, panAll]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: 'relative',
        border: isPeekTarget ? '3px dashed var(--tag-yellow)' : 'none',
        minHeight: 0,
        overflow: 'hidden',
        cursor: dragging ? 'grabbing' : 'grab',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />

      {/* Alias Badge — top-left */}
      {editingAlias ? (
        <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 6 }}>
          <AliasEditInput
            initialValue={folder.alias}
            onSave={(a) => { updateAlias(idx, a); setEditingAlias(false); }}
            onCancel={() => setEditingAlias(false)}
          />
        </div>
      ) : (
        <div
          onClick={(e) => { e.stopPropagation(); setEditingAlias(true); }}
          title="点击编辑 alias"
          style={{
            position: 'absolute', top: 8, left: 8,
            background: 'rgba(250,248,243,0.92)',
            border: '1px solid var(--rule)',
            borderRadius: 4,
            padding: '3px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            cursor: 'text',
            zIndex: 5,
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: TAG_COLORS[folder.colorIndex % 4],
          }} />
          {folder.alias}
          <span style={{ color: 'var(--ink-3)', fontSize: 9 }}>✎</span>
        </div>
      )}

      {/* Tag Chip — top-right */}
      {tag && (
        <span style={{
          position: 'absolute', top: 8, right: 8,
          width: 16, height: 16, borderRadius: 3,
          background: TAG_COLORS[tag - 1],
          border: '1px solid rgba(0,0,0,0.4)',
          zIndex: 5,
        }} />
      )}

      {/* File Name + Zoom — bottom-left */}
      <div style={{
        position: 'absolute', bottom: 8, left: 8,
        color: 'rgba(250,248,243,0.85)',
        fontSize: 10, fontFamily: 'var(--font-mono)',
        background: 'rgba(0,0,0,0.4)',
        padding: '2px 6px', borderRadius: 3,
        zIndex: 5,
        pointerEvents: 'none',
      }}>
        {currentFileName} · {Math.round(vp.zoom * 100)}%
      </div>

      {/* Peek Buttons — bottom-right */}
      {n > 1 && (
        <div style={{
          position: 'absolute', bottom: 8, right: 8,
          display: 'flex', gap: 3, alignItems: 'center',
          zIndex: 5,
        }}>
          <span style={{
            fontSize: 9, color: 'rgba(250,248,243,0.55)',
            fontFamily: 'var(--font-ui)', marginRight: 2,
          }}>peek:</span>
          {otherFolders.map((f) => {
            const otherIdx = folders.indexOf(f);
            const active = isPeekTarget && peekSourcePath === f.path;
            return (
              <button
                key={f.path}
                onMouseDown={(e) => { e.stopPropagation(); startPeek(f.path, folder.path, f.alias); }}
                onMouseUp={(e) => { e.stopPropagation(); stopPeek(); }}
                onMouseLeave={(e) => { if (e.buttons === 0) stopPeek(); }}
                title={`按住：将 ${f.alias} 叠到本格`}
                style={{
                  width: 18, height: 18, borderRadius: 3,
                  background: active ? 'var(--tag-yellow)' : 'rgba(250,248,243,0.85)',
                  border: '1px solid var(--rule)',
                  fontSize: 10, fontFamily: 'var(--font-mono)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative',
                  color: 'var(--ink)',
                  padding: 0,
                }}
              >
                {otherIdx + 1}
                <span style={{
                  position: 'absolute', top: -2, right: -2,
                  width: 5, height: 5, borderRadius: '50%',
                  background: TAG_COLORS[otherIdx % 4],
                }} />
              </button>
            );
          })}
        </div>
      )}

      {/* Peek Toast */}
      {isPeekTarget && peekActive && (
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--tag-yellow)', color: 'var(--ink)',
          padding: '4px 10px', borderRadius: 4,
          fontSize: 11, fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          peek 中：叠加 {folders.find((f) => f.path === peekSourcePath)?.alias || ''}
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)',
          zIndex: 8,
        }}>
          <div style={{
            background: 'var(--paper)',
            padding: '12px 16px',
            borderRadius: 6,
            fontSize: 12,
            color: 'var(--tag-red)',
            textAlign: 'center',
          }}>
            {error}
            <br />
            <button
              onClick={() => setError(null)}
              style={{ marginTop: 8, cursor: 'pointer', fontSize: 11 }}
            >关闭</button>
          </div>
        </div>
      )}
    </div>
  );
}
