'use client'

import Link from 'next/link'

import { useCart } from '@/lib/cart/CartProvider'
import { formatBrl } from '@/lib/whatsapp/formatBrl'

export default function CartPage() {
  const { cart, setQuantity, removeLine } = useCart()
  const lines = cart.lines

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Carrinho</h1>
      {lines.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
          <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          <Link
            href="/browse"
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Ver ambientes
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {lines.map((line) => (
              <li
                key={line.productId}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug">{line.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatBrl(line.unitPriceBrl)} cada
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="sr-only" htmlFor={`qty-${line.productId}`}>
                    Quantidade
                  </label>
                  <input
                    id={`qty-${line.productId}`}
                    type="number"
                    min={1}
                    max={99}
                    value={line.quantity}
                    onChange={(e) =>
                      setQuantity(
                        line.productId,
                        Math.max(1, Number.parseInt(e.target.value, 10) || 1),
                      )
                    }
                    className="w-16 rounded-md border border-input bg-background px-2 py-1 text-center text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeLine(line.productId)}
                    className="text-sm text-destructive underline-offset-2 hover:underline"
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-semibold">
              Total: {formatBrl(lines.reduce((acc, l) => acc + l.quantity * l.unitPriceBrl, 0))}
            </p>
            <Link
              href="/checkout"
              className="inline-flex justify-center rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
            >
              Finalizar no WhatsApp
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
