# Swashree Collection

A full e-commerce website for **Swashree Collection** (gifts & fine collections in Nepal), built with **Next.js on Vercel** and powered by a **Sanity CMS** admin panel — a lightweight WordPress-style experience at your public URL `/studio`.

Features:

- 🛍️ Storefront: home, shop-all, category pages, product pages with galleries & variants
- 🛒 Cart + checkout (persisted in localStorage)
- 💳 Payments: Cash on Delivery, eSewa & Khalti
- 🧾 Orders saved straight into the admin dashboard
- 🎟️ Coupons/discounts
- 🧑‍💼 Admin panel at `/studio` (Sanity Studio) — products, categories, orders, coupons, site settings
- ⚡ Content changes go live in ~1 minute (ISR), or instantly via webhook revalidation

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS v4
- [Sanity](https://sanity.io) headless CMS (free tier is enough)
- [Vercel](https://vercel.com) hosting (free tier)
- PayPal-less: Khalti + eSewa gateways

## 1. Get the project running locally

```bash
npm install
cp .env.example .env.local   # then fill in your values
npm run dev
```

Open:

- Storefront: http://localhost:3000
- Admin panel: http://localhost:3000/studio (requires Sanity login)

## 2. Set up Sanity (the admin system)

1. Create a free account/project at https://www.sanity.io/manage (or run `npx sanity manage`).
2. Copy the Project ID and a dataset name (`production` by default).
3. Create an **API token** (Sanity → API → Tokens → Add API token, permission **View + Edit**).
4. Fill these into `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=<view+edit token>
```

5. Restart `npm run dev`, open `/studio`, and add your first products. They appear on the store within a minute.

> Tip: add the `SANITY_REVALIDATE_SECRET` and configure a Sanity webhook for instant updates (see `.env.example`).

## 3. Payments

### Khalti

1. Get live keys from Khalti merchant dashboard (test: `https://docs.khalti.com`).
2. Set `NEXT_PUBLIC_KHALTI_PUBLIC_KEY` and `KHALTI_SECRET_KEY`.
3. Keep the default live endpoints in `.env.example`, or uncomment the test endpoints for development.

### eSewa

1. Get an eSewa merchant service code (SCD).
2. Set `NEXT_PUBLIC_ESEWA_MERCHANT_ID`.
3. Keep live gateway/verify endpoints by default, or uncomment the UAT endpoints for testing.

### Cash on Delivery

Enabled by default. Toggle each payment method in Admin → **Site Settings**.

## 4. Deploy with GitHub + Vercel

1. **Push to GitHub** (install Git: https://git-scm.com/downloads):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/swashree-collection.git
git push -u origin main
```

2. **Import on Vercel**: https://vercel.com/new → *Import existing repository* → select `swashree-collection` → framework is auto-detected (**Next.js**) → hit **Deploy**.

3. **Add environment variables in Vercel** (Settings → Environment Variables): copy every value from your `.env.local` (same keys, no quotes). For `NEXT_PUBLIC_SITE_URL` use `https://your-app.vercel.app`.

4. Redeploy, then:

- Storefront at `https://your-app.vercel.app`
- Admin panel at `https://your-app.vercel.app/studio`

5. (Optional) Connect your custom domain in Vercel → Settings → Domains.

## Folder structure (quick map)

```
sanity.config.ts          Studio config (admin panel)
src/sanity/schemas/       Content types: product, category, order, coupon, siteSettings
src/sanity/structure.tsx  Admin sidebar (nice lists, grouped like WP)
src/lib/sanity.ts         Sanity client + GROQ queries
src/lib/orders.ts         Create/verify orders & coupons (server)
src/lib/payments/         Khalti + eSewa integration (service = server only)
src/components/storefront Storefront UI
src/app/api/              Coupon, order, khalti-initiate, revalidate endpoints
src/app/(pages)           Home, shop, product, category, cart, checkout, contact, about
src/app/studio/           The /studio admin panel route
```

## Customising

Almost everything visible on the site (store name, tagline, hero, announcement, phone, WhatsApp, delivery fee, free-shipping threshold, payment toggles, social links) is editable in **Admin → Site Settings**. Products/categories/orders/coupons live in the same panel.