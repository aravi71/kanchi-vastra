import { publicEnv } from '@/config/env.public';

/**
 * Sanity connection settings — all public by design (they identify the
 * project; reading published content needs no secret).
 *
 * The site runs perfectly well WITHOUT Sanity configured: it then serves the
 * catalogue from src/content/products.ts. The moment a project id is set,
 * the catalogue switches to the CMS, so nothing is ever half-broken during
 * setup.
 */
export const { projectId, dataset, apiVersion } = publicEnv.sanity;

/** True once the CMS is connected. Everything branches on this. */
export const sanityEnabled = projectId.length > 0;
