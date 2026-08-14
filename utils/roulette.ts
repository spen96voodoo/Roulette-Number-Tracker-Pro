
import { VOISINS_SERIES, ORPHELINS_SERIES, TIERS_SERIES, EUROPEAN_WHEEL_ORDER, NUMBER_COLORS, ROULETTE_NUMBERS, WHEEL_SECTORS } from '../constants';
import type { SeriesType, RouletteColor, ComplexPrediction, FiveCriteriaDepths, SectorSplitMode, StrategyConfig } from '../types';

export const getSeriesType = (num: number): SeriesType => {
    if (VOISINS_SERIES.includes(num)) return 'Top';
    if (ORPHELINS_SERIES.includes(num)) return 'Middle';
    if (TIERS_SERIES.includes(num)) return 'Small';
    return 'none';
};

export const getWheelSector = (num: number) => {
    return WHEEL_SECTORS.find(s => s.numbers.includes(num)) || WHEEL_SECTORS[0];
};

export const getSectorsForSplitMode = (mode: SectorSplitMode = '9') => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    let sliceSizes: number[] = [];
    let prefix: 'SC' | 'S' = 'S';

    if (mode === '4') {
        sliceSizes = [9, 9, 9, 10];
        prefix = 'SC';
    } else if (mode === '6') {
        sliceSizes = [6, 6, 6, 6, 6, 7];
        prefix = 'SC';
    } else if (mode === '8') {
        sliceSizes = [5, 4, 5, 4, 5, 4, 5, 5];
        prefix = 'S';
    } else if (mode === '9') {
        sliceSizes = [4, 4, 4, 4, 4, 4, 4, 4, 5];
        prefix = 'S';
    } else if (mode === '12') {
        sliceSizes = [4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
        prefix = 'S';
    } else if (mode === '0') {
        return [
            { id: 'zero-spiel', name: '0-Spiel (7 nums)', numbers: [12, 35, 3, 26, 0, 32, 15] },
            { id: 'voisins', name: 'Top series (10 nums)', numbers: [22, 18, 29, 7, 28, 19, 4, 21, 2, 25] },
            { id: 'orphelins', name: 'Orphelins (8 nums)', numbers: [1, 20, 14, 31, 9, 17, 34, 6] },
            { id: 'tiers', name: 'Small series (12 nums)', numbers: [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33] },
        ];
    } else {
        sliceSizes = [4, 4, 4, 4, 4, 4, 4, 4, 5];
        prefix = 'S';
    }

    const sectors = [];
    let currentIdx = 0;
    for (let i = 0; i < sliceSizes.length; i++) {
        const size = sliceSizes[i];
        const nums = EUROPEAN_WHEEL_ORDER.slice(currentIdx, currentIdx + size);
        const letter = letters[i] || `${i + 1}`;
        const codeName = `${prefix}-${letter}`;
        sectors.push({
            id: `sec-${i + 1}`,
            name: `${codeName} (${nums.length} nums)`,
            numbers: nums,
        });
        currentIdx += size;
    }
    return sectors;
};

/**
 * Gets a number and its neighbours on the European wheel.
 * @param num The center number
 * @param depth Number of neighbours on each side (1 for N3, 2 for N5)
 * @returns Array of numbers including center and neighbours
 */
export const getNeighbours = (num: number, depth: number = 1): number[] => {
    const index = EUROPEAN_WHEEL_ORDER.indexOf(num);
    if (index === -1) return [];
    
    const result: number[] = [];
    for (let i = -depth; i <= depth; i++) {
        const targetIndex = (index + i + EUROPEAN_WHEEL_ORDER.length) % EUROPEAN_WHEEL_ORDER.length;
        result.push(EUROPEAN_WHEEL_ORDER[targetIndex]);
    }
    return result;
};

