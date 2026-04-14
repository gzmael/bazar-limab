import { type CartLine, type CartStorage, cartStorageSchema } from '@/lib/cart/schema'

export const CART_STORAGE_KEY = 'bazar-lima.cart.v1'

/** Single shared empty cart — required for `useSyncExternalStore` server snapshot + referential stability. */
export const EMPTY_CART: CartStorage = { version: 1, lines: [] }

let snapshotCache: CartStorage = EMPTY_CART
let cachedStorageRaw: string | undefined

/**
 * Same data as `readCart()` but returns the **same object reference** while `localStorage` is unchanged.
 * `useSyncExternalStore` requires this; a new object every call causes an infinite re-render loop.
 */
export function getCartSnapshot(): CartStorage {
  if (typeof window === 'undefined') return EMPTY_CART
  const raw = window.localStorage.getItem(CART_STORAGE_KEY)
  const normalized = raw === null ? '' : raw
  if (normalized === cachedStorageRaw) {
    return snapshotCache
  }
  cachedStorageRaw = normalized
  if (!normalized) {
    snapshotCache = EMPTY_CART
    return snapshotCache
  }
  try {
    const parsed: unknown = JSON.parse(normalized)
    const result = cartStorageSchema.safeParse(parsed)
    if (!result.success) {
      snapshotCache = EMPTY_CART
      return snapshotCache
    }
    snapshotCache = {
      ...result.data,
      lines: result.data.lines.map((l) => {
        const cap = lineMax(l)
        return { ...l, quantity: Math.min(l.quantity, cap) }
      }),
    }
    return snapshotCache
  } catch {
    snapshotCache = EMPTY_CART
    return snapshotCache
  }
}

export function readCart(): CartStorage {
  if (typeof window === 'undefined') return EMPTY_CART
  return getCartSnapshot()
}

export function writeCart(data: CartStorage) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data))
}

function lineMax(line: CartLine): number {
  return line.maxPurchaseQty ?? 99
}

export function mergeLine(lines: CartLine[], incoming: CartLine): CartLine[] {
  const idx = lines.findIndex((l) => l.productId === incoming.productId)
  const incomingMax = lineMax(incoming)
  const clampedIncoming = { ...incoming, quantity: Math.min(incoming.quantity, incomingMax) }
  if (idx === -1) return [...lines, { ...clampedIncoming, maxPurchaseQty: incomingMax }]
  const next = [...lines]
  const existing = next[idx]
  const maxAllowed = Math.min(lineMax(existing), incomingMax)
  const mergedQty = Math.min(existing.quantity + clampedIncoming.quantity, maxAllowed)
  next[idx] = {
    ...existing,
    quantity: mergedQty,
    title: incoming.title,
    unitPriceBrl: incoming.unitPriceBrl,
    slug: incoming.slug ?? existing.slug,
    maxPurchaseQty: maxAllowed,
  }
  return next
}
