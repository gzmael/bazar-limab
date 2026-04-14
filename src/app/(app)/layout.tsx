import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Work_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { NavVisibilityProvider } from '@/components/storefront/NavVisibilityProvider'
import { SalesProvider } from '@/components/storefront/SalesProvider'
import { StorefrontChrome } from '@/components/storefront/StorefrontChrome'
import { CartProvider } from '@/lib/cart/CartProvider'
import { getPublicSiteUrl, listPublishedRooms, readSalesGlobal } from '@/lib/payload/storefront'
import { cn } from '@/lib/utils'

import './globals.css'

const fontSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontDisplay = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
})

const base = getPublicSiteUrl()

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: 'Bazar Lima Basilio',
    template: '%s · Bazar Lima Basilio',
  },
  description: 'Catálogo da família — ambientes, produtos e pedido pelo WhatsApp.',
  robots: { index: true, follow: true },
  openGraph: {
    locale: 'pt_BR',
    siteName: 'Bazar Lima Basilio',
    type: 'website',
  },
}

type LayoutProps = {
  children: ReactNode
}

export default async function AppLayout({ children }: LayoutProps) {
  let salesPayload = {
    whatsappE164: '+5511999999999',
    displayCurrency: 'BRL',
    storefrontTitle: null as string | null,
  }
  try {
    const sales = await readSalesGlobal()
    salesPayload = {
      whatsappE164: sales.whatsappE164,
      displayCurrency: sales.displayCurrency,
      storefrontTitle: sales.storefrontTitle ?? null,
    }
  } catch {
    /* Global ainda não configurado ou banco indisponível (ex.: build) */
  }

  let headerRooms: { id: number; title: string; slug: string }[] = []
  try {
    const rooms = await listPublishedRooms()
    headerRooms = rooms.map((r) => ({ id: r.id, title: r.title, slug: r.slug }))
  } catch {
    /* Mesmo tratamento que leituras Payload no layout */
  }

  return (
    <html lang="pt-BR">
      <body
        className={cn(
          'min-h-dvh bg-background font-sans antialiased',
          fontSans.variable,
          fontDisplay.variable,
        )}
      >
        <NavVisibilityProvider>
          <SalesProvider value={salesPayload}>
            <CartProvider>
              <StorefrontChrome storefrontTitle={salesPayload.storefrontTitle} rooms={headerRooms}>
                {children}
              </StorefrontChrome>
            </CartProvider>
          </SalesProvider>
        </NavVisibilityProvider>
      </body>
    </html>
  )
}
