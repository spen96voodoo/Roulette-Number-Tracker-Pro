
import { VOISINS_SERIES, ORPHELINS_SERIES, TIERS_SERIES, EUROPEAN_WHEEL_ORDER } from '../constants';
import type { SeriesType } from '../types';

export const getSeriesType = (num: number): SeriesType => {
    if (VOISINS_SERIES.includes(num)) return 'Top';
    if (ORPHELINS_SERIES.includes(num)) return 'Middle';
    if (TIERS_SERIES.includes(num)) return 'Small';
    return 'none';
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
