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
  sanity: z.object({
    /** Empty until the CMS is connected; the shop then serves src/content. */
    projectId: z
      .string()
      .regex(/^[a-z0-9]*$/, 'lowercase letters and digits only')
      .default(''),
    dataset: z.string().min(1).default('production'),
    apiVersion: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .default('2024-10-01'),
  }),
});

const blankToUndefined = (value: string | undefined) => (value?.trim() ? value.trim() : undefined);

export const publicEnv = schema.parse({
  siteUrl: blankToUndefined(process.env.NEXT_PUBLIC_SITE_URL),
  mediaBaseUrl: blankToUndefined(process.env.NEXT_PUBLIC_MEDIA_BASE_URL),
  sanity: {
    projectId: blankToUndefined(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
    dataset: blankToUndefined(process.env.NEXT_PUBLIC_SANITY_DATASET),
    apiVersion: blankToUndefined(process.env.NEXT_PUBLIC_SANITY_API_VERSION),
  },
});
