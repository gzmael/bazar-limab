import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import type { ReactNode } from 'react'
import { NavVisibilityProvider } from '@/components/storefront/NavVisibilityProvider'
import { SalesProvider } from '@/components/storefront/SalesProvider'
import { StorefrontChrome } from '@/components/storefront/StorefrontChrome'
import { CartProvider } from '@/lib/cart/CartProvider'
import { getPublicSiteUrl, readSalesGlobal } from '@/lib/payload/storefront'
import { cn } from '@/lib/utils'

import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
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

  return (
    <html lang="pt-BR">
      <body className={cn('min-h-dvh bg-background font-sans antialiased', fontSans.variable)}>
        <NavVisibilityProvider>
          <SalesProvider value={salesPayload}>
            <CartProvider>
              <StorefrontChrome storefrontTitle={salesPayload.storefrontTitle}>
                {children}
              </StorefrontChrome>
            </CartProvider>
          </SalesProvider>
        </NavVisibilityProvider>
      </body>
    </html>
  )
}