export const getMultiCriteriaPrediction = (
    history: number[],
    depths: FiveCriteriaDepths = { colorDepth: 5, finalDepth: 5, seriesDepth: 5, sectorsDepth: 5, pocketsDepth: 5 },
    sectorSplitMode: SectorSplitMode = '9',
    strategyConfig?: StrategyConfig
): ComplexPrediction | null => {
    if (history.length < 3) return null;

    const { 
        colorDepth = 5, 
        finalDepth = 5, 
        seriesDepth = 5, 
        sectorsDepth = 5, 
        pocketsDepth = 5 
    } = depths || {};
    const lastNumber = history[history.length - 1];

    // 1. COLOUR PREDICTION (using colorDepth)
    const colorHistory = history.map(n => NUMBER_COLORS[n]);
    const recentColors = colorHistory.slice(-colorDepth);
    const colorCounts: Record<RouletteColor, number> = { red: 0, black: 0, green: 0 };
    recentColors.forEach(c => { if (c) colorCounts[c] = (colorCounts[c] || 0) + 1; });
    
    const cTransitions: Map<RouletteColor, number> = new Map();
    const cLook = Math.min(colorDepth, colorHistory.length - 1);
    if (cLook > 0) {
        const targetColorSlice = colorHistory.slice(-cLook);
        for (let i = 0; i <= colorHistory.length - 1 - cLook; i++) {
            const currentSlice = colorHistory.slice(i, i + cLook);
            const matches = currentSlice.length === cLook && currentSlice.every((c, idx) => c === targetColorSlice[idx]);
            if (matches && i + cLook < colorHistory.length) {
                const next = colorHistory[i + cLook];
                if (next) cTransitions.set(next, (cTransitions.get(next) || 0) + 1);
            }
        }
    }
    let likelyColor: RouletteColor | null = Array.from(cTransitions.entries()).sort((a,b) => b[1]-a[1])[0]?.[0] || null;
    if (!likelyColor) {
        likelyColor = (Object.keys(colorCounts) as RouletteColor[]).sort((a,b) => colorCounts[b] - colorCounts[a])[0] || 'red';
    }

    // 3. SERIES PREDICTION (using seriesDepth)
    const seriesHistory = history.map(getSeriesType);
    const sTransitions: Map<SeriesType, number> = new Map();
    const sLook = Math.min(seriesDepth, seriesHistory.length - 1);
    if (sLook > 0) {
        const targetSeriesSlice = seriesHistory.slice(-sLook);
        for (let i = 0; i <= seriesHistory.length - 1 - sLook; i++) {
            const currentSlice = seriesHistory.slice(i, i + sLook);
            const matches = currentSlice.length === sLook && currentSlice.every((s, idx) => s === targetSeriesSlice[idx]);
            if (matches && i + sLook < seriesHistory.length) {
                const next = seriesHistory[i + sLook];
                if (next && next !== 'none') sTransitions.set(next, (sTransitions.get(next) || 0) + 1);
            }
        }
    }
    const likelySeries: SeriesType | null = Array.from(sTransitions.entries()).sort((a,b) => b[1]-a[1])[0]?.[0] || getSeriesType(lastNumber);

    // 4. SECTOR PREDICTION (using ALL spin numbers in history)
    const activeSectors = getSectorsForSplitMode(sectorSplitMode);
    const getSectorOfNum = (n: number) => activeSectors.find(s => s.numbers.includes(n)) || activeSectors[0];

    const sectorHistory = history.map(getSectorOfNum);
    const lastSector = getSectorOfNum(lastNumber);
    const lastSectorIdx = activeSectors.findIndex(s => s.id === lastSector.id);

    // Identify wheel-adjacent (closed) sectors to lastSector
    const prevClosedIdx = (lastSectorIdx - 1 + activeSectors.length) % activeSectors.length;
    const nextClosedIdx = (lastSectorIdx + 1) % activeSectors.length;
    const closedSectorIds = new Set([
        activeSectors[prevClosedIdx].id,
        activeSectors[nextClosedIdx].id,
        lastSector.id // Same sector is also self-closed
    ]);

    // Count overall sector hits across ALL history
    const totalSectorHits: Map<string, number> = new Map();
    sectorHistory.forEach(sec => {
        totalSectorHits.set(sec.id, (totalSectorHits.get(sec.id) || 0) + 1);
    });

    // 1-step destination transitions following lastSector across ALL history
    const destinationCounts: Map<string, number> = new Map();
    for (let i = 0; i < sectorHistory.length - 1; i++) {
        if (sectorHistory[i].id === lastSector.id) {
            const nextSec = sectorHistory[i + 1];
            if (nextSec) {
                destinationCounts.set(nextSec.id, (destinationCounts.get(nextSec.id) || 0) + 1);
            }
        }
    }

    // Sequence pattern transitions across ALL history
    const secLook = Math.min(3, sectorHistory.length - 1);
    const seqSectorTransitions: Map<string, number> = new Map();
    if (secLook >= 2) {
        const targetSecSlice = sectorHistory.slice(-secLook);
        for (let i = 0; i <= sectorHistory.length - 1 - secLook; i++) {
            const currentSlice = sectorHistory.slice(i, i + secLook);
            const matches = currentSlice.length === secLook && currentSlice.every((sec, idx) => targetSecSlice[idx] && sec.id === targetSecSlice[idx].id);
            if (matches && i + secLook < sectorHistory.length) {
                const nextSec = sectorHistory[i + secLook];
                if (nextSec) seqSectorTransitions.set(nextSec.id, (seqSectorTransitions.get(nextSec.id) || 0) + 1);
            }
        }
    }

    const rankingMode = strategyConfig?.vectorRankingMode || 'next_probable';

    // Calculate composite score for each active sector
    const sectorScores = activeSectors.map(sec => {
        const destTransitions = destinationCounts.get(sec.id) || 0;
        const seqTransitions = seqSectorTransitions.get(sec.id) || 0;
        const totalHits = totalSectorHits.get(sec.id) || 0;
        const isClosed = closedSectorIds.has(sec.id);

        const nextScore = (destTransitions * 100) + (seqTransitions * 50) + (isClosed ? 20 : 0) + totalHits;
        const historyScore = (totalHits * 100) + (destTransitions * 10) + (seqTransitions * 5);

        return {
            sector: sec,
            nextScore,
            historyScore,
            score: rankingMode === 'history_frequency' ? historyScore : nextScore,
            destTransitions,
            seqTransitions,
            totalHits,
            isClosed,
        };
    });

    const nextScores = [...sectorScores].sort((a, b) => b.nextScore - a.nextScore);
    const historyScores = [...sectorScores].sort((a, b) => b.historyScore - a.historyScore);

    const topNextSectors = nextScores.slice(0, 3).map(s => ({
        id: s.sector.id,
        name: s.sector.name,
        numbers: s.sector.numbers,
        score: s.nextScore,
    }));

    const topHistorySectors = historyScores.slice(0, 3).map(s => ({
        id: s.sector.id,
        name: s.sector.name,
        numbers: s.sector.numbers,
        score: s.historyScore,
    }));

    const activeScores = rankingMode === 'history_frequency'
        ? historyScores
        : rankingMode === 'both'
        ? (() => {
            const topCount = strategyConfig?.vectorTopSectorsCount || 1;
            const nextTop = nextScores.slice(0, topCount);
            const histTop = historyScores.slice(0, topCount);
            const combined = [...nextTop, ...histTop];
            const uniqueCombined = Array.from(new Set(combined.map(s => s.sector.id)))
                .map(id => combined.find(s => s.sector.id === id)!);
            return uniqueCombined;
          })()
        : nextScores;

    const topScored = activeScores[0];
    const likelySector = topScored?.sector || activeSectors[0];

    const topSectors = activeScores.slice(0, 3).map(s => ({
        id: s.sector.id,
        name: s.sector.name,
        numbers: s.sector.numbers,
        score: s.score,
    }));

    // Dynamic sector confidence based on destination transition strength
    const sectorConfidence = Math.min(98, Math.max(65, 70 + (topScored?.destTransitions || 0) * 8 + (topScored?.isClosed ? 5 : 0)));

    // 5. POCKETS DISTANCE STEP PREDICTION (using ALL spin numbers in history)
    const displacements: number[] = [];
    for (let i = 0; i < history.length - 1; i++) {
        const start = EUROPEAN_WHEEL_ORDER.indexOf(history[i]);
        const end = EUROPEAN_WHEEL_ORDER.indexOf(history[i+1]);
        const cwDist = (end - start + 37) % 37;
        const acwDist = (start - end + 37) % 37;
        const minDist = Math.min(cwDist, acwDist);
        if (minDist > 0) {
            displacements.push(minDist);
        }
    }
    const dispCounts: Map<number, number> = new Map();
    displacements.forEach(d => dispCounts.set(d, (dispCounts.get(d) || 0) + 1));
    
    const sortedDisps = Array.from(dispCounts.entries()).sort((a,b) => b[1]-a[1]).map(e => e[0]);
    // Ensure we have top 1 through top 5 distinct distance steps (defaulting to 1..10 if needed)
    const fallbackSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const topDisps: number[] = [];
    for (const d of sortedDisps) {
        if (!topDisps.includes(d)) topDisps.push(d);
        if (topDisps.length === 5) break;
    }
    for (const fb of fallbackSteps) {
        if (topDisps.length >= 5) break;
        if (!topDisps.includes(fb)) topDisps.push(fb);
    }

    const lastWheelIdx = EUROPEAN_WHEEL_ORDER.indexOf(lastNumber);
    const topSteps = topDisps.map(dist => ({
        distance: dist,
        cwTarget: EUROPEAN_WHEEL_ORDER[(lastWheelIdx + dist) % 37],
        acwTarget: EUROPEAN_WHEEL_ORDER[(lastWheelIdx - dist + 37) % 37],
    }));

    const topDisp = topSteps[0].distance;
    const cwTarget = topSteps[0].cwTarget;
    const acwTarget = topSteps[0].acwTarget;
    const allPocketTargets = topSteps.flatMap(s => [s.cwTarget, s.acwTarget]);

    // 2. FINAL DIGIT PREDICTION
    const lastFinal = lastNumber % 10;
    const finalLookback = Math.min(Math.max(finalDepth, 10), history.length);
    const recentHistory = history.slice(-finalLookback);

    const fTransitions: Map<number, number> = new Map();
    const lastTransitionIndex: Map<number, number> = new Map();
    
    // Primary scan: count transitions following lastFinal across history
    for (let i = 0; i < history.length - 1; i++) {
        if (history[i] % 10 === lastFinal) {
            const next = history[i + 1] % 10;
            fTransitions.set(next, (fTransitions.get(next) || 0) + 1);
            lastTransitionIndex.set(next, i); // Higher index = occurred more recently after lastFinal
        }
    }

    const finalCounts: Map<number, number> = new Map();
    recentHistory.forEach(n => {
        const f = n % 10;
        finalCounts.set(f, (finalCounts.get(f) || 0) + 1);
    });

    const digitScored = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => {
        const transCount = fTransitions.get(d) || 0;
        const lastTransIdx = lastTransitionIndex.get(d) ?? -1;
        const totalCount = finalCounts.get(d) || 0;

        // Cross-criteria synergy evaluation for candidate numbers ending in digit d
        const candidateNums = ROULETTE_NUMBERS.filter(n => n % 10 === d);
        const colorSynergy = likelyColor ? candidateNums.filter(n => NUMBER_COLORS[n] === likelyColor).length : 0;
        const sectorSynergy = likelySector ? candidateNums.filter(n => likelySector.numbers.includes(n)).length : 0;
        const seriesSynergy = candidateNums.filter(n => getSeriesType(n) === likelySeries).length;
        const pocketSynergy = candidateNums.filter(n => allPocketTargets.includes(n)).length;

        const synergyScore = (colorSynergy * 15) + (sectorSynergy * 20) + (seriesSynergy * 15) + (pocketSynergy * 25);

        return { digit: d, transCount, synergyScore, lastTransIdx, totalCount };
    });

    digitScored.sort((a, b) => {
        // Primary Key — Transition Frequency Following Latest Spin Ending Digit (transCount)
        if (b.transCount !== a.transCount) {
            return b.transCount - a.transCount;
        }
        // Secondary Key — Cross-Criteria Synergy (synergyScore)
        if (b.synergyScore !== a.synergyScore) {
            return b.synergyScore - a.synergyScore;
        }
        // Tertiary Key — Transition Recency (lastTransIdx)
        if (b.lastTransIdx !== a.lastTransIdx) {
            return b.lastTransIdx - a.lastTransIdx;
        }
        // Quaternary Key — Overall Frequency (totalCount)
        if (b.totalCount !== a.totalCount) {
            return b.totalCount - a.totalCount;
        }
        // Fallback: Numeric order
        return a.digit - b.digit;
    });

    // Limit strictly to user configured count: 2, 3, or 4 (default 3)
    const requestedFinalCount = strategyConfig?.finalDigitsCount ?? 3;
    const finalDigitsCountToUse = Math.min(Math.max(requestedFinalCount, 2), 4);
    const finalDigits = digitScored.slice(0, finalDigitsCountToUse).map(item => item.digit);

    // COMPOSITE SCORING FOR ALL 37 NUMBERS ACROSS 5 CRITERIA + PATTERN ALERTS
    const scores: Map<number, { score: number; matched: string[] }> = new Map();

    const lastSpin = history[history.length - 1];
    const prevSpin = history.length >= 2 ? history[history.length - 2] : null;
    const prevPrevSpin = history.length >= 3 ? history[history.length - 3] : null;

    // Pre-calculate historical pattern follow-up frequencies
    const seq3Follows: Map<number, number> = new Map();
    const seq2Follows: Map<number, number> = new Map();
    const seq1Follows: Map<number, number> = new Map();
    const gappedFollows: Map<number, number> = new Map();

    if (history.length >= 4 && prevPrevSpin !== null && prevSpin !== null) {
        for (let i = 0; i < history.length - 3; i++) {
            if (history[i] === prevPrevSpin && history[i+1] === prevSpin && history[i+2] === lastSpin) {
                const nextNum = history[i+3];
                seq3Follows.set(nextNum, (seq3Follows.get(nextNum) || 0) + 1);
            }
        }
    }

    if (history.length >= 3 && prevSpin !== null) {
        for (let i = 0; i < history.length - 2; i++) {
            if (history[i] === prevSpin && history[i+1] === lastSpin) {
                const nextNum = history[i+2];
                seq2Follows.set(nextNum, (seq2Follows.get(nextNum) || 0) + 1);
            }
            if (history[i] === prevSpin && history[i+2] === lastSpin) {
                const nextNum = history[i+3];
                if (nextNum !== undefined) {
                    gappedFollows.set(nextNum, (gappedFollows.get(nextNum) || 0) + 1);
                }
            }
        }
    }

    if (history.length >= 2) {
        for (let i = 0; i < history.length - 1; i++) {
            if (history[i] === lastSpin) {
                const nextNum = history[i+1];
                seq1Follows.set(nextNum, (seq1Follows.get(nextNum) || 0) + 1);
            }
        }
    }

    ROULETTE_NUMBERS.forEach(n => {
        let score = 0;
        const matched: string[] = [];
        const nFD = n % 10;
        const nSeries = getSeriesType(n);

        // 1. Colour Criteria
        if (likelyColor && NUMBER_COLORS[n] === likelyColor) {
            score += 20;
            matched.push("Colour");
        }

        // 2. Final Digit Criteria
        if (finalDigits.length > 0 && finalDigits.includes(nFD)) {
            if (finalDigits[0] === nFD) {
                score += 35;
            } else {
                score += 20;
            }
            matched.push("Final");
        }

        // 3. Series Criteria
        if (likelySeries && nSeries === likelySeries) {
            score += 25;
            matched.push("Series");
        }

        // 4. Wheel Sector Criteria
        if (likelySector.numbers.includes(n)) {
            score += 30;
            matched.push("Sector");
        }

        // 5. Pocket Distance Steps Criteria (Top 1-3 CW/ACW)
        if (n === cwTarget || n === acwTarget) {
            score += 40;
            matched.push("Pocket");
        } else if (allPocketTargets.includes(n)) {
            score += 25;
            matched.push("Pocket");
        }

        // 6. Pattern Alert & Sequence Intelligence Criteria
        let patternScore = 0;
        if (seq3Follows.has(n)) {
            patternScore += (seq3Follows.get(n) || 0) * 60;
        }
        if (seq2Follows.has(n)) {
            patternScore += (seq2Follows.get(n) || 0) * 40;
        }
        if (seq1Follows.has(n)) {
            patternScore += (seq1Follows.get(n) || 0) * 20;
        }
        if (gappedFollows.has(n)) {
            patternScore += (gappedFollows.get(n) || 0) * 35;
        }

        if (patternScore > 0) {
            score += patternScore;
            matched.push("Pattern");
        }

        // Multi-criteria synergy multipliers
        const uniqueCriteriaCount = matched.length;
        if (uniqueCriteriaCount >= 5) {
            score *= 2.2;
        } else if (uniqueCriteriaCount >= 4) {
            score *= 1.7;
        } else if (uniqueCriteriaCount >= 3) {
            score *= 1.35;
        }

        scores.set(n, { score, matched });
    });

    const sortedCandidates = Array.from(scores.entries())
        .sort((a, b) => b[1].score - a[1].score);

    const maxScore = sortedCandidates[0]?.[1].score || 100;

    const topNumbers = sortedCandidates
        .slice(0, 3)
        .map(([num, data], idx) => {
            const rawConf = Math.round((data.score / Math.max(maxScore, 100)) * 95);
            // Ensure clear, descending confidence hierarchy (#1 > #2 > #3)
            const confidence = Math.min(98, Math.max(50 + (3 - idx) * 10, rawConf));
            return {
                num,
                score: Math.round(data.score),
                confidence,
                matchedCriteria: data.matched,
            };
        });

    return {
        series: likelySeries,
        color: likelyColor,
        finalDigits,
        topNumbers,
        sector: {
            predictedSectorId: likelySector.id,
            predictedSectorName: likelySector.name,
            numbers: likelySector.numbers,
            confidence: sectorConfidence,
            depthUsed: sectorsDepth,
            topSectors,
            topNextSectors,
            topHistorySectors,
            rankingMode,
        },
        pocket: {
            predictedDistance: topDisp,
            cwTarget,
            acwTarget,
            topSteps,
            confidence: 85,
            depthUsed: pocketsDepth,
        },
        depthsUsed: depths,
    };
};

