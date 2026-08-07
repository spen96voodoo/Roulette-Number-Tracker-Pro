

import React, { useMemo } from 'react';
import type { Pattern, GappedPattern, Language } from '../types';
import { NUMBER_COLORS } from '../constants';

interface PatternDisplayProps {
  patterns2?: Pattern[];
  patterns3?: Pattern[];
  patterns4?: Pattern[];
  gappedPatterns?: GappedPattern[];
  history?: number[];
  lang?: Language;
}

const patternLabels = {
  en: {
    title: 'Sequence & Pattern Intelligence',
    waitingMsg: 'Record at least 5-6 spins to detect recurring number pair and triplet patterns.',
    alert: 'ALERT',
    gap: 'GAP',
  },
  zh: {
    title: '连续序列与模式识别智能',
    waitingMsg: '请录入至少5-6轮历史，系统将自动识别重复出现的二连、三连与跨度对码模式。',
    alert: '预警',
    gap: '隔空对码',
  },
  ja: {
    title: 'シーケンス・パターン分析インテリジェンス',
    waitingMsg: '5〜6スピン以上記録すると、ペアやトリプレットなどの反復パターンを検出します。',
    alert: 'アラート',
    gap: 'ギャップ',
  },
  es: {
    title: 'Inteligencia de Secuencia y Patrón',
    waitingMsg: 'Registre al menos 5-6 giros para detectar patrones recurrentes de pares y trío.',
    alert: 'ALERTA',
    gap: 'SALTO',
  },
  ko: {
    title: '시퀀스 및 패턴 지능 분석',
    waitingMsg: '반복되는 페어 및 트리플 패턴을 감지하려면 최소 5-6 스핀을 기록하세요.',
    alert: '경보',
    gap: '간격',
  },
  vi: {
    title: 'Trí Tuệ Mẫu & Chuỗi Lặp',
    waitingMsg: 'Ghi lại ít nhất 5-6 vòng quay để phát hiện mẫu cặp số và bộ ba xuất hiện lặp lại.',
    alert: 'CẢNH BÁO',
    gap: 'CÁCH ĐOẠN',
  },
};

const colorClasses = {
  red: 'bg-roulette-red text-white',
  black: 'bg-roulette-black text-white border border-gray-700',
  green: 'bg-emerald-600 text-white',
};

