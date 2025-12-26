export const CONTRACT_ADDRESS =
  "0xc6ada2982604e78e77fa16942389f4e1c82410ce";

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