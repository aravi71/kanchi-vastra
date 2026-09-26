'use client';

import { Check, X } from 'lucide-react';
import { categories, colorFamilies, fabrics, priceBands } from '@/content/collections';
import { countActiveFilters, type FilterState } from '@/features/catalog/filters';
import { cn } from '@/lib/utils';
import type { CategoryId, ColorFamily, Fabric } from '@/types/catalog';

/**
 * The facet panel. Rendered inline as a sidebar from `lg`, and inside a
 * bottom sheet on touch devices — same component, same state, two frames.
 */
export function FilterPanel({
  state,
  onChange,
  onReset,
  counts,
}: {
  state: FilterState;
  onChange: (next: Partial<FilterState>) => void;
  onReset: () => void;
  /** How many products each facet value would yield, for the count hints. */
  counts: {
    category: Record<string, number>;
    color: Record<string, number>;
    fabric: Record<string, number>;
    band: Record<string, number>;
  };
}) {
  const active = countActiveFilters(state);

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  return (
    <div className="space-y-9">
      {active > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="eyebrow-sm inline-flex items-center gap-2 text-wine-700 transition-opacity hover:opacity-70"
        >
          <X className="size-3.5" strokeWidth={1.6} />
          Clear {active} {active === 1 ? 'filter' : 'filters'}
        </button>
      )}

      <Group title="Collection">
        {categories.map((c) => (
          <CheckRow
            key={c.id}
            label={c.label}
            count={counts.category[c.id] ?? 0}
            checked={state.categories.includes(c.id)}
            onToggle={() => onChange({ categories: toggle<CategoryId>(state.categories, c.id) })}
          />
        ))}
      </Group>

      <Group title="Colour">
        {colorFamilies.map((c) => (
          <CheckRow
            key={c.id}
            label={c.label}
            count={counts.color[c.id] ?? 0}
            checked={state.colors.includes(c.id)}
            onToggle={() => onChange({ colors: toggle<ColorFamily>(state.colors, c.id) })}
            swatch={c.hex}
          />
        ))}
      </Group>

      <Group title="Price">
        {priceBands.map((b) => (
          <CheckRow
            key={b.id}
            label={b.label}
            count={counts.band[b.id] ?? 0}
            checked={state.bands.includes(b.id)}
            onToggle={() => onChange({ bands: toggle(state.bands, b.id) })}
          />
        ))}
      </Group>

      <Group title="Fabric">
        {fabrics.map((f) => (
          <CheckRow
            key={f}
            label={f}
            count={counts.fabric[f] ?? 0}
            checked={state.fabrics.includes(f)}
            onToggle={() => onChange({ fabrics: toggle<Fabric>(state.fabrics, f) })}
          />
        ))}
      </Group>

      <Group title="Availability">
        <CheckRow
          label="In stock only"
          checked={state.inStockOnly}
          onToggle={() => onChange({ inStockOnly: !state.inStockOnly })}
        />
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="eyebrow-sm mb-4 text-ink-400">{title}</legend>
      <div className="space-y-0.5">{children}</div>
    </fieldset>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onToggle,
  swatch,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onToggle: () => void;
  swatch?: string;
}) {
  const empty = count === 0;
  return (
    <label
      className={cn(
        'group flex cursor-pointer items-center gap-3 py-2 text-sm transition-opacity',
        empty && !checked && 'opacity-40',
      )}
    >
      <input type="checkbox" checked={checked} onChange={onToggle} className="sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          'grid size-4 shrink-0 place-items-center border transition-colors duration-300',
          checked
            ? 'border-wine-700 bg-wine-700'
            : 'border-ink-900/30 group-hover:border-ink-900/60',
        )}
      >
        {checked && <Check className="size-3 text-ivory-50" strokeWidth={2.4} />}
      </span>

      {swatch && (
        <span
          aria-hidden="true"
          className="size-3.5 shrink-0 rounded-full ring-1 ring-ink-900/15 ring-inset"
          style={{ backgroundColor: swatch }}
        />
      )}

      <span className="flex-1 text-ink-700">{label}</span>
      {typeof count === 'number' && <span className="tnum text-xs text-ink-300">{count}</span>}
    </label>
  );
}
