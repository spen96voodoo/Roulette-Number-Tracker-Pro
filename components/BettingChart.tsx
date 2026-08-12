

import React from 'react';
import { NUMBER_COLORS } from '../constants';
import type { StrategySummarySignalItem } from '../utils/roulette';

interface BettingChartProps {
  bettingMap: Map<number, number>;
  signals?: StrategySummarySignalItem[];
}

const colorClasses = {
  red: 'bg-roulette-red text-white',
  black: 'bg-roulette-black text-white',
  green: 'bg-roulette-green text-white',
};

const getBetAmountBadgeStyle = (amt: number) => {
  if (amt >= 6) return 'bg-emerald-400 text-black ring-2 ring-emerald-300 font-black shadow-md';
  if (amt >= 4) return 'bg-gold text-black ring-2 ring-yellow-300 font-black shadow-sm';
  if (amt === 3) return 'bg-amber-400 text-black font-black';
  if (amt === 2) return 'bg-yellow-200 text-black font-bold';
  return 'bg-blue-400 text-white font-bold';
};

export const BettingChart: React.FC<BettingChartProps> = ({ bettingMap, signals = [] }) => {
  if (bettingMap.size === 0 && signals.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-xs font-bold uppercase tracking-wider">Spin at least 2 times to see strategy predictions.</p>;
  }

  const renderNumberButton = (num: number) => {
    const betAmount = bettingMap.get(num);
    const hasBet = betAmount !== undefined && betAmount > 0;

    return (
      <button
        key={num}
        disabled={true} // Not clickable, just for display
        className={`font-semibold rounded-md text-sm md:text-lg w-full aspect-square flex items-center justify-center relative transition-all duration-300
          ${hasBet ? colorClasses[NUMBER_COLORS[num]] : 'bg-gray-200 dark:bg-gray-900/40 text-gray-500 border border-transparent dark:border-gray-800/50'}
        `}
      >
        {num}
        {hasBet && (
          <span className={`absolute -top-1 -right-1 z-10 ${betAmount >= 3 ? 'min-w-5 h-5 px-1 text-[11px]' : 'min-w-4 h-4 text-[10px]'} rounded-full flex items-center justify-center font-extrabold ${getBetAmountBadgeStyle(betAmount)}`}>
            {betAmount}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1 md:gap-2">
        {/* Zero Button */}
        <div className="flex-shrink-0 w-10 md:w-14 self-stretch">
          {renderNumberButton(0)}
        </div>
        
        {/* Numbers 1-36 */}
        <div className="flex-grow grid grid-cols-12 gap-0.5 md:gap-1">
          {Array.from({ length: 12 }).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col-reverse gap-0.5 md:gap-1">
              {Array.from({ length: 3 }).map((_, rowIndex) => {
                const num = colIndex * 3 + rowIndex + 1;
                return renderNumberButton(num);
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Downside Strategy Signals (Dozen, Column, Colour, Series) */}
      {signals && signals.length > 0 && (
        <div className="pt-1.5 border-t border-gray-800/60 flex flex-wrap items-center justify-around gap-1.5 bg-zinc-950/60 p-1.5 rounded-lg">
          {signals.map((sig, idx) => (
            <div
              key={idx}
              className={`px-2 py-1 rounded-md border text-[10px] font-black uppercase flex items-center gap-1.5 shadow-xs ${sig.badgeClass}`}
            >
              <span className="text-[9px] opacity-75 font-bold">{sig.label}:</span>
              <span className="font-extrabold tracking-tight">{sig.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};