'use client';
import { useState } from 'react';
import WalletConnect from '@/components/ConnectButton';
import MessageBoard from '@/components/MessageBoard';
import MessageList from '@/components/MessageList';
import BottomSheet from '@/components/BottomSheet';

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen px-4 pb-24 pt-6 max-w-md mx-auto">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Base Message Board
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          On-chain messages. Real activity.
        </p>
      </header>

      <div className="mb-6 flex justify-center">
        <WalletConnect />
      </div>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg text-white z-50"
      >
        ✍️
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <MessageBoard />
      </BottomSheet>

      <section className="mt-8 space-y-4">
        <h2 className="text-sm uppercase tracking-widest text-gray-400">
          Messages
        </h2>
        <MessageList />
      </section>
    </main>
  );
}