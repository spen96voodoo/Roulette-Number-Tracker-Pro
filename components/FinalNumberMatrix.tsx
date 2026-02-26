import React, { useMemo } from 'react';

interface FinalNumberMatrixProps {
  history: number[];
}

export const FinalNumberMatrix: React.FC<FinalNumberMatrixProps> = ({ history }) => {
  // Sequence as requested: 1, 2, 3, 4, 5, 6, 7, 8, 9, 0
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const rowDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const lastFinalDigit = history.length > 0 ? history[history.length - 1] % 10 : null;

  const { matrix, lastTransition } = useMemo(() => {
    const m = Array.from({ length: 10 }, () => Array(10).fill(0));
    let lastT: { prev: number, next: number } | null = null;
    
    if (history.length < 2) return { matrix: m, lastTransition: null };

    for (let i = 0; i < history.length - 1; i++) {
      const prevFinal = history[i] % 10;
      const nextFinal = history[i + 1] % 10;
      m[prevFinal][nextFinal]++;
      
      if (i === history.length - 2) {
        lastT = { prev: prevFinal, next: nextFinal };
      }
    }
    
    return { matrix: m, lastTransition: lastT };
  }, [history]);

  const maxVal = useMemo(() => {
    let max = 0;
    matrix.forEach(row => row.forEach(val => {
      if (val > max) max = val;
    }));
    return max || 1;
  }, [matrix]);

  const getCellStyles = (val: number, isLast: boolean, isActiveRow: boolean) => {
    if (isLast) return 'bg-gold text-black z-10 scale-110 shadow-[0_0_15px_rgba(255,215,0,0.9)] ring-2 ring-white dark:ring-gray-900 border-none font-black';
    
    // If it's the active row (based on last spin), give it a subtle pulse or glow if it has data
    if (isActiveRow && val > 0) {
      return 'bg-yellow-400/40 text-gray-900 dark:text-white border-yellow-500 shadow-[0_0_8px_rgba(255,215,0,0.4)] animate-pulse';
    }

    if (val === 0) return 'bg-gray-100 dark:bg-gray-800/40 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700/50';
    
    const intensity = (val / maxVal);
    if (intensity > 0.8) return 'bg-yellow-500 text-white border-yellow-600';
    if (intensity > 0.5) return 'bg-yellow-500/60 text-white border-yellow-500/40';
    if (intensity > 0.2) return 'bg-yellow-500/30 text-gray-800 dark:text-gray-100 border-yellow-500/20';
    return 'bg-yellow-500/10 text-gray-600 dark:text-gray-400 border-yellow-500/10';
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Matrix Header Labels */}
      <div className="flex justify-between items-center px-1 mb-1">
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Last Final:</span>
           {lastFinalDigit !== null ? (
             <div className="w-7 h-7 rounded-full bg-gold text-black flex items-center justify-center font-black text-sm shadow-md animate-bounce">
                {lastFinalDigit}
             </div>
           ) : <span className="text-gray-400 text-[10px] font-bold">-</span>}
        </div>
        <div className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-2">
          <span className="hidden sm:inline">Active Row: {lastFinalDigit !== null ? `${lastFinalDigit}-X` : 'None'}</span>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* 10x10 Grid */}
      <div className="grid grid-cols-10 gap-0.5 sm:gap-1 bg-gray-300 dark:bg-black/40 p-1 rounded-lg">
        {rowDigits.map(rowIdx => (
          <React.Fragment key={`row-${rowIdx}`}>
            {digits.map(colIdx => {
              const val = matrix[rowIdx][colIdx];
              const isLast = lastTransition?.prev === rowIdx && lastTransition?.next === colIdx;
              const isActiveRow = lastFinalDigit === rowIdx;
              
              return (
                <div 
                  key={`${rowIdx}-${colIdx}`} 
                  className={`
                    aspect-square flex flex-col items-center justify-center rounded-sm transition-all duration-300 border
                    ${getCellStyles(val, isLast, isActiveRow)}
                  `}
                >
                  <span className={`text-[10px] sm:text-[12px] font-black leading-none mb-0.5 ${isLast ? 'text-black' : (isActiveRow && val > 0 ? 'text-yellow-600 dark:text-gold' : 'opacity-90')}`}>
                    {rowIdx}-{colIdx}
                  </span>
                  {val > 0 && (
                    <span className={`text-[11px] sm:text-[13px] font-black leading-none ${isLast ? 'text-black' : 'text-inherit'}`}>
                      {val}x
                    </span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Legend & Help Text */}
      <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 px-1 mt-1 uppercase tracking-tighter">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 bg-gold rounded-sm shadow-[0_0_4px_gold]"></div>
                <span className="text-gold">Last Hit</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 bg-yellow-400/40 border border-yellow-500 animate-pulse"></div>
                <span>Next Possible</span>
            </div>
        </div>
        <div className="flex items-center gap-1">
            <span>Freq Scale:</span>
            <div className="flex h-1.5 w-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                <div className="w-1/3 bg-yellow-500/20"></div>
                <div className="w-1/3 bg-yellow-500/60"></div>
                <div className="w-1/3 bg-yellow-500"></div>
            </div>
        </div>
      </div>
    </div>
  );
};