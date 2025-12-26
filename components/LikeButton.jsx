'use client';

import { useEffect, useState } from 'react';
import { useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/contract';

export default function LikeButton({ author }) {
  const { data: walletClient } = useWalletClient();
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔁 Load real on-chain likes
  useEffect(() => {
    fetchLikes();
  }, [author]);

  async function fetchLikes() {
    try {
      const provider = new ethers.JsonRpcProvider(
        'https://base-mainnet.public.blastapi.io'
      );

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      const message = await contract.messages(author);
      setLikes(Number(message.likes));
    } catch (err) {
      console.error('Failed to fetch likes:', err);
    }
  }

  async function like() {
    if (!walletClient) return;

    const previousLikes = likes;

    // 🚀 optimistic update
    setLikes(previousLikes + 1);
    setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.likeMessage(author);
      await tx.wait();
    } catch (err) {
      // ❌ rollback on failure
      setLikes(previousLikes);
      console.error('Like failed:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={like}
      disabled={loading}
      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 disabled:opacity-50"
    >
      ❤️ {likes}
    </button>
  );
}