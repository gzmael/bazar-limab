import { FeaturedProducts } from '@/components/storefront/FeaturedProducts'
import { RoomsCarousel } from '@/components/storefront/RoomsCarousel'
import { listFeaturedProducts, listPublishedRooms, mediaSrc } from '@/lib/payload/storefront'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let rooms: Awaited<ReturnType<typeof listPublishedRooms>> = []
  let featured: Awaited<ReturnType<typeof listFeaturedProducts>> = []
  try {
    ;[rooms, featured] = await Promise.all([listPublishedRooms(), listFeaturedProducts()])
  } catch {
    /* Payload indisponível (ex.: build) */
  }

  const roomItems = rooms.map((r) => {
    const icon = typeof r.icon === 'object' && r.icon ? r.icon : null
    return {
      id: r.id,
      title: r.title,
      slug: r.slug,
      iconUrl: mediaSrc(icon),
    }
  })

  const featuredItems = featured.map((p) => {
    const first = p.gallery?.[0]?.file
    const file = typeof first === 'object' && first ? first : null
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      shortDescription: p.shortDescription,
      price: p.price,
      maxPurchaseQty: typeof p.maxPurchaseQty === 'number' ? p.maxPurchaseQty : 99,
      imageSrc: mediaSrc(file),
      familyPick: Boolean(p.familyPick),
    }
  })

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Ambientes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha um ambiente para explorar o catálogo.
          </p>
        </div>
        <RoomsCarousel rooms={roomItems} />
      </section>
      <section className="space-y-3">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Destaques
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Peças selecionadas para você.</p>
        </div>
        <FeaturedProducts products={featuredItems} />
      </section>
    </div>
  )
}
