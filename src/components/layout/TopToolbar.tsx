import { useAppStore } from '../../stores/useAppStore.js';
import { useUIStore } from '../../stores/useUIStore.js';
import TagPalette from '../tags/TagPalette.js';
import type { AppMode, PairingMode } from '../../types/ui.js';

export default function TopToolbar() {
  const mode = useAppStore((s) => s.mode);
  const pairingMode = useAppStore((s) => s.pairingMode);
  const setMode = useAppStore((s) => s.setMode);
  const setPairingMode = useAppStore((s) => s.setPairingMode);
  const navigateNext = useAppStore((s) => s.navigateNext);
  const navigatePrev = useAppStore((s) => s.navigatePrev);
  const setShowHelp = useUIStore((s) => s.setShowHelpDialog);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 14px',
      borderBottom: '1px solid #333',
      background: 'var(--toolbar-bg)',
      minHeight: 40,
      flexShrink: 0,
    }}>
      <NavButton onClick={navigatePrev} title="上一张">←</NavButton>
      <NavButton onClick={navigateNext} title="下一张">→</NavButton>

      <Divider />

      <ModeTabs
        options={[
          { value: 'compare' as AppMode, label: '对比模式' },
          { value: 'preview' as AppMode, label: '预览模式' },
        ]}
        value={mode}
        onChange={setMode}
      />

      <div style={{ flex: 1 }} />

      {mode === 'compare' && (
        <>
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>匹配：</span>
          <ModeTabs
            options={[
              { value: 'name' as PairingMode, label: '同名' },
              { value: 'free' as PairingMode, label: '自由' },
            ]}
            value={pairingMode}
            onChange={setPairingMode}
            small
          />
          <Divider />
        </>
      )}

      <TagPalette />
      <Divider />

      <button
        onClick={() => setShowHelp(true)}
        title="帮助 (F1)"
        style={{
          width: 26, height: 26,
          border: '1px solid var(--rule)',
          borderRadius: 4,
          background: 'var(--paper)',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ink-2)',
        }}
      >?</button>
    </div>
  );
}

function NavButton({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 26, height: 26,
        border: '1px solid var(--rule)',
        borderRadius: 4,
        background: 'var(--paper)',
        cursor: 'pointer',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--ink-2)',
        fontFamily: 'var(--font-mono)',
      }}
    >{children}</button>
  );
}

function ModeTabs<T extends string>({
  options, value, onChange, small,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  small?: boolean;
}) {
  return (
    <div style={{
      display: 'inline-flex',
      border: '1px solid var(--rule)',
      borderRadius: 999,
      padding: 2,
      background: 'var(--paper)',
    }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: small ? '3px 10px' : '4px 14px',
            fontSize: small ? 12 : 13,
            borderRadius: 999,
            border: 'none',
            cursor: 'pointer',
            background: value === opt.value ? 'var(--ink)' : 'transparent',
            color: value === opt.value ? 'var(--paper)' : 'var(--ink-2)',
            fontFamily: 'var(--font-ui)',
            whiteSpace: 'nowrap',
          }}
        >{opt.label}</button>
      ))}
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, background: 'var(--ink-3)', alignSelf: 'stretch', opacity: 0.4, margin: '0 4px' }} />;
}
