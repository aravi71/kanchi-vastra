# Sri Kanchi Silks

A premium storefront for a Kanchipuram-inspired silk saree house, built with Next.js 15, React 19, TypeScript and Tailwind CSS v4.

---

## ⚠️ Read this first — the catalogue is demonstration content

**The current product catalogue, product imagery, prices, stock figures, SKUs, contact
information and business details are demonstration content and must be replaced with official
Sri Kanchi Silks information before production launch.**

Specifically, none of the following is real:

| What | Where it lives | Status |
| --- | --- | --- |
| Product names, descriptions, prices, SKUs, stock | `data/products.ts` | Placeholder |
| Product and editorial imagery | `public/images/**` | Generated artwork, not photography |
| Phone, WhatsApp, email, address, hours, social | `data/site.ts` → `contact` | Placeholder, flagged `isPlaceholder: true` |
| Privacy / Terms / Shipping / Returns policies | `data/legal.ts` | Draft, **not legally reviewed** |
| Shipping rates and delivery estimates | `data/site.ts` → `shipping` | Placeholder |

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
in `components/ui/`, which is less code than the dependency would have added.

**On animation:** Motion / Framer Motion was evaluated and deliberately left out. Every
effect this design needs — scroll reveals, the header transform, image and hover transitions,
the drawer and sheet slides, the hero parallax — is a CSS transition driven by a class or a
single `IntersectionObserver` (`components/ui/Reveal.tsx`). That costs a few hundred bytes
instead of roughly 40 kB, and it makes `prefers-reduced-motion` a pure-CSS concern rather than
something each animation has to remember to check. Add `motion` if you later want shared-element
page transitions or gesture-driven components, which genuinely do need a runtime.

---

## Project structure

```text
app/                      Routes (App Router)
  layout.tsx              Fonts, metadata, providers, Organization/WebSite JSON-LD
  page.tsx                Homepage
  shop/                   Catalogue with filters
  product/[slug]/         Product detail (+ Product JSON-LD)
  collections/            Collection index and individual collections
  cart/ checkout/ wishlist/ account/
  about/ contact/ faq/ care-guide/
  legal/[slug]/           Privacy, terms, shipping, returns (draft)
  not-found.tsx  error.tsx  loading.tsx
  sitemap.ts  robots.ts

components/
  layout/                 Header, Footer, MobileNav, SearchOverlay, forms, PageHeader
  home/                   Hero, HeritageStory, CollectionsShowcase, FeaturedRail,
                          CraftSection, TrustSection, SocialSection, EditorialQuote
  product/                ProductCard, ProductGallery, BuyBox, FilterPanel,
                          ShopBrowser, QuickView, StickyBuyBar, WishlistView
  cart/                   CartDrawer, CartView, OrderSummary
  checkout/               CheckoutForm
  ui/                     Button, Field, Overlay, Accordion, Reveal, Logo
  motifs/                 Temple border, lotus, kolam, peacock ornament

data/                     ALL replaceable content lives here
  products.ts             The catalogue
  collections.ts          Collections + filter vocabularies
  site.ts                 Brand, contact, navigation, trust points, shipping
  legal.ts                Policy drafts
  art-specs.json          Colourways driving the artwork generator

lib/
  types.ts                Domain types — the contract between data and UI
  store/                  cart, wishlist, ui (React Context + localStorage)
  filters.ts              Faceted filtering and sorting
  search.ts               Weighted client-side search
  checkout.ts             Address validation + the payment-gateway seam
  utils.ts                cn, price formatting, safe storage access

scripts/generate-art.mjs  Generative SVG saree artwork
styles/globals.css        Design tokens and brand utilities
public/logo/              Logo suite for web, print and packaging
```

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
(`components/ui/Logo.tsx`) rather than as an image file, so it inherits colour from its
container, stays sharp at any zoom, and remains selectable and searchable. To change the mark
site-wide, edit that component; the files above are the print/packaging handoff.

> **Before sending to print:** the standalone SVGs reference *Cormorant Garamond* and *Inter*
> by name. Convert the wordmark to outlines in your vector editor first, or the printer will
> substitute a different face.

### Replacing the logo

1. Swap the files in `public/logo/` and `public/favicon.svg`, keeping the filenames.
2. Replace the paths inside `components/ui/Logo.tsx` (`Monogram`), or have it render an
   `<Image>` pointing at your file.

### Colour and type

Both are declared once, in the `@theme` block at the top of `styles/globals.css`:

| Role | Token | Value |
| --- | --- | --- |
| Primary — deep burgundy | `--color-wine-600` … `--color-wine-950` | `#6e2038` → `#2b0a14` |
| Secondary — antique gold | `--color-gold-300` … `--color-gold-700` | `#e3cb9e` → `#8a6a2f` |
| Background — warm ivory | `--color-ivory-100` | `#faf6ee` |
| Text — deep charcoal | `--color-ink-800` / `--color-ink-900` | `#2a2622` / `#1c1a17` |
| Accent — temple terracotta | `--color-terracotta-500` | `#b4543a` |

Gold is an accent only. It is never used for body text, because `#c0994f` on ivory is roughly
2.3:1 and would fail WCAG AA. Fonts are swapped in `app/layout.tsx`.

---

## Replacing product content

