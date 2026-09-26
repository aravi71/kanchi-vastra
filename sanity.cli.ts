import { config } from 'dotenv';
import { defineCliConfig } from 'sanity/cli';

/**
 * Settings for the `sanity` command-line tool (dataset export/import, tokens).
 * The project id comes from .env.local like everything else — it is a public
 * identifier, but settings belong in the environment, not in code.
 */
config({ path: '.env.local', quiet: true });

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  },
});
