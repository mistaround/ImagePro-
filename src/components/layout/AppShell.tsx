import { type ReactNode } from 'react';

interface AppShellProps {
  top: ReactNode;
  left: ReactNode;
  right: ReactNode;
  bottom: ReactNode;
  children: ReactNode;
}

export default function AppShell({ top, left, right, bottom, children }: AppShellProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      background: 'var(--grid-bg)',
      overflow: 'hidden',
    }}>
      {top}
      <div style={{
        display: 'flex',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}>
        {left}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
        }}>
          {children}
        </div>
        {right}
      </div>
      {bottom}
    </div>
  );
}
