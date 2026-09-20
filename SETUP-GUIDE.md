# Going live: real sarees, real prices, real payments

A plain-language checklist for turning this demo into a working shop. Written for the
business owner, not the developer. The technical detail sits in `README.md`.

There are three jobs, and they are independent — you can do them in any order, though
photography usually takes longest so start it first.

| Job | Who does it | Rough time |
| --- | --- | --- |
| 1. Real photos and prices | You + whoever edits the code | 1–2 days once photos exist |
| 2. Payments (Razorpay) | You (account + KYC) then developer | 3–7 days, mostly waiting on KYC |
| 3. Business + legal details | You | 1 day |

---

# JOB 1 — Replace the sarees

## What is on the site now

Every saree you see is invented. The images are computer-generated artwork, not
photographs. The names, prices, SKUs and stock counts are placeholders. Twenty of them.

## Step 1: Photograph the sarees

For each saree you want to sell, take **four photographs**:

| # | Shot | Why |
| --- | --- | --- |
| 1 | The full saree, draped or flat-laid | The main image. This is what people see in the grid. |
| 2 | The border (selvedge), close up | Buyers judge quality by the border. |
| 3 | The pallu | The most decorative part. |
| 4 | The body weave, close up | Shows the zari and the texture. |

**Rules that matter:**

- **Shape: 3:4 portrait** (taller than wide). Example: 1200 wide × 1600 tall. The whole
  site is built around this ratio. A square or landscape photo will be cropped badly.
- **Size:** at least 1200 px wide. Bigger is fine — the site shrinks them automatically.
- **Light:** daylight near a window, no direct sun, no flash. Flash kills the sheen of
  silk, which is the single thing you are trying to sell.
- **Background:** plain and consistent. One neutral backdrop for every saree. Mixed
  backgrounds are the fastest way to make a shop look cheap.
- **Be honest with colour.** Photograph the saree as it actually looks. Over-saturated
  photos cause returns and complaints.

> You do not need a professional photographer to start. A recent phone, a window, a plain
> sheet and a steady hand will beat a bad studio shot. You can upgrade later without
> changing anything else.

## Step 2: Name the files

Each saree has a **slug** — the short name used in its web address. For
`Kanchipuram Ruby Zari Silk Saree` the slug is `kanchipuram-ruby-zari-silk-saree`, and its
page lives at `/product/kanchipuram-ruby-zari-silk-saree`.

Name the four photos exactly like this:

```
kanchipuram-ruby-zari-silk-saree-1.jpg    <- full saree
kanchipuram-ruby-zari-silk-saree-2.jpg    <- border
kanchipuram-ruby-zari-silk-saree-3.jpg    <- pallu
kanchipuram-ruby-zari-silk-saree-4.jpg    <- weave close-up
```

Slug rules: all lowercase, words joined by hyphens, no spaces, no Tamil or Hindi script,
no `&`, `'` or `,`.

**Once a saree is published, never change its slug.** The slug is the web address. Changing
it breaks every link anyone has shared or bookmarked, and loses your Google ranking.

## Step 3: Put the photos in

Copy all the photos into:

```
public/images/products/
```

Delete the old `.svg` files in that folder once your photos are in.

## Step 4: Switch the site from artwork to photographs

Two small edits:

**a)** In `data/products.ts`, near the top, change one word:

```ts
const IMAGE_EXT = 'svg';     // before
const IMAGE_EXT = 'jpg';     // after
```

**b)** In `next.config.ts`, delete these three lines — they exist only because the demo
artwork was SVG, and leaving them on with real photos is a needless security loosening:

```ts
dangerouslyAllowSVG: true,
contentDispositionType: 'attachment',
contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
```

## Step 5: Set the real details and prices — the easy way

**Use the spreadsheet.** You do not need to touch code for this.

```bash
npm run products:export
```

That writes `content/products.csv`. Open it in **Excel or Google Sheets** — one row per
saree, one column per field, with `slug`, `name`, `price` and `stock` first because those
are what you change most. Edit it like any spreadsheet, save it as CSV in the same place,
then:

```bash
npm run products:import
```

This checks everything *before* changing anything. If something is wrong it tells you the
row number and fixes nothing, so a bad edit can never half-apply:

