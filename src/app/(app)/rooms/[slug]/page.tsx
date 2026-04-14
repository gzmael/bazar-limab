import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductCard } from '@/components/storefront/ProductCard'
import {
  getPublicSiteUrl,
  getPublishedRoomBySlug,
  listPublishedProductsForRoom,
  mediaSrc,
} from '@/lib/payload/storefront'

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
      <h1 className="mb-2 text-2xl font-semibold tracking-tight md:text-3xl">{room.title}</h1>
      <p className="mb-6 text-sm text-muted-foreground md:text-base">
        Produtos publicados neste ambiente.
      </p>
      {products.length === 0 ? (
        <p className="text-muted-foreground">Nenhum produto neste ambiente no momento.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => {
            const first = p.gallery?.[0]?.file
            const media = typeof first === 'object' && first ? first : null
            const src = mediaSrc(media)
            return (
              <li key={p.id}>
                <ProductCard
                  familyPick={Boolean(p.familyPick)}
                  href={`/products/${p.slug}`}
                  imageSrc={src}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  price={p.price}
                  priority={i < 2}
                  title={p.title}
                />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
