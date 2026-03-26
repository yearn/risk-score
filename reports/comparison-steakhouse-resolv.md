# Steakhouse vs Yearn: Resolv USR/RLP Report Comparison

**Date:** March 17, 2026
**Steakhouse report:** [Resolv USR](https://kitchen.steakhouse.financial/p/resolv-usr)
**Our reports:** `reports/report/resolv-wstusr.md` and `reports/report/resolv-rlp.md`

---

## 1. What We Missed

### 1.1 Economic / Yield Analysis

**Funding rate deep-dive** -- Steakhouse includes detailed funding rate analysis across venues (Binance, Bybit, Deribit, Hyperliquid) with average rates, volatility, and a statistical correlation analysis between staking yield and perp funding (ρ ≈ -0.049, showing diversification benefit). Our reports mention funding rates as a yield source but never quantify them per-venue or analyze correlation/diversification.

**Yield payoff waterfall** -- Steakhouse breaks down the exact profit distribution: 10% protocol fee, 76.5% base reward (split pro-rata between stUSR and RLP), 13.5% risk premium (RLP only). We mention the 13.5% risk premium in our RLP report but don't lay out the full waterfall with a worked example ($200M USR + $100M RLP = 7.7% stUSR yield, 11.7% RLP yield).

**Points/incentive analysis** -- Steakhouse documents the impact of token incentive seasons on TVL: Season 1 grew TVL from $50M to $650M, then TVL contracted 40-45% post-TGE as yield farmers exited. We don't cover incentive-driven TVL dynamics at all. This matters because it signals how "sticky" the TVL actually is.

**Monte Carlo simulation** -- Steakhouse ran 500-path Monte Carlo simulations on yield scenarios using 2025 funding/staking data, concluding "chances of the entire pool of RLP being wiped are virtually 0". We do no quantitative stress testing or simulation.

### 1.2 Stress Testing & Scenario Analysis

**Exchange insolvency scenario** -- Steakhouse models what happens if a major CEX goes down (FTX-style): margin and unrealized PnL lost, RLP absorbs it, USR remains redeemable from on-chain assets. We mention CEX counterparty risk but never walk through the concrete impact mechanics.

**Prolonged negative funding scenario** -- Steakhouse quantifies: "extreme 8-hour funding rates (-0.35% Binance, -0.6% Deribit) would require 60-90 days of extreme negative rates to drain the protection layer." We don't provide any time-to-depletion analysis for RLP under stress.

**Bank run scenario** -- Steakhouse explicitly analyzes the race condition between USR and RLP holders during mass redemption. We mention the 110% CR gate but don't model the dynamics of a cascading exit.

**Historical stress test reference** -- Steakhouse references a real late-2024 event where CR dropped from 170% to ~120%, and the system self-corrected (RLP yields spiked, attracting new capital). We don't reference this real-world stress event.

### 1.3 Operational Details

**Redemption timing data** -- Steakhouse cites Chaos Labs analysis: "weighted average execution time of 1.8 hours, with 50% completed within 1 hour and 75% within 2 hours" and "no correlation between redemption size and execution delay." We say "1-24h" without empirical data.

**Margin management parameters** -- Steakhouse documents specific operational parameters: target margin ratio 30%, minimum threshold 20%, target exchange exposure ~8%, position rollover cadence. We don't cover these operational mechanics.

**Off-exchange settlement architecture** -- Steakhouse details the 2-out-of-3 signer model (Custodian, Client, Trusted Third Party) for multi-party wallets and explains how assets never leave custody during trading. We mention Fireblocks/Ceffu but don't explain the custody architecture.

**Instant redemption mechanism** -- Steakhouse describes a $1M daily cap instant USR redemption with 1bps fee, funded from idle USDC or temporary Aave borrowing constrained by a health factor parameter. We don't mention this mechanism.

**Rebalancing mechanics** -- Steakhouse explains how every mint/burn triggers futures position adjustment, how inventory is split between staking and margin, and how price movements trigger margin top-ups or gain realization. We don't cover rebalancing at all.

### 1.4 Governance & Token Economics

**RESOLV token distribution** -- Steakhouse provides the full breakdown: 40.9% ecosystem/community (24mo vesting), 26.7% team (1yr cliff + 30mo vesting), 22.4% investors (1yr cliff + 24mo vesting), 10% Season 1 airdrop. We mention stRESOLV exists but don't cover token economics.

**stRESOLV mechanics** -- Steakhouse details: 14-day unstake cooldown, time-weighted multiplier reaching 2x for 1-year holders, Snapshot voting at resolvgovernance.eth. We note voting hasn't been initiated -- Steakhouse shows it was launched November 2025 and RGP-01 already passed.

**Governance transition roadmap** -- Steakhouse describes a "hybrid, team-led with transition roadmap toward full DAO control" model. We say "on-chain governance not yet live" which appears to be outdated information.

### 1.5 Legal & Regulatory

**Entity structure detail** -- Steakhouse identifies: Resolv Digital Assets Ltd (BVI, main protocol entity), Resolv Foundation (Cayman, parent and UBO), Resolv Labs Ltd (BVI, software/BD vendor). We mention BVI entities but miss the Cayman Foundation as parent/UBO and the vendor relationship.

**KYC/AML requirement** -- Steakhouse notes users must "undergo AML process (KYC/KYB + wallet screening)." We mention whitelist but not the KYC/AML requirement explicitly.

---

## 2. What We Could Do Better

### 2.1 Add Quantitative Stress Testing

Our reports are thorough on describing risks qualitatively but lack numbers. We should:
- Model funding rate scenarios with historical data (how long can RLP survive negative funding?)
- Quantify CEX insolvency impact (if Binance goes down, what % of RLP is lost?)
- Run or reference Monte Carlo simulations for yield paths
- Reference actual stress events (the late-2024 CR drop to 120%)

### 2.2 Include Economic Analysis Section

Our template doesn't have a dedicated "Economic Analysis" or "Yield Mechanics" section. For yield-bearing assets, we should analyze:
- Detailed yield source breakdown with historical ranges
- Profit distribution waterfall (who gets what %)
- Yield sustainability under different market regimes
- Impact of incentive programs on TVL stickiness

### 2.3 Add Empirical Operational Data

Where available, we should include real-world operational metrics:
- Actual redemption times (not just theoretical "1-24h" window)
- Historical exchange rate growth charts
- Margin utilization and rebalancing frequency
- Fee revenue data

### 2.4 Deeper Custody Architecture Analysis

Our reports mention custodians (Fireblocks, Ceffu) by name but don't explain:
- How off-exchange settlement actually works (MPC wallets, mirroring)
- The multi-party signer model
- What assets are actually at risk on exchanges vs held in custody
- Settlement frequency and mechanisms

### 2.5 Keep Governance Information Current

Our report says "on-chain governance not yet live" and "Snapshot voting has not been initiated," but Steakhouse shows governance launched in November 2025 with RGP-01 already passed. We need better processes to keep reports current with protocol developments.

### 2.6 Correlation & Diversification Analysis

Steakhouse analyzes the correlation between yield sources (staking vs funding: ρ ≈ -0.049) to argue diversification benefit. For delta-neutral and multi-source yield protocols, we should analyze:
- Co-movement of yield sources
- Venue concentration risk
- What happens when multiple risk factors align (correlated stress)

### 2.7 Token Economics Coverage

For protocols with governance tokens, we should cover:
- Token distribution and vesting schedules
- Incentive program impact on TVL
- Post-incentive TVL decay patterns
- Governance participation metrics

### 2.8 Scenario Walkthrough Format

Steakhouse's failure mode analysis is structured as: **Scenario -> Consequence -> Mitigants -> Quantified impact**. Our "Key Risks" section lists risks but doesn't walk through specific scenarios with quantified outcomes. The scenario format is more actionable.

---

## 3. What We Do Well (That Steakhouse Doesn't)

Worth noting -- our reports have strengths Steakhouse's doesn't:

- **Quantitative risk scoring** -- We have a structured 1-5 scoring framework with weighted categories. Steakhouse provides no scores at all, just qualitative narrative. Our approach is more actionable for decision-making.
- **Monitoring section** -- We define specific contracts, functions, thresholds, and alert frequencies. Steakhouse doesn't include a monitoring playbook.
- **On-chain verification** -- We verify claims with actual on-chain data (e.g., `convertToAssets(1e18) = 1.1304`, `USR.balanceOf(stUSR) == totalSupply`). Steakhouse references on-chain data but less granularly.
- **Contract address tables** -- We provide comprehensive contract address tables with proxy implementations, ProxyAdmin addresses, and cross-chain deployments. Steakhouse lists fewer addresses.
- **Reassessment triggers** -- We define specific conditions for re-evaluation. Steakhouse doesn't.
- **Audit detail** -- We list specific findings per audit (e.g., "4 Medium + 3 Low: rounding in unwrap, mintWithPermit wrong amount..."). Steakhouse just counts engagements.

---

## 4. Suggested Skills for Claude

Based on gaps identified, here are skills that would be valuable to define:

### 4.1 `economic-analysis` -- Yield & Economic Modeling

**Purpose:** For yield-bearing tokens, analyze the economic model depth.
**What it would do:**
- Break down yield sources with historical data (fetch from DeFi Llama, CoinGecko)
- Map the profit distribution waterfall (protocol fee %, base reward %, risk premium %)
- Analyze incentive program impact on TVL (fetch historical TVL, overlay token events)
- Flag yield sustainability concerns (compare yield to market benchmarks)
- Check if yield sources are correlated or diversified

**Why:** Our biggest gap vs Steakhouse is the lack of economic analysis. This is especially critical for structured products (tranches, delta-neutral, RWA-backed).

### 4.2 `stress-testing` -- Scenario & Stress Analysis

**Purpose:** Run through failure scenarios with quantified impacts.
**What it would do:**
- For each identified risk, walk through: Scenario -> Consequence -> Mitigants -> Quantified impact
- Model specific scenarios: CEX insolvency (% of collateral lost), prolonged negative funding (time-to-depletion for insurance layer), mass redemption (cascade dynamics)
- Reference historical stress events from the protocol or comparable protocols
- Use on-chain data to parameterize scenarios (fetch current collateral ratios, exchange exposure, margin ratios)
- Output a structured "Failure Modes" table

**Why:** Our reports identify risks qualitatively but never quantify "how bad could it get?" Steakhouse's Monte Carlo and scenario analysis is significantly more useful for decision-making.

### 4.3 `custody-analysis` -- Off-Chain Custody & Settlement Deep-Dive

**Purpose:** For protocols with off-chain/custodial components, analyze the custody architecture.
**What it would do:**
- Map the custody stack (which custodian, what signer model, what settlement frequency)
- Identify what assets are truly at risk on exchanges vs held in custody
- Analyze the off-exchange settlement mechanism (MPC, mirroring, etc.)
- Compare to industry standards
- Flag custody concentration risks

**Why:** Many DeFi protocols now have off-chain components (CEX hedging, RWAs, custodial bridges). "Uses Fireblocks" is not enough detail.

### 4.4 `report-freshness-check` -- Keep Reports Current

**Purpose:** Check if existing reports contain outdated information.
**What it would do:**
- Compare report claims against current on-chain state (TVL, exchange rates, contract states)
- Check if governance has evolved (new proposals, new voting systems)
- Check for new audits since assessment date
- Check for incidents since assessment date (Rekt News, DeFi Llama hacks)
- Flag stale data points and suggest updates
- Could be run periodically (e.g., monthly)

**Why:** Our Resolv reports claimed "on-chain governance not yet live" when it had already launched. Regular freshness checks prevent this.

### 4.5 `redemption-analysis` -- Empirical Liquidity & Redemption Analysis

**Purpose:** Gather empirical data on how redemptions actually work in practice.
**What it would do:**
- Fetch on-chain redemption events and calculate actual processing times
- Analyze redemption size vs processing time correlation
- Check for redemption delays or failures
- Map all exit paths (primary market redemption, DEX swap, lending market unwind)
- Calculate slippage for different exit sizes on DEX pools
- Compare stated redemption times vs actual

**Why:** "1-24h" is what docs say. Steakhouse cited actual data showing 1.8h average. On-chain data can tell us the truth.

### 4.6 `competitor-comparison` -- Cross-Protocol Benchmarking

**Purpose:** Compare a protocol's risk profile against comparable protocols.
**What it would do:**
- Identify comparable protocols (same category: delta-neutral, stablecoin, yield vault, etc.)
- Compare key metrics: TVL, audit coverage, governance maturity, yield, incident history
- Benchmark against our existing reports
- Highlight where the protocol is better or worse than peers

**Why:** Neither we nor Steakhouse do systematic comparisons. Context of "how does this compare to Ethena, Usual, etc." would help calibrate risk scores.

---

## 5. Key Takeaways

| Dimension | Us | Steakhouse | Winner |
|-----------|-----|-----------|--------|
| Scoring framework | Structured 1-5 weighted scores | No scores, qualitative only | Us |
| Monitoring | Detailed contract/function/threshold | None | Us |
| On-chain verification | Granular with specific calls | High-level | Us |
| Economic analysis | Minimal | Deep yield/incentive modeling | Steakhouse |
| Stress testing | Qualitative risk list | Monte Carlo + scenario walkthroughs | Steakhouse |
| Custody architecture | Names only | Full MPC/settlement detail | Steakhouse |
| Operational data | Theoretical ranges | Empirical measurements | Steakhouse |
| Governance freshness | Outdated | Current | Steakhouse |
| Audit findings detail | Per-finding breakdown | Engagement count only | Us |
| Reassessment triggers | Defined | None | Us |

**Bottom line:** Our framework is stronger for structured decision-making (scores, monitoring, triggers). Steakhouse is stronger on economic depth and stress analysis. The ideal report combines both. The biggest opportunity is adding economic analysis, stress testing, and empirical operational data to our existing framework.
