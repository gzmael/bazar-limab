# Quickstart: 002-responsive-storefront-ui

## Prerequisites

- Node ≥ 20.9, `pnpm`
- Env: database URL and Payload secrets (see project `.env.example` if present)

## Run locally

```bash
cd E:\Works\Baita\bazar-limab2
pnpm install
pnpm dev
```

Open `http://localhost:3000` (or `NEXT_PUBLIC_SERVER_URL`).

## Stitch prototypes (reference)

- **Project**: [Bazar Lima Basilio Catalog](https://stitch.withgoogle.com/projects/14045073527959821628) — ID `14045073527959821628`
- **Screens** (DESKTOP canvases; HTML export available per screen in Stitch):
  - Home — `cd882d35b3d045cb9f918e651384ca73`
  - Catalog (Kitchen) — `e6069a853ab2460ab4a5d285fe2e6823`
  - PDP — `05310f36f3f8469e91fc69ac5b1726d9`
  - Cart & Checkout — `b51ab00380ee40ea99c653f7569d4474`
  - PRD (spec only, not a route) — `8e54d7ba28fb4890900f46455d68a65a`

## Where to implement

- **Routes**: `src/app/(app)/` — especially `page.tsx` (home), `browse/`, `rooms/[slug]/`, `products/[slug]/`, `cart/`, `checkout/`
- **Chrome**: `src/components/storefront/StorefrontChrome.tsx`, `StoreHeader.tsx`, `BottomNav.tsx`
- **Design tokens**: `src/app/(app)/globals.css` (extend with Curated Hearth variables)
- **Payload**: `src/collections/Products.ts` (new fields), regenerate `pnpm generate:types`

## QA checklist (manual)

- [ ] Home: rooms carousel + featured + editorial layout at sm/md/lg
- [ ] Room catalog: grid, filters (if scoped), cards match Curated Hearth + Border Glow
- [ ] PDP: Stack gallery, specs, related/upsell, Family Badge when enabled
- [ ] Cart/checkout: Number Flow on totals/qty; max enforced from product
- [ ] `prefers-reduced-motion`: animations disabled or reduced
- [ ] **SC-008 / FR-013**: `src/app/(app)/globals.css` — typography, text/semantic color, and shadow token groups each fully used (no orphans); no hard-coded fonts/colors/shadows outside those tokens for those categories
- [ ] **Images (constitution II)**: All merchandising/product images use `next/image` with appropriate `sizes` (home, listings, PDP, featured, cart line thumbnails if shown)
- [ ] **Navigation**: Large-screen top bar has no About link and no `/about` route (FR-007)
