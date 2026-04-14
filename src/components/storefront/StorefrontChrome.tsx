'use client'

import type { ReactNode } from 'react'

import { StoreHeader, type StoreHeaderRoom } from '@/components/storefront/StoreHeader'

type Props = {
  storefrontTitle: string | null
  rooms?: StoreHeaderRoom[]
  children: ReactNode
}

export function StorefrontChrome({ storefrontTitle, rooms = [], children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col">
      <StoreHeader title={storefrontTitle} rooms={rooms} />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-4">{children}</div>
    </div>
  )
}