Everything is in `data/products.ts`. The UI reads only the `Product` type in `lib/types.ts`,
so nothing in `components/` needs to change.

```ts
{
  id: 'sks-001',
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
  sku: 'SKS-KAN-001',
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
   `images` in `data/products.ts` at whatever paths you prefer.
3. Use a **3:4 portrait** ratio — the grid, gallery and cards are all built around it.
4. In `next.config.ts`, remove `dangerouslyAllowSVG` and the SVG content-security policy.
   They exist only because the demo artwork is SVG.
5. Delete `scripts/generate-art.mjs`, `data/art-specs.json` and the `gen:art` script.

To adjust the demo artwork instead, edit the colourways in `data/art-specs.json` and run
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
| Instagram / WhatsApp links | Render as inert "soon" labels until configured in `data/site.ts`. |

---

## Future integrations

### Razorpay

The seam is already defined in `lib/checkout.ts`, which documents the whole flow. In short:

1. Put `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env.local`.
   **The secret is server-only — never prefix it with `NEXT_PUBLIC_` and never import it into
   a component.**
2. `app/api/checkout/create-order/route.ts` — receives the validated address plus cart line
   ids, **recomputes the total server-side from the catalogue** (never trust a total sent by
   the browser), calls the Razorpay Orders API, returns `{ orderId, amount, currency }`.
3. `app/api/checkout/verify/route.ts` — verifies `razorpay_signature` with HMAC-SHA256 over
   `` `${razorpay_order_id}|${razorpay_payment_id}` `` keyed by `RAZORPAY_KEY_SECRET`.
   **Mark an order paid only inside this route.**
4. `app/api/webhooks/razorpay/route.ts` — verified against `RAZORPAY_WEBHOOK_SECRET`; treat
   this as the authoritative source of payment state.
5. Replace the body of `submitOrder` in `lib/checkout.ts` to call step 2, open Razorpay
   Checkout, and pass the handler response to step 3.

Card numbers, CVVs and UPI PINs are collected by Razorpay's own hosted widget and must never
touch this codebase. Then remove the "payment gateway coming soon" panel from
`components/checkout/CheckoutForm.tsx` and update the FAQ and terms.

The same seam works for Stripe or Cashfree — only the SDK calls differ.

### A real product database

`data/products.ts` exports plain functions (`getProductBySlug`, `productsInCollection`,
`featuredProducts`, …). Swap their bodies for queries against Supabase, Shopify, Medusa,
Sanity or your own API, keep the `Product` shape from `lib/types.ts`, and make the page
components `async`. No component needs to change. Add `export const revalidate = 60` to the
catalogue routes for ISR.

### Other

| Want | Do this |
| --- | --- |
| Customer accounts | NextAuth or Supabase Auth; then move cart/wishlist from `localStorage` to the user record in `lib/store/` |
| Contact email | `app/api/contact/route.ts` posting to Resend/SES with a server-only key; then update `components/layout/ContactForm.tsx` |
| WhatsApp | Set `contact.whatsapp` and `isPlaceholder: false` in `data/site.ts` — the `wa.me` link activates automatically |
| Instagram | Set `contact.social.instagram`; the footer link and social CTA activate automatically |
| Analytics | `@vercel/analytics`, or GA4 via `next/script`. Add a consent banner and update the privacy policy |
| Admin panel | Use a headless CMS (Sanity, Contentful) rather than building one — it is the smaller job and non-developers can use it |

---

## Deployment

The project is Vercel-ready: no server-only runtime, no database, every catalogue page
prerendered.

### Deploying to Vercel (free tier)

1. Create the GitHub repository and push:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Sri Kanchi Silks storefront"
   git branch -M main
   git remote add origin https://github.com/<your-username>/sri-kanchi-silks.git
   git push -u origin main
   ```

2. Go to <https://vercel.com/new>, sign in with GitHub, and import the repository.
3. Vercel detects Next.js automatically — leave the build settings alone.
4. Add one environment variable: `NEXT_PUBLIC_SITE_URL` = your production URL
   (e.g. `https://sri-kanchi-silks.vercel.app`). This drives canonical URLs, the sitemap,
   Open Graph tags and JSON-LD, so getting it right matters for SEO.
5. Deploy. You get HTTPS and a free `*.vercel.app` URL.

Every later push to `main` redeploys automatically; pull requests get preview URLs.

### Connecting a custom domain later

1. Buy the domain from any registrar.
2. In Vercel: **Project → Settings → Domains → Add**, enter it.
3. At your registrar, add the DNS records Vercel shows — usually an `A` record for the apex
   pointing at `76.76.21.21`, and a `CNAME` for `www` pointing at `cname.vercel-dns.com`.
   Use whatever Vercel displays; these values can change.
4. Wait for DNS propagation. Vercel issues the TLS certificate automatically.
5. **Update `NEXT_PUBLIC_SITE_URL` to the custom domain and redeploy**, otherwise canonical
   URLs and the sitemap will keep pointing at the `.vercel.app` address.

---

## SEO

- Per-page titles and descriptions with a `%s | Sri Kanchi Silks` template
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

Source code © Sri Kanchi Silks. The brand name, logo, written content and generated artwork in
this repository belong to Sri Kanchi Silks. Third-party dependencies remain under their own
licences, listed above.
