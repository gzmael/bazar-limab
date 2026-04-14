'use client'

import Link from 'next/link'
import { useMemo } from 'react'

import { FlowNumber } from '@/components/storefront/FlowNumber'
import { useCart } from '@/lib/cart/CartProvider'
import { formatBrl } from '@/lib/whatsapp/formatBrl'

export default function CartPage() {
  const { cart, setQuantity, removeLine } = useCart()
  const lines = cart.lines

  const totalBrl = useMemo(
    () => lines.reduce((acc, l) => acc + l.quantity * l.unitPriceBrl, 0),
    [lines],
  )

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold tracking-tight md:text-3xl">Carrinho</h1>
      {lines.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/40 p-6 text-center shadow-sm">
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
          <ul className="space-y-3 md:space-y-4">
            {lines.map((line) => {
              const maxQty = line.maxPurchaseQty ?? 99
              return (
                <li
                  key={line.productId}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between md:p-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug">{line.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatBrl(line.unitPriceBrl)} cada
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <label className="sr-only" htmlFor={`qty-${line.productId}`}>
                        Quantidade
                      </label>
                      <input
                        id={`qty-${line.productId}`}
                        type="number"
                        min={1}
                        max={maxQty}
                        value={line.quantity}
                        onChange={(e) =>
                          setQuantity(
                            line.productId,
                            Math.min(maxQty, Math.max(1, Number.parseInt(e.target.value, 10) || 1)),
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
                    {line.quantity >= maxQty ? (
                      <p className="max-w-56 text-right text-xs text-muted-foreground">
                        Limite de {maxQty} unidade{maxQty === 1 ? '' : 's'} para este produto.
                      </p>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between md:mt-10 md:p-6">
            <p className="text-lg font-semibold text-foreground">
              Total: <FlowNumber format={{ style: 'currency', currency: 'BRL' }} value={totalBrl} />
            </p>
            <Link
              href="/checkout"
              className="inline-flex justify-center rounded-lg bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground shadow-sm motion-safe:transition-transform motion-safe:active:scale-[0.99]"
            >
              Finalizar no WhatsApp
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
