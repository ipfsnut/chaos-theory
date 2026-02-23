'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletButton } from './WalletButton'

const NAV_LINKS = [
  { href: '/whitepaper', label: 'Whitepaper' },
  { href: '/docs', label: 'Docs' },
  { href: '/blog', label: 'Blog' },
  { href: '/stake', label: 'Stake' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="site-header">
      <Link href="/" className="site-logo">
        <Image src="/chaos-icon.png" alt="ChaosTheory" width={36} height={36} style={{ borderRadius: '50%' }} />
        <h1>Chaos<span className="logo-dot">Theory</span></h1>
      </Link>
      <nav className="site-nav">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={pathname === href ? 'active' : ''}
          >
            {label}
          </Link>
        ))}
        <WalletButton />
      </nav>
    </header>
  )
}
