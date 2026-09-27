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
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex items-center rounded-full border border-cream-200/30 py-1.5 pr-1.5 pl-6 focus-within:border-brass-400">
        <input
          id={id}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== 'idle') setState('idle');
          }}
          aria-invalid={state === 'error'}
          aria-describedby={`${id}-msg`}
          className="w-full min-w-0 bg-transparent py-2.5 text-sm text-cream-100 placeholder:text-cream-200/45 focus:outline-none"
        />
        <button
          type="submit"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-brass-500 text-forest-900 transition-colors duration-500 hover:bg-brass-300"
          aria-label="Submit email address"
        >
          <ArrowRight className="size-4" strokeWidth={1.6} />
        </button>
      </div>
      <p
        id={`${id}-msg`}
        role="status"
        aria-live="polite"
        className="mt-3 min-h-[1.25rem] pl-6 text-xs text-cream-200/60"
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
