# Implementation Plan: Responsive Storefront UI + Curated Hearth

**Branch**: `002-responsive-storefront-ui` | **Date**: 2026-04-13 (updated) | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification (including **FR-013** / **SC-008** on `globals.css` tokens), Stitch project **Bazar Lima Basilio Catalog** (`14045073527959821628`, `TEXT_TO_UI_PRO`), and planning goal to align routes, components, data contracts, and phased delivery with five prototypes + **Curated Hearth** system.

## Summary

Deliver a **mobile-first**, responsive Next.js/Payload storefront that satisfies `spec.md` (rooms carousel, featured products, desktop nav, max purchase quantity, React Bits Stack + Border Glow, Number Flow) while matching the **editorial, asymmetric “Digital Curator”** aesthetic from Stitch. **Visual implementation MUST comply with FR-013**: all Typography, text color, key semantic color, and shadow tokens defined in `src/app/(app)/globals.css` (including `:root`, `.dark`, and `@theme inline`) are the **single source of truth** for those categories—components consume `var(...)` / Tailwind theme mappings, not ad-hoc hex fonts, or one-off `box-shadow`s. Stitch `namedColors` and `designMd` inform **what values to assign** to those CSS variables when extending the file; internal QA validates **SC-008** (no orphaned tokens in those four groups). **Stitch HTML exports** are QA/reference only; production UI is implemented in React with Payload data.

**Stitch ↔ app mapping**: Home → `/`; category catalog → `/rooms/[slug]`; PDP → `/products/[slug]`; cart + checkout → `/cart` + `/checkout`; PRD screen is **documentation-only**, not a route.

## Technical Context

**Language/Version**: TypeScript 5.4+, Node ≥ 20.9  
**Primary Dependencies**: Next.js ^16 (App Router, RSC), React 19, Payload CMS 3.82, Tailwind CSS 4, shadcn/ui + radix-ui, tw-animate-css, Sharp, `@number-flow/react` (per spec FR-012)  
**Storage**: PostgreSQL via `@payloadcms/db-postgres` (Mongo adapter also in repo; storefront targets Postgres per constitution)  
**Testing**: None automated (constitution); Biome + TypeScript + manual / Lighthouse + **SC-008** token checklist  
**Target Platform**: Web — mobile-first, tablet, desktop  
**Project Type**: Monolithic Next.js app with Payload admin route group  
**Performance Goals**: LCP under 2.5s on simulated 4G; page weight under 500 KB compressed per route; `next/image` everywhere; lazy below-fold  
**Constraints**: `prefers-reduced-motion` for non-essential motion; pt-BR copy; touch targets ≥ 44×44px; **FR-013** forbids bypassing `globals.css` token groups for typography, text/semantic colors, and shadows  
**Scale/Scope**: ~5 primary templates (home, room catalog, PDP, cart, checkout) + shared chrome; Payload collections `rooms`, `products`, globals `sales-channel`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Alignment |
|-----------|-----------|
| **I. Mobile-First** | Plan implements breakpoints from smallest viewport up; Stitch DESKTOP canvases are translated to progressive enhancement, not desktop-only. |
| **II. Performance Budget** | RSC for listings; client islands only for cart, gallery stack, glow, number morph; image `sizes` + lazy. |
| **III. Visual Excellence** | **FR-013**: cohesive tokens from `globals.css` (typography, colors, shadows); Curated Hearth/Stitch values feed variable definitions; motion respects reduced-motion; photography via Payload. |
| **IV. Simple UX** | Flat IA: home → room → product → cart/checkout ≤ 3 taps; clear pt-BR labels. |

**Post-design re-check**: Data model adds only `maxPurchaseQty` / `featured` (and optional badge flag)—no new user-facing flows beyond spec. **FR-013** adds a **delivery obligation** (token coverage + SC-008 QA), not new entities. **No gate violations.**

## Stitch prototype index

| # | Screen title | Screen ID | Canvas | Maps to |
|---|--------------|-----------|--------|---------|
| 1 | Home Page | `cd882d35b3d045cb9f918e651384ca73` | 2560×5316 | `/` |
| 2 | Product Catalog - Kitchen | `e6069a853ab2460ab4a5d285fe2e6823` | 2560×4534 | `/rooms/[slug]` |
| 3 | Product Detail Page | `05310f36f3f8469e91fc69ac5b1726d9` | 2560×4244 | `/products/[slug]` |
| 4 | Cart & Checkout | `b51ab00380ee40ea99c653f7569d4474` | 2560×2406 | `/cart`, `/checkout` |
| 5 | Product Requirements Document | `8e54d7ba28fb4890900f46455d68a65a` | 600×900 | Specs only — **not** a storefront route |

## Route & component map

### Routes (see `contracts/storefront-routes.md`)

