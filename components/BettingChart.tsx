

import React from 'react';
import { NUMBER_COLORS } from '../constants';

interface BettingChartProps {
  bettingMap: Map<number, number>;
}

const colorClasses = {
  red: 'bg-roulette-red text-white',
  black: 'bg-roulette-black text-white',
  green: 'bg-roulette-green text-white',
};

const betAmountClasses: { [key: number]: string } = {
  5: 'bg-gold text-black ring-2 ring-offset-2 ring-offset-gray-800 ring-gold',
  3: 'bg-purple-500 text-white',
  2: 'bg-yellow-200 text-black',
  1: 'bg-blue-400 text-white',
}

export const BettingChart: React.FC<BettingChartProps> = ({ bettingMap }) => {
  
  if (bettingMap.size === 0) {
      return <p className="text-center text-gray-500 dark:text-gray-400 py-4">Spin at least 2 times to see betting suggestions.</p>;
  }

  const renderNumberButton = (num: number) => {
    const betAmount = bettingMap.get(num);
    const hasBet = betAmount !== undefined;

    return (
      <button
        key={num}
        disabled={true} // Not clickable, just for display
        className={`font-semibold rounded-md text-sm md:text-lg w-full aspect-square flex items-center justify-center relative transition-all duration-300
          ${hasBet ? colorClasses[NUMBER_COLORS[num]] : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}
        `}
      >
        {num}
        {hasBet && (
          <span className={`absolute -top-0.5 -right-0.5 ${betAmount === 3 ? 'w-5 h-5 text-xs md:w-6 md:h-6 md:text-sm' : 'w-4 h-4 text-[10px] md:w-5 md:h-5 md:text-xs'} rounded-full flex items-center justify-center font-bold ${betAmountClasses[betAmount]}`}>
            {betAmount}
          </span>
        )}
      </button>
    );
  }

  return (
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
  );
};