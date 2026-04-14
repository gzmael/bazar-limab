# Phase 0 Research: Responsive Storefront + Curated Hearth

**Feature**: `002-responsive-storefront-ui`  
**Stitch project**: [Bazar Lima Basilio Catalog](https://stitch.withgoogle.com/projects/14045073527959821628) (`projects/14045073527959821628`, `TEXT_TO_UI_PRO`, target DESKTOP canvases scaled to mobile/tablet in implementation)

## 1. Design system source of truth

**Decision**: **Runtime** styling for typography, text colors, key semantic colors, and shadows MUST come from **`src/app/(app)/globals.css`** per **FR-013**: use all token groups there (`:root`, `.dark`, `@theme inline`), consumed via `var(...)` / Tailwind mappings—no ad-hoc hex, font stacks, or raw `box-shadow` for those categories. **Stitch** `designTheme.designMd` and `namedColors` remain the authoritative **Curated Hearth** reference for **what values to assign** when updating those CSS variables (e.g. map Stitch “surface” / “on-surface” into the project’s shadcn-aligned `--background`, `--foreground`, etc.).

**Rationale**: Spec clarification and SC-008 require full token-group coverage and auditability; a single file avoids drift between “contract hex” and shipped CSS.

**Alternatives considered**: (a) Stitch hex only in components—rejected: violates FR-013. (b) Import Stitch HTML as-is—rejected: not responsive, not RSC-friendly.

## 2. Typography

**Decision**: Load **Plus Jakarta Sans** and **Work Sans** via `next/font/google` and wire them into **`globals.css` typography tokens** (e.g. `--font-sans` for primary UI, with display/heading utilities using the same stack or a second variable if split—must remain defined in `globals.css` per FR-013).

**Rationale**: Matches Stitch theme and `designMd` §3 while satisfying FR-013 (no font family strings in components outside the token file).

**Alternatives considered**: Keep Quicksand-only defaults in `globals.css`—rejected: conflicts with Curated Hearth direction once fonts are applied.

## 3. Color & surfaces

**Decision**: Map Stitch `namedColors` into **`globals.css` variables** (project uses shadcn-style names: `--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--border`, chart and sidebar scales, etc.). Prefer **background shifts** (`bg-background` / `bg-card` / `bg-muted`) for sectioning per Curated Hearth; use `--border` / `outline` tokens sparingly (e.g. inputs, dense controls), not as the primary section grid.

**Rationale**: FR-013 requires semantic tokens from the file; Stitch provides the target palette for variable *values*.

**Alternatives considered**: Parallel “Stitch-only” palette in components—rejected: violates FR-013.

## 4. React Bits patterns vs Curated Hearth

**Decision**: Keep **Stack** gallery (FR-010) and **Border Glow** on cards (FR-011). Glow is an **interaction affordance** on the card edge, not a 1px **section grid** border; use soft surface nesting for section boundaries per `designMd`.

**Rationale**: Spec clarifications require React Bits references; Stitch forbids harsh containment lines, not focus/glow treatments.

**Alternatives considered**: Remove Border Glow—rejected: violates FR-011 unless PO approves replacement.

## 5. Animated numerals

**Decision**: Add **`@number-flow/react`** (or the project-standard Number Flow package used elsewhere in the React ecosystem) for prices, quantities, totals, badge; respect `prefers-reduced-motion`.

**Rationale**: FR-012 and spec Assumptions.

**Alternatives considered**: CSS-only transitions—rejected: does not match digit morphing requirement.

## 6. Route mapping vs Stitch screens

| Stitch screen | Screen ID | Implementation route |
|---------------|-----------|------------------------|
| Home Page | `cd882d35b3d045cb9f918e651384ca73` | **`/`** editorial home (replace current `redirect('/browse')`) with hero, category/room navigation, featured |
| Product Catalog - Kitchen | `e6069a853ab2460ab4a5d285fe2e6823` | **`/rooms/[slug]`** as category catalog (filters + product cards); optional future **`/browse`** as index |
| Product Detail Page | `05310f36f3f8469e91fc69ac5b1726d9` | **`/products/[slug]`** |
| Cart & Checkout | `b51ab00380ee40ea99c653f7569d4474` | **`/cart`** + **`/checkout`** (may be one flow with two steps UI) |
| Product Requirements Document | `8e54d7ba28fb4890900f46455d68a65a` | **Not a public route**—content lives in `spec.md` / `plan.md` / internal docs; optional static `docs/` or Storybook only if needed |

**Rationale**: Aligns URLs with Next.js app structure and user’s “PRD is reference only” instruction.

## 7. Data gaps (catalog rules)

**Decision**: Add Payload fields **`maxPurchaseQty`** (number, required default) and **`featured`** (boolean or relationship to a global “featured list”) on **Products**, plus storefront enforcement in cart and quantity UI. Cart line `max` in UI must come from product payload, not hardcoded `99`.

**Rationale**: FR-006; current `Products` collection has no max quantity; `cart/page.tsx` uses `max={99}`.

**Alternatives considered**: Single global max—rejected: spec requires per-product cap.

## 8. Responsive behavior from DESKTOP prototypes

**Decision**: Treat Stitch canvas as **art direction at xl**; implement **mobile-first** breakpoints (constitution): collapse grids, stack filters, use glass nav / bottom nav patterns from `StorefrontChrome` where appropriate.

**Rationale**: Constitution I; Stitch screens are DESKTOP-type.

## 9. Performance

**Decision**: Lazy-load below-fold sections; `next/image` with explicit `sizes`; keep gallery and glow as **client islands** with minimal JS; prefer RSC for listings.

**Rationale**: Constitution II and III.

---

## 10. FR-013 token coverage (typography, colors, shadows)

**Decision**: Implement Plus Jakarta Sans / Work Sans through `next/font` and assign to the CSS variables consumed by `@theme inline` (`--font-sans`, etc.). Ensure **chart** (`--chart-1`–`--chart-5`) and **sidebar** semantic colors appear in storefront chrome or a deliberate small UI surface (e.g. mini legend, drawer styled as sidebar) so SC-008 passes—no orphaned variables in those four groups.

**Rationale**: Spec requires every token in Typography, text color, key semantic color, and shadow groups to be referenced.

**Alternatives considered**: Drop unused shadcn tokens—rejected: violates FR-013/SC-008.

---

## Consolidated unknowns resolved

- **Featured selection**: Boolean `featured` on product or curated list—either satisfies FR-004/FR-005 once query filters `featured: true`.
- **Badge count**: Sum of line quantities (per spec Assumptions)—document in cart contract.
- **Stitch HTML exports**: Reference-only for QA diff, not runtime embedding.
