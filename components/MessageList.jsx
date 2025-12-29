'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/contract';
import LikeButton from './LikeButton';

// Default RPC and deployment constants can be overridden via env vars
const DEFAULT_RPC = 'https://base-mainnet.public.blastapi.io';
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || DEFAULT_RPC;
const DEPLOYMENT_BLOCK = Number(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK || 39908272);

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    setError(null);

    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // Fetch MessageCreated events from deployment block to latest
      const events = await contract.queryFilter(
        contract.filters.MessageCreated(),
        DEPLOYMENT_BLOCK,
        'latest'
      );

      // Build messages map by id and then fetch full on-chain message details
      const ids = Array.from(new Set(events.map((e) => Number(e.args?.id ?? e.args?._id ?? 0)))).filter(Boolean);

      const fetched = [];
      for (const id of ids) {
        try {
          const m = await contract.getMessage(id);
          fetched.push({
            id: Number(m.id ?? id),
            author: m.author,
            text: m.text,
            likes: Number(m.likes ?? 0),
            timestamp: Number(m.timestamp ?? 0),
            txHash: events.find(e => Number(e.args?.id ?? 0) === id)?.transactionHash || null,
          });
        } catch (e) {
          // skip invalid / missing messages
          console.warn('Skipping invalid message id', id, e.message || e);
        }
      }

      // sort by timestamp desc
      const formatted = fetched.sort((a, b) => b.timestamp - a.timestamp);

      setMessages(formatted);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p className="text-center text-gray-400">Loading messages…</p>;
  }

  if (error) {
    return <p className="text-center text-red-400">Error loading messages: {error}</p>;
  }

  if (!messages.length) {
    return <p className="text-center text-gray-500">No messages yet</p>;
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="rounded-xl bg-slate-900 p-4 border border-slate-800"
        >
          <p className="text-sm text-gray-300 mb-2">{msg.text}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <a
              href={`https://basescan.org/address/${msg.author}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {msg.author?.slice?.(0, 6)}…{msg.author?.slice?.(-4)}
            </a>

            <div className="flex items-center gap-3">
              <LikeButton author={msg.author} />

              {msg.txHash ? (
                <a
                  href={`https://basescan.org/tx/${msg.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  tx
                </a>
              ) : (
                <span className="text-gray-500">tx</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}