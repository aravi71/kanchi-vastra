import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';
import { serverEnv } from '@/config/env.server';

/**
 * Outgoing email over SMTP. On the server today that is Mailpit (catches
 * everything, delivers nothing); with the domain it becomes the real mail
 * server — only the settings in shared/app.env change.
 *
 * `sendMail` never throws: a mail problem must not break a sign-in or an
 * order. Failures are logged (without message contents).
 */
let transporter: Transporter | undefined;

function transport(): Transporter {
  if (!transporter) {
    const cfg = serverEnv('mail');
    transporter = nodemailer.createTransport({
      host: cfg.SMTP_HOST,
      port: cfg.SMTP_PORT,
      secure: cfg.SMTP_SECURE,
      auth: cfg.SMTP_USER ? { user: cfg.SMTP_USER, pass: cfg.SMTP_PASSWORD } : undefined,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return transporter;
}

export interface Mail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendMail(mail: Mail): Promise<boolean> {
  try {
    await transport().sendMail({ from: serverEnv('mail').MAIL_FROM, ...mail });
    return true;
  } catch (error) {
    console.error('[mail] send failed:', mail.subject, (error as Error).message);
    return false;
  }
}
