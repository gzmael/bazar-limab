# Storefront route contract

**Version**: 1.0.0 (planning)  
**App**: Next.js App Router under `src/app/(app)/`

## Public routes

| Path | Purpose | Stitch reference |
|------|---------|------------------|
| `/` | Editorial home: hero, room/category navigation (carousel), featured products | Home Page |
| `/browse` | Room index / “all environments” (may merge into home or stay as secondary index) | Supporting |
| `/rooms/[slug]` | Category catalog: product grid, optional filters, Curated Hearth cards | Product Catalog - Kitchen |
| `/products/[slug]` | PDP: Stack gallery, details, related/upsell, add to cart | Product Detail Page |
| `/cart` | Line items, qty, totals | Cart & Checkout |
| `/checkout` | Buyer fields + WhatsApp handoff | Cart & Checkout |

## Non-routes

| Artifact | Location |
|----------|----------|
| PRD-style spec (600×900) | `specs/002-responsive-storefront-ui/spec.md`, `plan.md`; not served as HTML |
| About / marketing story | **Out of scope** — no `/about` route (FR-007). |

## Navigation

- **Large screens**: Top bar — brand, subset of rooms + “all rooms” dropdown, cart with badge (FR-007); no About link.
- **Small screens**: Existing bottom nav / chrome patterns; must meet 44×44px targets (constitution).

## Canonical URLs

- Product: `/products/{slug}`
- Room: `/rooms/{slug}`

## Deep linking

- All public routes must be shareable; avoid session-only state for primary catalog views.
