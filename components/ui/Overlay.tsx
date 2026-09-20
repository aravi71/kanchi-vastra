'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

/**
 * Modal surface shared by the cart drawer, the mobile menu and search.
 *
 * Handles the things that are easy to get wrong and invisible when they are:
 * focus moves in on open, is trapped while open, and returns to the trigger on
 * close. Escape and body scroll-lock are handled centrally in the UI store.
 */
export function Overlay({
  open,
  onClose,
  side = 'right',
  labelledBy,
  label,
  children,
  panelClassName,
}: {
  open: boolean;
  onClose: () => void;
  side?: 'right' | 'left' | 'top';
  labelledBy?: string;
  label?: string;
  children: ReactNode;
  panelClassName?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;

    // Focus the first control inside the panel, or the panel itself.
    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      restoreRef.current?.focus?.();
    };
  }, [open]);

  const hiddenTransform =
    side === 'right' ? 'translate-x-full' : side === 'left' ? '-translate-x-full' : '-translate-y-full';

  const position =
    side === 'top'
      ? 'inset-x-0 top-0'
      : side === 'right'
        ? 'inset-y-0 right-0 w-full max-w-[26.5rem]'
        : 'inset-y-0 left-0 w-full max-w-[21rem]';

  return (
    <div
      className={cn('fixed inset-0 z-[70]', open ? 'visible' : 'invisible delay-500')}
      aria-hidden={!open}
    >
      {/* scrim */}
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close"
        onClick={onClose}
        className={cn(
          'absolute inset-0 h-full w-full cursor-default bg-wine-950/45 backdrop-blur-[2px] transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          'absolute flex flex-col bg-ivory-100 shadow-[0_0_60px_rgba(43,10,20,0.16)] outline-none',
          'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          position,
          open ? 'translate-x-0 translate-y-0' : hiddenTransform,
          panelClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