export interface StrategyNumberBreakdown {
  num: number;
  totalUnits: number;
  parts: { name: string; units: number; icon: string }[];
}

export const calculateStrategyBets = (
  history: number[],
  config: StrategyConfig,
  sectorSplitMode: SectorSplitMode = '9'
): Map<number, number> => {
  const breakdownMap = calculateStrategyBreakdowns(history, config, sectorSplitMode);
  const bettingMap = new Map<number, number>();
  breakdownMap.forEach((item, num) => {
    if (item.totalUnits > 0) {
      bettingMap.set(num, item.totalUnits);
    }
  });
  return bettingMap;
};

export const calculateStrategyBreakdowns = (
  history: number[],
  config: StrategyConfig,
  sectorSplitMode: SectorSplitMode = '9'
): Map<number, StrategyNumberBreakdown> => {
  const breakdownMap = new Map<number, StrategyNumberBreakdown>();

  const getOrCreate = (n: number): StrategyNumberBreakdown => {
    if (!breakdownMap.has(n)) {
      breakdownMap.set(n, { num: n, totalUnits: 0, parts: [] });
    }
    return breakdownMap.get(n)!;
  };

  const addPartUnits = (num: number, name: string, units: number, icon: string) => {
    if (units <= 0) return;
    const item = getOrCreate(num);
    const existing = item.parts.find(p => p.name === name);
    if (existing) {
      existing.units += units;
    } else {
      item.parts.push({ name, units, icon });
    }
    item.totalUnits += units;
  };

  if (history.length === 0) return breakdownMap;

  const lastSpin = history[history.length - 1];

  const defaultDepths: FiveCriteriaDepths = { colorDepth: 5, finalDepth: 5, seriesDepth: 5, sectorsDepth: 5, pocketsDepth: 5 };
  const effectiveSectorSplit = config.vectorSectorAmount || sectorSplitMode;
  const pred = getMultiCriteriaPrediction(history, defaultDepths, effectiveSectorSplit, config);

  // PART 1: CLOSED NUMBERS
  if (config.closedEnabled && history.length > 0) {
    const recentHistory = history.slice(-config.closedLookback);
    const uniqueHistoryByRecency = [...new Set([...recentHistory].reverse())];
    const candidatePool: number[] = [];
    uniqueHistoryByRecency.forEach(num => {
      if (num !== -1) {
        candidatePool.push(...getNeighbours(num, config.closedNeighbourDepth === 5 ? 2 : 1));
      }
    });
    const finalCandidates = [...new Set(candidatePool)].filter(n => n !== -1);

    if (config.closedProgression === '111') {
      finalCandidates.forEach(c => addPartUnits(c, 'Closed Numbers', 1, '📍'));
    } else {
      const units = config.closedProgression === '235' ? [5, 3, 2] : [3, 2, 1];
      finalCandidates.forEach((candidate, idx) => {
        let u = units[2];
        if (idx < 4) u = units[0];
        else if (idx < 10) u = units[1];
        addPartUnits(candidate, 'Closed Numbers', u, '📍');
      });
    }
  }

  // PART 2: WHEEL VECTOR
  if (config.vectorEnabled && history.length >= 2 && pred?.sector) {
    const topCount = config.vectorTopSectorsCount || 1;
    let targetSectors: { id: string | number; name: string; numbers: number[] }[] = [];

    if (config.vectorRankingMode === 'both') {
      const nextSecs = (pred.sector.topNextSectors || []).slice(0, topCount);
      const histSecs = (pred.sector.topHistorySectors || []).slice(0, topCount);
      const mergedMap = new Map<string | number, { id: string | number; name: string; numbers: number[] }>();
      nextSecs.forEach(s => mergedMap.set(s.id, s));
      histSecs.forEach(s => mergedMap.set(s.id, s));
      targetSectors = Array.from(mergedMap.values());
    } else if (config.vectorRankingMode === 'history_frequency') {
      targetSectors = (pred.sector.topHistorySectors || []).slice(0, topCount);
    } else {
      targetSectors = (pred.sector.topNextSectors || []).slice(0, topCount);
    }

    targetSectors.forEach(sec => {
      sec.numbers.forEach(num => {
        addPartUnits(num, 'Wheel Sector', 1, '🎯');
      });
    });
  }

  // PART 3: POCKET DISTANCE
  if (config.pocketEnabled && history.length >= 2 && pred?.pocket?.topSteps) {
    const pocketTargetsAdded = new Set<number>();
    const topRanks = config.pocketTopRanks || 3;
    const stepsToUse = pred.pocket.topSteps.slice(0, topRanks);

    stepsToUse.forEach(s => {
      pocketTargetsAdded.add(s.cwTarget);
      pocketTargetsAdded.add(s.acwTarget);
    });

    if (config.pocketNextChanceEnabled) {
      pocketTargetsAdded.add(pred.pocket.cwTarget);
      pocketTargetsAdded.add(pred.pocket.acwTarget);
    }

    pocketTargetsAdded.forEach(tNum => {
      addPartUnits(tNum, 'Pocket Distance', 2, '🧭');
    });
  }

  // PART 4: FINAL MATRIX
  if (config.finalEnabled && history.length >= 2 && pred?.finalDigits) {
    const count = config.finalDigitsCount || 3;
    const chosenFinals = pred.finalDigits.slice(0, count);

    ROULETTE_NUMBERS.forEach(n => {
      if (chosenFinals.includes(n % 10)) {
        addPartUnits(n, 'Final Matrix', 1, '🔢');
      }
    });
  }

  // PART 5: DOZENS, COLS, COLOUR & SERIES SIGNALS ARE RENDERED AS DOWNSIDE INDICATORS (NOT IN INDIVIDUAL NUMBERS)

  // PART 6: PATTERN INTELLIGENCE
  if (config.patternNextNumEnabled && history.length >= 2) {
    const nextNums = new Map<number, number>();
    for (let i = 0; i < history.length - 1; i++) {
      if (history[i] === lastSpin) {
        const nextN = history[i + 1];
        nextNums.set(nextN, (nextNums.get(nextN) || 0) + 1);
      }
    }
    nextNums.forEach((count, num) => {
      if (count >= 1) {
        addPartUnits(num, 'Pattern Intelligence', 1, '⚡');
      }
    });
  }

  if (config.patternMatchSequenceEnabled && history.length >= 3) {
    const last2 = history.slice(-2);
    const seqNextNums = new Map<number, number>();
    for (let i = 0; i < history.length - 2; i++) {
      if (history[i] === last2[0] && history[i + 1] === last2[1]) {
        const nextN = history[i + 2];
        seqNextNums.set(nextN, (seqNextNums.get(nextN) || 0) + 1);
      }
    }
    seqNextNums.forEach((count, num) => {
      addPartUnits(num, 'Pattern Intelligence', 1, '⚡');
    });
  }

  return breakdownMap;
};

