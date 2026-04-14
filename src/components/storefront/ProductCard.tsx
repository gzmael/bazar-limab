import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { FamilyBadge } from '@/components/storefront/FamilyBadge'
import { FlowNumber } from '@/components/storefront/FlowNumber'
import { cn } from '@/lib/utils'

type Props = {
  href: string
  title: string
  imageSrc: string | null
  price: number
  familyPick?: boolean
  /** One-line teaser (e.g. featured section). */
  shortDescription?: string
  sizes?: string
  priority?: boolean
  loading?: 'eager' | 'lazy'
  /** Extra row below price (e.g. featured “Adicionar ao carrinho”). */
  footer?: ReactNode
  className?: string
}

/**
 * Listing card with Border Glow–style hover ring (FR-011, token-backed gradients).
 */
export function ProductCard({
  href,
  title,
  imageSrc,
  price,
  familyPick,
  shortDescription,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  priority,
  loading,
  footer,
  className,
}: Props) {
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col rounded-2xl p-px',
        'bg-linear-to-br from-primary/30 via-chart-2/15 to-chart-3/25',
        'shadow-sm motion-safe:transition-[box-shadow,filter] motion-safe:duration-200',
        'hover:shadow-md focus-within:shadow-md',
        className,
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-[0.5px]',
          'bg-linear-to-br from-ring/40 via-primary/20 to-chart-4/30',
          'motion-safe:transition-opacity',
          'group-hover:opacity-100 group-focus-within:opacity-100',
        )}
        aria-hidden
      />
      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)-1px)] bg-card shadow-sm ring-1 ring-border/80">
        <Link href={href} className="block min-h-0 flex-1">
          <div className="relative aspect-square bg-muted">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-cover"
                sizes={sizes}
                priority={priority}
                loading={loading}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Sem foto
              </div>
            )}
            {familyPick ? (
              <span className="absolute left-2 top-2">
                <FamilyBadge />
              </span>
            ) : null}
          </div>
          <div className="p-3">
            <p className="line-clamp-2 text-sm font-medium leading-snug text-card-foreground">
              {title}
            </p>
            {shortDescription ? (
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{shortDescription}</p>
            ) : null}
            <p className="mt-1 text-sm font-semibold text-primary">
              <FlowNumber format={{ style: 'currency', currency: 'BRL' }} value={price} />
            </p>
          </div>
        </Link>
        {footer ? <div className="border-t border-border px-3 pb-3 pt-2">{footer}</div> : null}
      </div>
    </article>
  )
}
