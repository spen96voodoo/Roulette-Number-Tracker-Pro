
export type RouletteColor = 'red' | 'black' | 'green';
export type Language = 'en' | 'zh' | 'ja' | 'es' | 'ko';

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

export interface ComplexPrediction {
  series: SeriesType | null;
  topNumbers: { num: number; confidence: number }[];
  color: RouletteColor | null;
  finalDigits: number[];
}