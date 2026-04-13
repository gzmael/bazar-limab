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
      <StorefrontAccent />
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">Escolha um ambiente</h1>
      {rooms.length === 0 ? (
        <p className="text-muted-foreground">Nenhum ambiente publicado ainda. Volte em breve.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {rooms.map((room) => (
            <li key={room.id}>
              <Link
                href={`/rooms/${room.slug}`}
                className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border border-border bg-card p-4 text-center text-sm font-medium shadow-sm motion-safe:transition-shadow hover:shadow-md"
              >
                {room.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
