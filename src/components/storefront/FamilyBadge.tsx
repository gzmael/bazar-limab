import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

/** Semantic “Família” chip when `familyPick` is enabled (FR-013 tokens). */
export function FamilyBadge({ className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground',
        className,
      )}
    >
      Família
    </span>
  )
}