```
  3 problem(s) found. Nothing was changed.

  Row 4: "Peacock Motif Heritage Silk" has category "wedding".
          Must be one of: kanchipuram, bridal, festive, everyday.
  Row 6: SKU "KV-KAN-005" is already used on row 5.
  Row 7: "Lotus Zari Kanchipuram" has color_hex "reddish", which is not a
          6-digit colour code. Example: #9B1B30
```

It is forgiving about the things spreadsheets actually do to your data — typing
`₹ 24,500` in the price column is fine, and if Excel strips the `#` off a colour code it
puts it back. It is strict about anything that would break the site or mislead a customer.

It also checks your photographs are present. While you are still shooting them:

```bash
npm run products:import -- --allow-missing-photos
```

Your previous catalogue is always saved as `data/products.ts.bak`, so there is one step of
undo if an import was not what you meant.

**Adding a new saree:** add a row to the spreadsheet. **Removing one:** delete the row.

### Column notes

| Column | Notes |
| --- | --- |
| `slug` | The web address, and the photo filename. Lowercase, hyphens, no spaces. **Never change it once published** — it breaks shared links. |
| `price` | Plain number in rupees. `18500`. The site adds ₹ and Indian commas. |
| `compare_at_price` | Optional "was" price, shown struck through. **Leave blank** unless it genuinely sold at that price. |
| `stock` | Real count. `0` = Sold out, `1`–`2` shows an "N left" badge. |
| `category` | One of `kanchipuram`, `bridal`, `festive`, `everyday` |
| `collections` | Comma-separated, e.g. `bridal, new-arrivals` |
| `color_family` | Which colour filter it appears under |
| `color_hex` | The colour dot, e.g. `#9B1B30` |
| `featured` | `yes` to show on the homepage |
| `new_arrival` | `yes` for the "New" badge |

---

### The other way: editing the code directly

If you prefer, everything for one saree also lives in a single block in `data/products.ts`.
Both methods work on the same data — just don't edit both at once without re-exporting.

```ts
{
  id: 'kv-001',
  slug: 'kanchipuram-ruby-zari-silk-saree',   // the web address - keep it stable
  name: 'Kanchipuram Ruby Zari Silk Saree',   // shown to customers
  price: 18500,                               // PLAIN NUMBER. 18500 = Rs 18,500
                                              // no commas, no decimals, no "Rs"
  compareAtPrice: 22000,                      // optional. Shows a struck-through
                                              // "was" price. DELETE this line unless
                                              // the item was genuinely sold at that price
  category: 'kanchipuram',                    // kanchipuram | bridal | festive | everyday
  collections: ['kanchipuram', 'new-arrivals'],
  color: 'Ruby Red',                          // shown on the product page
  colorFamily: 'red',                         // which colour filter it appears under
  colorHex: '#9B1B30',                        // the little colour dot
  fabric: 'Pure Mulberry Silk',
  description: 'One or two lines...',         // shown on cards
  story: 'A longer paragraph...',             // shown on the product page
  specs: {
    length: '6.3 metres including blouse piece',
    width: '48 inches',
    blouse: '0.8 metre contrast blouse piece attached',
    zari: 'Half-fine gold zari',
    weight: 'Approx. 750 g',
    weave: 'Traditional Kanchipuram handloom technique',
    care: 'Dry clean only. Store folded in cotton muslin.',
  },
  sku: 'KV-KAN-001',                         // your own stock code
  stock: 4,                                   // how many you actually have
  images: img('kanchipuram-ruby-zari-silk-saree'),
  featured: true,                             // show on the homepage
  newArrival: true,                           // "New" badge
}
```

### About `price`

Write it as a plain number in rupees. `18500`, not `18,500` or `₹18500` or `18500.00`.
The site adds the ₹ symbol and Indian comma placement (₹18,500) automatically everywhere.

Decide whether your prices **include GST** and say so consistently. The product page
currently reads "Inclusive of all taxes" — if that is not true for you, change it in
`components/product/BuyBox.tsx`.

### About `stock`

This is wired up for real, not decoration:

- `stock: 0` → shows **Sold out**, and Add to Cart is disabled everywhere
- `stock: 1` or `2` → shows an **"N left"** badge
- A customer cannot add more to the cart than you have

So keep it accurate, or the site will sell something you do not have.

### Adding or removing sarees

- **Remove one:** delete its whole `{ ... }` block.
- **Add one:** copy an existing block, paste it, and change every value — especially
  `id`, `slug` and `sku`, which must be unique.

