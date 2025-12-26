'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

export default function MessageBoard() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!text) return;
    setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.writeMessage(text);
      await tx.wait();
      setText('');
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div>
      <textarea
        className="w-full p-2 border rounded mb-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a message..."
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}