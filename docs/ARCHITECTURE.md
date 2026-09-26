# Architecture

Kanchi Vastra is one Next.js 16 application (App Router, React 19, TypeScript,
Tailwind v4) deployed as a Docker image behind Caddy. See
[infra/dev/README.md](../infra/dev/README.md) for the server.

## Folder structure

```
src/
  app/                      Routes only — thin files that compose features
    layout.tsx              Document shell: <html>, fonts, metadata, JSON-LD
    not-found.tsx           404, rendered inside the store frame
    (store)/                Storefront route group; its layout adds the frame
      layout.tsx            → components/layout/StoreShell
      page.tsx, shop/, product/[slug]/, collections/, cart/, checkout/, …
    api/revalidate/         CMS publish webhook
  features/                 Business capabilities, each self-contained
    catalog/                Product list, filters, search, product page parts
      server/catalogue.ts   The ONE place products are read (server-only)
    cart/  wishlist/  checkout/  home/
  components/               Shared, feature-agnostic UI
    ui/                     Primitives: Button, Field, Overlay, Reveal, Logo
    layout/                 Header, Footer, StoreShell, navigation overlays
    motifs/                 Decorative SVG motifs
  config/
    env.server.ts           Validated server settings (secrets) — server-only
    env.public.ts           Validated NEXT_PUBLIC_* settings
    site.ts                 Business facts: name, contact, navigation
  content/                  Static content: demo catalogue, collections, legal
  lib/                      Infrastructure adapters
    db/prisma.ts            PostgreSQL client (server-only, lazy)
    image-loader.ts         Picks the right pre-sized photo from storage
    utils.ts
  styles/globals.css        Design tokens (Tailwind v4 @theme) and base styles
  types/                    Shared TypeScript types
prisma/                     Schema, migrations, seed
infra/                      Docker Compose, Caddy, backup — see infra/dev/README.md
scripts/                    deploy.sh and one-off maintenance scripts
docs/                       This file
```

### Rules of the road

- **Routes are thin.** A page file fetches data and composes feature
  components; logic lives in `features/`.
- **Features do not import each other's internals.** Shared needs move to
  `components/` or `lib/`.
- **Server-only code says so.** Anything touching secrets, the database or
  the CMS write path starts with `import 'server-only'`, which makes a
  client-side import a build error.
- **Imports use the `@/` alias** (`@/features/cart/cart-store`), never long
  relative paths.

## Settings and secrets

- No connection string, key or password is ever written in code.
- Server code reads settings only through `serverEnv(group)` in
  `src/config/env.server.ts`. Each group (database, storage, mail, cms) is
  validated with Zod the first time it is used; a missing key fails with a
  message naming the key, never its value.
- Browser-visible settings (`NEXT_PUBLIC_*`) go through
  `src/config/env.public.ts` and must never hold a secret.
- Values live in `.env.local` (laptop, git-ignored) and
  `/srv/kanchi-vastra/shared/app.env` (server, root-only). `.env.example`
  documents every key.
- The Docker build receives settings as a BuildKit secret; no image layer
  contains them.

## Security baseline

| Layer | Control |
|---|---|
| Transport | HTTPS only (Caddy, Let's Encrypt), HSTS |
| Browser | CSP (`object-src`, `base-uri`, `frame-ancestors`, `form-action`), `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP — `next.config.ts` |
| Server boundary | `server-only` modules; validated settings; webhook signature check |
| Network | Only Caddy (80/443) is public; database has no port; see infra/docker/compose.yaml |
| Supply chain | Pinned image versions, lockfile installs (`npm ci`), CI on every push, Dependabot |

## Quality gates

`npm run check` runs ESLint, the TypeScript compiler and Prettier. GitHub
Actions runs the same checks plus a production build on every push and pull
request (`.github/workflows/ci.yml`).

## Data flow today

The storefront reads products from PostgreSQL (`features/catalog/server/catalogue.ts`),
cached for five minutes under the `products` tag. Photos live in the photo
storage (Garage) with pre-sized WebP renditions; the app never resizes images.
Sanity was retired on 2026-09-26 (its export is in the pre-redesign backup); the
admin panel at `/admin` becomes the way to edit the catalogue.

### Reviewed dependency findings (2026-09-26)

`npm audit --omit=dev` reports 4 high-severity advisories, all in the Prisma
CLI (`prisma`, `mysql2`, `deepmerge-ts`, `@prisma/config`), which
`@prisma/client` lists as a dependency but the running site never loads. None
is present in the runtime Docker image (its traced `node_modules` holds only
what the server imports). Removing Sanity cleared the other 15.

Decision: accept; CI fails on **critical** findings. Re-review on every
Dependabot batch.
