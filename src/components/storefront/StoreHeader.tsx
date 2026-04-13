import Link from 'next/link'

type Props = {
  title?: string | null
}

export function StoreHeader({ title }: Props) {
  const display = title?.trim() || 'Bazar Lima Basilio'
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-center px-4">
        <Link
          href="/browse"
          className="text-lg font-semibold tracking-tight text-foreground motion-safe:transition-opacity hover:opacity-90"
        >
          {display}
        </Link>
      </div>
    </header>
  )
}
