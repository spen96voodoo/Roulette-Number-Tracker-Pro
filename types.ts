
export type RouletteColor = 'red' | 'black' | 'green';
export type Language = 'en' | 'zh' | 'ja' | 'es' | 'ko' | 'vi';
export type FunctionTab = 'cylinder' | 'distance' | 'dozens' | 'stats' | 'series' | 'matrix' | 'patterns';
export type PageType = 'main' | 'functions' | 'roadmap' | 'setup';

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
  colorDepth: number;     // 3, 4, 5, 8, 10 (default 5)
  finalDepth: number;     // 3, 4, 5, 8, 10 (default 5)
  seriesDepth: number;    // 3, 4, 5, 8, 10 (default 5)
  sectorsDepth: number;   // 3, 4, 5, 8, 10 (default 5)
  pocketsDepth: number;   // 3, 4, 5, 8, 10 (default 5)
}

export type SectorSplitMode = '4' | '6' | '8' | '9' | '12' | '0';

export interface SectorPredictionData {
  predictedSectorId: number | string;
  predictedSectorName: string;
  numbers: number[];
  confidence: number;
  depthUsed: number;
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
