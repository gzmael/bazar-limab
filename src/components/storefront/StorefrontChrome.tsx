'use client'

import type { ReactNode } from 'react'

import { BottomNav } from '@/components/storefront/BottomNav'
import { StoreHeader } from '@/components/storefront/StoreHeader'

type Props = {
  storefrontTitle: string | null
  children: ReactNode
}

export function StorefrontChrome({ storefrontTitle, children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col">
      <StoreHeader title={storefrontTitle} />
      <div className="mx-auto w-full max-w-lg flex-1 px-4 pb-28 pt-4">{children}</div>
      <BottomNav />
    </div>
  )
}
