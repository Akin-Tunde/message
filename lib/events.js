import { publicClient } from 'wagmi';

export async function getMessageEvents(address, abi) {
  return await publicClient.getLogs({
    address,
    event: abi.find(e => e.name === "MessageWritten"),
    fromBlock: 0n,
    toBlock: 'latest'
  });
}