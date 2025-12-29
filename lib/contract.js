export const DEFAULT_CONTRACT_ADDRESS =
  "0xc6ada2982604e78e77fa16942389f4e1c82410ce";

// CONTRACT_ADDRESS will prefer a NEXT_PUBLIC_* env var for browser builds, or
// fall back to CONTRACT_ADDRESS for server-side usage. If neither are set the
// DEFAULT_CONTRACT_ADDRESS will be used. This makes the address configurable
// in different environments while keeping the repo usable out-of-the-box.
export const CONTRACT_ADDRESS =
  (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS)) ||
  DEFAULT_CONTRACT_ADDRESS;

export const CONTRACT_ABI = [
  {
    "inputs": [{"internalType":"string","name":"_text","type":"string"}],
    "name":"writeMessage",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],
    "name":"likeMessage",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],
    "name":"getMessage",
    "outputs":[{
      "components":[
        {"internalType":"uint256","name":"id","type":"uint256"},
        {"internalType":"address","name":"author","type":"address"},
        {"internalType":"string","name":"text","type":"string"},
        {"internalType":"uint256","name":"likes","type":"uint256"},
        {"internalType":"uint256","name":"timestamp","type":"uint256"}
      ],
      "internalType":"struct MessageBoard.Message",
      "name":"",
      "type":"tuple"
    }],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "anonymous":false,
    "inputs":[
      {"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},
      {"indexed":true,"internalType":"address","name":"author","type":"address"},
      {"indexed":false,"internalType":"string","name":"text","type":"string"},
      {"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}
    ],
    "name":"MessageCreated",
    "type":"event"
  },
  {
    "anonymous":false,
    "inputs":[
      {"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},
      {"indexed":true,"internalType":"address","name":"liker","type":"address"}
    ],
    "name":"MessageLiked",
    "type":"event"
  }
];