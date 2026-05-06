import { useRef, useEffect, useCallback, useState } from 'react';
import { useViewportStore } from '../../stores/useViewportStore.js';
import { useImageStore } from '../../stores/useImageStore.js';
import { usePeekStore } from '../../stores/usePeekStore.js';
import { useTagStore } from '../../stores/useTagStore.js';
import { useFolderStore } from '../../stores/useFolderStore.js';
import { useUIStore } from '../../stores/useUIStore.js';
import { TAG_COLORS } from '../../types/tags.js';
import AliasEditInput from '../dialogs/AliasEditInput.js';

interface GridCellProps {
  idx: number;
  n: number;
  folder: { path: string; alias: string; colorIndex: number };
  isPeekTarget: boolean;
  isPeekSource: boolean;
}

export default function GridCell({ idx, n, folder, isPeekTarget, isPeekSource }: GridCellProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingAlias, setEditingAlias] = useState(false);

  const viewports = useViewportStore((s) => s.viewports);
  const vp = viewports[folder.path] || { zoom: 1, panX: 0, panY: 0 };
  const zoomCell = useViewportStore((s) => s.zoomCell);
  const panCell = useViewportStore((s) => s.panCell);
  const zoomAll = useViewportStore((s) => s.zoomAll);
  const panAll = useViewportStore((s) => s.panAll);
  const resetCell = useViewportStore((s) => s.resetCell);

  const startPeek = usePeekStore((s) => s.startPeek);
  const stopPeek = usePeekStore((s) => s.stopPeek);
  const peekActive = usePeekStore((s) => s.active);
  const peekSourcePath = usePeekStore((s) => s.sourceFolderPath);

  const tag = useTagStore((s) => s.tags[`${folder.path}/0042.png`]);
  const updateAlias = useFolderStore((s) => s.updateAlias);
  const folders = useFolderStore((s) => s.folders);
  const setFocusedFolder = useUIStore((s) => s.setFocusedFolderIndex);

  const otherFolders = folders.filter((_, i) => i !== idx);

  // Handle canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw background
    ctx.fillStyle = '#2a2724';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw diagonal pattern
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = -rect.height; x < rect.width; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + rect.height, rect.height);
      ctx.stroke();
    }

    // Draw placeholder label
    ctx.fillStyle = 'rgba(250,248,243,0.85)';
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`图 ${idx + 1}`, rect.width / 2, rect.height / 2);
  }, [idx, vp.zoom]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
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
    if (e.target !== canvasRef.current && (e.target as HTMLElement).tagName === 'BUTTON') return;
    setDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    setFocusedFolder(idx);
    error && setError(null);
  }, [idx, setFocusedFolder, error]);

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
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <AliasEditInput
            initialValue={folder.alias}
            onSave={(a) => { updateAlias(idx, a); setEditingAlias(false); }}
            onCancel={() => setEditingAlias(false)}
          />
        </div>
      ) : (
        <div
          onClick={() => setEditingAlias(true)}
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
      }}>
        0042.png · {Math.round(vp.zoom * 100)}%
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
                onMouseDown={() => startPeek(f.path, folder.path, f.alias)}
                onMouseUp={stopPeek}
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
