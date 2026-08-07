import type { RouletteColor } from './types';

export const RED_NUMBERS: number[] = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
export const BLACK_NUMBERS: number[] = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
export const ROULETTE_NUMBERS: number[] = Array.from({ length: 37 }, (_, i) => i);

export const NUMBER_COLORS: { [key: number]: RouletteColor } = ROULETTE_NUMBERS.reduce((acc, num) => {
  if (num === 0) {
    acc[num] = 'green';
  } else if (RED_NUMBERS.includes(num)) {
    acc[num] = 'red';
  } else {
    acc[num] = 'black';
  }
  return acc;
}, {} as { [key: number]: RouletteColor });

export const ROULETTE_HEX_COLORS = {
  red: '#C62828',
  black: '#121212',
  green: '#2E7D32',
};

// Based on French roulette wheel sections
export const VOISINS_SERIES: number[] = [22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25];
export const ORPHELINS_SERIES: number[] = [1, 20, 14, 31, 9, 17, 34, 6];
export const TIERS_SERIES: number[] = [33, 16, 24, 5, 10, 23, 8, 30, 11, 36, 13, 27];

export const EUROPEAN_WHEEL_ORDER: number[] = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

export const WHEEL_SECTORS = [
  { id: 1, name: "Sector 1 (0-Zone)", numbers: [0, 32, 15, 19, 4, 21, 2, 25, 17] },
  { id: 2, name: "Sector 2 (Tiers-R)", numbers: [34, 6, 27, 13, 36, 11, 30, 8, 23] },
  { id: 3, name: "Sector 3 (Tiers-L)", numbers: [10, 5, 24, 16, 33, 1, 20, 14, 31] },
  { id: 4, name: "Sector 4 (Zero-L)", numbers: [9, 22, 18, 29, 7, 28, 12, 35, 3, 26] },
];

