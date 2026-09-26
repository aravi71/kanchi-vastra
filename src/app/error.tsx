'use client';

import { useEffect } from 'react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { LotusMark } from '@/components/motifs/Motifs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with a real error reporter (Sentry, etc.) when one is added.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center px-5 py-32 text-center">
      <LotusMark className="text-gold-500/70" size={30} />

      <p className="eyebrow mt-8 text-wine-700">Something went wrong</p>

      <h1 className="display-lg mt-5 max-w-xl font-light text-balance">We have dropped a stitch</h1>

      <p className="mx-auto mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
        An unexpected error stopped this page from loading. Trying again usually resolves it.
      </p>

      {error.digest && <p className="tnum mt-4 text-xs text-ink-400">Reference: {error.digest}</p>}

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try Again</Button>
        <ButtonLink href="/" variant="secondary">
          Return Home
        </ButtonLink>
      </div>
    </div>
  );
}
