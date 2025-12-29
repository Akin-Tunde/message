import { publicClient } from 'wagmi';

/**
 * Get events with resilience: supports multiple event names, chunked fetching
 * to avoid RPC limits, and basic error handling.
 *
 * @param {string} address Contract address
 * @param {Array} abi Contract ABI
 * @param {object} options
 * @param {bigint|number|string} [options.fromBlock=0n]
 * @param {bigint|number|string} [options.toBlock='latest']
 * @param {Array<string>} [options.eventNames=['MessageCreated','MessageWritten']]
 * @param {bigint} [options.chunkSize=100000n]
 */
export async function getMessageEvents(address, abi, options = {}) {
  const {
    fromBlock = 0n,
    toBlock = 'latest',
    eventNames = ['MessageCreated', 'MessageWritten'],
    chunkSize = 100000n,
  } = options;

  const event = eventNames
    .map((name) => abi.find((e) => e.name === name))
    .find(Boolean);

  if (!event) {
    throw new Error(`None of the events (${eventNames.join(',')}) found in ABI`);
  }

  // Try simple fetch first
  try {
    return await publicClient.getLogs({
      address,
      event,
      fromBlock,
      toBlock,
    });
  } catch (err) {
    // Fallback to chunked fetch when node can't serve large range or when errors occur
    const current = await publicClient.getBlockNumber();
    const start = BigInt(fromBlock || 0);
    const end = toBlock === 'latest' ? BigInt(current) : BigInt(toBlock);
    const logs = [];

    for (let b = start; b <= end; b += chunkSize) {
      const chunkStart = b;
      const chunkEnd = b + chunkSize - 1n > end ? end : b + chunkSize - 1n;
      try {
        const chunk = await publicClient.getLogs({
          address,
          event,
          fromBlock: chunkStart,
          toBlock: chunkEnd,
        });
        if (chunk && chunk.length) logs.push(...chunk);
      } catch (e) {
        // on chunk error, rethrow with context
        throw new Error(`Failed fetching logs for block range ${chunkStart}-${chunkEnd}: ${e.message || e}`);
      }
    }

    return logs;
  }
}