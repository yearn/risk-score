#!/usr/bin/env node

const SNAPSHOT_BLOCK = 25_595_151;
const ENGINE = "0xce01c90de7fd1bcfa39e237fe6d8d9f569e8a6a3";
const VAT = "0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b";
const MULTICALL3 = "0xca11bde05977b3631167028862be2a173976ca11";
const LOG_API = "https://eth.blockscout.com/api";
const RPC_URL = "https://eth.blockscout.com/api/eth-rpc";
const DEPLOYMENT_BLOCK = 22_370_185;
const OPEN_TOPIC =
  "0xdde6dd354074cad07a2dacbb612a6d2bac55ac537264d73250bf5c76bc15d64d";
const URNS_SELECTOR = "2424be5c";
const ILKS_SELECTOR = "d9638d36";
const AGGREGATE3_SELECTOR = "82ad56cb";
const ILK =
  "4c534556322d534b592d41000000000000000000000000000000000000000000";
const MAT = 1.2;
const STUSDS_TOTAL_ASSETS = 187_538_897.3038364;
const PRICE_POINTS = [0.025, 0.0184, 0.0153, 0.01086, 0.00905];
const MORPHO_CHI_THRESHOLDS = {
  firstLiquidation: 0.0103145056,
  firstBadDebt: 0.1115558192,
};

function word(value) {
  return value.toLowerCase().replace(/^0x/, "").padStart(64, "0");
}

function decodeWords(value) {
  const raw = value.replace(/^0x/, "");
  const words = [];
  for (let offset = 0; offset < raw.length; offset += 64) {
    words.push(BigInt(`0x${raw.slice(offset, offset + 64)}`));
  }
  return words;
}

function encodeAggregate3(calls) {
  const bodies = calls.map((call) => {
    const data = call.data.replace(/^0x/, "");
    const paddedData = data.padEnd(Math.ceil(data.length / 64) * 64, "0");
    return [
      word(call.to),
      word("1"),
      word("60"),
      word((data.length / 2).toString(16)),
      paddedData,
    ].join("");
  });

  let offset = calls.length * 32;
  const offsets = bodies.map((body) => {
    const current = word(offset.toString(16));
    offset += body.length / 2;
    return current;
  });

  return `0x${AGGREGATE3_SELECTOR}${word("20")}${word(
    calls.length.toString(16),
  )}${offsets.join("")}${bodies.join("")}`;
}

function decodeAggregate3(value) {
  const raw = value.replace(/^0x/, "");
  const readWord = (byteOffset) =>
    BigInt(`0x${raw.slice(byteOffset * 2, byteOffset * 2 + 64)}`);
  const arrayStart = Number(readWord(0));
  const length = Number(readWord(arrayStart));
  const offsetsStart = arrayStart + 32;
  const results = [];

  for (let index = 0; index < length; index += 1) {
    const tupleStart = offsetsStart + Number(readWord(offsetsStart + index * 32));
    const success = readWord(tupleStart) === 1n;
    const dataOffset = Number(readWord(tupleStart + 32));
    const dataStart = tupleStart + dataOffset;
    const dataLength = Number(readWord(dataStart));
    const data = raw.slice((dataStart + 32) * 2, (dataStart + 32 + dataLength) * 2);
    if (!success) throw new Error(`Multicall item ${index} failed: 0x${data}`);
    results.push(`0x${data}`);
  }
  return results;
}

async function fetchJson(url, options, attempts = 5) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
    }
  }
  throw lastError;
}

async function fetchOpenLogs() {
  const logsById = new Map();
  let fromBlock = DEPLOYMENT_BLOCK;

  const getPage = async (start, end) => {
    const url = new URL(LOG_API);
    const params = {
      module: "logs",
      action: "getLogs",
      fromBlock: String(start),
      toBlock: String(end),
      address: ENGINE,
      topic0: OPEN_TOPIC,
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
  };

  while (fromBlock <= SNAPSHOT_BLOCK) {
    const page = await getPage(fromBlock, SNAPSHOT_BLOCK);
    if (page.length === 0) break;
    for (const log of page) {
      logsById.set(`${log.transactionHash}:${log.logIndex}`, log);
    }

    if (page.length < 1000) break;
    const lastBlock = Number.parseInt(page.at(-1).blockNumber, 16);
    const boundary = await getPage(lastBlock, lastBlock);
    for (const log of boundary) {
      logsById.set(`${log.transactionHash}:${log.logIndex}`, log);
    }
    if (lastBlock < fromBlock) throw new Error("Log pagination did not advance");
    fromBlock = lastBlock + 1;
  }

  return [...logsById.values()];
}

async function rpcBatch(calls) {
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_call",
    params: [
      { to: MULTICALL3, data: encodeAggregate3(calls) },
      `0x${SNAPSHOT_BLOCK.toString(16)}`,
    ],
  };
  const entry = await fetchJson(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!entry || entry.error) {
    throw new Error(`Multicall failed: ${JSON.stringify(entry)}`);
  }
  return decodeAggregate3(entry.result);
}

