import React, { useMemo, useRef, useEffect } from 'react';
import { getSeriesType } from '../utils/roulette';
import { SeriesIconDisplay } from './SeriesIconDisplay';
import type { SeriesType } from '../types';

interface SeriesTrackerProps {
  history: number[];
}

const SeriesColumnHeader: React.FC<{ series: SeriesType }> = ({ series }) => {
    // Top = Voisins (▲), Middle = Orphelins (■), Small = Tiers (▼)
    const color = series === 'Top' ? 'text-blue-400' : series === 'Middle' ? 'text-purple-400' : 'text-yellow-400';
    const symbol = series === 'Top' ? '▲' : series === 'Middle' ? '■' : '▼';
    
    return (
        <div className="flex flex-col items-center mb-0.5">
            <span className={`text-2xl font-black ${color} leading-none transition-all drop-shadow-sm`}>
                {symbol}
            </span>
            <div className={`w-1 h-0.5 mt-0.5 rounded-full ${series === 'Top' ? 'bg-blue-400' : series === 'Middle' ? 'bg-purple-400' : 'bg-yellow-400'} opacity-30`}></div>
        </div>
    );
};

interface HistoryItem {
    num: number;
    index: number;
}

export const SeriesTracker: React.FC<SeriesTrackerProps> = ({ history }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const columns = useMemo(() => {
        if (history.length === 0) return [];
        
        const processedHistory: HistoryItem[] = history.map((num, idx) => ({ num, index: idx + 1 }));
        
        const cols: { series: SeriesType; items: HistoryItem[] }[] = [];
        let currentCol: { series: SeriesType; items: HistoryItem[] } | null = null;

        for (const item of processedHistory) {
            const series = getSeriesType(item.num);
            if (series === 'none') continue;

            if (currentCol && currentCol.series === series) {
                currentCol.items.push(item);
            } else {
                currentCol = { series, items: [item] };
                cols.push(currentCol);
            }
        }
        return cols;
    }, [history]);

    // Ensure screen always shows the newest spin (scroll to end)
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            requestAnimationFrame(() => {
                container.scrollTo({
                    left: container.scrollWidth,
                    behavior: 'smooth'
                });
            });
        }
    }, [columns, history.length]);
    
    if (columns.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <p className="text-center text-gray-400 font-black text-[10px] uppercase tracking-widest">Waiting for Data</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full gap-1">
            <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    Sector Roadmap
                </span>
                <span className="text-[9px] font-bold text-gold uppercase tracking-tighter bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20">
                    Live History
                </span>
            </div>

            <div 
                ref={scrollContainerRef} 
                className="flex flex-row gap-1.5 p-1.5 bg-gray-100 dark:bg-gray-900/50 rounded-2xl overflow-x-auto h-full w-full border border-gray-200 dark:border-gray-800/50 custom-scrollbar-visible"
                style={{ 
                    scrollbarWidth: 'auto', 
                    scrollbarColor: '#FFD700 rgba(0,0,0,0.1)',
                    msOverflowStyle: 'auto'
                }}
            >
                <style>{`
                    .custom-scrollbar-visible::-webkit-scrollbar {
                        height: 4px;
                        display: block;
                    }
                    .custom-scrollbar-visible::-webkit-scrollbar-track {
                        background: rgba(0,0,0,0.05);
                        border-radius: 10px;
                    }
                    .custom-scrollbar-visible::-webkit-scrollbar-thumb {
                        background: #FFD700;
                        border-radius: 10px;
                    }
                `}</style>
                <div className="flex flex-row gap-2">
                    {columns.map((col, colIndex) => (
                        <div key={colIndex} className="flex flex-col items-center gap-0.5 flex-shrink-0 min-w-[36px]">
                            <SeriesColumnHeader series={col.series} />
                            <div className="flex flex-col gap-0.5">
                                {col.items.map((item, itemIndex) => (
                                    <div key={`${item.num}-${itemIndex}-${colIndex}`} className="relative group animate-pop">
                                        <SeriesIconDisplay num={item.num} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center items-center gap-4 text-[9px] font-black uppercase text-gray-500 tracking-widest pt-0.5">
                <div className="flex items-center gap-1">
                    <span className="text-blue-400 text-sm">▲</span> Voisins
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-purple-400 text-sm">■</span> Orphelins
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-sm">▼</span> Tiers
                </div>
            </div>
        </div>
    );
};