# Kanchi Vastra

A premium storefront for a Kanchipuram-inspired silk saree house, built with Next.js 15, React 19, TypeScript and Tailwind CSS v4.

---

## ⚠️ Read this first — the catalogue is demonstration content

**The current product catalogue, product imagery, prices, stock figures, SKUs, contact
information and business details are demonstration content and must be replaced with official
Kanchi Vastra information before production launch.**

Specifically, none of the following is real:

| What | Where it lives | Status |
| --- | --- | --- |
| Product names, descriptions, prices, SKUs, stock | `src/content/products.ts` | Placeholder |
| Product and editorial imagery | `public/images/**` | Generated artwork, not photography |
| Phone, WhatsApp, email, address, hours, social | `src/config/site.ts` → `contact` | Placeholder, flagged `isPlaceholder: true` |
| Privacy / Terms / Shipping / Returns policies | `src/content/legal.ts` | Draft, **not legally reviewed** |
| Shipping rates and delivery estimates | `src/config/site.ts` → `shipping` | Placeholder |

The site is deliberately honest about this rather than hiding it:

- A notice in the footer states that the catalogue is demonstration content.
- Contact rows render "To be confirmed" instead of inventing a phone number.
- Legal pages carry a prominent "Draft — not legally reviewed" banner and are `noindex`.
- The checkout says plainly that no order was placed and nothing was charged.
- The newsletter and contact forms say the message was **not** delivered.

**Nothing on this site claims a capability it does not have.** Please keep it that way as you
replace the placeholders — remove the notices only when the underlying thing is actually true.

There are also no fabricated trust signals anywhere: no customer counts, no awards, no
certifications, no reviews, no follower numbers, and no invented company history.

---

## Quick start

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run gen:art` | Regenerate the demo saree artwork |
| `npm run check` | Lint + typecheck + formatting — run before every commit |
| `npm run format` | Format all files with Prettier |
| `npm run deploy` | Build and ship the committed code to the server (Docker) |

Requires Node.js 20 or newer (built and verified on Node 24 LTS).

---

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) | Static generation for every catalogue page, image optimisation, file-based metadata |
| UI | React 19 + TypeScript (strict) | — |
| Styling | Tailwind CSS v4 | Design tokens declared once in `@theme`, no config file |
| Icons | `lucide-react` (ISC) | Tree-shakeable outline icons at consistent stroke weight |
| Class merging | `clsx` + `tailwind-merge` (both MIT) | Conditional classes without specificity fights |
| Fonts | Cormorant Garamond + Inter via `next/font` (SIL OFL) | Self-hosted at build time — no external request, no layout shift |

### Dependencies and licences

| Package | Licence |
| --- | --- |
| `next`, `react`, `react-dom` | MIT |
| `lucide-react` | ISC |
| `clsx`, `tailwind-merge`, `tailwindcss` | MIT |
| Cormorant Garamond, Inter (webfonts) | SIL Open Font License 1.1 |

No UI kit or theme was used. Every component, layout, colour, motif and animation in this
project was designed and written for it. `shadcn/ui` was deliberately **not** installed —
the handful of primitives needed (`Button`, `Field`, `Overlay`, `Accordion`) are hand-written
in `src/components/ui/`, which is less code than the dependency would have added.

**On animation:** Motion / Framer Motion was evaluated and deliberately left out. Every
effect this design needs — scroll reveals, the header transform, image and hover transitions,
the drawer and sheet slides, the hero parallax — is a CSS transition driven by a class or a
single `IntersectionObserver` (`src/components/ui/Reveal.tsx`). That costs a few hundred bytes
instead of roughly 40 kB, and it makes `prefers-reduced-motion` a pure-CSS concern rather than
something each animation has to remember to check. Add `motion` if you later want shared-element
page transitions or gesture-driven components, which genuinely do need a runtime.

---

## Project structure

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the folder layout, coding rules,
settings/secrets handling and the security baseline.

---

## Brand assets

### Logo

The mark is a **gopuram monogram**: a stepped temple silhouette whose interior courses read as
zari lines across a weave, capped by a kalasam finial. It is original to this project.

| File | Use |
| --- | --- |
| `public/logo/logo-primary.svg` | Stacked lockup — packaging, business cards |
| `public/logo/logo-primary-dark-bg.svg` | Stacked, for dark backgrounds |
| `public/logo/logo-horizontal.svg` | Horizontal lockup — letterhead, wide formats |
| `public/logo/logo-horizontal-dark-bg.svg` | Horizontal, for dark backgrounds |
| `public/logo/monogram.svg` | Icon only, antique gold |
| `public/logo/monogram-wine.svg` | Icon only, burgundy |
| `public/logo/monogram-dark-bg.svg` | Icon only, for dark backgrounds |
| `public/favicon.svg` | Favicon (simplified for 16 px legibility) |

**On the website**, the logo is rendered as inline SVG plus live text
(`src/components/ui/Logo.tsx`) rather than as an image file, so it inherits colour from its
container, stays sharp at any zoom, and remains selectable and searchable. To change the mark
site-wide, edit that component; the files above are the print/packaging handoff.

> **Before sending to print:** the standalone SVGs reference *Cormorant Garamond* and *Inter*
> by name. Convert the wordmark to outlines in your vector editor first, or the printer will
> substitute a different face.

### Replacing the logo

1. Swap the files in `public/logo/` and `public/favicon.svg`, keeping the filenames.
2. Replace the paths inside `src/components/ui/Logo.tsx` (`Monogram`), or have it render an
   `<Image>` pointing at your file.

### Colour and type

Both are declared once, in the `@theme` block at the top of `src/styles/globals.css`:

| Role | Token | Value |
| --- | --- | --- |
| Primary — deep burgundy | `--color-wine-600` … `--color-wine-950` | `#6e2038` → `#2b0a14` |
| Secondary — antique gold | `--color-gold-300` … `--color-gold-700` | `#e3cb9e` → `#8a6a2f` |
| Background — warm ivory | `--color-ivory-100` | `#faf6ee` |
| Text — deep charcoal | `--color-ink-800` / `--color-ink-900` | `#2a2622` / `#1c1a17` |
| Accent — temple terracotta | `--color-terracotta-500` | `#b4543a` |