- **`/`**: Editorial hero, rooms carousel (icons + placeholders), featured products (name + one-line truncated description + add to cart; **no** offer tabs), optional asymmetrical editorial blocks mirroring Stitch home. **Styles**: Tailwind semantic colors mapped to `globals.css` tokens only (FR-013).
- **`/browse`**: Keep or simplify as “all rooms” index; avoid duplicating home—either link prominently from home or merge.
- **`/rooms/[slug]`**: Category listing: filters (scope minimally: sort, condition, or search in later phase), product cards using token-backed backgrounds/borders/shadows; Family Badge when flagged.
- **`/products/[slug]`**: Stack gallery, specs/notes, related products (same room), upsell optional, `AddToCart` with qty clamped to `maxPurchaseQty`.
- **`/cart`**, **`/checkout`**: Line list, Number Flow on totals/qty, checkout form; inputs use semantic `input` / `border` / `ring` tokens from `globals.css`.

### Shared components (new / refactor)

| Area | Components |
|------|------------|
| Design system | **`src/app/(app)/globals.css`** — extend variable *values* using Stitch/Curated Hearth as reference; **use every token group** per FR-013; `next/font` for Plus Jakarta / Work Sans wired into `--font-sans` / roles in `layout.tsx` |
| Home | `RoomsCarousel`, `FeaturedProducts`, `EditorialHero` (asymmetric layout) |
| Catalog | `ProductCard` (Border Glow implemented with tokens + glow, not raw hex), `CatalogFilters` (optional phased), `FamilyBadge` |
| PDP | `ProductGallery` → Stack behavior; `ProductSpecs`, `RelatedProducts` |
| Chrome | `StoreHeader` — glass + blur ~20px on large screens; cart badge with Number Flow; **sidebar** semantic tokens if chrome uses sidebar pattern |
| Cart | Quantity + totals with Number Flow; enforce max from product |

## Phased implementation

**Phase A — Foundation (tokens + home shell)**  
- Align `globals.css` with Curated Hearth: map Stitch palette into existing shadcn-style variables (`--background`, `--foreground`, `--primary`, …) so **FR-013** is satisfiable without parallel hex usage in components.  
- Wire Plus Jakarta Sans / Work Sans via `next/font` and CSS variables for typography tokens.  
- **SC-008 prep**: plan explicit placements for chart (`--chart-1`…`--chart-5`) and sidebar tokens in storefront chrome or a small dashboard-style widget if needed so no token group is orphaned.  
- Replace `redirect('/browse')` on `/` with real home shell (SSR) + empty states.

**Phase B — Data + cart rules**  
- Add `maxPurchaseQty`, `featured` (+ optional `familyPick`) on products; migrate defaults.  
- Extend `storefront.ts` queries; regenerate `payload-types`.  
- Cart: clamp qty; pass max from server props or serialized product metadata on add.

**Phase C — Home & navigation**  
- Rooms carousel with icon placeholder; featured section; desktop top nav + rooms dropdown (FR-007).  
- Badge count = sum of quantities.

**Phase D — Catalog & PDP**  
- Restyle `/rooms/[slug]` with token-backed cards + Border Glow (FR-011); optional filters.  
- PDP: Stack gallery (FR-010); related products; badge.

**Phase E — Cart & checkout**  
- Stitch-aligned layout; Number Flow (FR-012); inputs use semantic tokens per FR-013.

**Phase F — Polish + SC-008**  
- Motion, hover states, reduced-motion tests; Lighthouse pass.  
- Run **SC-008** checklist: confirm typography, text/semantic color, and shadow tokens from `globals.css` are each referenced in customer-facing UI or documented shared chrome.

## Project Structure

### Documentation (this feature)

```text
specs/002-responsive-storefront-ui/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
│   ├── storefront-routes.md
│   ├── design-system-tokens.md
│   └── payload-storefront-queries.md
└── tasks.md             # From /speckit-tasks
```

### Source code (repository root)

```text
src/
├── app/(app)/
│   ├── page.tsx                 # Home (editorial — replace redirect)
│   ├── browse/page.tsx
│   ├── rooms/[slug]/page.tsx
│   ├── products/[slug]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── layout.tsx               # Fonts → typography CSS variables
│   └── globals.css              # Canonical tokens (FR-013)
├── collections/Products.ts
├── components/storefront/
└── lib/payload/storefront.ts
```

**Structure Decision**: Single Next.js app; Payload collections in `src/collections`; storefront UI under `src/components/storefront` and `src/app/(app)`.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

| Topic | Why Needed | Simpler Alternative Rejected Because |
|-------|------------|-------------------------------------|
| Border Glow (FR-011) vs Stitch “no harsh lines” | Glow is interactive affordance on cards, not section grid lines | Removing glow breaks FR-011 |
| Two fonts + gradient CTAs | Stitch Curated Hearth art direction | Single font feels off-brand vs prototypes |
| FR-013 “all tokens” vs minimal UI | Spec mandates full token-group coverage + SC-008 | Simpler partial-token UI violates FR-013 |

## Artifacts generated / updated (this run)

- [plan.md](./plan.md) — this file (restored after `setup-plan.ps1` template copy; includes FR-013 / SC-008)  
- [research.md](./research.md) — §10 globals.css vs Stitch  
- [contracts/design-system-tokens.md](./contracts/design-system-tokens.md) — aligned with `globals.css` + FR-013  
- [quickstart.md](./quickstart.md) — SC-008 QA step  
- Agent context: `update-agent-context.ps1` (cursor-agent)
