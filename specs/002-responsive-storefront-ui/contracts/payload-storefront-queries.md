# Contract: Payload data for storefront

**Locale**: `pt-BR` (single locale)

## Queries (server)

### `listPublishedRooms()`

- **Returns**: `Room[]` sorted by `sort`, `storeStatus: published`
- **Use**: Home carousel, nav dropdown, `/browse`

### `getPublishedRoomBySlug(slug)`

- **Returns**: `Room | null`
- **Use**: `/rooms/[slug]`

### `listPublishedProductsForRoom(roomId)`

- **Returns**: `Product[]` with `depth: 2` for media
- **Use**: Category catalog grid
- **Planned filter**: optional `featured` / search — extend query when filters ship

### `getPublishedProductBySlug(slug)`

- **Returns**: `Product | null` only if room published
- **Use**: PDP

### `readSalesGlobal()`

- **Returns**: `SalesChannel` — WhatsApp, currency, title
- **Use**: Layout, checkout

## Product shape (public fields of interest)

Required for UI contract after schema update:

- `title`, `slug`, `shortDescription`, `price`, `gallery[]`, `room`, `condition`
- **`maxPurchaseQty`**: number — cart and PDP quantity controls must not exceed
- **`featured`**: boolean — home featured section
- **`familyPick`** (optional): boolean — drives Family Badge chip

## Cart integration

- When adding to cart, pass `maxPurchaseQty` into client cart state.
- Badge count: **sum of line quantities** (per spec Assumptions).

## Media URLs

- Use `mediaSrc()` from `@/lib/payload/storefront` for `next/image` compatibility.

## Revalidation

- `revalidateProductAndRoom` / `revalidateAllStorefront` on product changes — keep after schema additions.
