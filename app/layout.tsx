import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://chaos-theory.epicdylan.com'),
  title: {
    default: 'Chaos Theory — $CHAOSLP',
    template: '%s | Chaos Theory',
  },
  description: 'Home of $CHAOSLP. High-risk coordination asset for ArbMe. Stake it or LP it. Earn from three pools on Base.',
  openGraph: {
    title: 'Chaos Theory — $CHAOSLP',
    description: 'Home of $CHAOSLP. High-risk coordination asset for ArbMe. Stake it or LP it. Earn from three pools on Base.',
    url: 'https://chaos-theory.epicdylan.com',
    siteName: 'Chaos Theory',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Chaos Theory — $CHAOSLP',
    description: 'Home of $CHAOSLP. High-risk coordination asset for ArbMe. Stake it or LP it. Earn from three pools on Base.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Chaos Theory',
  url: 'https://chaos-theory.epicdylan.com',
  description: 'Home of $CHAOSLP. High-risk coordination asset for ArbMe. Hold chaos, swap for deals during market turbulence.',
  applicationCategory: 'DeFi',
  operatingSystem: 'Web',
  creator: {
    '@type': 'Organization',
    name: 'Chaos Theory',
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
