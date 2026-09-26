import 'server-only';
import { site } from '@/config/site';
import type { Mail } from '@/lib/mail/mailer';

/* ===========================================================================
   Email templates. Plain text first (read by every client and by spam
   filters), with a small, inline-styled HTML version. Any value that came
   from a user is escaped.
   =========================================================================== */

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

function layout(
  title: string,
  paragraphs: string[],
  button?: { label: string; url: string },
): string {
  const body = paragraphs
    .map((p) => `<p style="margin:0 0 14px;line-height:1.6">${p}</p>`)
    .join('');
  const cta = button
    ? `<p style="margin:22px 0"><a href="${escape(button.url)}" style="background:#6f0e26;color:#fdfbf7;padding:12px 22px;text-decoration:none;border-radius:999px;font-size:13px;letter-spacing:.08em;text-transform:uppercase">${escape(button.label)}</a></p>`
    : '';
  return `<!doctype html><html><body style="margin:0;background:#faf6ee;font-family:Arial,sans-serif;color:#2a2622">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
<p style="font-family:Georgia,serif;font-size:22px;color:#6f0e26;margin:0 0 24px">Kanchi Vastra</p>
<h1 style="font-family:Georgia,serif;font-weight:normal;font-size:24px;margin:0 0 18px">${escape(title)}</h1>
${body}${cta}
<p style="margin:28px 0 0;font-size:12px;color:#8c847a">${escape(site.name)} · This email was sent automatically.</p>
</div></body></html>`;
}

const when = (d: Date) =>
  d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) +
  ' IST';

export function welcomeMail(to: string, name: string | null): Mail {
  const hi = name ? `Hello ${name},` : 'Hello,';
  return {
    to,
    subject: 'Welcome to Kanchi Vastra',
    text: `${hi}\n\nYour Kanchi Vastra account is ready. You can now save your details, track orders and keep a wishlist.\n\n${site.url}/account\n\nIf you did not create this account, reply to this email.`,
    html: layout(
      'Welcome to Kanchi Vastra',
      [
        escape(hi),
        'Your account is ready. You can now save your details, track orders and keep a wishlist.',
        'If you did not create this account, simply reply to this email.',
      ],
      { label: 'Go to my account', url: `${site.url}/account` },
    ),
  };
}

export function signInAlertMail(
  to: string,
  ctx: { ip: string; userAgent: string; at: Date; admin: boolean },
): Mail {
  const where = `${ctx.userAgent.slice(0, 120)} (IP ${ctx.ip})`;
  const what = ctx.admin ? 'the Kanchi Vastra admin panel' : 'your Kanchi Vastra account';
  return {
    to,
    subject: ctx.admin
      ? 'Admin sign-in to Kanchi Vastra'
      : 'New sign-in to your Kanchi Vastra account',
    text: `Someone just signed in to ${what}.\n\nWhen: ${when(ctx.at)}\nDevice: ${where}\n\nIf this was you, you can ignore this email. If not, change your password now${ctx.admin ? ' and contact your developer' : ''}.`,
    html: layout(ctx.admin ? 'Admin sign-in' : 'New sign-in', [
      `Someone just signed in to ${what}.`,
      `<strong>When:</strong> ${escape(when(ctx.at))}<br><strong>Device:</strong> ${escape(where)}`,
      `If this was you, you can ignore this email. <strong>If not, change your password now${ctx.admin ? ' and contact your developer' : ''}.</strong>`,
    ]),
  };
}

export function passwordResetMail(to: string, url: string): Mail {
  return {
    to,
    subject: 'Reset your Kanchi Vastra password',
    text: `We received a request to reset your password.\n\nOpen this link within 30 minutes:\n${url}\n\nIf you did not ask for this, ignore this email; your password stays the same.`,
    html: layout(
      'Reset your password',
      [
        'We received a request to reset your password. The link works for 30 minutes, once.',
        'If you did not ask for this, ignore this email — your password stays the same.',
      ],
      { label: 'Choose a new password', url },
    ),
  };
}

export function passwordChangedMail(to: string): Mail {
  return {
    to,
    subject: 'Your Kanchi Vastra password was changed',
    text: 'Your password was just changed and every other device was signed out.\n\nIf you did not do this, reset your password immediately and reply to this email.',
    html: layout('Password changed', [
      'Your password was just changed and every other device was signed out.',
      '<strong>If you did not do this</strong>, reset your password immediately and reply to this email.',
    ]),
  };
}
