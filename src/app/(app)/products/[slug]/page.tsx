import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AddToCartSection } from '@/components/storefront/AddToCartSection'
import { ProductGallery } from '@/components/storefront/ProductGallery'
import {
  conditionLabels,
  getPublicSiteUrl,
  getPublishedProductBySlug,
  mediaSrc,
} from '@/lib/payload/storefront'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getPublishedProductBySlug(slug)
  if (!product) return { title: 'Produto' }
  const base = getPublicSiteUrl()
  const url = `${base}/products/${slug}`
  return {
    title: product.title,
    description: product.shortDescription,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: `${product.title} · Bazar Lima Basilio`,
      description: product.shortDescription,
      url,
      type: 'website',
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getPublishedProductBySlug(slug)
  if (!product) notFound()

  const room = typeof product.room === 'object' && product.room ? product.room : null
  const slides = product.gallery
    ?.map((g) => {
      const m = typeof g.file === 'object' && g.file ? g.file : null
      const src = mediaSrc(m)
      if (!src) return null
      return { src, alt: product.title }
    })
    .filter(Boolean) as { src: string; alt: string }[]

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,24rem)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,26rem)] xl:gap-10">
      <div className="min-w-0">
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link href="/browse" className="underline-offset-2 hover:underline">
            Ambientes
          </Link>
          {room && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/rooms/${room.slug}`} className="underline-offset-2 hover:underline">
                {room.title}
              </Link>
            </>
          )}
        </nav>

        <ProductGallery slides={slides} productTitle={product.title} />
      </div>

      <div className="mt-6 min-w-0 space-y-4 lg:sticky lg:top-28 lg:mt-0">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold leading-tight md:text-3xl">{product.title}</h1>
          <p className="text-lg font-medium text-primary">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              product.price,
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            Estado: {conditionLabels[product.condition]}
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {product.shortDescription}
          </p>
        </div>

        {(product.notesDimensions || product.notesBrand || product.notesYear) && (
          <section className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
            <h2 className="mb-2 font-medium text-foreground">Detalhes</h2>
            <ul className="space-y-1 text-muted-foreground">
              {product.notesDimensions ? <li>Dimensões: {product.notesDimensions}</li> : null}
              {product.notesBrand ? <li>Marca: {product.notesBrand}</li> : null}
              {product.notesYear ? <li>Ano: {product.notesYear}</li> : null}
            </ul>
          </section>
        )}

        <AddToCartSection
          maxPurchaseQty={typeof product.maxPurchaseQty === 'number' ? product.maxPurchaseQty : 99}
          productId={String(product.id)}
          slug={product.slug}
          title={product.title}
          unitPriceBrl={product.price}
        />
      </div>
    </div>
  )
}
