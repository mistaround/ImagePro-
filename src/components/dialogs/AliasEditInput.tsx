import { useState, useRef, useEffect } from 'react';

interface AliasEditInputProps {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

export default function AliasEditInput({ initialValue, onSave, onCancel }: AliasEditInputProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <div style={{
      background: 'var(--paper)',
      border: '2px solid var(--accent-blue)',
      borderRadius: 4,
      padding: '4px 8px',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      whiteSpace: 'nowrap',
    }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave(value);
          if (e.key === 'Escape') onCancel();
        }}
        onBlur={() => onCancel()}
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--ink)',
          minWidth: 60,
        }}
      />
      <span style={{ color: 'var(--ink-3)', fontSize: 10 }}>
        Enter 保存 · Esc 取消
      </span>
    </div>
  );
}
