import { type CartLine, type CartStorage, cartStorageSchema } from '@/lib/cart/schema'

export const CART_STORAGE_KEY = 'bazar-lima.cart.v1'

/** Single shared empty cart — required for `useSyncExternalStore` server snapshot + referential stability. */
export const EMPTY_CART: CartStorage = { version: 1, lines: [] }

let snapshotCache: CartStorage = EMPTY_CART
let cachedStorageRaw: string | undefined = undefined

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
    snapshotCache = result.success ? result.data : EMPTY_CART
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

export function mergeLine(lines: CartLine[], incoming: CartLine): CartLine[] {
  const idx = lines.findIndex((l) => l.productId === incoming.productId)
  if (idx === -1) return [...lines, incoming]
  const next = [...lines]
  next[idx] = {
    ...next[idx],
    quantity: next[idx].quantity + incoming.quantity,
    title: incoming.title,
    unitPriceBrl: incoming.unitPriceBrl,
    slug: incoming.slug ?? next[idx].slug,
  }
  return next
}
