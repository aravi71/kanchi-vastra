'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Product gallery with thumbnail navigation, hover-zoom on pointer devices
 * and a fullscreen viewer.
 *
 * Zoom is driven by transform-origin rather than a second magnified element,
 * which keeps it to one repaint and works identically on every image size.
 */
export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + images.length) % images.length),
    [images.length],
  );

  // Arrow-key navigation, and Escape to leave the fullscreen viewer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Escape' && fullscreen) setFullscreen(false);
    };
    if (!fullscreen) return;
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [go, fullscreen]);

  return (
    <>
      <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-4">
        {/* --- thumbnails --- */}
        <ul
          className="no-scrollbar flex gap-3 overflow-x-auto md:w-[74px] md:shrink-0 md:flex-col md:overflow-visible"
          aria-label={`${name} images`}
        >
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === index}
                className={cn(
                  // Unselected thumbnails are only lightly dimmed — any more and
                  // the crops stop reading as the same cloth.
                  'relative block aspect-[3/4] w-[62px] overflow-hidden bg-ivory-200 transition-opacity duration-500 md:w-full',
                  i === index ? 'opacity-100 ring-1 ring-ink-900' : 'opacity-80 hover:opacity-100',
                )}
              >
                <Image src={src} alt="" fill sizes="74px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>

        {/* --- main image --- */}
        <div className="relative flex-1">
          <div
            className="group relative aspect-[3/4] w-full overflow-hidden bg-ivory-200"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setOrigin(
                `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`,
              );
            }}
            onMouseLeave={() => setZoom(false)}
          >
            {images.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={i === 0 ? name : `${name} — detail ${i}`}
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 45vw"
                className={cn(
                  'object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                  i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
                style={
                  i === index
                    ? { transformOrigin: origin, transform: zoom ? 'scale(2)' : 'scale(1)' }
                    : undefined
                }
              />
            ))}

            {/* hover-zoom toggle, pointer devices only */}
            <button
              type="button"
              onClick={() => setZoom((z) => !z)}
              aria-pressed={zoom}
              className="absolute bottom-3 left-3 hidden items-center gap-2 bg-ivory-50/85 px-3.5 py-2.5 backdrop-blur-sm transition-opacity hover:opacity-75 md:flex"
            >
              <ZoomIn className="size-4" strokeWidth={1.3} />
              <span className="eyebrow-sm">{zoom ? 'Zoom off' : 'Zoom'}</span>
            </button>

            <button
              type="button"
              onClick={() => setFullscreen(true)}
              className="absolute bottom-3 right-3 grid size-10 place-items-center bg-ivory-50/85 backdrop-blur-sm transition-opacity hover:opacity-75"
              aria-label="View fullscreen"
            >
              <Expand className="size-4" strokeWidth={1.3} />
            </button>

            {/* prev / next, touch-friendly */}
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center bg-ivory-50/80 opacity-0 backdrop-blur-sm transition-opacity duration-500 focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" strokeWidth={1.3} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center bg-ivory-50/80 opacity-0 backdrop-blur-sm transition-opacity duration-500 focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="size-5" strokeWidth={1.3} />
            </button>
          </div>

          <p className="eyebrow-sm mt-3 text-center text-ink-400 md:hidden" aria-live="polite">
            {index + 1} / {images.length}
          </p>
        </div>
      </div>

      {/* --- fullscreen viewer --------------------------------------- */}
      {fullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} — fullscreen image viewer`}
          className="fixed inset-0 z-[90] flex flex-col bg-wine-950/97 animate-fade"
        >
          <div className="flex items-center justify-between px-5 py-4 text-ivory-100">
            <p className="eyebrow-sm">
              {name} · {index + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="-mr-2 p-2 transition-opacity hover:opacity-70"
              aria-label="Close fullscreen viewer"
              autoFocus
            >
              <X className="size-6" strokeWidth={1.3} />
            </button>
          </div>

          <div className="relative flex-1">
            <Image
              src={images[index]}
              alt={`${name} — image ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <div className="flex items-center justify-center gap-3 py-5">
            <button
              type="button"
              onClick={() => go(-1)}
              className="grid size-11 place-items-center text-ivory-100 transition-opacity hover:opacity-65"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" strokeWidth={1.2} />
            </button>
            <ul className="flex gap-2">
              {images.map((src, i) => (
                <li key={src}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Image ${i + 1}`}
                    aria-current={i === index}
                    className={cn(
                      'h-px w-9 transition-colors duration-500',
                      i === index ? 'bg-gold-400' : 'bg-ivory-100/30',
                    )}
                  />
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => go(1)}
              className="grid size-11 place-items-center text-ivory-100 transition-opacity hover:opacity-65"
              aria-label="Next image"
            >
              <ChevronRight className="size-6" strokeWidth={1.2} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
