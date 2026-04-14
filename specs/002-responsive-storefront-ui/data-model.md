# Data Model: Storefront + Curated Hearth Alignment

**Scope**: Payload entities and derived storefront shapes for `002-responsive-storefront-ui`.

## Design tokens (non-Payload)

**FR-013**: Visual **typography**, **text/semantic colors**, and **shadows** are not Payload entities; they live in `src/app/(app)/globals.css` and are validated by **SC-008**. Stitch Curated Hearth values inform updates to those CSS variables only.

## Entities

### Room (`rooms`)

| Field | Type | Notes |
|-------|------|--------|
| `title` | localized text | Display name |
| `slug` | text | URL segment `/rooms/[slug]` |
| `sort` | number | Carousel / nav order |
| `storeStatus` | enum | `published` required for public |
| Icon / image | upload (if present) | Carousel + nav; placeholder when missing (FR-002, FR-003) |

**Relationships**: One room → many products.

### Product (`products`)

**Existing (summary)**: `title`, `slug`, `room`, `price`, `condition`, `shortDescription`, notes, `gallery` (1–3 images), `sort`, `storeStatus`.

**Planned additions (implementation)**:

| Field | Type | Validation | Purpose |
|-------|------|------------|---------|
| `maxPurchaseQty` | number | required, integer ≥ 1, sensible admin default (e.g. 99) | FR-006; replaces hardcoded cart max |
| `featured` | checkbox | default false | FR-004, FR-005 featured section |
| `familyPick` / `showFamilyBadge` | checkbox (optional) | — | Maps “Family Badge” chip in Stitch (`tertiary-container`); optional if `featured` alone is enough |

**Rules**:

- Published product must have published room (already enforced in `getPublishedProductBySlug`).
- Gallery: 1–3 images (existing hooks).

### Cart (client-side)

**Shape** (conceptual; see `CartProvider`):

- `lines[]`: `{ productId, title, unitPriceBrl, quantity, maxPurchaseQty? }`
- Quantity updates must clamp to `min(quantity, maxPurchaseQty)` and surface message when blocked.

### Sales global (`sales-channel`)

**Existing**: `whatsappE164`, `displayCurrency`, `storefrontTitle` — used for checkout message and chrome title.

## State transitions

- **Product `storeStatus`**: `draft` → `published` → `archived` (revalidation already handled).
- **Cart**: Add/update/remove lines; checkout builds WhatsApp message then may `clear` cart.

## Validation summary

- Cannot add to cart above `maxPurchaseQty`.
- Featured section only lists `featured === true` and `storeStatus === published`.
