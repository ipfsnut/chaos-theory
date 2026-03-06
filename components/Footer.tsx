import { LINKS } from '@/utils/constants'

export function Footer() {
  return (
    <footer className="site-footer">
      <a href={LINKS.arbme} target="_blank" rel="noopener noreferrer">ArbMe</a>
      <a href={LINKS.flaunch} target="_blank" rel="noopener noreferrer">Flaunch</a>
      <a href={LINKS.warpcast} target="_blank" rel="noopener noreferrer">Farcaster</a>
      <a href={LINKS.basescan} target="_blank" rel="noopener noreferrer">Basescan</a>
      <a href={LINKS.safe} target="_blank" rel="noopener noreferrer">Treasury Safe</a>
    </footer>
  )
}
