
export type RouletteColor = 'red' | 'black' | 'green';
export type Language = 'en' | 'zh' | 'ja' | 'es' | 'ko' | 'vi';
export type FunctionTab = 'cylinder' | 'distance' | 'dozens' | 'stats' | 'series' | 'matrix' | 'patterns';
export type PageType = 'main' | 'functions' | 'roadmap' | 'setup' | 'dashboard' | 'strategy';

export interface StrategyConfig {
  // 1) Closed Numbers
  closedEnabled: boolean;
  closedLookback: number; // 3, 5, 8, 10, 12
  closedNeighbourDepth: 3 | 5; // Near 3 (N3), Near 5 (N5)
  closedProgression: '111' | '123' | '235';

  // 2) Wheel Vector
  vectorEnabled: boolean;
  vectorSectorAmount: SectorSplitMode; // '4' | '6' | '8' | '9' | '12'
  vectorTopSectorsCount: 1 | 2 | 3;
  vectorHighlightHighest: boolean;
  vectorRankingMode?: 'next_probable' | 'history_frequency' | 'both';

  // 3) Pocket Distance
  pocketEnabled: boolean;
  pocketTopRanks: 1 | 2 | 3 | 4 | 5;
  pocketNextChanceEnabled: boolean;

  // 4) Final Matrix
  finalEnabled: boolean;
  finalDigitsCount: 2 | 3 | 4;

  // 5) Dozen & Column + Colour
  dozensEnabled: boolean;
  colsEnabled: boolean;
  colorEnabled: boolean;

  // 6) Series Strategy
  seriesEnabled: boolean;

  // 7) Pattern
  patternNextNumEnabled: boolean;
  patternMatchSequenceEnabled: boolean;
}

export const DEFAULT_STRATEGY_CONFIG: StrategyConfig = {
  closedEnabled: true,
  closedLookback: 8,
  closedNeighbourDepth: 3,
  closedProgression: '235',

  vectorEnabled: true,
  vectorSectorAmount: '9',
  vectorTopSectorsCount: 1,
  vectorHighlightHighest: true,
  vectorRankingMode: 'next_probable',

  pocketEnabled: true,
  pocketTopRanks: 3,
  pocketNextChanceEnabled: true,

  finalEnabled: true,
  finalDigitsCount: 3,

  dozensEnabled: true,
  colsEnabled: true,
  colorEnabled: true,

  seriesEnabled: true,

  patternNextNumEnabled: true,
  patternMatchSequenceEnabled: true,
};

export interface ToastData {
  id: number;
  trigger: number[];
  predictions: number[][];
}

export interface Pattern {
  sequence: number[];
  count: number;
}

export interface GappedPattern {
  sequence: [number, number];
  count: number;
}

export type SeriesType = 'Top' | 'Middle' | 'Small' | 'none';

export interface FiveCriteriaDepths {
  colorDepth: number;       // 5, 8, 10, 12, 15 (default 10)
  finalDepth: number;       // 5, 8, 10, 12, 15 (default 10)
  seriesDepth: number;      // 5, 8, 10, 12, 15 (default 10)
  sectorsDepth: number;     // 5, 8, 10, 12, 15 (default 10)
  pocketsDepth: number;     // 5, 8, 10, 12, 15 (default 10)
  othersDepth?: number;     // 5, 8, 10, 12, 15 (default 10)
  dozensDepth?: number;     // 5, 8, 10, 12, 15 (default 10)
  topNumbersDepth?: number; // 5, 8, 10, 12, 15 (default 10)
}

export type SectorSplitMode = '4' | '6' | '8' | '9' | '12' | '0';

export interface SectorPredictionData {
  predictedSectorId: number | string;
  predictedSectorName: string;
  numbers: number[];
  confidence: number;
  depthUsed: number;
  rankingMode?: 'next_probable' | 'history_frequency' | 'both';
  topSectors?: {
    id: number | string;
    name: string;
    numbers: number[];
    score?: number;
  }[];
  topNextSectors?: {
    id: number | string;
    name: string;
    numbers: number[];
    score?: number;
  }[];
  topHistorySectors?: {
    id: number | string;
    name: string;
    numbers: number[];
    score?: number;
  }[];
}

export interface PocketStepItem {
  distance: number;
  cwTarget: number;
  acwTarget: number;
}

export interface PocketPredictionData {
  predictedDistance: number;
  cwTarget: number;
  acwTarget: number;
  topSteps: PocketStepItem[];
  confidence: number;
  depthUsed: number;
}

export interface HitStatus {
  color: boolean;
  final: boolean;
  series: boolean;
  top: boolean;
  sector?: boolean;
  pocket?: boolean;
  closed?: boolean;
  dozen?: boolean;
  col?: boolean;
  lastSpin?: number;
  hitUnits?: number;
  topRank?: number | null;
  hitSummary?: string;
}

export interface ComplexPrediction {
  series: SeriesType | null;
  color: RouletteColor | null;
  finalDigits: number[];
  topNumbers: {
    num: number;
    confidence: number;
    score?: number;
    matchedCriteria?: string[];
  }[];
  sector?: SectorPredictionData;
  pocket?: PocketPredictionData;
  depthsUsed?: FiveCriteriaDepths;
}
