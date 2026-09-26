import type { ReactNode } from 'react';

/** The framed panel every sign-in style page sits in. */
export function AuthCard({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="container-editorial pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="mx-auto max-w-md border border-ivory-300 bg-ivory-50 p-8 md:p-10">
        <p className="eyebrow text-gold-700">{eyebrow}</p>
        <h1 className="display-md mt-3 font-light text-ink-900">{title}</h1>
        {intro && <div className="mt-3 text-sm leading-relaxed text-ink-500">{intro}</div>}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
