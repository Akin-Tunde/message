'use client';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Base Message Board',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_ID',
  chains: [base],
  ssr: true,
});
