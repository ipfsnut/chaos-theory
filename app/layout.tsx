import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ChaosTheory — CHAOS Rails Infrastructure',
    template: '%s | ChaosTheory',
  },
  description: 'Stake $CHAOS once, earn 7 tokens. Infrastructure for moving price information across Ethereum via arbitrage surfaces and the Progressive Bid Wall.',
  openGraph: {
    title: 'ChaosTheory — CHAOS Rails Infrastructure',
    description: 'Stake $CHAOS once, earn 7 tokens. 180-day rolling streams from LP fees across 7 CHAOS pairs on Base.',
    url: 'https://chaos-theory.epicdylan.com',
    siteName: 'ChaosTheory',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'ChaosTheory — CHAOS Rails Infrastructure',
    description: 'Stake $CHAOS once, earn 7 tokens. Infrastructure for moving price information across Ethereum.',
  },
  other: {
    'application-name': 'ChaosTheory',
  },
}

// JSON-LD structured data for machine readability
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ChaosTheory',
  url: 'https://chaos-theory.epicdylan.com',
  description: 'Infrastructure for moving price information across Ethereum. Stake $CHAOS, earn 7 tokens via 180-day rolling LP fee streams.',
  applicationCategory: 'DeFi',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    description: 'CHAOS staking with multi-token rewards',
    price: '0',
    priceCurrency: 'USD',
  },
  creator: {
    '@type': 'Organization',
    name: 'ChaosTheory Foundation',
    url: 'https://abc-alpha.epicdylan.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <div className="app">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
