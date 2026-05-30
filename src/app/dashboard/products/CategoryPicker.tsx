'use client';

import { useState } from 'react';
import type { Category } from '@/lib/types';

export function CategoryPicker({
  categories,
  defaultSlugs = [],
}: {
  categories: Category[];
  defaultSlugs?: string[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(defaultSlugs));

  function toggle(slug: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  if (categories.length === 0) {
    return (
      <div className="dash-input-box">
        <p style={{ fontSize: 12, color: 'var(--dash-muted)' }}>
          No categories yet. Add some in the Categories section first.
        </p>
      </div>
    );
  }

  return (
    <div className="dash-chip-group">
      {categories.map(c => {
        const active = selected.has(c.slug);
        return (
          <label
            key={c.id}
            className={`dash-chip${active ? ' dash-chip-active' : ''}`}
          >
            <input
              type="checkbox"
              name="categories"
              value={c.slug}
              checked={active}
              onChange={() => toggle(c.slug)}
            />
            {c.name}
          </label>
        );
      })}
    </div>
  );
}
