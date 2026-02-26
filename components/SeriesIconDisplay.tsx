import React from 'react';
import { NUMBER_COLORS } from '../constants';
import { getSeriesType } from '../utils/roulette';

export interface SeriesIconDisplayProps {
  num: number;
}

export const SeriesIconDisplay: React.FC<SeriesIconDisplayProps> = ({ num }) => {
    const series = getSeriesType(num);
    const colorClass = {
        red: 'bg-roulette-red text-white',
        black: 'bg-roulette-black text-white',
        green: 'bg-roulette-green text-white',
    }[NUMBER_COLORS[num]];

    const iconColor = "text-white/20"; 

    const icon = () => {
        if (num === 0) return null;

        const iconContainerClasses = "absolute inset-0 flex items-center justify-center";
        const svgClasses = "w-3/4 h-3/4";

        switch(series) {
            case 'Top':
                return <div className={iconContainerClasses}><svg viewBox="0 0 100 85" className={svgClasses} fill="currentColor"><polygon points="50,0 100,85 0,85" /></svg></div>;
            case 'Middle':
                return <div className={iconContainerClasses}><svg viewBox="0 0 100 100" className={svgClasses} fill="currentColor"><rect width="100" height="100" rx="8" /></svg></div>;
            case 'Small':
                return <div className={iconContainerClasses}><svg viewBox="0 0 100 85" className={svgClasses} fill="currentColor"><polygon points="0,0 100,0 50,85" /></svg></div>;
            default:
                return null;
        }
    }

    return (
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shadow-md flex-shrink-0 relative transition-transform active:scale-90 touch-manipulation ${colorClass} ${iconColor}`}>
            {icon()}
            <span className="relative z-10 text-white drop-shadow-sm">{num}</span>
        </div>
    );
};