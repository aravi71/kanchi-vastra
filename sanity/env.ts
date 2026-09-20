/**
 * Sanity connection settings.
 *
 * The site is designed to run perfectly well WITHOUT Sanity configured — in
 * that state it serves the catalogue from `data/products.ts`. The moment a
 * project id appears in the environment, the catalogue switches over to the
 * CMS. That means nothing is ever broken half-way through setup.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01';

/** True once the CMS is connected. Everything branches on this. */
export const sanityEnabled = projectId.length > 0;

/**
 * Server-only write/read token. Used by the seeding script and by draft
 * previews. Never expose this to the browser — no NEXT_PUBLIC_ prefix.
 */
export const token = process.env.SANITY_API_TOKEN;