async function readUrns(urns) {
  const positions = [];
  const batchSize = 100;
  for (let offset = 0; offset < urns.length; offset += batchSize) {
    const batch = urns.slice(offset, offset + batchSize);
    const calls = batch.map((urn) => ({
      to: VAT,
      data: `0x${URNS_SELECTOR}${ILK}${word(urn)}`,
    }));
    const values = await rpcBatch(calls);
    for (let index = 0; index < batch.length; index += 1) {
      const [ink, art] = decodeWords(values[index]);
      positions.push({ urn: batch[index], ink, art });
    }
  }
  return positions;
}

const logs = await fetchOpenLogs();
console.error(`Discovered ${logs.length} urns; reading pinned VAT positions...`);
const urns = logs.map((log) => `0x${log.data.slice(-40)}`);
const positions = await readUrns(urns);
const [ilkResult] = await rpcBatch([{ to: VAT, data: `0x${ILKS_SELECTOR}${ILK}` }]);
const [totalArt, rate, spot] = decodeWords(ilkResult);

const active = positions
  .filter(({ ink, art }) => ink > 0n || art > 0n)
  .map((position) => {
    const collateral = Number(position.ink) / 1e18;
    const debt = Number(position.art * rate) / 1e45;
    return {
      urn: position.urn,
      collateral,
      debt,
      liquidationPrice: collateral > 0 ? (debt * MAT) / collateral : Infinity,
      parityPrice: collateral > 0 ? debt / collateral : Infinity,
    };
  })
  .sort((a, b) => b.liquidationPrice - a.liquidationPrice);

const totalCollateral = active.reduce((sum, position) => sum + position.collateral, 0);
const totalDebt = active.reduce((sum, position) => sum + position.debt, 0);
const shortfallAt = (price) =>
  active.reduce(
    (sum, position) => sum + Math.max(position.debt - position.collateral * price, 0),
    0,
  );
const priceForShortfall = (target) => {
  let low = 0;
  let high = Math.max(...active.map((position) => position.parityPrice));
  for (let iteration = 0; iteration < 100; iteration += 1) {
    const middle = (low + high) / 2;
    if (shortfallAt(middle) > target) low = middle;
    else high = middle;
  }
  return high;
};

const priceStress = PRICE_POINTS.map((price) => {
  const unsafe = active.filter((position) => price < position.liquidationPrice);
  const underwater = active.filter((position) => price < position.parityPrice);
  const principalShortfall = shortfallAt(price);
  return {
    price,
    unsafeUrns: unsafe.length,
    unsafeDebt: unsafe.reduce((sum, position) => sum + position.debt, 0),
    underwaterUrns: underwater.length,
    principalShortfall,
    chiLossPct: (principalShortfall / STUSDS_TOTAL_ASSETS) * 100,
  };
});

const output = {
  snapshotBlock: SNAPSHOT_BLOCK,
  openEvents: logs.length,
  activeUrns: active.length,
  debtBearingUrns: active.filter(({ debt }) => debt > 0).length,
  vatArt: Number(totalArt),
  vatRate: Number(rate),
  vatSpot: Number(spot),
  totalCollateral,
  totalDebt,
  firstLiquidation: active[0],
  firstParity: [...active].sort((a, b) => b.parityPrice - a.parityPrice)[0],
  integratedMorphoThresholds: Object.fromEntries(
    Object.entries(MORPHO_CHI_THRESHOLDS).map(([name, fraction]) => {
      const lseLoss = fraction * STUSDS_TOTAL_ASSETS;
      return [
        name,
        {
          chiLossPct: fraction * 100,
          lseLoss,
          skyPrice: priceForShortfall(lseLoss),
        },
      ];
    }),
  ),
  priceStress,
  topLiquidationThresholds: active.slice(0, 20),
};

console.log(JSON.stringify(output, null, 2));
