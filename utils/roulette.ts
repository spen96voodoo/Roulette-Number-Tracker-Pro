
import { VOISINS_SERIES, ORPHELINS_SERIES, TIERS_SERIES, EUROPEAN_WHEEL_ORDER, NUMBER_COLORS, ROULETTE_NUMBERS, WHEEL_SECTORS } from '../constants';
import type { SeriesType, RouletteColor, ComplexPrediction, FiveCriteriaDepths, SectorSplitMode } from '../types';

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
            { id: 'voisins', name: 'Voisins (10 nums)', numbers: [22, 18, 29, 7, 28, 19, 4, 21, 2, 25] },
            { id: 'orphelins', name: 'Orphelins (8 nums)', numbers: [1, 20, 14, 31, 9, 17, 34, 6] },
            { id: 'tiers', name: 'Tiers (12 nums)', numbers: [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33] },
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
    sectorSplitMode: SectorSplitMode = '9'
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

    // 2. FINAL DIGIT PREDICTION (using finalDepth)
    const lastFinal = lastNumber % 10;
    const fTransitions: Map<number, number> = new Map();
    for (let i = 0; i < history.length - 1; i++) {
        if (history[i] % 10 === lastFinal) {
            const next = history[i+1] % 10;
            fTransitions.set(next, (fTransitions.get(next) || 0) + 1);
        }
    }
    const finalDigits = Array.from(fTransitions.entries())
        .sort((a,b) => b[1] - a[1])
        .slice(0, 3)
        .map(e => e[0]);
    
    if (finalDigits.length === 0) {
        const recentFinals = history.slice(-finalDepth).map(n => n % 10);
        const finalCounts: Map<number, number> = new Map();
        recentFinals.forEach(f => finalCounts.set(f, (finalCounts.get(f) || 0) + 1));
        const topRecentFinals = Array.from(finalCounts.entries())
            .sort((a,b) => b[1] - a[1])
            .slice(0, 2)
            .map(e => e[0]);
        finalDigits.push(...topRecentFinals);
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

    // 4. SECTOR PREDICTION (following last spin to next destination sector, with top hit and closed sector tie-breakers)
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

    // Count overall sector hits across recent history (for top hit sector tie-breaker)
    const totalSectorHits: Map<string, number> = new Map();
    const recentHistoryForSectors = sectorHistory.slice(-Math.max(sectorsDepth, 10));
    recentHistoryForSectors.forEach(sec => {
        totalSectorHits.set(sec.id, (totalSectorHits.get(sec.id) || 0) + 1);
    });

    // 1-step destination transitions following lastSector ("where does last spin sector go next")
    const destinationCounts: Map<string, number> = new Map();
    for (let i = 0; i < sectorHistory.length - 1; i++) {
        if (sectorHistory[i].id === lastSector.id) {
            const nextSec = sectorHistory[i + 1];
            if (nextSec) {
                destinationCounts.set(nextSec.id, (destinationCounts.get(nextSec.id) || 0) + 1);
            }
        }
    }

    // Sequence pattern transitions (secLook depth)
    const secLook = Math.min(sectorsDepth, sectorHistory.length - 1);
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

    // Calculate composite score for each active sector
    const sectorScores = activeSectors.map(sec => {
        const destTransitions = destinationCounts.get(sec.id) || 0;
        const seqTransitions = seqSectorTransitions.get(sec.id) || 0;
        const totalHits = totalSectorHits.get(sec.id) || 0;
        const isClosed = closedSectorIds.has(sec.id);

        // Scoring hierarchy:
        // 1. Next destination sector transition from last spin (100 pts per hit)
        // 2. Multi-step sequence match (50 pts per match)
        // 3. Top hit sector frequency in recent spins (10 pts per hit)
        // 4. Closed / Wheel-adjacent sector bonus (15 pts)
        const score = (destTransitions * 100) + (seqTransitions * 50) + (totalHits * 10) + (isClosed ? 15 : 0);

        return {
            sector: sec,
            score,
            destTransitions,
            seqTransitions,
            totalHits,
            isClosed,
        };
    });

    sectorScores.sort((a, b) => b.score - a.score);
    const topScored = sectorScores[0];
    const likelySector = topScored?.sector || activeSectors[0];

    // Dynamic sector confidence based on destination transition strength
    const hasTransitions = (topScored?.destTransitions || 0) > 0;
    const sectorConfidence = Math.min(98, Math.max(65, 70 + (topScored?.destTransitions || 0) * 8 + (topScored?.isClosed ? 5 : 0)));

    // 5. POCKETS DISTANCE STEP PREDICTION (using pocketsDepth)
    const displacements: number[] = [];
    const pLook = Math.min(pocketsDepth, history.length - 1);
    const recentHistoryForPockets = history.slice(-(pLook + 1));
    for (let i = 0; i < recentHistoryForPockets.length - 1; i++) {
        const start = EUROPEAN_WHEEL_ORDER.indexOf(recentHistoryForPockets[i]);
        const end = EUROPEAN_WHEEL_ORDER.indexOf(recentHistoryForPockets[i+1]);
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
    // Ensure we have top 1, top 2, and top 3 distinct distance steps (defaulting to 1, 2, 3 if needed)
    const fallbackSteps = [1, 2, 3];
    const topDisps: number[] = [];
    for (const d of sortedDisps) {
        if (!topDisps.includes(d)) topDisps.push(d);
        if (topDisps.length === 3) break;
    }
    for (const fb of fallbackSteps) {
        if (topDisps.length >= 3) break;
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