export interface DozensColsStrategyResult {
  recDozenStrategy: string;
  recColStrategy: string;
  dozensArr: Array<{ id: string; count: number; sleep: number; label: string }>;
  colsArr: Array<{ id: string; count: number; sleep: number; label: string }>;
  sortedDozensBySleep: Array<{ id: string; count: number; sleep: number; label: string }>;
  sortedDozensByHit: Array<{ id: string; count: number; sleep: number; label: string }>;
  sortedColsBySleep: Array<{ id: string; count: number; sleep: number; label: string }>;
  sortedColsByHit: Array<{ id: string; count: number; sleep: number; label: string }>;
  d1: number;
  d2: number;
  d3: number;
  c1: number;
  c2: number;
  c3: number;
  sleepD1: number;
  sleepD2: number;
  sleepD3: number;
  sleepC1: number;
  sleepC2: number;
  sleepC3: number;
  zeroCount: number;
  grid3x3: number[][];
  hotGridStr: string;
}

export const calculateDozensAndColsStrategy = (history: number[]): DozensColsStrategyResult => {
  const total = history.length;
  let d1 = 0, d2 = 0, d3 = 0, zeroCount = 0;
  let c1 = 0, c2 = 0, c3 = 0;
  let sleepD1 = -1, sleepD2 = -1, sleepD3 = -1;
  let sleepC1 = -1, sleepC2 = -1, sleepC3 = -1;
  const grid3x3 = Array.from({ length: 3 }, () => [0, 0, 0]);

  for (let i = 0; i < history.length; i++) {
    const num = history[i];
    if (num === 0) {
      zeroCount++;
    } else {
      const dIdx = num <= 12 ? 0 : num <= 24 ? 1 : 2;
      if (dIdx === 0) d1++;
      else if (dIdx === 1) d2++;
      else d3++;

      const cIdx = (num - 1) % 3;
      if (cIdx === 0) c1++;
      else if (cIdx === 1) c2++;
      else c3++;

      grid3x3[dIdx][cIdx]++;
    }
  }

  for (let i = history.length - 1; i >= 0; i--) {
    const num = history[i];
    const revDist = history.length - 1 - i;
    if (num === 0) continue;

    const dIdx = num <= 12 ? 0 : num <= 24 ? 1 : 2;
    const cIdx = (num - 1) % 3;

    if (dIdx === 0 && sleepD1 === -1) sleepD1 = revDist;
    if (dIdx === 1 && sleepD2 === -1) sleepD2 = revDist;
    if (dIdx === 2 && sleepD3 === -1) sleepD3 = revDist;

    if (cIdx === 0 && sleepC1 === -1) sleepC1 = revDist;
    if (cIdx === 1 && sleepC2 === -1) sleepC2 = revDist;
    if (cIdx === 2 && sleepC3 === -1) sleepC3 = revDist;
  }

  if (sleepD1 === -1) sleepD1 = total;
  if (sleepD2 === -1) sleepD2 = total;
  if (sleepD3 === -1) sleepD3 = total;
  if (sleepC1 === -1) sleepC1 = total;
  if (sleepC2 === -1) sleepC2 = total;
  if (sleepC3 === -1) sleepC3 = total;

  const dozensArr = [
    { id: '1st Dozen', count: d1, sleep: sleepD1, label: '1-12' },
    { id: '2nd Dozen', count: d2, sleep: sleepD2, label: '13-24' },
    { id: '3rd Dozen', count: d3, sleep: sleepD3, label: '25-36' },
  ];

  const colsArr = [
    { id: 'Col 1', count: c1, sleep: sleepC1, label: '1,4,7...' },
    { id: 'Col 2', count: c2, sleep: sleepC2, label: '2,5,8...' },
    { id: 'Col 3', count: c3, sleep: sleepC3, label: '3,6,9...' },
  ];

  const sortedDozensBySleep = [...dozensArr].sort((a, b) => b.sleep - a.sleep);
  const sortedDozensByHit = [...dozensArr].sort((a, b) => b.count - a.count);

  let recDozenStrategy = "";
  if (sortedDozensBySleep[0].sleep >= 5) {
    const hitPartner = sortedDozensByHit[0].id === sortedDozensBySleep[0].id ? sortedDozensByHit[1].id : sortedDozensByHit[0].id;
    recDozenStrategy = `Hedge ${sortedDozensBySleep[0].id} + ${hitPartner}`;
  } else {
    recDozenStrategy = `Play ${sortedDozensByHit[0].id} + ${sortedDozensByHit[1].id}`;
  }

  const sortedColsBySleep = [...colsArr].sort((a, b) => b.sleep - a.sleep);
  const sortedColsByHit = [...colsArr].sort((a, b) => b.count - a.count);

  let recColStrategy = "";
  if (sortedColsBySleep[0].sleep >= 5) {
    const hitPartner = sortedColsByHit[0].id === sortedColsBySleep[0].id ? sortedColsByHit[1].id : sortedColsByHit[0].id;
    recColStrategy = `Hedge ${sortedColsBySleep[0].id} + ${hitPartner}`;
  } else {
    recColStrategy = `Play ${sortedColsByHit[0].id} + ${sortedColsByHit[1].id}`;
  }

  let maxGridVal = -1;
  let hotGridStr = "N/A";
  for (let d = 0; d < 3; d++) {
    for (let c = 0; c < 3; c++) {
      if (grid3x3[d][c] > maxGridVal) {
        maxGridVal = grid3x3[d][c];
        hotGridStr = `Dozen ${d + 1} × Col ${c + 1} (${grid3x3[d][c]} hits)`;
      }
    }
  }

  return {
    recDozenStrategy,
    recColStrategy,
    dozensArr,
    colsArr,
    sortedDozensBySleep,
    sortedDozensByHit,
    sortedColsBySleep,
    sortedColsByHit,
    d1, d2, d3,
    c1, c2, c3,
    sleepD1, sleepD2, sleepD3,
    sleepC1, sleepC2, sleepC3,
    zeroCount,
    grid3x3,
    hotGridStr,
  };
};

