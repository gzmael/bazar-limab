'use client'

import { useState } from 'react'

import { FlowNumber } from '@/components/storefront/FlowNumber'
import { useCart } from '@/lib/cart/CartProvider'

type Props = {
  productId: string
  title: string
  unitPriceBrl: number
  slug: string
  maxPurchaseQty: number
  /** Produto vendido: desabilita quantidade e botão de compra. */
  sold?: boolean
}

export function AddToCartSection({
  productId,
  title,
  unitPriceBrl,
  slug,
  maxPurchaseQty,
  sold,
}: Props) {
  const { addLine } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  return (
    <div className="mt-6 space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-lg font-semibold text-primary">
          <FlowNumber format={{ style: 'currency', currency: 'BRL' }} value={unitPriceBrl} />
        </span>
        <label className="flex items-center gap-2 text-sm">
          Qtd
          <input
            type="number"
            min={1}
            max={maxPurchaseQty}
            value={qty}
            disabled={sold}
            onChange={(e) =>
              setQty(
                Math.min(maxPurchaseQty, Math.max(1, Number.parseInt(e.target.value, 10) || 1)),
              )
            }
            className="w-16 rounded-md border border-input bg-background px-2 py-1 text-center disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>
      </div>
      <p className="text-xs text-muted-foreground">
        {sold
          ? 'Produto vendido — indisponível para compra.'
          : `Máximo ${maxPurchaseQty} unidades por pedido.`}
      </p>
      <button
        type="button"
        className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground motion-safe:active:scale-[0.99]"
        disabled={sold}
        onClick={() => {
          if (sold) return
          addLine({
            productId,
            quantity: Math.min(qty, maxPurchaseQty),
            unitPriceBrl,
            title,
            slug,
            maxPurchaseQty,
          })
          setAdded(true)
          window.setTimeout(() => setAdded(false), 2000)
        }}
      >
        {sold ? 'Vendido' : added ? 'Adicionado!' : 'Adicionar ao carrinho'}
      </button>
    </div>
  )
}
