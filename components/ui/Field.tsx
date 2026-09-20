'use client';

import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Accessible form field. The label is always present (never a placeholder
 * standing in for one), the error is wired through aria-describedby, and
 * aria-invalid is set so screen readers announce the failure.
 */
export function Field({
  label,
  error,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: (props: {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby': string | undefined;
  }) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');

  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow-sm block text-ink-500">
        {label}
        {required && (
          <span className="ml-1 text-terracotta-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy || undefined,
      })}

      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-ink-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-terracotta-600">
          {error}
        </p>
      )}
    </div>
  );
}

const control =
  'mt-2 w-full border-b bg-transparent py-2.5 text-sm text-ink-900 transition-colors duration-300 ' +
  'placeholder:text-ink-300 focus:outline-none focus:border-wine-700';

export function TextInput({
  className,
  invalid,
  ...props
}: ComponentProps<'input'> & { invalid?: boolean }) {
  return (
    <input
      className={cn(control, invalid ? 'border-terracotta-500' : 'border-ivory-400', className)}
      {...props}
    />
  );
}

export function TextArea({
  className,
  invalid,
  ...props
}: ComponentProps<'textarea'> & { invalid?: boolean }) {
  return (
    <textarea
      className={cn(
        control,
        'min-h-24 resize-y',
        invalid ? 'border-terracotta-500' : 'border-ivory-400',
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  invalid,
  children,
  ...props
}: ComponentProps<'select'> & { invalid?: boolean }) {
  return (
    <select
      className={cn(
        control,
        'cursor-pointer',
        invalid ? 'border-terracotta-500' : 'border-ivory-400',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
