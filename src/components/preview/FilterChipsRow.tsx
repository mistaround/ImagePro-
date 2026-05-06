import { useState } from 'react';
import { useTagStore } from '../../stores/useTagStore.js';
import { TAG_COLORS } from '../../types/tags.js';

export default function FilterChipsRow() {
  const tagMeta = useTagStore((s) => s.tagMeta);
  const [activeFilters, setActiveFilters] = useState<Set<number>>(new Set());

  // Mock counts
  const counts: Record<number, number> = { 1: 12, 2: 4, 3: 0, 4: 7 };

  const toggleFilter = (key: number) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  return (
    <div style={{
      padding: '8px 14px',
      borderBottom: '1px solid #333',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      background: 'var(--toolbar-bg)',
    }}>
      <span style={{ fontSize: 11, color: 'var(--ink-2)' }}>过滤：</span>
      {[1, 2, 3, 4].map((key) => (
        <button
          key={key}
          onClick={() => toggleFilter(key)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            border: activeFilters.has(key) ? '2px solid var(--ink)' : '1px solid var(--rule)',
            borderRadius: 999,
            background: activeFilters.has(key) ? 'var(--paper)' : 'var(--paper)',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            opacity: counts[key] === 0 && !activeFilters.has(key) ? 0.4 : 1,
          }}
        >
          <span style={{
            width: 10, height: 10, borderRadius: 2,
            background: TAG_COLORS[key - 1],
            border: '1px solid rgba(0,0,0,0.3)',
          }} />
          {tagMeta[key]?.label || key} · {counts[key]}
        </button>
      ))}
      <div style={{ flex: 1 }} />
      {activeFilters.size > 0 && (
        <button
          onClick={() => setActiveFilters(new Set())}
          style={{
            padding: '2px 8px',
            border: '1px solid var(--rule)',
            borderRadius: 4,
            background: 'var(--paper)',
            cursor: 'pointer',
            fontSize: 11,
            color: 'var(--ink-2)',
          }}
        >清除筛选</button>
      )}
    </div>
  );
}
