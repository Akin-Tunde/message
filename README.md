# Base Message Board

A **mobile-first, next-generation on-chain message board** built on **Base Mainnet**. Users can post, update, and like messages **directly on-chain** with a **modern Web3 interface**, WalletConnect integration, and gasless like functionality.  

---

## Features

- **WalletConnect Ready**: Connect any supported wallet (Rainbow, MetaMask, etc.) seamlessly.  
- **Write & Update Messages**: Post on-chain messages instantly.  
- **Like Messages**: Gasless likes supported via sponsored relayer transactions.  
- **Mobile-First Interface**: Bottom-sheet composer, pull-to-refresh, skeleton loaders, and optimistically updating likes.  
- **Event Indexing**: All actions are emitted as smart contract events for easy on-chain tracking.  
- **ENS / Basename Display**: Author names resolved automatically if available, otherwise truncated addresses.  
- **Base Mainnet Compatible**: Fully production-ready and secure.  

---

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, RainbowKit, Wagmi  
- **Smart Contract**: Solidity 0.8.x  
- **Backend**: Node.js Express relayer for gasless likes  
- **Blockchain**: Base Mainnet  

---

## Getting Started

### 1. Clone Repo

```bash
git clone https://github.com/YOUR_USERNAME/base-message-board.git
cd base-message-board
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
RELAYER_PRIVATE_KEY=0xyourprivatekey
BASE_RPC_URL=https://mainnet.base.org
RELAYER_PORT=5000
```

### 4. Run Frontend

```bash
npm run dev
```

Frontend will run at `http://localhost:3000`. Mobile-friendly interface is fully supported.

### 5. Run Relayer for Gasless Likes

```bash
npm run relayer
```

Ensure the backend is running to enable **gasless likes** functionality.

---

## Smart Contract

- **Contract Name**: `MessageBoard`  
- **Functions**:
  - `writeMessage(string _text)` – Post a new message.
  - `updateMessage(string _text)` – Update your existing message.
  - `likeMessage(address _author)` – Like another user's message (can be gasless via relayer).  
  - `getAllAuthors()` – List of all authors for event tracking.  
  - `messages(address)` – Returns message content and like count.  

- **Events**:
  - `MessageWritten(address user, string text)`  
  - `MessageUpdated(address user, string text)`  
  - `MessageLiked(address liker, address author)`  

---

## Usage

1. Connect your wallet via **WalletConnect**.  
2. Open the **bottom-sheet composer** to write a message.  
3. Messages appear in the feed instantly with **optimistic like updates**.  
4. Pull-to-refresh or wait for event confirmation to sync on-chain data.  
5. Like messages using the **gasless relayer** to avoid paying gas.  

All messages and interactions are **permanently recorded on Base mainnet** and **fully trackable through on-chain events**.

---

## Mobile Experience

- One-hand usability with large touch targets.  
- Skeleton loaders indicate data loading.  
- Pull-to-refresh for the feed.  
- Optimistic UI ensures fast feedback when liking messages.  
- Bottom-sheet composer for intuitive posting.  

---

## Deployment

### Frontend

```bash
npm run build
npm run start
```

### Backend Relayer

```bash
npm run relayer
```

Deploy frontend to **Vercel, Railway, or Netlify**.  
Deploy relayer to **Render, Railway, or a VPS**.  

---

## Contributing

- Fork the repo, make your changes, and submit a pull request.  
- Ensure any new smart contract changes are backward-compatible with Base mainnet.  

---

## License

MIT License