## Step 6: Check it

```bash
npm run build
npm run dev
```

Open http://localhost:3000 and look at the shop, one product page, and the same pages on
your phone. If the build reports an error, it will name the file and line.

---

# JOB 2 — Payments

## The honest position today

**The site cannot take money right now.** Someone can browse, fill a cart, and enter a
delivery address — and then the checkout tells them plainly that no order was placed and
nothing was charged. That is deliberate. A checkout that silently fails is far worse than
one that is honest.

## How online payment actually works

There are four parties, and the money does **not** come straight to you:

```
Customer  --pays-->  Payment gateway  --settles-->  Your bank account
(card/UPI)           (Razorpay)                     (2-3 days later,
                          |                          minus their fee)
                          |
                    tells the website
                    "this one is paid"
```

You never see or store the customer's card number or UPI PIN. They are typed into
Razorpay's own secure window. This is not just good practice — handling card details
yourself requires PCI-DSS certification, which you do not want to take on.

## Step 1: Choose a gateway

For an Indian business selling in rupees, **Razorpay** is the usual choice: UPI, cards,
net banking, wallets and EMI in one integration, and good documentation. Cashfree and
PayU are comparable. Stripe is excellent but weaker for Indian domestic payments.

This project is already written so that any of them can be plugged in. The instructions
below assume Razorpay.

Typical cost: **around 2% + GST per transaction** for cards and net banking, lower for
UPI. No monthly fee on the standard plan. Confirm current rates with them directly —
do not take a figure in this document as a quote.

## Step 2: Register the business — the part people get stuck on

You are selling online from home, with no shop and no company. That is completely normal
and there is a straightforward path.

### You are a Sole Proprietorship

You do not "register" a sole proprietorship as an entity — there is no such certificate in
India. You exist as a business the moment you trade. What a payment gateway wants is a
*government-issued document that shows your business exists*. The easiest one to get is:

### Udyam (MSME) registration — free, online, same day

This is the single best answer to "what do I use as business proof".

- Go to **udyamregistration.gov.in** (the official government portal)
- **It is completely free.** The portal says so explicitly: *"Registration Process is
  totally free. No Costs or Fees are to be paid to anyone."* Ignore any site charging a fee
- You need only your **Aadhaar** and **PAN** — fully online, paperless, self-declared
- The certificate is issued online immediately, with a QR code

That certificate is accepted as business proof. This is the fastest route by a wide margin.

### Alternatives, if you want or need them

| Document | Where | Notes |
| --- | --- | --- |
| **Shop & Establishment licence** | Your local municipal body | State-level; works even for a home-based business in most states |
| **GST registration** | gst.gov.in | Free. Mandatory above ₹40 lakh turnover for goods (₹20 lakh in some states) — but you may want it voluntarily to claim input credit |
| **Professional tax registration** | State commercial tax dept | Accepted in many states |
| **Income Tax Return** in your name showing the business income | — | Accepted as proof of existence |

### Address proof

Because you work from home, use a document in **your own name** at your home address:

- Aadhaar card, passport, voter ID or driving licence, **or**
- A recent **electricity, water or landline bill** (usually within the last 3 months), **or**
- A **rent agreement**, if you rent

If the bill is in a parent's or landlord's name, you will typically also need a short
**No Objection Certificate** from them plus their bill. Ask Razorpay's support which they
want for your specific case — it is a routine question and they answer it quickly.

Note: if a business-proof document already shows your full address, it can usually serve
as the address proof too.

### Also needed

- **PAN card** — your personal PAN is correct for a sole proprietor
- **Bank account** with a cancelled cheque or passbook. For a sole proprietorship this
  should ideally be a **current account in the business name**, though many gateways will
  start you on a savings account. The name on the account must match your PAN exactly
- A passport-size photograph

**KYC approval usually takes 2–4 working days.** Start it early; it is the long pole.

> These requirements do change, and they vary by business type. Treat this as a map, not
> the final word: check Razorpay's own checklist in their dashboard when you apply, and if
> you are unsure about GST or which structure suits you, **a chartered accountant will
> settle it in one short conversation.** That is worth the fee.

You will also be asked for your **website URL** — so deploy the site first (see
"Deployment" in `README.md`), even without payments enabled.

## Step 3: What Razorpay requires on your website before approving

This is the part people get caught out by. Gateways will not activate an account unless
the site carries genuine policy pages:

