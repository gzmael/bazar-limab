import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

/** Selo “Vendido” (vermelho, texto branco) para produtos com status vendido. */
export function SoldBadge({ className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive-foreground',
        className,
      )}
    >
      Vendido
    </span>
  )
}
