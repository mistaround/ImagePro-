import { useRef, useCallback, type ReactNode } from 'react';

interface ResizablePanelProps {
  width: number;
  onWidthChange: (w: number) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  side: 'left' | 'right';
  children: ReactNode;
  minWidth?: number;
  maxWidth?: number;
}

export default function ResizablePanel({
  width, onWidthChange, collapsed, onToggleCollapse,
  side, children, minWidth = 180, maxWidth = 450,
}: ResizablePanelProps) {
  const dragging = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const dx = ev.clientX - startX;
      const newWidth = side === 'left'
        ? startWidth + dx
        : startWidth - dx;
      onWidthChange(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    };

    const onMouseUp = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [width, onWidthChange, side, minWidth, maxWidth]);

  if (collapsed) {
    return (
      <div style={{
        width: 36,
        flexShrink: 0,
        borderRight: side === 'left' ? '1px solid #333' : undefined,
        borderLeft: side === 'right' ? '1px solid #333' : undefined,
        background: 'var(--sidebar-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 0',
        gap: 8,
      }}>
        <button
          onClick={onToggleCollapse}
          title="展开"
          style={{
            width: 24, height: 24,
            border: '1px solid var(--rule)',
            borderRadius: 4,
            background: 'var(--paper)',
            cursor: 'pointer',
            fontSize: 12,
            color: 'var(--ink-2)',
          }}
        >{side === 'left' ? '»' : '«'}</button>
      </div>
    );
  }

  return (
    <div style={{
      width,
      flexShrink: 0,
      display: 'flex',
      position: 'relative',
    }}>
      <div style={{
        flex: 1,
        borderRight: side === 'left' ? '1px solid #333' : undefined,
        borderLeft: side === 'right' ? '1px solid #333' : undefined,
        background: 'var(--sidebar-bg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}>
        <div style={{
          padding: '8px 12px',
          borderBottom: '1px dashed var(--ink-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexShrink: 0,
        }}>
          <span style={{ flex: 1, fontWeight: 600, fontSize: 12 }}>
            {side === 'left' ? '文件夹' : '图片区'}
          </span>
          <button
            onClick={onToggleCollapse}
            title="收起"
            style={{
              width: 22, height: 22,
              border: '1px solid var(--rule)',
              borderRadius: 4,
              background: 'var(--paper)',
              cursor: 'pointer',
              fontSize: 11,
              color: 'var(--ink-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >{side === 'left' ? '«' : '»'}</button>
        </div>
        {children}
      </div>
      <div
        onMouseDown={onMouseDown}
        style={{
          position: 'absolute',
          [side === 'left' ? 'right' : 'left']: -3,
          top: 0,
          bottom: 0,
          width: 6,
          cursor: 'col-resize',
          zIndex: 10,
        }}
      />
    </div>
  );
}
