'use client';
import { useEnsName } from 'wagmi';

export function useDisplayName(address) {
  const { data: ens } = useEnsName({ address });
  return ens ?? `${address.slice(0, 6)}…${address.slice(-4)}`;
}