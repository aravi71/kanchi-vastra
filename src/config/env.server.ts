import 'server-only';
import { z } from 'zod';

/* ===========================================================================
   SERVER SETTINGS
   ---------------------------------------------------------------------------
   The only place server code reads process.env. Values come from the
   environment (.env.local on a laptop, shared/app.env on the server) and are
   never written in code.

   Settings are grouped by integration and each group is validated the first
   time it is used, so a missing mail setting fails loudly when mail is sent
   rather than silently at some later point — and a laptop without storage
   keys can still run the storefront.

   Error messages name the missing keys but never print their values.
   =========================================================================== */

const required = z.string().trim().min(1);
const optional = z.string().trim().min(1).optional();

const groups = {
  database: z.object({
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  }),
  storage: z.object({
    S3_ENDPOINT: z.url(),
    S3_REGION: required,
    S3_BUCKET: required,
    S3_ACCESS_KEY_ID: required,
    S3_SECRET_ACCESS_KEY: required,
    MEDIA_PUBLIC_BASE_URL: z.url(),
  }),
  mail: z.object({
    SMTP_HOST: required,
    SMTP_PORT: z.coerce.number().int().min(1).max(65535),
    SMTP_SECURE: z.stringbool().default(false),
    SMTP_USER: optional,
    SMTP_PASSWORD: optional,
    MAIL_FROM: required,
  }),
  cms: z.object({
    /** Shared with the Sanity webhook; at least 32 characters. */
    SANITY_REVALIDATE_SECRET: z.string().min(32).optional(),
    /** Server-only write token, used by scripts. */
    SANITY_API_TOKEN: optional,
  }),
} as const;

type Group = keyof typeof groups;
type Settings<G extends Group> = z.infer<(typeof groups)[G]>;

const cache = new Map<Group, unknown>();

/**
 * Validated settings for one integration.
 *
 *   const { DATABASE_URL } = serverEnv('database');
 */
export function serverEnv<G extends Group>(group: G): Settings<G> {
  const hit = cache.get(group);
  if (hit) return hit as Settings<G>;

  const result = groups[group].safeParse(process.env);
  if (!result.success) {
    const keys = [...new Set(result.error.issues.map((issue) => String(issue.path[0])))];
    throw new Error(
      `Missing or invalid ${group} settings: ${keys.join(', ')}. ` +
        'Set them in .env.local (see .env.example) or on the server in shared/app.env.',
    );
  }

  cache.set(group, result.data);
  return result.data as Settings<G>;
}

export const isProduction = process.env.NODE_ENV === 'production';
