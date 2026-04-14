# Tasks: Responsive Storefront UI + Curated Hearth

**Input**: Design documents from `/specs/002-responsive-storefront-ui/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Not requested by spec (constitution); manual QA including **SC-008** (FR-013 token audit).

**Organization**: Phases follow spec user-story priorities: P1 → P2 → P3, with Setup and Foundational work first.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependency on incomplete tasks in the same wave)
- **[Story]**: `[US1]` … `[US7]` map to user stories in `spec.md`
- Paths below use repo root `E:\Works\Baita\bazar-limab2\` — adjust if cloning elsewhere.

---

## Phase 1: Setup (shared infrastructure)

**Purpose**: Add dependencies per [plan.md](./plan.md) and spec FR-012.

- [X] T001 Add `@number-flow/react` dependency with pnpm in `E:\Works\Baita\bazar-limab2\package.json`

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: **FR-013** design tokens in `globals.css`, fonts, chart/sidebar token surfaces for **SC-008**, Payload product fields, storefront queries, and cart max enforcement—**must complete before user stories**.

**⚠️ CRITICAL**: No user story work until this phase completes.

- [X] T002 Map Stitch / Curated Hearth palette into shadcn-aligned variables in `E:\Works\Baita\bazar-limab2\src\app\(app)\globals.css` (`:root`, `.dark`, `@theme inline`) so Typography, text/semantic colors, and shadow groups satisfy **FR-013**; no hard-coded hex in components for those categories afterward
- [X] T003 [P] Load Plus Jakarta Sans and Work Sans via `next/font/google` in `E:\Works\Baita\bazar-limab2\src\app\(app)\layout.tsx` and assign to CSS font variables consumed by `globals.css` / `@theme inline`
- [X] T004 Ensure **`--chart-1`–`--chart-5`** and **`--sidebar-*`** semantic tokens are referenced at least once in shared storefront chrome (e.g. `E:\Works\Baita\bazar-limab2\src\components\storefront\StorefrontChrome.tsx` or `E:\Works\Baita\bazar-limab2\src\components\storefront\StoreHeader.tsx`) so **SC-008** can pass for semantic color groups
- [X] T005 Add `maxPurchaseQty`, `featured`, and optional `familyPick` fields to `E:\Works\Baita\bazar-limab2\src\collections\Products.ts`
- [X] T006 Run Payload schema migration / db update per project convention and `pnpm generate:types` so `E:\Works\Baita\bazar-limab2\src\payload-types.ts` includes new product fields
- [X] T007 Add `listFeaturedProducts()` (or equivalent `payload.find`) in `E:\Works\Baita\bazar-limab2\src\lib\payload\storefront.ts`
- [X] T008 Extend `CartLine` with `maxPurchaseQty` in `E:\Works\Baita\bazar-limab2\src\lib\cart\schema.ts` and handle storage versioning in `E:\Works\Baita\bazar-limab2\src\lib\cart\storage.ts` if needed
- [X] T009 Clamp merged quantities to `maxPurchaseQty` in `mergeLine` in `E:\Works\Baita\bazar-limab2\src\lib\cart\storage.ts`
- [X] T010 Enforce `maxPurchaseQty` in `addLine` / `setQuantity` in `E:\Works\Baita\bazar-limab2\src\lib\cart\CartProvider.tsx`

**Checkpoint**: Tokens + fonts + chart/sidebar hooks landed; featured/max data and cart clamps ready.

---

## Phase 3: User Story 1 — Consistent layout on phone and desktop (Priority: P1)

**Goal**: Primary routes use responsive layout and **FR-013** token-backed styling (no ad-hoc colors/fonts/shadows for those categories).

**Independent Test**: Resize across phone/tablet/desktop on `/`, `/browse`, `/rooms/[slug]`, `/products/[slug]`, `/cart`, `/checkout`; no horizontal scroll for normal content (spec US1).

### Implementation for User Story 1

- [X] T011 [US1] Replace `redirect('/browse')` with a responsive editorial shell on `E:\Works\Baita\bazar-limab2\src\app\(app)\page.tsx` (sections may await US2/US3; empty states use semantic tokens from `globals.css`)
- [X] T012 [P] [US1] Refactor `E:\Works\Baita\bazar-limab2\src\app\(app)\browse\page.tsx` for responsive grids and tonal surfaces via Tailwind semantic tokens only
- [X] T013 [P] [US1] Refactor `E:\Works\Baita\bazar-limab2\src\app\(app)\rooms\[slug]\page.tsx` for responsive product grid and spacing
- [X] T014 [P] [US1] Refactor `E:\Works\Baita\bazar-limab2\src\app\(app)\products\[slug]\page.tsx` for responsive PDP layout
- [X] T015 [P] [US1] Refactor `E:\Works\Baita\bazar-limab2\src\app\(app)\cart\page.tsx` and `E:\Works\Baita\bazar-limab2\src\app\(app)\checkout\page.tsx` for responsive stacks/columns
- [X] T016 [US1] Align breakpoints and main padding in `E:\Works\Baita\bazar-limab2\src\components\storefront\StorefrontChrome.tsx`, `E:\Works\Baita\bazar-limab2\src\components\storefront\BottomNav.tsx`, and `E:\Works\Baita\bazar-limab2\src\components\storefront\StoreHeader.tsx` using token-backed classes

**Checkpoint**: US1 acceptance scenarios hold; home is a real route.

---

## Phase 4: User Story 2 — Browse rooms from a home carousel (Priority: P1)

**Goal**: Horizontal rooms carousel with labels, icon placeholder, controls, and “view all” (FR-002, FR-003).

**Independent Test**: From `/` only, use carousel and open a room without other navigation (spec US2).

### Implementation for User Story 2

- [X] T017 [US2] Add optional icon upload (relation to `media`) to `E:\Works\Baita\bazar-limab2\src\collections\Rooms.ts` if merchandising needs it; regenerate types
- [X] T018 [US2] Implement `RoomsCarousel` in `E:\Works\Baita\bazar-limab2\src\components\storefront\RoomsCarousel.tsx` (accessible controls, icon fallback, 0/1 room edge cases; **FR-013** styling)
- [X] T019 [US2] Integrate `RoomsCarousel` and “Ver todos” into `E:\Works\Baita\bazar-limab2\src\app\(app)\page.tsx` using `listPublishedRooms()` from `E:\Works\Baita\bazar-limab2\src\lib\payload\storefront.ts`

**Checkpoint**: US2 acceptance scenarios satisfied.

---

## Phase 5: User Story 3 — Featured products on the home page (Priority: P1)

**Goal**: Featured section below rooms; name, one-line truncated description, add to cart; no offer tabs (FR-004, FR-005).

**Independent Test**: From `/` only, add featured product to cart; long text ellipsis (spec US3).

### Implementation for User Story 3

- [X] T020 [US3] Implement `FeaturedProducts` in `E:\Works\Baita\bazar-limab2\src\components\storefront\FeaturedProducts.tsx` using `listFeaturedProducts()`
- [X] T021 [US3] Render `FeaturedProducts` below carousel in `E:\Works\Baita\bazar-limab2\src\app\(app)\page.tsx` with empty/muted state when none configured
- [X] T022 [US3] Wire add-to-cart with `maxPurchaseQty` via `E:\Works\Baita\bazar-limab2\src\components\storefront\AddToCartSection.tsx` or shared helper from featured cards

**Checkpoint**: US3 acceptance scenarios satisfied.

---

## Phase 6: User Story 4 — Maximum quantity per product (Priority: P2)

**Goal**: Admin-set max; storefront blocks excess with clear messaging (FR-006).

**Independent Test**: Low `maxPurchaseQty` on a test product; verify PDP and cart (spec US4).

### Implementation for User Story 4

- [X] T023 [US4] Pass `maxPurchaseQty` into `E:\Works\Baita\bazar-limab2\src\components\storefront\AddToCartSection.tsx` and replace hardcoded `max={99}` on quantity input
- [X] T024 [US4] Plumb `maxPurchaseQty` from `E:\Works\Baita\bazar-limab2\src\app\(app)\products\[slug]\page.tsx` and featured add-to-cart flows
- [X] T025 [US4] Update `E:\Works\Baita\bazar-limab2\src\app\(app)\cart\page.tsx` to use per-line `maxPurchaseQty` and show pt-BR limit message when capped
- [X] T026 [US4] Handle line quantity above newly lowered max (edge case) in cart UI or `E:\Works\Baita\bazar-limab2\src\lib\cart\CartProvider.tsx`

**Checkpoint**: US4 acceptance scenarios satisfied.

---

## Phase 7: User Story 5 — Large-screen top navigation (Priority: P2)

**Goal**: Desktop top bar: brand, rooms subset, all-rooms control, cart badge sum of units (FR-007, FR-009); **no** About link or `/about` route.

**Independent Test**: Wide viewport: navigate to room via bar; badge updates after add (spec US5).

### Implementation for User Story 5

- [X] T027 [US5] Implement desktop header in `E:\Works\Baita\bazar-limab2\src\components\storefront\StoreHeader.tsx` (brand, rooms, dropdown, cart; **FR-013** tokens; omit About link per FR-007)
- [X] T028 [US5] Keyboard-accessible full room list (e.g. Radix) in `E:\Works\Baita\bazar-limab2\src\components\storefront\StoreHeader.tsx`
- [X] T029 [US5] Cart entry in `E:\Works\Baita\bazar-limab2\src\components\storefront\StoreHeader.tsx` shows badge with sum of line quantities; replace static digits with `FlowNumber` in T034 after `FlowNumber.tsx` exists

**Checkpoint**: US5 acceptance scenarios satisfied.

---

## Phase 8: User Story 7 — Product gallery, cards, and animated numbers (Priority: P2)

**Goal**: Stack gallery (FR-010), Border Glow cards (FR-011), Number Flow (FR-012) with reduced-motion fallback.

**Independent Test**: Multi-image PDP; card hover/focus glow; qty/price updates; reduced motion on (spec US7).

### Implementation for User Story 7

- [X] T030 [US7] Implement stack-style gallery in `E:\Works\Baita\bazar-limab2\src\components\storefront\ProductGallery.tsx` (React Bits Stack; **FR-013** for surfaces/shadows)
- [X] T031 [P] [US7] Add `ProductCard` with Border Glow in `E:\Works\Baita\bazar-limab2\src\components\storefront\ProductCard.tsx`; use on `E:\Works\Baita\bazar-limab2\src\app\(app)\rooms\[slug]\page.tsx` and featured section
- [X] T032 [US7] Add `FamilyBadge` in `E:\Works\Baita\bazar-limab2\src\components\storefront\FamilyBadge.tsx` when `familyPick` is true (semantic tokens)
- [X] T033 [US7] Create `FlowNumber` wrapper in `E:\Works\Baita\bazar-limab2\src\components\storefront\FlowNumber.tsx` using `@number-flow/react` with `prefers-reduced-motion` handling
- [X] T034 [US7] Apply `FlowNumber` to cart, checkout, `AddToCartSection`, prices, and cart badge in `E:\Works\Baita\bazar-limab2\src\components\storefront\StoreHeader.tsx`

**Checkpoint**: US7 and FR-010–FR-012 satisfied.

---

## Phase 9: User Story 6 — Richer visual polish (Priority: P3)

**Goal**: Purposeful motion and palette cohesion; reduced motion respected (FR-008).

**Independent Test**: OS reduced motion; transitions do not block tasks (spec US6).

### Implementation for User Story 6

- [X] T035 [US6] Add `motion-safe` transitions to key components under `E:\Works\Baita\bazar-limab2\src\components\storefront\` using **shadow** and **color** tokens from `globals.css`
- [X] T036 [US6] Audit `prefers-reduced-motion` for gallery, glow, and `FlowNumber` in `E:\Works\Baita\bazar-limab2\src\components\storefront\ProductGallery.tsx`, `ProductCard`, and `FlowNumber.tsx`

**Checkpoint**: US6 acceptance scenarios satisfied.

---

## Phase 10: Polish & cross-cutting concerns

**Purpose**: **SC-008**, lint, and spec success criteria.

- [ ] T037 [P] Run **SC-008** / **FR-013** audit: confirm every typography, text/semantic color, and shadow token in `E:\Works\Baita\bazar-limab2\src\app\(app)\globals.css` is referenced in storefront routes or shared chrome per `E:\Works\Baita\bazar-limab2\specs\002-responsive-storefront-ui\quickstart.md`; document any shared-chrome exception list
- [ ] T038 [P] Run `pnpm lint` and `pnpm exec tsc --noEmit` from `E:\Works\Baita\bazar-limab2` and fix issues in touched files
- [ ] T039 Manual pass on `E:\Works\Baita\bazar-limab2\specs\002-responsive-storefront-ui\quickstart.md` QA checklist including Lighthouse on key routes; **confirm all merchandising/product images** (home, room listing, PDP, featured, cart thumbnails if any) use **`next/image`** with appropriate **`sizes`** per constitution II
- [ ] T040 Verify SC-001–SC-008 from `E:\Works\Baita\bazar-limab2\specs\002-responsive-storefront-ui\spec.md` via internal checklist (no automated tests)

---

## Dependencies & execution order

### Phase dependencies

- **Phase 1**: Start immediately.
- **Phase 2**: Depends on T001; **blocks** all user stories.
- **Phases 3–9**: Depend on Phase 2.
- **Phase 10**: Depends on intended user stories being complete (minimum Phases 1–5 for MVP).

### User story dependencies

| Story | Depends on | Notes |
|-------|------------|--------|
| US1 | Phase 2 | Real `/` shell |
| US2 | US1 shell (T011) | Carousel on home |
| US3 | US1 shell | Featured below carousel |
| US4 | Phase 2 | Uses Payload + cart from T005–T010 |
| US5 | Phase 2; Number Flow polish with US7 | T029 completes with T034 |
| US7 | US1 layouts | Gallery/cards on PDP and listings |
| US6 | US7 preferred | Motion after core components |

**Suggested order**: Phase 1–2 → US1 → US2 → US3 → US4 → US5 → US7 → US6 → Phase 10.

### Parallel opportunities

- Phase 2: T003 parallel to T002 (different files).
- Phase 3: T012–T015 parallel after T011.
- Phase 8: T031 parallel to T030.
- Phase 10: T037 parallel to T038.

---

## Parallel example: User Story 1

```text
# After T011:
T012  # browse/page.tsx
T013  # rooms/[slug]/page.tsx
T014  # products/[slug]/page.tsx
T015  # cart + checkout
```

---

## Parallel example: User Story 7

```text
T030  # ProductGallery.tsx
T031  # ProductCard.tsx  [P]
# Then T032–T034
```

---

## Implementation strategy

### MVP first

1. Phases 1–2  
2. Phases 3–5 (US1–US3)  
3. Stop and validate SC-001 + US1–US3  

### Incremental delivery

Add US4 → US5 → US7 → US6 → Phase 10 (SC-008).

### Task counts

| Phase | Tasks | Story |
|-------|-------|--------|
| 1 | 1 | — |
| 2 | 9 | — |
| 3 | 6 | US1 |
| 4 | 3 | US2 |
| 5 | 3 | US3 |
| 6 | 4 | US4 |
| 7 | 3 | US5 |
| 8 | 5 | US7 |
| 9 | 2 | US6 |
| 10 | 4 | Polish |
| **Total** | **40** | |

---

## Notes

- `[P]` = parallelizable; `[US#]` on story phases only.
- **FR-013** enforced in Phase 2 (T002–T004) and verified in Phase 10 (T037).
- Commit after each task or logical group.
