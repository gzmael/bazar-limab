'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { FlowNumber } from '@/components/storefront/FlowNumber'
import { useSales } from '@/components/storefront/SalesProvider'
import { useCart } from '@/lib/cart/CartProvider'
import { parseCheckoutDraft } from '@/lib/cart/checkout-draft'
import type { OrderLineInput } from '@/lib/whatsapp/buildOrderMessage'
import { buildOrderMessage, cartTotalBrl } from '@/lib/whatsapp/buildOrderMessage'
import { waMeUrl } from '@/lib/whatsapp/waMeUrl'

const SESSION_KEY = 'bazar-lima.checkout-draft.v1'

export default function CheckoutPage() {
  const { cart, clear } = useCart()
  const { whatsappE164 } = useSales()
  const lines = cart.lines

  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({})
  const [copyHint, setCopyHint] = useState<string | null>(null)
  const [lastMessage, setLastMessage] = useState<{
    fullText: string
    waUrl: string
    truncated: boolean
  } | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY)
      if (!raw) return
      const j: unknown = JSON.parse(raw)
      const n = typeof j === 'object' && j && 'buyerName' in j ? String(j.buyerName) : ''
      const c = typeof j === 'object' && j && 'buyerContact' in j ? String(j.buyerContact) : ''
      if (n) setName(n)
      if (c) setContact(c)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ buyerName: name, buyerContact: contact }),
      )
    } catch {
      /* ignore */
    }
  }, [name, contact])

  const orderLines: OrderLineInput[] = useMemo(
    () =>
      lines.map((l) => ({
        quantity: l.quantity,
        title: l.title,
        unitPriceBrl: l.unitPriceBrl,
      })),
    [lines],
  )

  const previewTotal = useMemo(
    () => orderLines.reduce((acc, l) => acc + l.quantity * l.unitPriceBrl, 0),
    [orderLines],
  )

  const submit = useCallback(() => {
    setErrors({})
    setCopyHint(null)
    const parsed = parseCheckoutDraft({ buyerName: name.trim(), buyerContact: contact.trim() })
    if (!parsed.success) {
      const e: { name?: string; contact?: string } = {}
      for (const issue of parsed.error.issues) {
        const p = issue.path[0]
        if (p === 'buyerName') e.name = 'Informe seu nome.'
        if (p === 'buyerContact') e.contact = 'Informe um contato válido (mín. 3 caracteres).'
      }
      setErrors(e)
      return
    }

    const total = cartTotalBrl(orderLines)
    const { fullText, textForWaMeUrl, truncatedForUrl } = buildOrderMessage({
      buyerName: parsed.data.buyerName,
      buyerContact: parsed.data.buyerContact,
      lines: orderLines,
      totalBrl: total,
    })

    const waUrl = waMeUrl(whatsappE164, textForWaMeUrl)
    setLastMessage({ fullText, waUrl, truncated: truncatedForUrl })

    const open = () => {
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    }

    try {
      open()
    } catch {
      setCopyHint('Abra o link abaixo ou copie a mensagem.')
    }

    try {
      void navigator.clipboard.writeText(fullText)
      setCopyHint((h) => h ?? 'Mensagem copiada. Se o WhatsApp não abrir, cole no aplicativo.')
    } catch {
      setCopyHint('Copie a mensagem manualmente na caixa abaixo.')
    }

    clear()
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignore */
    }
  }, [name, contact, orderLines, whatsappE164, clear])

  if (lines.length === 0 && !lastMessage) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-semibold">Checkout</h1>
        <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
          <p className="text-muted-foreground">
            Não há itens para enviar. Adicione produtos ao carrinho.
          </p>
          <Link
            href="/browse"
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Ver ambientes
          </Link>
        </div>
      </div>
    )
  }

  if (lines.length === 0 && lastMessage) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-semibold">Pedido</h1>
        {copyHint && <p className="mb-3 text-sm text-muted-foreground">{copyHint}</p>}
        {lastMessage.truncated && (
          <p className="mb-3 text-sm text-amber-700 dark:text-amber-400">
            A mensagem enviada ao WhatsApp pode estar abreviada. Use o texto completo abaixo se
            necessário.
          </p>
        )}
        <a
          href={lastMessage.waUrl}
          target="_blank"
          rel="noreferrer"
          className="mb-4 inline-block rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
        >
          Abrir WhatsApp de novo
        </a>
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-muted/40 p-4 text-xs">
          {lastMessage.fullText}
        </pre>
      </div>
    )
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:items-start lg:gap-8 xl:gap-10">
      <div className="min-w-0">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight md:text-3xl">Checkout</h1>
        <p className="mb-6 text-sm text-muted-foreground md:text-base">
          Informe seus dados para montarmos a mensagem no WhatsApp. Nada disso fica salvo nos nossos
          servidores.
        </p>
        <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
          <div>
            <label htmlFor="buyerName" className="mb-1 block text-sm font-medium">
              Nome completo
            </label>
            <input
              id="buyerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              autoComplete="name"
            />
            {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="buyerContact" className="mb-1 block text-sm font-medium">
              Telefone ou outro contato
            </label>
            <input
              id="buyerContact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              autoComplete="tel"
            />
            {errors.contact && <p className="mt-1 text-sm text-destructive">{errors.contact}</p>}
          </div>
          <button
            type="button"
            onClick={submit}
            className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground shadow-sm motion-safe:transition-transform motion-safe:active:scale-[0.99]"
          >
            Abrir WhatsApp com o pedido
          </button>
        </div>
      </div>

      <aside className="mt-8 min-w-0 rounded-xl border border-border bg-muted/35 p-4 shadow-sm lg:sticky lg:top-28 lg:mt-0">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Resumo</h2>
        <ul className="mb-4 max-h-64 space-y-2 overflow-auto text-sm text-muted-foreground">
          {lines.map((l) => (
            <li key={l.productId} className="flex justify-between gap-2">
              <span className="min-w-0 truncate">
                {l.title} <span className="text-muted-foreground/80">×{l.quantity}</span>
              </span>
              <FlowNumber
                className="shrink-0 tabular-nums text-foreground"
                format={{ style: 'currency', currency: 'BRL' }}
                value={l.quantity * l.unitPriceBrl}
              />
            </li>
          ))}
        </ul>
        <p className="border-t border-border pt-3 text-base font-semibold text-foreground">
          Total: <FlowNumber format={{ style: 'currency', currency: 'BRL' }} value={previewTotal} />
        </p>
      </aside>
    </div>
  )
}
