---

description: "Task list for Bazar Lima Basilio — Family Catalog & WhatsApp Checkout"
---

# Tasks: Bazar Lima Basilio — Family Catalog & WhatsApp Checkout

**Input**: Design documents from `/specs/001-bazar-lima-catalog/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Omitted — constitution / plan specify Biome, TypeScript strict, and manual verification only (no automated test tasks).

**Organization**: Phases follow user story priorities from spec.md; file paths match plan.md (`src/app/(app)`, `src/collections`, `src/globals`, `src/lib`, `src/components`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies on incomplete sibling tasks)
- **[Story]**: User story label ([US1]–[US4]) on story-phase tasks only

## Path Conventions

Single Next.js + Payload app at repository root: `src/`, `migrations/`, `Dockerfile`, `next.config.mjs`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Coolify-ready build output and accurate local env hints

- [x] T001 Enable Next.js `output: 'standalone'` in `next.config.mjs` for container deploys per `specs/001-bazar-lima-catalog/quickstart.md`
- [x] T002 Add multi-stage production `Dockerfile` at repository root (pnpm install → build → standalone `node server.js` on port 3000) per `specs/001-bazar-lima-catalog/research.md`
- [x] T003 [P] Update `.env.example` to PostgreSQL `DATABASE_URL`, `NEXT_PUBLIC_SERVER_URL`, `PAYLOAD_SECRET`, and `RESEND_API_KEY` aligned with `src/payload.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Payload schema, public read access, storefront data helpers, and shared chrome — **required before any user story UI**

**⚠️ CRITICAL**: No user story work until this phase is complete

