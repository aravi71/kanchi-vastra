import type { SchemaTypeDefinition } from 'sanity';
import product from './product';
import siteSettings from './siteSettings';

export const schemaTypes: SchemaTypeDefinition[] = [product, siteSettings];
