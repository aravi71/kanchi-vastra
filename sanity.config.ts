'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import { apiVersion, dataset, projectId } from './sanity/env';

/**
 * The admin. Served from the site itself at /studio, so there is one
 * deployment and one login, and it works on a phone.
 */
export default defineConfig({
  name: 'kanchi-vastra',
  title: 'Kanchi Vastra',
  basePath: '/studio',
  projectId,
  dataset,

  schema: { types: schemaTypes },

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Shop')
          .items([
            S.listItem()
              .title('Sarees')
              .child(S.documentTypeList('product').title('Sarees')),
            S.divider(),
            // Settings is a singleton — one document, edited in place, rather
            // than a list the owner could accidentally add a second entry to.
            S.listItem()
              .title('Shop Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Shop Settings'),
              ),
          ]),
    }),
    // Query playground — useful for a developer, harmless for everyone else.
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  document: {
    // Hide the singleton from "create new" menus.
    newDocumentOptions: (prev) =>
      prev.filter((item) => item.templateId !== 'siteSettings'),
  },
});
