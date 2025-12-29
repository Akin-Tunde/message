'use client';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// Runtime warning to surface misconfiguration during development.
if (typeof window !== 'undefined') {
  if (!WALLETCONNECT_PROJECT_ID || WALLETCONNECT_PROJECT_ID === 'YOUR_ID') {
    // eslint-disable-next-line no-console
    console.warn('[wagmi] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect may not work correctly. Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your .env');
  }
}

export const wagmiConfig = getDefaultConfig({
  appName: 'Base Message Board',
  projectId: WALLETCONNECT_PROJECT_ID || 'YOUR_ID',
  chains: [base],
  ssr: true,
});
