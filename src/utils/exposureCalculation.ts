/**
 * Bookset Exposure Calculation Utility
 *
 * Implements dynamic Back/Lay exposure and profit & loss calculations for betting exchanges.
 * Combines existing backend exposure + unsettled placed bets + active unplaced bet preview:
 * Final Exposure = Backend Exposure + Unsettled Placed Bets Impact + Proposed Bet Impact
 *
 * BACK Bet:
 * - Selected outcome: + (Stake × (Odds - 1))
 * - Other outcomes:    - Stake
 *
 * LAY Bet:
 * - Selected outcome: - (Stake × (Odds - 1))
 * - Other outcomes:    + Stake
 */

export interface BooksetSelectionItem {
  selectionId: string | number;
  exposure: number;
}

export interface RunnerItem {
  selectionId: string | number;
  runnerName?: string;
}

export interface ProposedBetItem {
  marketId?: string | number;
  selectionId: string | number;
  betOn: 'BACK' | 'LAY';
  rate: number;
  stake: number;
  marketType?: string;
  minBet?: number;
  maxBet?: number;
}

export interface CalculateMarketExposuresParams {
  backendSelections?: BooksetSelectionItem[] | null;
  allRunners: RunnerItem[];
  unsettledBets?: ProposedBetItem[] | null;
  proposedBets?: ProposedBetItem | null | (ProposedBetItem | null)[];
  currentMarketId?: string | number;
}

export interface MarketExposureResult {
  exposures: Record<string, number>;
  hasExposure: boolean;
}

/**
 * Calculates dynamic exposures for all selections in a market.
 * Integrates backend exposure, active placed bets (until settled), and proposed unplaced bets.
 */
export function calculateMarketExposures({
  backendSelections,
  allRunners = [],
  unsettledBets = [],
  proposedBets,
  currentMarketId,
}: CalculateMarketExposuresParams): MarketExposureResult {
  const exposures: Record<string, number> = {};
  let hasBackendExposure = false;

  // 1. Gather all unique runner/selection IDs
  const allSelectionIds = new Set<string>();

  allRunners.forEach((runner) => {
    if (runner?.selectionId != null) {
      allSelectionIds.add(String(runner.selectionId));
    }
  });

  if (backendSelections && Array.isArray(backendSelections)) {
    backendSelections.forEach((b) => {
      if (b && b.selectionId != null) {
        allSelectionIds.add(String(b.selectionId));
      }
    });
  }

  // 2. Initialize all selections to 0
  allSelectionIds.forEach((id) => {
    exposures[id] = 0;
  });

  // 3. Populate existing exposures from API response
  if (backendSelections && Array.isArray(backendSelections)) {
    backendSelections.forEach((item) => {
      if (item && item.selectionId != null) {
        const selId = String(item.selectionId);
        const exp = Number(item.exposure) || 0;
        exposures[selId] = exp;
        if (exp !== 0) {
          hasBackendExposure = true;
        }
      }
    });
  }

  // 4. Gather all active bets for this market
  const unsettledList: ProposedBetItem[] = Array.isArray(unsettledBets)
    ? (unsettledBets.filter(Boolean) as ProposedBetItem[])
    : [];

  const proposedList: ProposedBetItem[] = Array.isArray(proposedBets)
    ? (proposedBets.filter(Boolean) as ProposedBetItem[])
    : proposedBets
      ? [proposedBets]
      : [];

  // Filter bets applicable to this market
  const filterRelevantBets = (bets: ProposedBetItem[]) =>
    bets.filter((bet) => {
      if (!bet) return false;

      // Validate market match if market IDs exist
      if (currentMarketId != null && bet.marketId != null) {
        if (String(currentMarketId) !== String(bet.marketId)) {
          return false;
        }
      }

      // Must have positive stake
      const stakeNum = Number(bet.stake);
      if (isNaN(stakeNum) || stakeNum <= 0) return false;

      // Must have valid rate / odds > 1 (or > 0 for special markets)
      const rateNum = Number(bet.rate);
      if (isNaN(rateNum) || rateNum <= 1) return false;

      return true;
    });

  const relevantUnsettled = filterRelevantBets(unsettledList);
  const relevantProposed = filterRelevantBets(proposedList);

  const hasAnyBets = relevantUnsettled.length > 0 || relevantProposed.length > 0;

  // 5. Combine and calculate impact of placed unsettled bets + unplaced proposed bets
  const allBetsToApply = [...relevantUnsettled, ...relevantProposed];

  allBetsToApply.forEach((bet) => {
    const selectedId = String(bet.selectionId);
    const stake = Number(bet.stake) || 0;
    const odds = Number(bet.rate) || 0;
    const isBack = bet.betOn === 'BACK';
    const isLay = bet.betOn === 'LAY';

    // Multiplier for profit on winning outcome:
    // Standard decimal odds: (Odds - 1)
    // Bookmaker percentage odds if rate > 10: (Rate / 100)
    const profitMultiplier =
      bet.marketType?.toUpperCase() === 'BOOKMAKER' && odds > 10
        ? odds / 100
        : Math.max(0, odds - 1);

    const winProfit = stake * profitMultiplier;

    allSelectionIds.forEach((selId) => {
      const isSelected = selId === selectedId;
      let impact = 0;

      if (isBack) {
        // BACK Bet:
        // Selected outcome: + (Stake × (Odds - 1))
        // Other outcomes:    - Stake
        impact = isSelected ? winProfit : -stake;
      } else if (isLay) {
        // LAY Bet:
        // Selected outcome: - (Stake × (Odds - 1))
        // Other outcomes:    + Stake
        impact = isSelected ? -winProfit : stake;
      }

      exposures[selId] = (exposures[selId] || 0) + impact;
    });
  });

  // 6. Clean up floating-point precision artifacts (round to 2 decimals)
  allSelectionIds.forEach((id) => {
    const rawVal = exposures[id] || 0;
    exposures[id] = Math.round((rawVal + Number.EPSILON) * 100) / 100;
  });

  return {
    exposures,
    hasExposure: hasBackendExposure || hasAnyBets,
  };
}

/**
 * Formats numeric exposure with sign (+ or -) and ALWAYS 2 decimal places.
 * Example:
 * 1200   -> "+1200.00"
 * -2     -> "-2.00"
 * 100    -> "+100.00"
 * -400   -> "-400.00"
 * 0      -> "0.00"
 * 200.5  -> "+200.50"
 */
export function formatExposure(value: number): string {
  const num = Number(value) || 0;
  const absFormatted = Math.abs(num).toFixed(2);

  if (num > 0) {
    return `+${absFormatted}`;
  }
  if (num < 0) {
    return `-${absFormatted}`;
  }
  return '0.00';
}

/**
 * Returns Tailwind text color class for exposure value:
 * - Positive (Profit) -> Green
 * - Negative (Loss)   -> Red
 * - Zero              -> Neutral (Gray)
 */
export function getExposureColorClass(value: number): string {
  if (value > 0) return 'text-[#107c41]';
  if (value < 0) return 'text-[#d90429]';
  return 'text-gray-500';
}
