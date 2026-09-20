# Setting up your admin (the Wix-style editor)

When this is done you will be able to open a web page on your phone or laptop, drag in
saree photos, type a price, press Publish, and see it live on the shop about ten seconds
later. No code, no terminal, no messaging anyone.

**It takes about 15 minutes, once.** Steps 1–3 are yours because they involve creating an
account, which nobody should do on your behalf.

---

## What you are setting up

The shop needs somewhere to keep photos and prices. Right now they live in the project
files, which is why changing them means editing code. We are moving them to **Sanity** — a
free service that gives you an admin screen.

| | |
| --- | --- |
| **Cost** | Free. No credit card. The free plan allows 100GB of photos and 20 logins — this shop will use a fraction of that. |
| **Your admin lives at** | `yoursite.com/studio` |
| **Who can log in** | Only people you invite |
| **If you outgrow it** | The paid tier starts around $15/month, but a saree shop will not reach the free limits for years. |

---

## Step 1 — Create your free account (2 minutes)

1. Open **<https://www.sanity.io/get-started>**
2. Click **Continue with Google**
3. Choose your Gmail account

Do this in your normal browser, where you are already signed into Gmail. It is two clicks.

---

## Step 2 — Create the project (2 minutes)

1. When asked, choose to **create a new project**
2. Name it: **Kanchi Vastra**
3. Dataset: **production** (this is the default — keep it)
4. When it finishes, find the **Project ID**

The Project ID is a short code like `a1b2c3d4`. You will find it on the project's
dashboard, or under **Settings → API**.

> The Project ID is **not a secret** — it is designed to be public and it ends up in the
> website's code. You can safely share it.

---

## Step 3 — Connect the site (3 minutes)

In the project folder `C:\Users\aravi\projects\sri-kanchi-silks`, open the file
**`.env.local`** in Notepad. Add these two lines at the bottom, replacing `a1b2c3d4` with
your own Project ID:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=a1b2c3d4
NEXT_PUBLIC_SANITY_DATASET=production
```

Save and close.

### Then add a token, so your existing sarees can be copied in

1. In Sanity, go to **Settings → API → Tokens**
2. Click **Add API token**
3. Name it `seed`, permission **Editor**, then **Save**
4. Copy the token it shows you — **it is only shown once**
5. Add it to the same `.env.local` file:

```
SANITY_API_TOKEN=paste-the-token-here
```

> This token **is** a secret — it can change your shop's content. Do not paste it into a
> chat, an email or a screenshot. `.env.local` is already set up to never be committed to
> git. If it ever leaks, delete the token in Sanity and make a new one.

---

## Step 4 — Copy your sarees in (1 minute)

In the project folder, run:

```bash
npm run cms:seed
```

This uploads all twenty sarees and their images into your new admin, so you open it and
find everything already there to edit — rather than a blank screen.

Then:

```bash
npm run dev
```

and open **<http://localhost:3000/studio>**.

You should see your sarees listed with their photos, prices and stock levels.

---

## Step 5 — Using it

### Change a price

Sarees → click the saree → change the **Price** field → **Publish**.

### Add a new saree

Sarees → **+** (new) → fill in the fields. The tabs across the top group them:

| Tab | What is in it |
| --- | --- |
| **Price & Stock** | Name, price, how many you have, SKU |
| **Photos** | Drag photos in. Four works best: full saree, border, pallu, weave close-up |
| **Description** | The wording customers read, colour, fabric |
| **Measurements** | Length, width, blouse piece, zari, care |
| **Where it appears** | Which collections, homepage, "New" badge |

Press **Generate** next to the web address field, then **Publish**.

### About the photos

Drag them straight in from your phone or computer — no resizing needed. Sanity shrinks
them for the web automatically.

After uploading, click a photo and use the **crop/hotspot** tool to mark the important
part. The shop displays photos as tall rectangles, and the hotspot is what stops the
border of a saree getting cropped off.

### Mark something sold out

Set **stock** to `0`. The site immediately shows "Sold out" and stops anyone buying it.

---

## Step 6 — Making it live (so you can edit from your phone)

Until the site is deployed, the admin only works on this computer. Once you deploy to
Vercel (see **Deployment** in `README.md`):

1. In Vercel, go to **Settings → Environment Variables**
2. Add `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` with the same
   values as your `.env.local`
3. Redeploy

Your admin is then at `yoursite.com/studio` from any device.

### Make changes appear instantly

By default the site refreshes its content every 5 minutes. To make Publish appear within
seconds:

1. Pick any random long password — this is your webhook secret
2. Add it to Vercel's environment variables as `SANITY_REVALIDATE_SECRET`
3. In Sanity: **API → Webhooks → Create webhook**
   - URL: `https://yoursite.com/api/revalidate`
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - HTTP method: `POST`
   - Secret: the same password
4. Redeploy

---

## Things worth knowing

**The site never breaks if Sanity is down.** If the CMS cannot be reached, the shop falls
back to the catalogue stored in the project files. Customers keep shopping.

**You can invite others.** Sanity → **Members → Invite**. Up to 20 people free. Useful if
someone else photographs or lists the sarees.

**Deleting is permanent-ish.** Sanity keeps a document history, so a mistake can be
recovered — but do not rely on it for anything important.

**The spreadsheet still works** for bulk changes (`npm run products:export`). Once you are
on the CMS, though, the CMS is the real source — use the spreadsheet only for the initial
load, or you will overwrite CMS edits.

---

## If something goes wrong

| Problem | Fix |
| --- | --- |
| `/studio` shows "Not connected yet" | `.env.local` is missing the project id, or the dev server needs restarting after you edited it |
| `npm run cms:seed` says no token | `SANITY_API_TOKEN` is missing from `.env.local`, or it was created with "Viewer" instead of "Editor" permission |
| Sarees do not appear on the shop | Did you press **Publish**, not just save a draft? |
| Changes take minutes to appear | Normal until you set up the webhook in Step 6 |
| Photos look cropped oddly | Open the photo in the admin and set the crop/hotspot |
