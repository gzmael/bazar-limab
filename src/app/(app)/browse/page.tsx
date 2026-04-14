import type { Metadata } from 'next'
import Link from 'next/link'

import { StorefrontAccent } from '@/components/bits/StorefrontAccent'
import { listPublishedRooms } from '@/lib/payload/storefront'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Ambientes',
  alternates: { canonical: '/browse' },
  openGraph: { title: 'Ambientes · Bazar Lima Basilio', url: '/browse' },
}

export default async function BrowsePage() {
  const rooms = await listPublishedRooms()

  return (
    <div className="relative">
      <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 shadow-sm sm:p-6 md:p-8">
        <StorefrontAccent />
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Escolha um ambiente
        </h1>
        <p className="mb-6 max-w-xl text-sm text-muted-foreground md:text-base">
          Toque em um ambiente para ver o catálogo de produtos.
        </p>
        {rooms.length === 0 ? (
          <p className="text-muted-foreground">Nenhum ambiente publicado ainda. Volte em breve.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
            {rooms.map((room) => (
              <li key={room.id}>
                <Link
                  href={`/rooms/${room.slug}`}
                  className="flex aspect-4/3 flex-col items-center justify-center rounded-xl border border-border bg-card p-3 text-center text-sm font-medium text-card-foreground shadow-sm ring-1 ring-border/60 motion-safe:transition-[box-shadow,transform] motion-safe:duration-200 hover:shadow-md hover:ring-primary/20 sm:p-4"
                >
                  {room.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
