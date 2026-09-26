import { z } from 'zod';

/** Shared input rules for every auth form (server-side validation). */

export const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .pipe(z.email({ message: 'Enter a valid email address.' }));

export const password = z
  .string()
  .min(10, 'Use at least 10 characters.')
  .max(128, 'Use at most 128 characters.');

export const name = z.string().trim().min(1, 'Enter your name.').max(80);

export const phone = z
  .string()
  .trim()
  .max(20)
  .regex(/^[+\d][\d\s-]{6,19}$/, 'Enter a valid phone number.')
  .optional()
  .or(z.literal(''));

export const otp = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'Enter the 6-digit code from your authenticator app.');

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    out[key] ??= issue.message;
  }
  return out;
}
