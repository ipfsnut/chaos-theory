import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';

const { wallets } = getDefaultWallets();

const connectors = connectorsForWallets(wallets, {
  appName: 'ChaosTheory',
  projectId: '2efb2aeae04a72cb733a24ae9efaaf0e',
});

export const wagmiConfig = createConfig({
  chains: [base],
  connectors,
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});
