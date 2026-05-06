import { useState } from 'react';
import { useTagStore } from '../../stores/useTagStore.js';
import { TAG_COLORS } from '../../types/tags.js';

export default function TagQuickFilter() {
  const tagMeta = useTagStore((s) => s.tagMeta);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', gap: 8, padding: '2px 12px 8px', alignItems: 'center' }}>
      {[1, 2, 3, 4].map((key) => (
        <button
          key={key}
          onClick={() => setActiveFilter(activeFilter === key ? null : key)}
          title={tagMeta[key]?.label}
          style={{
            width: 12, height: 12, borderRadius: '50%',
            background: TAG_COLORS[key - 1],
            border: activeFilter === key ? '2px solid var(--ink)' : '1px solid rgba(0,0,0,0.3)',
            cursor: 'pointer',
            padding: 0,
            opacity: activeFilter && activeFilter !== key ? 0.4 : 1,
          }}
        />
      ))}
      <span style={{ marginLeft: 'auto', color: 'var(--ink-3)', fontSize: 11 }}>
        {activeFilter ? `仅${tagMeta[activeFilter]?.label || ''}` : '全部'}
      </span>
    </div>
  );
}