const PatternCard: React.FC<{ pattern: Pattern }> = ({ pattern }) => (
  <div className="bg-zinc-900 rounded-xl p-3 flex items-center justify-between border border-gray-800 shadow-sm">
    <div className="flex items-center space-x-1.5">
      {pattern.sequence.map((num, i) => (
        <React.Fragment key={i}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${colorClasses[NUMBER_COLORS[num]]}`}>
            {num}
          </div>
          {i < pattern.sequence.length - 1 && <span className="text-gray-600 text-xs">➔</span>}
        </React.Fragment>
      ))}
    </div>
    <div className="text-right flex items-center gap-2">
      <span className="text-[10px] font-black uppercase text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/30">
        ALERT
      </span>
      <span className="text-xs font-black text-white bg-zinc-800 px-2 py-0.5 rounded-lg border border-gray-700">
        {pattern.count}x
      </span>
    </div>
  </div>
);

const GappedPatternCard: React.FC<{ pattern: GappedPattern }> = ({ pattern }) => (
  <div className="bg-zinc-900 rounded-xl p-3 flex items-center justify-between border border-gray-800 shadow-sm">
    <div className="flex items-center space-x-1.5">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${colorClasses[NUMBER_COLORS[pattern.sequence[0]]]}`}>
        {pattern.sequence[0]}
      </div>
      <span className="text-gray-600 text-xs">➔</span>
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black bg-zinc-800 text-gold border border-gold/40" title="Any number">
        ?
      </div>
      <span className="text-gray-600 text-xs">➔</span>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${colorClasses[NUMBER_COLORS[pattern.sequence[1]]]}`}>
        {pattern.sequence[1]}
      </div>
    </div>
    <div className="text-right flex items-center gap-2">
      <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
        GAP
      </span>
      <span className="text-xs font-black text-white bg-zinc-800 px-2 py-0.5 rounded-lg border border-gray-700">
        {pattern.count}x
      </span>
    </div>
  </div>
);

export const PatternDisplay: React.FC<PatternDisplayProps> = ({
  patterns2 = [],
  patterns3 = [],
  patterns4 = [],
  gappedPatterns = [],
  history,
  lang = 'en',
}) => {
  const t = patternLabels[lang] || patternLabels.en;

  const computedData = useMemo(() => {
    if (history && history.length >= 2) {
      const p2Map = new Map<string, { sequence: number[]; count: number }>();
      const p3Map = new Map<string, { sequence: number[]; count: number }>();
      const p4Map = new Map<string, { sequence: number[]; count: number }>();
      const gappedMap = new Map<string, { sequence: [number, number]; count: number }>();

      for (let i = 0; i < history.length - 1; i++) {
        const key = `${history[i]}-${history[i + 1]}`;
        const existing = p2Map.get(key);
        p2Map.set(key, { sequence: [history[i], history[i + 1]], count: (existing?.count || 0) + 1 });
      }

      if (history.length >= 3) {
        for (let i = 0; i < history.length - 2; i++) {
          const key = `${history[i]}-${history[i + 1]}-${history[i + 2]}`;
          const existing = p3Map.get(key);
          p3Map.set(key, { sequence: [history[i], history[i + 1], history[i + 2]], count: (existing?.count || 0) + 1 });

          const gapKey = `${history[i]}-X-${history[i + 2]}`;
          const existingGap = gappedMap.get(gapKey);
          gappedMap.set(gapKey, { sequence: [history[i], history[i + 2]], count: (existingGap?.count || 0) + 1 });
        }
      }

      if (history.length >= 4) {
        for (let i = 0; i < history.length - 3; i++) {
          const key = `${history[i]}-${history[i + 1]}-${history[i + 2]}-${history[i + 3]}`;
          const existing = p4Map.get(key);
          p4Map.set(key, { sequence: [history[i], history[i + 1], history[i + 2], history[i + 3]], count: (existing?.count || 0) + 1 });
        }
      }

      return {
        p2: Array.from(p2Map.values()).filter((p) => p.count >= 2),
        p3: Array.from(p3Map.values()).filter((p) => p.count >= 2),
        p4: Array.from(p4Map.values()).filter((p) => p.count >= 2),
        gapped: Array.from(gappedMap.values()).filter((p) => p.count >= 2),
      };
    }

    return {
      p2: patterns2,
      p3: patterns3,
      p4: patterns4,
      gapped: gappedPatterns,
    };
  }, [history, patterns2, patterns3, patterns4, gappedPatterns]);

  // Combine all patterns and sort by count
  const allPatterns = [
    ...computedData.p4.map((p) => ({ ...p, type: 'normal' as const })),
    ...computedData.p3.map((p) => ({ ...p, type: 'normal' as const })),
    ...computedData.p2.map((p) => ({ ...p, type: 'normal' as const })),
    ...computedData.gapped.map((p) => ({ ...p, type: 'gapped' as const })),
  ].sort((a, b) => b.count - a.count);

  if (allPatterns.length === 0) {
    return (
      <div className="bg-zinc-950 p-6 rounded-2xl border border-gray-800 text-center space-y-1">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.title}</p>
        <p className="text-xs text-gray-500 font-medium">{t.waitingMsg}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
      {allPatterns.map((p, i) => {
        if (p.type === 'gapped') {
          return <GappedPatternCard key={`gapped-${p.sequence.join('-')}-${i}`} pattern={p as GappedPattern} />;
        }
        return <PatternCard key={`normal-${(p as Pattern).sequence.join('-')}-${i}`} pattern={p as Pattern} />;
      })}
    </div>
  );
};
