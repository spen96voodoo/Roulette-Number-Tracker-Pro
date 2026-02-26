import React from 'react';
import { NUMBER_COLORS } from '../constants';

interface NumberGridProps {
  onNumberSelect: (num: number) => void;
  disabled: boolean;
}

const colorClasses = {
  red: 'bg-roulette-red active:bg-red-800 text-white shadow-[0_3px_0_#9a1f1f] active:shadow-none active:translate-y-[2px]',
  black: 'bg-roulette-black active:bg-gray-900 text-white shadow-[0_3px_0_#000000] active:shadow-none active:translate-y-[2px]',
  green: 'bg-roulette-green active:bg-green-800 text-white shadow-[0_3px_0_#1e5622] active:shadow-none active:translate-y-[2px]',
};

export const NumberGrid: React.FC<NumberGridProps> = ({ onNumberSelect, disabled }) => {
  return (
    <div className={`flex gap-2 transition-opacity duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {/* Zero Button */}
      <button 
        onClick={() => onNumberSelect(0)} 
        disabled={disabled}
        className={`${colorClasses.green} font-black text-2xl md:text-3xl rounded-xl transition-all transform flex-shrink-0 flex items-center justify-center w-14 md:w-20 self-stretch touch-manipulation`}
        aria-label="Number 0"
      >
        0
      </button>
      
      {/* Numbers 1-36 */}
      <div className="flex-grow grid grid-cols-12 gap-1.5 md:gap-2">
        {Array.from({ length: 12 }).map((_, colIndex) => (
          <div key={colIndex} className="flex flex-col-reverse gap-1.5 md:gap-2">
            {Array.from({ length: 3 }).map((_, rowIndex) => {
              const num = colIndex * 3 + rowIndex + 1;
              return (
                <button
                  key={num}
                  onClick={() => onNumberSelect(num)}
                  disabled={disabled}
                  className={`${colorClasses[NUMBER_COLORS[num]]} font-black rounded-xl text-base sm:text-lg md:text-xl transition-all transform w-full aspect-square flex items-center justify-center touch-manipulation`}
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
  );
};