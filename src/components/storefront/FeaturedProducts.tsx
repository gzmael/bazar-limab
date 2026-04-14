'use client'

import { useState } from 'react'

import { ProductCard } from '@/components/storefront/ProductCard'
import { useCart } from '@/lib/cart/CartProvider'

export type FeaturedProductItem = {
  id: number
  title: string
  slug: string
  shortDescription: string
  price: number
  maxPurchaseQty: number
  imageSrc: string | null
  familyPick: boolean
}

type Props = {
  products: FeaturedProductItem[]
}

export function FeaturedProducts({ products }: Props) {
  if (products.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum produto em destaque no momento.</p>
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <li key={p.id}>
          <FeaturedCard product={p} />
        </li>
      ))}
    </ul>
  )
}

function FeaturedCard({ product }: { product: FeaturedProductItem }) {
  const { addLine } = useCart()
  const [added, setAdded] = useState(false)

  return (
    <ProductCard
      familyPick={product.familyPick}
      footer={
        <button
          type="button"
          className="w-full rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground motion-safe:active:scale-[0.99]"
          onClick={() => {
            addLine({
              productId: String(product.id),
              quantity: 1,
              unitPriceBrl: product.price,
              title: product.title,
              slug: product.slug,
              maxPurchaseQty: product.maxPurchaseQty,
            })
            setAdded(true)
            window.setTimeout(() => setAdded(false), 2000)
          }}
        >
          {added ? 'Adicionado!' : 'Adicionar ao carrinho'}
        </button>
      }
      href={`/products/${product.slug}`}
      imageSrc={product.imageSrc}
      price={product.price}
      shortDescription={product.shortDescription}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      title={product.title}
    />
  )
}
