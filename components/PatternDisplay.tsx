

import React from 'react';
import type { Pattern, GappedPattern } from '../types';
import { NUMBER_COLORS } from '../constants';

interface PatternDisplayProps {
  patterns2: Pattern[];
  patterns3: Pattern[];
  patterns4: Pattern[];
  gappedPatterns: GappedPattern[];
}

const colorClasses = {
  red: 'bg-roulette-red text-white',
  black: 'bg-roulette-black text-white',
  green: 'bg-roulette-green text-white',
};

const PatternCard: React.FC<{ pattern: Pattern }> = ({ pattern }) => (
  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between shadow">
    <div className="flex items-center space-x-2">
      {pattern.sequence.map((num, i) => (
        <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${colorClasses[NUMBER_COLORS[num]]}`}>
          {num}
        </div>
      ))}
    </div>
    <div className="text-right">
        <div className="bg-gold text-roulette-black text-xs font-bold px-2 py-1 rounded-full">
            ALERT
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {pattern.count}x
        </div>
    </div>
  </div>
);

const GappedPatternCard: React.FC<{ pattern: GappedPattern }> = ({ pattern }) => (
  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between shadow">
    <div className="flex items-center space-x-2">
       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${colorClasses[NUMBER_COLORS[pattern.sequence[0]]]}`}>
          {pattern.sequence[0]}
        </div>
       <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200" title="Any number">
        X
      </div>
       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${colorClasses[NUMBER_COLORS[pattern.sequence[1]]]}`}>
          {pattern.sequence[1]}
        </div>
    </div>
     <div className="text-right">
        <div className="bg-gold text-roulette-black text-xs font-bold px-2 py-1 rounded-full">
            ALERT
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {pattern.count}x
        </div>
    </div>
  </div>
);

export const PatternDisplay: React.FC<PatternDisplayProps> = ({ patterns2, patterns3, patterns4, gappedPatterns }) => {
  // Combine all patterns, add a type for differentiation, and sort by count
  const allPatterns = [
    ...patterns4.map(p => ({ ...p, type: 'normal' as const })),
    ...patterns3.map(p => ({ ...p, type: 'normal' as const })),
    ...patterns2.map(p => ({ ...p, type: 'normal' as const })),
    ...gappedPatterns.map(p => ({ ...p, type: 'gapped' as const }))
  ].sort((a, b) => b.count - a.count);

  if (allPatterns.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400">Spin at least 6 times to see patterns.</p>;
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
      {allPatterns.map((p, i) => {
        if (p.type === 'gapped') {
            return <GappedPatternCard key={`gapped-${p.sequence.join('-')}-${i}`} pattern={p as GappedPattern} />;
        }
        return <PatternCard key={`normal-${(p as Pattern).sequence.join('-')}-${i}`} pattern={p as Pattern} />;
      })}
    </div>
  );
};