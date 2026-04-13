import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  getPublicSiteUrl,
  getPublishedRoomBySlug,
  listPublishedProductsForRoom,
  mediaSrc,
} from '@/lib/payload/storefront'
import { formatBrl } from '@/lib/whatsapp/formatBrl'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const room = await getPublishedRoomBySlug(slug)
  if (!room) return { title: 'Ambiente' }
  const base = getPublicSiteUrl()
  const url = `${base}/rooms/${slug}`
  return {
    title: room.title,
    alternates: { canonical: `/rooms/${slug}` },
    openGraph: { title: `${room.title} · Bazar Lima Basilio`, url },
  }
}

export default async function RoomPage({ params }: Props) {
  const { slug } = await params
  const room = await getPublishedRoomBySlug(slug)
  if (!room) notFound()

  const products = await listPublishedProductsForRoom(room.id)

  return (
    <div>
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href="/browse" className="underline-offset-2 hover:underline">
          Ambientes
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{room.title}</span>
      </nav>
      <h1 className="mb-4 text-2xl font-semibold">{room.title}</h1>
      {products.length === 0 ? (
        <p className="text-muted-foreground">Nenhum produto neste ambiente no momento.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {products.map((p, i) => {
            const first = p.gallery?.[0]?.file
            const media = typeof first === 'object' && first ? first : null
            const src = mediaSrc(media)
            return (
              <li key={p.id}>
                <Link
                  href={`/products/${p.slug}`}
                  className="block overflow-hidden rounded-xl border border-border bg-card shadow-sm motion-safe:transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-square bg-muted">
                    {src ? (
                      <Image
                        src={src}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 14rem"
                        loading={i < 4 ? 'eager' : 'lazy'}
                        priority={i < 2}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        Sem foto
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-medium leading-snug">{p.title}</p>
                    <p className="mt-1 text-sm font-semibold text-primary">{formatBrl(p.price)}</p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
