'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Select, TextArea, TextInput } from '@/components/ui/Field';

const SUBJECTS = [
  'A question about a saree',
  'An existing order',
  'Sizing, draping or care',
  'Wholesale or commission',
  'Something else',
];

interface Values {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const blank: Values = { name: '', email: '', phone: '', subject: '', message: '' };

/**
 * Contact form.
 *
 * There is no mail provider connected yet, so the form validates and then
 * says exactly that. It does not pretend a message was delivered.
 *
 * To make it live: add an app/api/contact/route.ts that posts to your mail
 * provider (Resend, SES, Postmark) using a server-only API key, and replace
 * the body of handleSubmit with a fetch to it.
 */
export function ContactForm() {
  const [values, setValues] = useState<Values>(blank);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof Values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: Partial<Record<keyof Values, string>> = {};

    if (values.name.trim().length < 2) found.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
      found.email = 'Please enter a valid email address.';
    }
    if (values.message.trim().length < 10) {
      found.message = 'Please tell us a little more — at least a sentence.';
    }

    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-7 border border-ivory-300 bg-ivory-200/40 p-8">
        <p className="eyebrow text-wine-700">Not sent yet</p>
        <h3 className="display-sm mt-4 font-light">Our inbox is not connected</h3>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
          <p>
            Your message was validated but <strong>not</strong> delivered — there is no email
            service behind this form yet, and nothing was transmitted anywhere.
          </p>
          <p>
            Once our contact channels are live, this form will reach us directly and we will
            reply to the address you gave.
          </p>
        </div>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => {
            setSent(false);
            setValues(blank);
          }}
        >
          Write another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Name" required error={errors.name}>
          {(a) => (
            <TextInput
              {...a}
              data-field="name"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={set('name')}
              invalid={Boolean(errors.name)}
            />
          )}
        </Field>

        <Field label="Email" required error={errors.email}>
          {(a) => (
            <TextInput
              {...a}
              data-field="email"
              type="email"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={set('email')}
              invalid={Boolean(errors.email)}
            />
          )}
        </Field>

        <Field label="Phone" hint="Optional">
          {(a) => (
            <TextInput
              {...a}
              type="tel"
              name="phone"
              autoComplete="tel"
              value={values.phone}
              onChange={set('phone')}
            />
          )}
        </Field>

        <Field label="Subject">
          {(a) => (
            <Select {...a} name="subject" value={values.subject} onChange={set('subject')}>
              <option value="">Select a subject</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label="Message" required error={errors.message} className="sm:col-span-2">
          {(a) => (
            <TextArea
              {...a}
              data-field="message"
              name="message"
              rows={5}
              value={values.message}
              onChange={set('message')}
              invalid={Boolean(errors.message)}
              placeholder="Tell us what you are looking for."
            />
          )}
        </Field>
      </div>

      <Button type="submit" size="lg" className="mt-9">
        <Send className="size-4" strokeWidth={1.4} />
        Send Message
      </Button>
      <p className="mt-4 text-xs leading-relaxed text-ink-400">
        Our inbox is not connected yet — this form will confirm your details but cannot deliver
        a message until launch.
      </p>
    </form>
  );
}
