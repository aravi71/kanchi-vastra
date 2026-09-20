'use client';

import { useState, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

/**
 * Disclosure list. Built on buttons with aria-expanded rather than <details>
 * so the open/close transition can be animated and a single item can be
 * opened by default.
 */
export function Accordion({
  items,
  defaultOpen,
  className,
}: {
  items: AccordionItem[];
  defaultOpen?: string;
  className?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);

  return (
    <div className={cn('divide-y divide-ivory-300 border-y border-ivory-300', className)}>
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={`acc-${item.id}`}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="eyebrow-sm">{item.title}</span>
                <Plus
                  className={cn(
                    'size-4 shrink-0 text-ink-400 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    isOpen && 'rotate-45',
                  )}
                  strokeWidth={1.4}
                />
              </button>
            </h3>
            <div
              id={`acc-${item.id}`}
              role="region"
              hidden={!isOpen}
              className={cn('pb-6 text-sm leading-[1.85] text-ink-600', isOpen && 'animate-fade')}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
