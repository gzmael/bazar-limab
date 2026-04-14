'use client'

import { ChevronDown, LayoutGrid, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { DropdownMenu } from 'radix-ui'
import { useMemo } from 'react'

import { FlowNumber } from '@/components/storefront/FlowNumber'
import { useCart } from '@/lib/cart/CartProvider'
import { cn } from '@/lib/utils'

export type StoreHeaderRoom = {
  id: number
  title: string
  slug: string
}

type Props = {
  title?: string | null
  rooms?: StoreHeaderRoom[]
}

const MAX_ROOM_LINKS = 3

function CartBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute -right-0.5 -top-0.5 flex min-h-[1.15rem] min-w-[1.15rem] justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-tight text-primary-foreground">
      {count > 99 ? '99+' : <FlowNumber className="tabular-nums" value={count} />}
    </span>
  )
}

export function StoreHeader({ title, rooms = [] }: Props) {
  const display = title?.trim() || 'Bazar Lima Basilio'
  const { cart } = useCart()

  const badgeCount = useMemo(() => cart.lines.reduce((sum, l) => sum + l.quantity, 0), [cart.lines])

  const visibleRooms = rooms.slice(0, MAX_ROOM_LINKS)
  const showRoomMenu = rooms.length > MAX_ROOM_LINKS

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 shadow-sm backdrop-blur-xl supports-backdrop-filter:bg-background/75">
      <div className="chart-token-strip flex h-1 w-full" aria-hidden>
        <span className="min-h-px flex-1 bg-chart-1" />
        <span className="min-h-px flex-1 bg-chart-2" />
        <span className="min-h-px flex-1 bg-chart-3" />
        <span className="min-h-px flex-1 bg-chart-4" />
        <span className="min-h-px flex-1 bg-chart-5" />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="flex min-h-11 items-center justify-center md:justify-start gap-8">
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight text-foreground motion-safe:transition-opacity hover:opacity-90"
          >
            {display}
          </Link>
          <nav
            className="hidden min-h-11 flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm md:flex"
            aria-label="Ambientes e carrinho"
          >
            {visibleRooms.map((r) => (
              <Link
                key={r.id}
                href={`/rooms/${r.slug}`}
                className="text-muted-foreground motion-safe:transition-colors hover:text-foreground"
              >
                {r.title}
              </Link>
            ))}
            {showRoomMenu ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger
                  className={cn(
                    'inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-muted-foreground outline-none',
                    'hover:bg-muted/60 hover:text-foreground',
                    'focus-visible:ring-2 focus-visible:ring-ring',
                  )}
                >
                  Todos os ambientes
                  <ChevronDown className="size-4" aria-hidden />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    className="z-50 min-w-48 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
                    sideOffset={6}
                  >
                    {rooms.map((r) => (
                      <DropdownMenu.Item key={r.id} asChild>
                        <Link
                          className="block cursor-pointer rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-muted"
                          href={`/rooms/${r.slug}`}
                        >
                          {r.title}
                        </Link>
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : null}
          </nav>
        </div>
        <Link
          href="/cart"
          className="hidden relative md:inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={`Carrinho${badgeCount > 0 ? `, ${badgeCount} itens` : ''}`}
        >
          <ShoppingCart className="size-6" aria-hidden />
          <CartBadge count={badgeCount} />
        </Link>

        <div className="flex items-center justify-center gap-4 md:hidden">
          <Link
            href="/browse"
            className={cn(
              'inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted-foreground',
              'hover:bg-muted hover:text-foreground',
            )}
            aria-label="Ambientes"
          >
            <LayoutGrid className="size-6" />
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Carrinho${badgeCount > 0 ? `, ${badgeCount} itens` : ''}`}
          >
            <ShoppingCart className="size-6" />
            <CartBadge count={badgeCount} />
          </Link>
        </div>
      </div>
    </header>
  )
}
