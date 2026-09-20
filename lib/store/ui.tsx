'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type Overlay = 'search' | 'cart' | 'menu' | null;

interface UiContextValue {
  overlay: Overlay;
  open: (o: Exclude<Overlay, null>) => void;
  close: () => void;
  isOpen: (o: Exclude<Overlay, null>) => boolean;
}

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null);

  const open = useCallback((o: Exclude<Overlay, null>) => setOverlay(o), []);
  const close = useCallback(() => setOverlay(null), []);

  // A single Escape handler for every overlay, and a scroll lock while one is up.
  useEffect(() => {
    if (!overlay) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOverlay(null);
    };
    document.addEventListener('keydown', onKey);

    // Compensate for the disappearing scrollbar so the page does not jump.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [overlay]);

  const value = useMemo<UiContextValue>(
    () => ({ overlay, open, close, isOpen: (o) => overlay === o }),
    [overlay, open, close],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used inside <UiProvider>');
  return ctx;
}
