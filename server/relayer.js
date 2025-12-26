require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
const { CONTRACT_ABI, CONTRACT_ADDRESS } = require('../lib/contract');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
const wallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

app.post('/like', async (req, res) => {
  const { author } = req.body;
  if (!author) return res.status(400).send('author required');

  try {
    const tx = await contract.likeMessage(author);
    await tx.wait();
    res.send({ success: true, hash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

const PORT = process.env.RELAYER_PORT || 5000;
app.listen(PORT, () => console.log(`Relayer running on port ${PORT}`));