Gold is an accent only. It is never used for body text, because `#c0994f` on ivory is roughly
2.3:1 and would fail WCAG AA. Fonts are swapped in `src/app/layout.tsx`.

---

## Replacing product content

Everything is in `src/content/products.ts`. The UI reads only the `Product` type in `src/types/catalog.ts`,
so nothing in `src/features/` needs to change.

```ts
{
  id: 'kv-001',
  slug: 'kanchipuram-ruby-zari-silk-saree',  // the URL — keep stable once published
  name: 'Kanchipuram Ruby Zari Silk Saree',
  price: 18500,              // whole rupees
  compareAtPrice: 22000,     // optional strike-through
  category: 'kanchipuram',   // kanchipuram | bridal | festive | everyday
  collections: ['kanchipuram', 'new-arrivals'],
  color: 'Ruby Red',
  colorFamily: 'red',        // drives the colour filter
  colorHex: '#9B1B30',       // the swatch dot
  fabric: 'Pure Mulberry Silk',
  description: '…',          // one or two lines, shown on cards and quick view
  story: '…',                // longer copy for the product page
  specs: { length, width, blouse, zari, weight, weave, care },
  sku: 'KV-KAN-001',
  stock: 4,                  // 0 renders "Sold out" and disables purchase
  images: ['/images/products/…-1.svg', /* …2, 3, 4 */],
  featured: true,            // appears in the homepage rail
  newArrival: true,          // "New" badge + New Arrivals collection
}
```

Stock behaviour is real: `0` disables Add to Cart everywhere, `≤ 2` shows an "N left" badge,
and the cart will not let a quantity exceed `stock`.

### Replacing the imagery

The demo images are **not photographs**. They are original SVG artwork generated by
`scripts/generate-art.mjs`, which composes each image from real saree anatomy — a woven body
scattered with buttas, a contrast korvai border, a dense zari pallu, and light falling across
the drape. Each product's four images are different crops of one generated cloth, so they read
as one saree photographed four times.

This was a deliberate choice: no licensed saree photography was available, and scraping images
from other saree businesses is never acceptable. Everything here is unambiguously yours to use.

To use real photography:

1. Delete `public/images/products/` and `public/images/editorial/`.
2. Drop in your photographs using the same filenames (`<slug>-1.jpg` … `-4.jpg`), or point
   `images` in `src/content/products.ts` at whatever paths you prefer.
3. Use a **3:4 portrait** ratio — the grid, gallery and cards are all built around it.
4. In `next.config.ts`, remove `dangerouslyAllowSVG` and the SVG content-security policy.
   They exist only because the demo artwork is SVG.
5. Delete `scripts/generate-art.mjs`, `src/content/art-specs.json` and the `gen:art` script.

To adjust the demo artwork instead, edit the colourways in `src/content/art-specs.json` and run
`npm run gen:art`.

---

## What actually works, and what does not

**Working, end to end:**

- Faceted catalogue filtering (collection, colour, price band, fabric, availability) with
  live counts, sorting, and all state in the URL so views are shareable and the back button works
- Weighted client-side search across name, colour, category, collection, fabric and SKU,
  with a search overlay, recent searches and suggestions
- Cart: add, remove, quantity up/down clamped to stock, subtotal, shipping threshold, total,
  persisted to `localStorage`
- Wishlist: add, remove, clear, move one or all in-stock items to the bag, persisted
- Product gallery: thumbnails, arrows, keyboard navigation, hover zoom, fullscreen viewer
- Checkout: full address form with Indian mobile and PIN validation, focus moved to the first
  invalid field, live order summary
- Every empty, loading and error state, plus a designed 404

**Deliberately not working — and the UI says so:**

| Feature | State |
| --- | --- |
| Payments | No gateway. Checkout validates and then states that no order was placed. |
| Customer accounts | Not built. `/account` explains this rather than showing a dead sign-in form. |
| Contact form delivery | No mail provider. The form says the message was not sent. |
| Newsletter | No mailing list. The form says nothing was subscribed. |
| Instagram / WhatsApp links | Render as inert "soon" labels until configured in `src/config/site.ts`. |

