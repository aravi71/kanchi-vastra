import { z } from 'zod';

/* ===========================================================================
   PUBLIC SETTINGS
   ---------------------------------------------------------------------------
   NEXT_PUBLIC_* values are copied into the browser bundle at build time, so
   nothing secret may ever live here. Each variable must be referenced by its
   full literal name for Next to inline it — hence no loops over process.env.

   Validated when the module loads: a malformed site URL fails the build
   instead of shipping broken canonical links.
   =========================================================================== */

const schema = z.object({
  siteUrl: z.url().default('http://localhost:3000'),
  /** Public address of the photo storage, e.g. https://site/media. Optional:
   *  without it editorial photos fall back to a local placeholder. */
  mediaBaseUrl: z
    .url()
    .transform((url) => url.replace(/\/+$/, ''))
    .optional(),
});

const blankToUndefined = (value: string | undefined) => (value?.trim() ? value.trim() : undefined);

export const publicEnv = schema.parse({
  siteUrl: blankToUndefined(process.env.NEXT_PUBLIC_SITE_URL),
  mediaBaseUrl: blankToUndefined(process.env.NEXT_PUBLIC_MEDIA_BASE_URL),
});
