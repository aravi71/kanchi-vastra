import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';

/** Centered card for the admin sign-in steps. */
export function AdminAuthShell({
  step,
  title,
  intro,
  children,
}: {
  step: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-svh items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <p className="mb-6 flex items-center justify-center gap-2 text-sm text-ink-500">
          <ShieldCheck className="size-4 text-wine-800" /> Kanchi Vastra · Admin
        </p>
        <div className="rounded-lg border border-ivory-300 bg-white p-8 shadow-sm md:p-10">
          <p className="eyebrow-sm text-gold-700">{step}</p>
          <h1 className="mt-2 font-display text-3xl font-light">{title}</h1>
          {intro && <div className="mt-3 text-sm leading-relaxed text-ink-500">{intro}</div>}
          <div className="mt-8">{children}</div>
        </div>
        <p className="mt-6 text-center text-xs text-ink-400">
          Every sign-in is recorded and sends an email alert.
        </p>
      </div>
    </main>
  );
}
