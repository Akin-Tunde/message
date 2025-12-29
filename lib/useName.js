'use client';
import { useEnsName } from 'wagmi';

// Safely resolve ENS names and fall back to a truncated address or a placeholder
export function useDisplayName(address) {
  const isValidAddress = typeof address === 'string' && /^0x[a-fA-F0-9]{40}$/.test(address);

  // Only pass a valid address to useEnsName to avoid unnecessary calls
  const { data: ens } = useEnsName({ address: isValidAddress ? address : undefined });

  if (ens) return ens;

  if (!isValidAddress) {
    // If address is undefined or malformed, return a readable placeholder
    return address ?? 'Unknown';
  }

  // Truncate a valid address for display
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}