---

## Future integrations

### Razorpay

The seam is already defined in `src/features/checkout/checkout.ts`, which documents the whole flow. In short:

1. Put `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env.local`.
   **The secret is server-only — never prefix it with `NEXT_PUBLIC_` and never import it into
   a component.**
2. `src/app/api/checkout/create-order/route.ts` — receives the validated address plus cart line
   ids, **recomputes the total server-side from the catalogue** (never trust a total sent by
   the browser), calls the Razorpay Orders API, returns `{ orderId, amount, currency }`.
3. `src/app/api/checkout/verify/route.ts` — verifies `razorpay_signature` with HMAC-SHA256 over
   `` `${razorpay_order_id}|${razorpay_payment_id}` `` keyed by `RAZORPAY_KEY_SECRET`.
   **Mark an order paid only inside this route.**
4. `src/app/api/webhooks/razorpay/route.ts` — verified against `RAZORPAY_WEBHOOK_SECRET`; treat
   this as the authoritative source of payment state.
5. Replace the body of `submitOrder` in `src/features/checkout/checkout.ts` to call step 2, open Razorpay
   Checkout, and pass the handler response to step 3.

Card numbers, CVVs and UPI PINs are collected by Razorpay's own hosted widget and must never
touch this codebase. Then remove the "payment gateway coming soon" panel from
`src/features/checkout/components/CheckoutForm.tsx` and update the FAQ and terms.

The same seam works for Stripe or Cashfree — only the SDK calls differ.

### A real product database

`src/content/products.ts` exports plain functions (`getProductBySlug`, `productsInCollection`,
`featuredProducts`, …). Swap their bodies for queries against Supabase, Shopify, Medusa,
your own API, keep the `Product` shape from `src/types/catalog.ts`, and make the page
components `async`. No component needs to change. Add `export const revalidate = 60` to the
catalogue routes for ISR.

### Other

| Want | Do this |
| --- | --- |
| Customer accounts | NextAuth or Supabase Auth; then move cart/wishlist from `localStorage` to the user record in `src/features/` |
| Contact email | `src/app/api/contact/route.ts` posting to Resend/SES with a server-only key; then update `src/components/layout/ContactForm.tsx` |
| WhatsApp | Set `contact.whatsapp` and `isPlaceholder: false` in `src/config/site.ts` — the `wa.me` link activates automatically |
| Instagram | Set `contact.social.instagram`; the footer link and social CTA activate automatically |
| Analytics | `@vercel/analytics`, or GA4 via `next/script`. Add a consent banner and update the privacy policy |
| Admin panel | Being built at `/admin` on the same database and photo storage |

---

## Deployment

The site runs on a Hostinger VPS as Docker containers (Caddy, the app,
PostgreSQL, Garage photo storage, Mailpit), defined in
[infra/docker/compose.yaml](infra/docker/compose.yaml). Server layout, paths,
backups and restore steps: [infra/dev/README.md](infra/dev/README.md).

```bash
npm run deploy                 # build the committed code into an image and switch to it
npm run deploy -- --rollback   # go back to the previous image
```

The deploy builds the new image while the current one keeps serving, swaps
it in, waits for the health check, and keeps the last three images.

The version before the 2026-09 redesign is preserved as the git tag
`v1-classic-design`.

## SEO

- Per-page titles and descriptions with a `%s | Kanchi Vastra` template
- Open Graph and Twitter card metadata, including per-product images
- JSON-LD: `Organization` + `WebSite` (with `SearchAction`) site-wide, `Product` with live
  price and stock on every product page, `FAQPage` on the FAQ
- `sitemap.xml` and `robots.txt` generated from the catalogue at build time
- Cart, checkout, wishlist, account and the legal drafts are `noindex`
- Semantic landmarks, one `<h1>` per page, ordered headings, breadcrumbs

## Accessibility

- Skip-to-content link; visible focus rings throughout
- Focus trapped in every overlay, restored to the trigger on close; Escape closes
- Labelled form fields with `aria-invalid`, `aria-describedby`, and focus moved to the first
  invalid field on submit
- `role="status"` / `aria-live` on result counts, cart quantities and form outcomes
- `prefers-reduced-motion` honoured globally
- Body text meets WCAG AA; gold is restricted to decoration for this reason
- Product cards use one link with a pseudo-element overlay, so the whole card is clickable
  without producing three duplicate links per card for screen reader users

## Performance

- Every catalogue page statically prerendered (45 routes)
- ~103 kB shared JS; ~134 kB first load on the homepage
- Fonts self-hosted by `next/font` with `display: swap`
- Responsive `sizes` on every image, `priority` only on above-the-fold art
- Scroll reveals via `IntersectionObserver`, not a JS animation library

---

## Licence

Source code © Kanchi Vastra. The brand name, logo, written content and generated artwork in
this repository belong to Kanchi Vastra. Third-party dependencies remain under their own
licences, listed above.
