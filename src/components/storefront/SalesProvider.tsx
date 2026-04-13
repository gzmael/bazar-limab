'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

export type SalesPayload = {
  whatsappE164: string
  displayCurrency: string
  storefrontTitle: string | null
}

const SalesContext = createContext<SalesPayload | null>(null)

export function SalesProvider({ value, children }: { value: SalesPayload; children: ReactNode }) {
  const memo = useMemo(() => value, [value])
  return <SalesContext.Provider value={memo}>{children}</SalesContext.Provider>
}

export function useSales() {
  const ctx = useContext(SalesContext)
  if (!ctx) throw new Error('useSales requires SalesProvider')
  return ctx
}
