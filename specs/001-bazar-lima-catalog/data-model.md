# Data Model: 001-bazar-lima-catalog

**Date**: 2026-04-13  
**Spec**: [spec.md](./spec.md)  
**ORM/CMS**: Payload CMS 3.x on PostgreSQL

## Collections

### Users (existing)

- Payload admin users; **no** public registration.
- Fields: align with existing `Users` collection; roles for **operator** vs future expansion if needed.

### Rooms (`rooms`)

| Field | Type | Rules |
|-------|------|--------|
| `title` | text | Required; localized pt-BR label (e.g. Quarto, Cozinha). |
| `slug` | text | Required, unique; URL segment. |
| `sort` | number | Required; ascending order on **room chooser** (FR-002, Key Entities). |
| `_status` or custom `published` | draft/published | Align with Payload version pattern; unpublished rooms hidden from storefront. |

**Relationships**: One-to-many → **Products** (`products.room`).

### Products (`products`)

| Field | Type | Rules |
|-------|------|--------|
| `title` | text | Required. |
| `slug` | text | Required, unique (global uniqueness recommended for URLs). |
| `room` | relationship | Required; exactly one `rooms` id (FR-003). |
| `price` | number | Required; BRL minor units or decimal with validation (FR-004). |
| `condition` | select | Required; options from fixed set (family-agreed, spec Assumptions). |
| `shortDescription` | textarea or text | Required; max length enforced in field validation + UI hint. |
| `notesDimensions` | text | Optional (FR-006). |
| `notesBrand` | text | Optional. |
| `notesYear` | text or number | Optional. |
| `gallery` | upload array | Min 1, max 3 images; hook rejects >3 (Edge Cases). |
| `sort` | number | Required per room ordering (FR-012, FR-018). |
| `published` / draft | per Payload | Unpublished/archived hidden from public queries. |

**Indexes**: `(room, sort)`, unique `slug`.

### Posts (template)

- **Remove or replace** with catalog collections before production; not part of the feature domain.

## Globals

### Sales channel (`sales-channel` or similar)

| Field | Type | Rules |
|-------|------|--------|
| `whatsappE164` | text | Required for `wa.me` link builder; validate format. |
| `displayCurrency` | select | Default `BRL` (Assumptions). |
| `storefrontTitle` | text | Optional override; still show brand FR-001. |

Readable/editable only by authenticated operators.

## Client-side only (not in Postgres)

| Concept | Storage | Notes |
|---------|---------|--------|
| Cart lines | `localStorage` | See [contracts/cart-lines.schema.json](./contracts/cart-lines.schema.json). |
| Checkout draft | memory + optional `sessionStorage` | Name + contact; not a Payload collection (FR-008). |

## State transitions

- **Room / Product**: `draft` → `published` → `archived` (or Payload-native `_status`); storefront queries **only published** entities.
- **Cart**: ephemeral client mutations; no server workflow.

## Hooks (recommended)

- **Products**: `beforeValidate` / `beforeChange`—enforce gallery length ≤3, required fields, slug uniqueness.
- **Products & Rooms**: `afterChange`—trigger `revalidatePath`/`revalidateTag` for affected storefront routes.
- **Access**: Public **read** for published catalog via dedicated access rules or local API from server components only; **no** anonymous write.
