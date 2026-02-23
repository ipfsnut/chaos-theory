import { LINKS } from '@/utils/constants'

export function Footer() {
  return (
    <footer className="site-footer">
      <a href={LINKS.arbme} target="_blank" rel="noopener noreferrer">ArbMe</a>
      <a href={LINKS.flaunch} target="_blank" rel="noopener noreferrer">Flaunch</a>
      <a href={LINKS.moltlaunch} target="_blank" rel="noopener noreferrer">MoltLaunch</a>
      <a href={LINKS.warpcast} target="_blank" rel="noopener noreferrer">Farcaster</a>
      <a href={LINKS.basescan} target="_blank" rel="noopener noreferrer">Basescan</a>
      <a href={LINKS.multisig} target="_blank" rel="noopener noreferrer">Foundation Safe</a>
      <a href={LINKS.agentDocs} target="_blank" rel="noopener noreferrer">Agent Docs</a>
    </footer>
  )
}
