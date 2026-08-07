import React, { useState, useEffect } from 'react';
import { NUMBER_COLORS } from '../constants';

interface NumberGridProps {
  onNumberSelect: (num: number) => void;
  disabled: boolean;
}

type ViewMode = 'board' | 'keypad';

const colorClasses = {
  red: 'bg-roulette-red hover:bg-red-600 active:bg-red-800 text-white shadow-[0_2px_0_#9a1f1f] active:shadow-none active:translate-y-[2px]',
  black: 'bg-roulette-black hover:bg-zinc-800 active:bg-gray-900 text-white border border-gray-800/80 shadow-[0_2px_0_#000000] active:shadow-none active:translate-y-[2px]',
  green: 'bg-roulette-green hover:bg-green-600 active:bg-green-800 text-white shadow-[0_2px_0_#1e5622] active:shadow-none active:translate-y-[2px]',
};

export const NumberGrid: React.FC<NumberGridProps> = ({ onNumberSelect, disabled }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem('roulette_numbergrid_mode');
      return (saved === 'keypad' || saved === 'board') ? saved : 'board';
    } catch {
      return 'board';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('roulette_numbergrid_mode', viewMode);
    } catch {
      // Ignore storage errors
    }
  }, [viewMode]);

  return (
    <div className={`w-full max-w-full select-none touch-manipulation ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {/* Header with View Mode Switcher */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-gold flex items-center gap-1">
          <span>🎯</span> Number Input Pad
        </span>
        <div className="flex bg-zinc-800/80 p-0.5 rounded-lg border border-gray-700/50">
          <button
            type="button"
            onClick={() => setViewMode('board')}
            className={`px-2 py-0.5 text-[9px] font-black rounded transition-all ${
              viewMode === 'board'
                ? 'bg-gold text-black shadow-xs font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Classic 13-Column Table Board"
          >
            Table (13 Col)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('keypad')}
            className={`px-2 py-0.5 text-[9px] font-black rounded transition-all ${
              viewMode === 'keypad'
                ? 'bg-gold text-black shadow-xs font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
            title="6x6 Mobile Keypad Grid"
          >
            Keypad (6x6)
          </button>
        </div>
      </div>

      {viewMode === 'board' ? (
        /* CLASSIC ROULETTE BOARD - Fits 100% width on Mobile without horizontal scroll */
        <div className="w-full flex gap-0.5 sm:gap-1.5">
          {/* Zero Button */}
          <button
            type="button"
            onClick={() => onNumberSelect(0)}
            disabled={disabled}
            className={`${colorClasses.green} font-black text-xs xs:text-sm sm:text-lg md:text-xl rounded-md sm:rounded-xl transition-all flex items-center justify-center w-[7%] min-w-[20px] max-w-[36px] sm:w-12 self-stretch touch-manipulation active:scale-95 shrink-0`}
            aria-label="Number 0"
          >
            0
          </button>

          {/* Numbers 1-36 in 12 Columns x 3 Rows */}
          <div className="flex-1 grid grid-cols-12 gap-0.5 sm:gap-1.5 min-w-0">
            {Array.from({ length: 12 }).map((_, colIndex) => (
              <div key={colIndex} className="flex flex-col-reverse gap-0.5 sm:gap-1.5 min-w-0">
                {Array.from({ length: 3 }).map((_, rowIndex) => {
                  const num = colIndex * 3 + rowIndex + 1;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onNumberSelect(num)}
                      disabled={disabled}
                      className={`${colorClasses[NUMBER_COLORS[num]]} font-black rounded sm:rounded-lg text-[10px] min-[360px]:text-[11px] xs:text-xs sm:text-sm md:text-base transition-all w-full h-8 xs:h-9 sm:h-10 flex items-center justify-center touch-manipulation active:scale-90 p-0 leading-none`}
                      aria-label={`Number ${num}`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* LARGE MOBILE KEYPAD (6x6 Grid + Zero Top Bar) */
        <div className="w-full space-y-1">
          {/* Zero Full-width Bar */}
          <button
            type="button"
            onClick={() => onNumberSelect(0)}
            disabled={disabled}
            className={`${colorClasses.green} font-black text-xs sm:text-sm rounded-lg py-1.5 w-full flex items-center justify-center touch-manipulation active:scale-98 shadow-sm`}
            aria-label="Number 0"
          >
            0 (ZERO)
          </button>

          {/* 6 columns x 6 rows grid */}
          <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
            {Array.from({ length: 36 }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                type="button"
                onClick={() => onNumberSelect(num)}
                disabled={disabled}
                className={`${colorClasses[NUMBER_COLORS[num]]} font-black rounded-lg text-xs sm:text-sm py-2 sm:py-2.5 flex items-center justify-center touch-manipulation active:scale-95 transition-transform shadow-xs`}
                aria-label={`Number ${num}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
