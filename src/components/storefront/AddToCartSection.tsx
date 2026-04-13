'use client'

import { useState } from 'react'

import { useCart } from '@/lib/cart/CartProvider'
import { formatBrl } from '@/lib/whatsapp/formatBrl'

type Props = {
  productId: string
  title: string
  unitPriceBrl: number
  slug: string
}

export function AddToCartSection({ productId, title, unitPriceBrl, slug }: Props) {
  const { addLine } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  return (
    <div className="mt-6 space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-lg font-semibold">{formatBrl(unitPriceBrl)}</span>
        <label className="flex items-center gap-2 text-sm">
          Qtd
          <input
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number.parseInt(e.target.value, 10) || 1))}
            className="w-16 rounded-md border border-input bg-background px-2 py-1 text-center"
          />
        </label>
      </div>
      <button
        type="button"
        className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground motion-safe:active:scale-[0.99]"
        onClick={() => {
          addLine({
            productId,
            quantity: qty,
            unitPriceBrl,
            title,
            slug,
          })
          setAdded(true)
          window.setTimeout(() => setAdded(false), 2000)
        }}
      >
        {added ? 'Adicionado!' : 'Adicionar ao carrinho'}
      </button>
    </div>
  )
}
