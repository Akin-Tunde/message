require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pino = require('pino');
const { ethers } = require('ethers');
const { CONTRACT_ABI, CONTRACT_ADDRESS } = require('../lib/contract');

const logger = pino({ transport: { target: 'pino-pretty' } });
const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
const wallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// Optional API key protection (set RELAYER_API_KEY in env)
const API_KEY = process.env.RELAYER_API_KEY;
if (API_KEY) logger.info('Relayer API key configured');

function requireApiKey(req, res, next) {
  if (!API_KEY) return next();
  const key = req.headers['x-api-key'] || req.query.api_key;
  if (!key || key !== API_KEY) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// Simple in-memory rate limiter per IP (not for production)
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_MAX = 20;
const rateMap = new Map();
function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const entry = rateMap.get(ip) || { count: 0, start: now };

  if (now - entry.start > RATE_WINDOW_MS) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count += 1;
  }

  rateMap.set(ip, entry);
  if (entry.count > RATE_MAX) return res.status(429).json({ error: 'Too many requests' });
  next();
}

app.get('/health', (req, res) => {
  res.json({ ok: true, rpc: !!process.env.BASE_RPC_URL });
});

app.post('/like', requireApiKey, rateLimiter, async (req, res) => {
  const { id } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  try {
    const tx = await contract.likeMessage(id);
    await tx.wait();
    logger.info({ id, hash: tx.hash }, 'Message liked');
    res.json({ success: true, hash: tx.hash });
  } catch (err) {
    logger.error({ err }, 'Failed to like message');
    res.status(500).json({ error: err.message || 'Internal error' });
  }
});

const PORT = process.env.RELAYER_PORT || 5000;
app.listen(PORT, () => logger.info(`Relayer running on port ${PORT}`));