# Storefront Demo

A premium e-commerce prototype for client presentations. React 18, TypeScript, Tailwind CSS, Vite and Lucide icons. No backend: everything runs in the browser from local mock data.

**What is included:** homepage, shop (search, category, price, sale and sort filters), product pages with colour/size/quantity, cart (saved in localStorage), demo checkout with validation, and an admin dashboard preview (overview, orders, product management).

**Honesty built in:** checkout is labelled as a demonstration, collects no payment details and places no real order. The admin banner states all figures are illustrative.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds to dist/
npm run preview    # serves the production build
```

Requires Node 18 or newer.

## Deploy the demo link

Routing uses hash URLs (`/#/shop`), so no rewrite rules are needed on any static host.

**Vercel:** push the folder to GitHub, import the repo at vercel.com/new, accept the Vite defaults, deploy. Or run `npx vercel` from this folder.

**Netlify:** push to GitHub, "Add new site", import the repo (build command `npm run build`, publish directory `dist`; both are already set in `netlify.toml`). Or run `npm run build` and drag the `dist` folder onto app.netlify.com/drop.

## Customise for each prospect

| To change | Edit |
| --- | --- |
| Brand name, tagline, hero copy, colours, fonts, currency, shipping rules, contact details, "Concept prepared for ..." line, footer credit | `src/config/brand.ts` |
| Logo | Put a file in `public/` and set `logoUrl` in `brand.ts` (for example `'/logo.svg'`) |
| Products, prices, categories, variants | `src/data/products.ts` |
| Product photos | In `products.ts`, replace a product's `images` with real paths, e.g. `['/products/tote-1.jpg', '/products/tote-2.jpg']`, and put the files in `public/products/` |
| Testimonials, hero products, promo codes, states list | `src/data/storefront.ts` |
| Sample orders and revenue chart | `src/data/orders.ts` |
| Page title and favicon | `brand.ts` and `public/favicon.svg` |

**Colours:** all nine colours in `brand.colors` are applied at startup, so one edit re-skins the whole site including the admin. Use hex values.

**Product images:** by default every product uses generated SVG artwork (`'art:0'` to `'art:3'`), which means the demo never has a broken image and works offline. Real photos override it per product. If a real image fails to load, the artwork is shown instead.

**Before showing a prospect:** replace the sample testimonials with believable ones for their industry, and set `preparedFor` in `brand.ts` so the top bar and admin banner carry their name. Change `storagePrefix` so cart data from one demo never appears in another.

## Project structure

```
src/
  config/brand.ts        brand, theme, shipping and copy
  data/                  products, orders, testimonials (swap for an API later)
  types.ts               Product, CartLine, Order types
  context/               catalogue, cart + wishlist, toasts
  lib/                   router, formatting, pricing, colour helpers
  components/            ProductCard, ProductArt, Navbar, CartDrawer, ...
  pages/                 Home, Shop, ProductDetail, Cart, Checkout
  pages/admin/           Overview, Orders, Products
```

## Moving to a full-stack build later

- `CatalogContext` is the single place products are loaded: replace its initial state with an API call.
- `StoreContext` owns cart logic: swap localStorage for a server cart without touching the pages.
- Checkout's `submit` is where an order request and Paystack/Flutterwave would go.
- Admin edits currently live in memory and reset on reload; they map directly onto CRUD endpoints.
