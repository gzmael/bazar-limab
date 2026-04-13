'use client'

import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react'

import type { CartLine, CartStorage } from '@/lib/cart/schema'
import { EMPTY_CART, getCartSnapshot, mergeLine, readCart, writeCart } from '@/lib/cart/storage'

type CartContextValue = {
  cart: CartStorage
  addLine: (line: CartLine) => void
  setQuantity: (productId: string, quantity: number) => void
  removeLine: (productId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function subscribe(cb: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('storage', cb)
  window.addEventListener('bazar-lima-cart', cb)
  return () => {
    window.removeEventListener('storage', cb)
    window.removeEventListener('bazar-lima-cart', cb)
  }
}

function getSnapshot(): CartStorage {
  return getCartSnapshot()
}

function getServerSnapshot(): CartStorage {
  return EMPTY_CART
}

function notifyCart() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('bazar-lima-cart'))
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const addLine = useCallback((line: CartLine) => {
    const next = { version: 1 as const, lines: mergeLine(readCart().lines, line) }
    writeCart(next)
    notifyCart()
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const cur = readCart()
    if (quantity < 1) {
      const next = {
        version: 1 as const,
        lines: cur.lines.filter((l) => l.productId !== productId),
      }
      writeCart(next)
    } else {
      const next = {
        version: 1 as const,
        lines: cur.lines.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
      }
      writeCart(next)
    }
    notifyCart()
  }, [])

  const removeLine = useCallback((productId: string) => {
    const cur = readCart()
    writeCart({ version: 1, lines: cur.lines.filter((l) => l.productId !== productId) })
    notifyCart()
  }, [])

  const clear = useCallback(() => {
    writeCart({ version: 1, lines: [] })
    notifyCart()
  }, [])

  const value = useMemo(
    () => ({ cart, addLine, setQuantity, removeLine, clear }),
    [cart, addLine, setQuantity, removeLine, clear],
  )

  return (
    <CartContext.Provider value={value}>
      {children}
      <p className="sr-only">
        O carrinho fica salvo neste aparelho (local), não como uma conta na loja.
      </p>
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
