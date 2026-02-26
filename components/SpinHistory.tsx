import React from 'react';
import { NUMBER_COLORS } from '../constants';

interface SpinHistoryProps {
  history: number[];
}

const colorClasses = {
  red: 'bg-roulette-red text-white',
  black: 'bg-roulette-black text-white',
  green: 'bg-roulette-green text-white',
};

export const SpinHistory: React.FC<SpinHistoryProps> = ({ history }) => {
  return (
    <div className="flex flex-wrap gap-1.5 p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md max-h-48 md:max-h-72 overflow-y-auto custom-scrollbar">
      {[...history].reverse().map((num, index) => (
        <div 
          key={`${num}-${history.length - 1 - index}`}
          className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center font-black text-xs md:text-sm shadow-sm flex-shrink-0 ${colorClasses[NUMBER_COLORS[num]]} transition-transform active:scale-95`}
          title={`Spin #${history.length - index}`}
        >
          {num}
        </div>
      ))}
    </div>
  );
};