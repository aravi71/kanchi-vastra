'use client';

import { startTransition, useActionState, type FormEvent, type ReactNode } from 'react';
import { Field, TextInput } from '@/components/ui/Field';
import { cn } from '@/lib/utils';

export type FormState = { error?: string; ok?: string; fieldErrors?: Record<string, string> };

export interface FieldSpec {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  autoComplete?: string;
  required?: boolean;
  hint?: string;
  defaultValue?: string;
  inputMode?: 'numeric' | 'text' | 'email' | 'tel';
  maxLength?: number;
}

/**
 * A form wired to a Server Action: server-side validation messages appear
 * under each field, a general error or success line above the button, and
 * the button is disabled while the request is in flight.
 */
export function ActionForm({
  action,
  fields,
  submitLabel,
  hidden,
  footer,
  tone = 'wine',
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  fields: FieldSpec[];
  submitLabel: string;
  hidden?: Record<string, string>;
  footer?: ReactNode;
  tone?: 'wine' | 'ink';
}) {
  const [state, formAction, pending] = useActionState(action, {} as FormState);

  return (
    <form onSubmit={keepValues(formAction)} className="space-y-6" noValidate>
      {hidden &&
        Object.entries(hidden).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}

      {fields.map((f) => (
        <Field
          key={f.name}
          label={f.label}
          required={f.required}
          hint={f.hint}
          error={state.fieldErrors?.[f.name]}
        >
          {(a11y) => (
            <TextInput
              {...a11y}
              name={f.name}
              type={f.type ?? 'text'}
              autoComplete={f.autoComplete}
              required={f.required}
              defaultValue={f.defaultValue}
              inputMode={f.inputMode}
              maxLength={f.maxLength}
              invalid={Boolean(state.fieldErrors?.[f.name])}
            />
          )}
        </Field>
      ))}

      {state.error && (
        <p
          role="alert"
          className="border-l-2 border-terracotta-500 bg-terracotta-500/5 px-4 py-3 text-sm text-terracotta-600"
        >
          {state.error}
        </p>
      )}
      {state.ok && (
        <p
          role="status"
          className="border-l-2 border-emerald-600 bg-emerald-600/5 px-4 py-3 text-sm text-emerald-800"
        >
          {state.ok}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          'eyebrow inline-flex h-12 w-full items-center justify-center text-ivory-50 transition-colors disabled:opacity-60',
          tone === 'wine' ? 'bg-wine-800 hover:bg-wine-950' : 'bg-ink-900 hover:bg-ink-700',
        )}
      >
        {pending ? 'Please wait…' : submitLabel}
      </button>
      {footer}
    </form>
  );
}

/**
 * Submit handler that keeps what the person typed. With <form action={...}>
 * React 19 resets the form after every submission — including when the
 * server answers "password too short" — which would wipe every field.
 * Dispatching the action manually skips that reset.
 */
export function keepValues(dispatch: (data: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => dispatch(data));
  };
}
