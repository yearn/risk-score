#!/usr/bin/env node

const SNAPSHOT_BLOCK = 25_595_151;
const TOKEN = "0x99cd4ec3f88a45940936f469e4bb72a2a701eeb9";
const LOG_API = "https://eth.blockscout.com/api";
const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

async function fetchJson(url, attempts = 5) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
    }
  }
  throw lastError;
}

async function fetchLogs(fromBlock, toBlock) {
  const url = new URL(LOG_API);
  const params = {
    module: "logs",
    action: "getLogs",
    fromBlock: String(fromBlock),
    toBlock: String(toBlock),
    address: TOKEN,
    topic0: TRANSFER_TOPIC,
    offset: "1000",
  };
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const payload = await fetchJson(url);
  if (payload.status !== "1" || !Array.isArray(payload.result)) {
    throw new Error(`Log API error: ${JSON.stringify(payload)}`);
  }
  return payload.result;
}

const logsById = new Map();
let fromBlock = 0;

while (fromBlock <= SNAPSHOT_BLOCK) {
  const page = await fetchLogs(fromBlock, SNAPSHOT_BLOCK);
  if (page.length === 0) break;
  for (const log of page) {
    logsById.set(`${log.transactionHash}:${log.logIndex}`, log);
  }

  if (page.length < 1000) break;
  const lastBlock = Number.parseInt(page.at(-1).blockNumber, 16);
  const boundary = await fetchLogs(lastBlock, lastBlock);
  for (const log of boundary) {
    logsById.set(`${log.transactionHash}:${log.logIndex}`, log);
  }
  if (lastBlock < fromBlock) throw new Error("Log pagination did not advance");
  fromBlock = lastBlock + 1;
}

const logs = [...logsById.values()].sort(
  (a, b) =>
    Number.parseInt(a.blockNumber, 16) - Number.parseInt(b.blockNumber, 16) ||
    Number.parseInt(a.logIndex, 16) - Number.parseInt(b.logIndex, 16),
);
const balances = new Map();

for (const log of logs) {
  const from = `0x${log.topics[1].slice(-40)}`.toLowerCase();
  const to = `0x${log.topics[2].slice(-40)}`.toLowerCase();
  const amount = BigInt(log.data);
  if (from !== ZERO_ADDRESS) balances.set(from, (balances.get(from) ?? 0n) - amount);
  if (to !== ZERO_ADDRESS) balances.set(to, (balances.get(to) ?? 0n) + amount);
}

const holders = [...balances.entries()]
  .filter(([, balance]) => balance > 0n)
  .map(([address, balance]) => ({ address, balance }))
  .sort((a, b) => (a.balance === b.balance ? 0 : a.balance > b.balance ? -1 : 1));
const totalSupply = holders.reduce((sum, holder) => sum + holder.balance, 0n);
const top20Metadata = await Promise.all(
  holders.slice(0, 20).map(async ({ address }) => {
    const metadata = await fetchJson(`https://eth.blockscout.com/api/v2/addresses/${address}`);
    return {
      name: metadata.name ?? metadata.ens_domain_name ?? null,
      isContract: metadata.is_contract,
    };
  }),
);

function units(value) {
  return Number(value) / 1e18;
}

function concentration(count) {
  const balance = holders
    .slice(0, count)
    .reduce((sum, holder) => sum + holder.balance, 0n);
  return (Number(balance) / Number(totalSupply)) * 100;
}

console.log(
  JSON.stringify(
    {
      snapshotBlock: SNAPSHOT_BLOCK,
      transferEvents: logs.length,
      holders: holders.length,
      totalSupply: units(totalSupply),
      concentration: {
        top1Pct: concentration(1),
        top5Pct: concentration(5),
        top10Pct: concentration(10),
        top20Pct: concentration(20),
      },
      top20: holders.slice(0, 20).map(({ address, balance }, index) => ({
        address,
        ...top20Metadata[index],
        balance: units(balance),
        sharePct: (Number(balance) / Number(totalSupply)) * 100,
      })),
    },
    null,
    2,
  ),
);
