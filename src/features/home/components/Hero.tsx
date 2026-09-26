'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { TempleBorder } from '@/components/motifs/Motifs';

/**
 * Cinematic opening frame.
 *
 * The parallax is a single transform driven by scroll position and capped at
 * a small distance — enough to give the cloth weight, not enough to become a
 * gimmick. It is disabled outright for reduced-motion users.
 */
export function Hero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Cap the travel so the image never detaches from the section.
        setOffset(Math.min(window.scrollY * 0.18, 90));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-wine-950">
      {/* --- image --- */}
      <div
        className="absolute inset-0 -z-10 will-change-transform"
        style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.08)` }}
      >
        <Image
          src="/images/editorial/hero-portrait.svg"
          alt="A deep wine Kanchipuram silk saree with an antique gold zari border and lotus motifs"
          fill
          priority
          sizes="100vw"
          className="object-cover md:hidden"
        />
        <Image
          src="/images/editorial/hero.svg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover md:block"
        />
      </div>

      {/* Tonal wash so the type always has ground to sit on. */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-wine-950 via-wine-950/55 to-wine-950/20"
        aria-hidden="true"
      />

      {/* --- copy --- */}
      <div className="container-editorial relative w-full pb-20 pt-40 md:pb-28 lg:pb-32">
        <div className="max-w-3xl">
          <p
            className="eyebrow text-gold-400/90 animate-fade"
            style={{ animationDelay: '120ms' }}
          >
            Kanchi Vastra
          </p>

          <h1 className="display-hero mt-6 font-light text-ivory-50">
            {['The Art of', 'Timeless Silk'].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span
                  className="block animate-fade-up"
                  style={{ animationDelay: `${260 + i * 130}ms` }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="mt-7 max-w-md text-[1.0625rem] leading-relaxed text-ivory-200/85 animate-fade-up"
            style={{ animationDelay: '580ms' }}
          >
            Where South Indian heritage meets contemporary elegance.
          </p>

          <div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4 animate-fade-up"
            style={{ animationDelay: '700ms' }}
          >
            <ButtonLink href="/shop" variant="onDark" size="lg" className="bg-ivory-50 text-wine-950 hover:bg-gold-400 hover:text-wine-950 border-transparent">
              Explore the Collection
            </ButtonLink>
            <ButtonLink href="/about" variant="onDark" size="lg">
              Discover Our Story
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Temple teeth rise out of the bottom edge to meet the ivory below. */}
      <TempleBorder className="absolute inset-x-0 bottom-0 text-ivory-100" height={16} />
    </section>
  );
}