- Privacy Policy
- Terms & Conditions
- **Refund / Cancellation Policy**
- **Shipping Policy**
- Contact page with a real address, phone number and email

Those pages exist in this project — but as **drafts marked "not legally reviewed"**. They
must be replaced with real, accurate policies before you submit. See Job 3.

Your refund policy in particular must be truthful. If you do not accept returns on
custom-woven pieces, say so plainly; do not copy another shop's policy.

## Step 4: Test mode first

Razorpay gives you two sets of keys: **test** and **live**.

The developer wires up test mode first. You then place fake orders using Razorpay's test
card numbers, and confirm end to end:

- Payment succeeds → order is recorded, confirmation shown
- Payment fails → a clear error, cart intact, nothing charged
- Customer closes the window midway → no phantom order
- Stock decreases correctly, and two people cannot buy the last saree at once

**No real money moves in test mode.** Nothing goes live until you have watched all of the
above work.

## Step 5: What the developer builds

Already documented in `lib/checkout.ts`. In short, three server-side pieces:

1. **Create order** — recalculates the total on the server from your own catalogue.
   (Never trust a price sent by the browser — otherwise someone can edit it and buy a
   ₹32,000 saree for ₹1.)
2. **Verify payment** — checks Razorpay's cryptographic signature before marking anything
   paid.
3. **Webhook** — Razorpay tells your server directly about every payment. This is the
   authority, because a customer's browser can close before confirming.

Plus: a secret key stored in server-side environment variables, **never** in the code and
never in the browser.

## Step 6: Go live

Switch test keys for live keys, place one real small-value order yourself, confirm it
appears in your Razorpay dashboard and settles to your bank. Then remove the "payment
gateway coming soon" notices from the checkout and FAQ.

## After payments work, you still need

Taking money is the start, not the end:

- **Order emails** — the customer needs a confirmation, and you need a notification.
  Requires an email service (Resend, Amazon SES) wired up.
- **Somewhere to see orders.** Right now there is no database and no admin screen.
  Razorpay's dashboard shows payments but not what was ordered or where to ship it.
  Realistically you need either a simple database + admin page, or to move the catalogue
  onto a platform that provides one.
- **Stock that updates itself** when something sells, instead of being edited by hand.
- **Invoices** meeting Indian GST requirements, if you are registered.

Be aware of the size of this: payments are perhaps a week of work, but *running* an
online shop properly — orders, stock, emails, invoices — is a bigger project than the
storefront itself. Worth planning before you switch payments on.

---

# JOB 3 — Business and legal details

Quick, but blocks both of the above.

## Contact details

In `data/site.ts`, fill in the real values and set `isPlaceholder: false`:

```ts
export const contact = {
  isPlaceholder: false,                    // <- flip this last
  phone: '+91 ...',
  whatsapp: '+91 ...',                     // makes the WhatsApp link work
  email: '...',
  address: { line1: '...', city: '...', state: '...', pincode: '...' },
  hours: [...],
  social: { instagram: 'https://instagram.com/...', ... },
};
```

While `isPlaceholder` is `true`, the site honestly shows "To be confirmed" instead of a
fake phone number, and the Instagram and WhatsApp links stay inert. Flip it only when
every value above is real — that one flag is what turns them all live.

## Policies

Replace the draft text in `data/legal.ts` with wording from someone qualified. The drafts
are structured so you can go section by section. **Do not launch with them as they are** —
they say so themselves, on the page.

## Shipping

In `data/site.ts`, set your real numbers:

```ts
export const shipping = {
  freeAbove: 15000,          // free shipping above this amount (0 = never)
  flatRate: 250,             // charge below that threshold
  estimate: '5 - 7 business days',
};
```

## Remove the demo notice

Once the catalogue, contact details and policies are all real, delete the demonstration
notice at the bottom of `components/layout/Footer.tsx`.

**Delete it last.** While any placeholder content remains, that notice is the thing
keeping the site honest with your customers.

---

# Suggested order

1. Start saree photography — it takes the longest
2. Open the Razorpay account and begin KYC — also slow, and independent
3. Get real policies written
4. Deploy the site (needed for the Razorpay application anyway)
5. Load real sarees, prices and stock
6. Fill in contact details, flip `isPlaceholder` to `false`
7. Wire up payments in test mode, test thoroughly
8. Go live, remove the demo notices
