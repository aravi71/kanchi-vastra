'use client';

import { useId, useState } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Newsletter capture.
 *
 * There is no mailing-list provider connected yet, so this deliberately does
 * NOT claim a subscription succeeded. It validates the address, then tells the
 * visitor the truth: the list opens at launch. Wire it to a real provider by
 * replacing the body of `handleSubmit` with a POST to your API route.
 */
export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'error' | 'noted'>('idle');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    setState(valid ? 'noted' : 'error');
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor={id} className="eyebrow-sm text-ivory-200/60">
        Email address
      </label>
      <div className="mt-3 flex items-center border-b border-ivory-100/25 focus-within:border-gold-400">
        <input
          id={id}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== 'idle') setState('idle');
          }}
          aria-invalid={state === 'error'}
          aria-describedby={`${id}-msg`}
          className="w-full bg-transparent py-3 text-sm text-ivory-100 placeholder:text-ivory-200/30 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 p-3 text-gold-400 transition-transform duration-500 hover:translate-x-1"
          aria-label="Submit email address"
        >
          <ArrowRight className="size-5" strokeWidth={1.3} />
        </button>
      </div>
      <p
        id={`${id}-msg`}
        role="status"
        aria-live="polite"
        className="mt-3 min-h-[1.25rem] text-xs text-ivory-200/55"
      >
        {state === 'error' && (
          <span className="text-terracotta-400">Please enter a valid email address.</span>
        )}
        {state === 'noted' &&
          'Thank you. Our mailing list opens at launch — nothing has been sent yet.'}
      </p>
    </form>
  );
}