export interface StrategySummarySignalItem {
  type: 'dozen' | 'col' | 'color' | 'series';
  label: string;
  value: string;
  badgeClass: string;
}

export const calculateStrategySignals = (
  history: number[],
  config: StrategyConfig
): StrategySummarySignalItem[] => {
  const signals: StrategySummarySignalItem[] = [];
  if (history.length < 1) return signals;

  const dc = calculateDozensAndColsStrategy(history);

  // 1. DOZENS
  if (config.dozensEnabled) {
    // Format concise string to fit cleanly in compact 2-column mobile layout
    const formattedDozenStr = dc.recDozenStrategy
      .replace(/1st Dozen/g, '1st')
      .replace(/2nd Dozen/g, '2nd')
      .replace(/3rd Dozen/g, '3rd');

    signals.push({
      type: 'dozen',
      label: 'DOZEN',
      value: formattedDozenStr,
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-2xs font-black',
    });
  }

  // 2. COLUMNS
  if (config.colsEnabled) {
    const formattedColStr = dc.recColStrategy
      .replace(/Col 1/g, 'Col 1')
      .replace(/Col 2/g, 'Col 2')
      .replace(/Col 3/g, 'Col 3');

    signals.push({
      type: 'col',
      label: 'COLUMN',
      value: formattedColStr,
      badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30 shadow-2xs font-black',
    });
  }

  // 3. COLOUR
  if (config.colorEnabled) {
    const recentColors = history.slice(-10).map(n => NUMBER_COLORS[n]);
    const redCount = recentColors.filter(c => c === 'red').length;
    const blackCount = recentColors.filter(c => c === 'black').length;
    const isRed = redCount >= blackCount;

    signals.push({
      type: 'color',
      label: 'COLOUR',
      value: isRed ? 'RED 🔴' : 'BLACK ⬛',
      badgeClass: isRed
        ? 'bg-red-500/15 text-red-400 border-red-500/30 shadow-2xs font-black'
        : 'bg-zinc-800/90 text-gray-200 border-zinc-700/80 shadow-2xs font-black',
    });
  }

  // 4. SERIES
  if (config.seriesEnabled) {
    const seriesHistory = history.map(getSeriesType);
    const lastNum = history[history.length - 1];
    const sTransitions: Map<SeriesType, number> = new Map();
    const sLook = Math.min(5, seriesHistory.length - 1);
    if (sLook > 0) {
      const targetSlice = seriesHistory.slice(-sLook);
      for (let i = 0; i <= seriesHistory.length - 1 - sLook; i++) {
        const slice = seriesHistory.slice(i, i + sLook);
        if (slice.every((s, idx) => s === targetSlice[idx])) {
          const nextS = seriesHistory[i + sLook];
          if (nextS && nextS !== 'none') {
            sTransitions.set(nextS, (sTransitions.get(nextS) || 0) + 1);
          }
        }
      }
    }
    const likelySeries: SeriesType = Array.from(sTransitions.entries()).sort((a,b) => b[1]-a[1])[0]?.[0] || getSeriesType(lastNum) || 'Top';

    let seriesText = 'Voisins (Top)';
    if (likelySeries === 'Small') seriesText = 'Tiers (Small)';
    else if (likelySeries === 'Middle') seriesText = 'Orphelins (Mid)';

    signals.push({
      type: 'series',
      label: 'SERIES',
      value: seriesText,
      badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30 shadow-2xs font-black',
    });
  }

  return signals;
};

