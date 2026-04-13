'use client'

import { LayoutGrid, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useNavVisibility } from '@/components/storefront/NavVisibilityProvider'
import { cn } from '@/lib/utils'

const itemClass =
  'flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium text-muted-foreground transition-colors motion-safe:transition-transform'

export function BottomNav() {
  const pathname = usePathname()
  const { navVisible } = useNavVisibility()

  if (!navVisible) return null

  const browseActive = pathname === '/browse' || pathname === '/'
  const cartActive = pathname === '/cart'

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md"
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around gap-1">
        <Link
          href="/browse"
          className={cn(itemClass, browseActive && 'text-primary')}
          prefetch={true}
        >
          <LayoutGrid className="size-6 shrink-0" aria-hidden />
          Ambientes
        </Link>
        <Link href="/cart" className={cn(itemClass, cartActive && 'text-primary')} prefetch={true}>
          <ShoppingCart className="size-6 shrink-0" aria-hidden />
          Carrinho
        </Link>
      </div>
    </nav>
  )
}
