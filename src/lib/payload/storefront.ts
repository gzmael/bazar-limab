import config from '@payload-config'
import { getPayload } from 'payload'
import type { Media, Product, Room, SalesChannel } from '@/payload-types'

const locale = 'pt-BR' as const

export async function getPayloadInstance() {
  return getPayload({ config })
}

export function getPublicSiteUrl() {
  return (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
}

/**
 * URL for a Media record for `next/image`.
 * Same-origin URLs are returned as paths (`/api/media/...`) so optimization uses `images.localPatterns`.
 */
export function mediaSrc(media: Media | null | undefined): string | null {
  if (!media?.url) return null
  const u = media.url.trim()
  const base = getPublicSiteUrl()

  if (u.startsWith('http://') || u.startsWith('https://')) {
    try {
      const parsed = new URL(u)
      const origin = new URL(base.endsWith('/') ? base : `${base}/`).origin
      if (parsed.origin === origin) {
        const path = `${parsed.pathname}${parsed.search}`
        return path || '/'
      }
    } catch {
      /* fall through */
    }
    return u
  }

  return u.startsWith('/') ? u : `/${u}`
}

export async function listPublishedRooms(): Promise<Room[]> {
  const payload = await getPayloadInstance()
  const { docs } = await payload.find({
    collection: 'rooms',
    where: { storeStatus: { equals: 'published' } },
    sort: 'sort',
    depth: 1,
    locale,
    limit: 100,
  })
  return docs
}

export async function getPublishedRoomBySlug(slug: string): Promise<Room | null> {
  const payload = await getPayloadInstance()
  const { docs } = await payload.find({
    collection: 'rooms',
    where: {
      and: [{ slug: { equals: slug } }, { storeStatus: { equals: 'published' } }],
    },
    limit: 1,
    locale,
  })
  return docs[0] ?? null
}

export async function listFeaturedProducts(): Promise<Product[]> {
  const payload = await getPayloadInstance()
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      and: [{ storeStatus: { equals: 'published' } }, { featured: { equals: true } }],
    },
    sort: 'sort',
    depth: 2,
    locale,
    limit: 48,
  })
  return docs.filter((p) => {
    const room = typeof p.room === 'object' && p.room ? p.room : null
    return room?.storeStatus === 'published'
  })
}

export async function listPublishedProductsForRoom(roomId: number): Promise<Product[]> {
  const payload = await getPayloadInstance()
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      and: [{ room: { equals: roomId } }, { storeStatus: { equals: 'published' } }],
    },
    sort: 'sort',
    depth: 2,
    locale,
    limit: 500,
  })
  return docs
}

export async function getPublishedProductBySlug(slug: string): Promise<Product | null> {
  const payload = await getPayloadInstance()
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      and: [{ slug: { equals: slug } }, { storeStatus: { equals: 'published' } }],
    },
    limit: 1,
    depth: 2,
    locale,
  })
  const p = docs[0]
  if (!p) return null
  const room = typeof p.room === 'object' && p.room ? p.room : null
  if (!room || room.storeStatus !== 'published') return null
  return p
}

export async function readSalesGlobal(): Promise<SalesChannel> {
  const payload = await getPayloadInstance()
  const doc = await payload.findGlobal({
    slug: 'sales-channel',
    locale,
  })
  return doc as SalesChannel
}

export const conditionLabels: Record<Product['condition'], string> = {
  novo: 'Novo',
  seminovo: 'Seminovo',
  usado: 'Usado',
  usado_bom: 'Usado — bom estado',
}