- [x] T004 Create `src/collections/Rooms.ts` (title, slug, sort, draft/published/**archived** or equivalent Payload status) per `specs/001-bazar-lima-catalog/data-model.md`; storefront MUST treat non-published and archived rooms as absent from public queries (FR-012)
- [x] T005 Create `src/collections/Products.ts` (room relationship, price BRL, condition, shortDescription, optional notes fields, gallery 1–3, per-room `sort`, draft/published/**archived**) per `specs/001-bazar-lima-catalog/data-model.md`; storefront MUST hide unpublished/archived products from public queries (FR-012)
- [x] T006 Create `src/globals/SalesChannel.ts` (or equivalent slug) with `whatsappE164`, `displayCurrency`, optional `storefrontTitle` per `specs/001-bazar-lima-catalog/data-model.md`
- [x] T007 Register Rooms, Products, and Sales global in `src/payload.config.ts`; remove `Posts` from `collections` array
- [x] T008 [P] Remove template `src/collections/Posts.ts` or replace exports if still referenced; ensure no dead imports in `src/payload.config.ts`
- [x] T009 Add validation/hooks on `src/collections/Products.ts` to enforce gallery length ≤3 and required fields per `specs/001-bazar-lima-catalog/data-model.md` edge cases
- [x] T010 [P] Add `afterChange` (or equivalent) hooks on `src/collections/Rooms.ts` and `src/collections/Products.ts` calling `revalidatePath` / `revalidateTag` for affected storefront routes per `specs/001-bazar-lima-catalog/research.md`
- [x] T011 Configure access on `src/collections/Rooms.ts` and `src/collections/Products.ts` so anonymous public read is limited to **published** storefront data (draft and **archived** excluded) and mutations require authenticated operators
- [x] T012 Create and apply Payload Postgres migration under `migrations/` for new collections/global; run project migration workflow per `specs/001-bazar-lima-catalog/quickstart.md`
- [x] T013 Regenerate `src/payload-types.ts` after schema changes using the project’s Payload TypeScript generate command
- [x] T049 [P] Add optional baseline room seed for FR-002 in `src/seed/baselineRooms.ts` (idempotent upsert by slug; pt-BR titles for Quarto, Cozinha, Garagem, Lavanderia) wired to a `pnpm` script or one-time migration so first deploy can satisfy minimum categories without hand entry
- [x] T014 Implement `src/lib/payload/storefront.ts` with typed helpers: list published rooms (chooser order), list published products by room slug ordered by `sort`, get product by slug, read sales global
- [x] T015 Update `src/app/(app)/layout.tsx` to `lang="pt-BR"`, default metadata for the catalog, and wrap content with shared storefront chrome placeholders per FR-001 and FR-011
- [x] T016 [P] Add `src/components/storefront/BottomNav.tsx` with persistent destinations for Browse entry and `/cart` (touch targets ≥44px) per FR-015
- [x] T017 [P] Add `src/components/storefront/StoreHeader.tsx` showing brand “Bazar Lima Basilio” per FR-001

**Checkpoint**: Schema, migrations, types, and shared layout shell ready — user story routes can ship incrementally

---

## Phase 3: User Story 1 — Browse the catalog by room (Priority: P1) 🎯 MVP

**Goal**: Room chooser first, then room listing with operator-defined order, skeletons, mobile-first layout, one-tap cart from listing/detail when nav visible

**Independent Test**: Seed rooms/products; open Browse → pick a room → see only that room’s products with title/price/primary image; no horizontal scroll below 480px; cart reachable in one tap from listing when bottom nav is visible

### Implementation for User Story 1

- [x] T018 [P] [US1] Add `src/components/storefront/skeletons/RoomChooserSkeleton.tsx` mirroring chooser layout per FR-013
- [x] T019 [P] [US1] Add `src/components/storefront/skeletons/RoomListingSkeleton.tsx` mirroring listing cards per FR-013
- [x] T020 [US1] Implement `src/app/(app)/browse/page.tsx` as room chooser (grid or list) using `src/lib/payload/storefront.ts`; add `src/app/(app)/browse/loading.tsx` using RoomChooserSkeleton
- [x] T021 [US1] Implement `src/app/(app)/rooms/[slug]/page.tsx` listing published products for one room in `sort` order using `next/image` for each card’s primary photo with explicit `width`/`height` or `fill` + `sizes` appropriate to the grid; lazy-load below-the-fold rows per `.specify/memory/constitution.md` II; add `src/app/(app)/rooms/[slug]/loading.tsx` using RoomListingSkeleton
- [x] T022 [US1] Update `src/app/(app)/page.tsx` to send visitors to the room chooser (`/browse`) without skipping FR-017 normal navigation
- [x] T023 [US1] Add `generateMetadata` in `src/app/(app)/browse/page.tsx` and `src/app/(app)/rooms/[slug]/page.tsx` per `specs/001-bazar-lima-catalog/research.md`
- [x] T024 [US1] Integrate `src/components/storefront/BottomNav.tsx` and `src/components/storefront/StoreHeader.tsx` in `src/app/(app)/layout.tsx` with correct active states and cart link from room listing and product detail routes per FR-015 and SC-006 (when T029 adds `StorefrontChrome.tsx` / `NavVisibilityProvider.tsx`, move bottom chrome into that wrapper without changing routes)

**Checkpoint**: P1 browse flow testable without product detail or cart implementation beyond navigation shell

---

## Phase 4: User Story 2 — View product details (Priority: P1)

**Goal**: Product detail with 1–3 photos, required fields, optional notes only when populated, skeleton loading, SEO metadata

**Independent Test**: Open products with 1 vs 3 images; confirm gallery behavior; empty notes hidden; long text does not break narrow layout

### Implementation for User Story 2

- [x] T025 [P] [US2] Add `src/components/storefront/ProductGallery.tsx` for 1–3 images with mobile-friendly navigation and no empty slots per spec edge cases; render all gallery assets with `next/image` (correct `sizes`, priority only for the primary/visible slide) and lazy/defer non-visible slides per `.specify/memory/constitution.md` II
- [x] T026 [US2] Implement `src/app/(app)/products/[slug]/page.tsx` using `src/lib/payload/storefront.ts` to render title, price, condition, shortDescription, and conditional notes blocks per FR-004–FR-006 (reuse gallery images from T025 — no duplicate `<img>` without `next/image`)
- [x] T027 [US2] Add `src/app/(app)/products/[slug]/loading.tsx` with a product-detail-shaped skeleton per FR-013
- [x] T028 [US2] Add `generateMetadata` in `src/app/(app)/products/[slug]/page.tsx` with canonical and Open Graph fields per `specs/001-bazar-lima-catalog/research.md`
- [x] T029 [US2] Add `src/components/storefront/NavVisibilityProvider.tsx` (client React context) and a thin `src/components/storefront/StorefrontChrome.tsx` (or equivalent) consumed from `src/app/(app)/layout.tsx` so `BottomNav` visibility responds to context; update `src/components/storefront/ProductGallery.tsx` to toggle fullscreen/lightbox mode via that context so bottom navigation hides during fullscreen media and restores on exit per spec edge case (avoid coupling gallery directly to layout internals)

**Checkpoint**: P1 browse + detail complete — still without cart/checkout (MVP catalog reading)

---

## Phase 5: User Story 3 — Cart and checkout via WhatsApp (Priority: P2)

**Goal**: localStorage cart with Zod validation, cart page, checkout validation and empty state, WhatsApp message per contract, desktop fallback without server persistence of buyer data

**Independent Test**: Add two products with quantities; complete checkout; verify `wa.me` message matches `specs/001-bazar-lima-catalog/contracts/whatsapp-order-message.md`; empty cart shows blocked checkout; validation prevents send

### Implementation for User Story 3

- [x] T030 [P] [US3] Implement Zod models mirroring `specs/001-bazar-lima-catalog/contracts/cart-lines.schema.json` in `src/lib/cart/schema.ts`
- [x] T031 [P] [US3] Implement checkout draft validation mirroring `specs/001-bazar-lima-catalog/contracts/checkout-draft.schema.json` in `src/lib/cart/checkout-draft.ts`
- [x] T032 [US3] Implement `src/lib/cart/storage.ts` for versioned localStorage key with read/merge/write; duplicate product adds increment `quantity` per spec edge cases
- [x] T033 [US3] Add `src/lib/cart/CartProvider.tsx` (client) exposing cart operations and pt-BR disclosure that the cart is stored on device per `specs/001-bazar-lima-catalog/quickstart.md`
- [x] T034 [US3] Implement `src/lib/whatsapp/buildOrderMessage.ts` and URL helper (e.g. `src/lib/whatsapp/waMeUrl.ts`) per `specs/001-bazar-lima-catalog/contracts/whatsapp-order-message.md` using sales global from `src/lib/payload/storefront.ts`
- [x] T035 [US3] Wrap storefront tree in `src/app/(app)/layout.tsx` with `src/lib/cart/CartProvider.tsx` using appropriate `"use client"` boundaries
- [x] T036 [US3] Add client add-to-cart UI on `src/app/(app)/products/[slug]/page.tsx` (e.g. `src/components/storefront/AddToCartSection.tsx`) populating denormalized title/price for cart lines
- [x] T037 [US3] Implement `src/app/(app)/cart/page.tsx` with line list, quantity updates, remove, and empty state per FR-007 and FR-014
- [x] T038 [US3] Implement `src/app/(app)/checkout/page.tsx` with required fields, validation UI, empty-cart guard, WhatsApp open, and copy-friendly fallback when `wa.me` cannot open per FR-008–FR-010 and spec edge cases
- [x] T039 [US3] Optionally mirror checkout draft to `sessionStorage` from `src/app/(app)/checkout/page.tsx` per `specs/001-bazar-lima-catalog/research.md` (cleared after successful handoff)

**Checkpoint**: End-to-end shopper flow through WhatsApp handoff without Payload storing buyer profiles

---

## Phase 6: User Story 4 — Maintain catalog content (Priority: P2)

**Goal**: Operators manage rooms and products in Payload Admin with correct field constraints, publish behavior, and per-room ordering reflected on storefront

**Independent Test**: Create room + product with two images, set sort orders, publish; verify storefront listing order and field updates match FR-012 and FR-018

### Implementation for User Story 4

- [x] T040 [P] [US4] Refine admin `labels`, `admin.description`, and grouping for fields in `src/collections/Rooms.ts` for operator clarity (pt-BR)
- [x] T041 [P] [US4] Refine admin `labels`, `admin.description`, validation messages, and upload limits UX in `src/collections/Products.ts` (pt-BR)
- [x] T042 [P] [US4] Refine admin presentation and validation hints in `src/globals/SalesChannel.ts` for WhatsApp and currency settings
- [x] T043 [US4] Update `src/collections/Users.ts` access/roles so only authorized operators can create/update catalog collections and globals
- [x] T044 [US4] End-to-end verify in Payload Admin at `src/app/(payload)/admin/[[...segments]]/page.tsx` that draft, publish, and **archive** flows for rooms and products match storefront visibility (archived and draft MUST NOT appear publicly) and that per-room `sort` updates public listings without duplicates

**Checkpoint**: Operators can run the business without developer intervention for routine catalog updates

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: SEO consistency, motion preferences, optional React Bits, release validation

- [x] T045 [P] Pass SEO review across `src/app/(app)/layout.tsx`, `src/app/(app)/browse/page.tsx`, `src/app/(app)/rooms/[slug]/page.tsx`, and `src/app/(app)/products/[slug]/page.tsx` for `robots`, canonical, `og:*`, and pt-BR titles per `specs/001-bazar-lima-catalog/quickstart.md`
- [x] T046 [P] Ensure skeleton/animation styles respect `prefers-reduced-motion` in `src/app/(app)/globals.css` and storefront components per spec assumptions
- [x] T047 [P] Add isolated React Bits usage only under `src/components/bits/` where bundle impact is controlled per `specs/001-bazar-lima-catalog/research.md`
- [x] T050 [P] Add `src/app/(app)/browse/error.tsx`, `src/app/(app)/rooms/[slug]/error.tsx`, and `src/app/(app)/products/[slug]/error.tsx` with pt-BR copy, retry where appropriate, and no stack traces or internal error strings (FR-013)
- [x] T048 Run manual smoke from `specs/001-bazar-lima-catalog/quickstart.md` (local dev, migrations, Docker build/run) and fix any gaps in `Dockerfile` or `next.config.mjs`; run **Lighthouse (mobile, simulated throttling)** on `/browse`, a representative `rooms/[slug]`, and `products/[slug]` and record whether LCP stays under 2.5s and total transferred bytes stay within the Performance Budget in `.specify/memory/constitution.md` II (iterate until pass or document approved exception)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: **Blocks all user stories**; may start in parallel with Phase 1 for schema work, but Phase 1 MUST be complete before relying on container smoke (T002, T048)
- **Phase 3 (US1)**: Depends on Phase 2
- **Phase 4 (US2)**: Depends on Phase 2; listing pages from US1 should link to `/products/[slug]` — implement US2 after or in parallel once slugs exist in data
- **Phase 5 (US3)**: Depends on Phase 2 and product identity from US2 for add-to-cart UX (can stub until T036)
- **Phase 6 (US4)**: Depends on Phase 2 collections/globals existing; can proceed in parallel with US1–US3 for admin polish
- **Phase 7 (Polish)**: Depends on desired user stories being feature-complete

### User Story Dependencies

- **US1 (P1)**: After Foundational — no dependency on other stories
- **US2 (P1)**: After Foundational — links naturally from US1 listings
- **US3 (P2)**: After Foundational; add-to-cart integration needs product detail route (US2) for best UX
- **US4 (P2)**: After Foundational — admin concerns; parallelizable with storefront stories

### Within Each User Story

- Skeletons/components before pages when referenced by `loading.tsx`
- `src/lib/*` helpers before pages that import them
- Client providers (`CartProvider`) before checkout/cart pages that consume context
- **US2**: Complete T025 before T029 so the gallery owns fullscreen behavior; T029 wraps bottom chrome for visibility

### Parallel Opportunities

- **Phase 1**: T003 parallel with T001–T002 if different owners (T001/T002 touch `next.config.mjs` / `Dockerfile` — avoid conflict; T003 is independent)
- **Phase 2**: T008, T010, T016, T017 can proceed in parallel once collection filenames are stable; T010 should wait until T004–T005 hooks API is known
- **Phase 3**: T018 and T019 in parallel
- **Phase 4**: T025 parallel with early US2 layout work
- **Phase 5**: T030 and T031 in parallel
- **Phase 6**: T040, T041, T042 in parallel
- **Phase 7**: T045, T046, T047, T050 in parallel (T048 sequencing: after core routes stable)

---

## Parallel Example: User Story 1

```bash
# Parallel UI scaffolding:
Task: "src/components/storefront/skeletons/RoomChooserSkeleton.tsx"
Task: "src/components/storefront/skeletons/RoomListingSkeleton.tsx"
```

---

## Parallel Example: User Story 3

```bash
# Parallel client contracts:
Task: "src/lib/cart/schema.ts"
Task: "src/lib/cart/checkout-draft.ts"
```

---

## Implementation Strategy

### MVP First (P1 stories only)

1. Complete Phase 1 and Phase 2
2. Complete Phase 3 (US1) and Phase 4 (US2)
3. **STOP and validate** browse + detail independently (seeded data, mobile layout, SEO view-source)
4. Deploy/demo when ready

### Incremental Delivery

1. Setup + Foundational → schema and shared chrome stable
2. US1 → room discovery and listings
3. US2 → trustworthy product pages
4. US3 → cart + WhatsApp checkout
5. US4 → operator polish and access hardening
6. Polish phase → SEO/motion/Docker hardening

### Parallel Team Strategy

- After Foundational: one developer on US1+US2 storefront routes, another on US4 admin polish, a third prepares US3 cart/whatsapp libs (T030–T034) before wiring pages

---

## Notes

- Tasks use absolute paths relative to repo root as shown
- [P] = different files, no ordering dependency within the same bullet batch where stated
- Commit after each task or coherent group; stop at checkpoints to validate stories independently
- Avoid cross-story coupling except where navigation naturally links routes
