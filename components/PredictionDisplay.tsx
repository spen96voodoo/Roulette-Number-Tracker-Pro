import React from 'react';
import type { ComplexPrediction, Language } from '../types';
import { NUMBER_COLORS } from '../constants';
import type { HitStatus } from '../App';

const colorClasses = {
    red: 'bg-roulette-red text-white',
    black: 'bg-roulette-black text-white',
    green: 'bg-roulette-green text-white',
};

const labels = {
    en: { color: "Color", final: "Final", series: "Series", top: "Top Numbers", hit: "HIT!", analyzing: "Analyzing..." },
    zh: { color: "颜色", final: "尾数", series: "分区", top: "核心推荐", hit: "命中!", analyzing: "正在分析..." },
    ja: { color: "カラー", final: "下一桁", series: "セクター", top: "推奨番号", hit: "当たり!", analyzing: "分析中..." },
    es: { color: "Color", final: "Final", series: "Serie", top: "Top Números", hit: "¡ACIERTO!", analyzing: "Analizando..." },
    ko: { color: "색상", final: "끝수", series: "구역", top: "추천 번호", hit: "적중!", analyzing: "분석 중..." }
};

const SeriesIcon: React.FC<{ type: string | null }> = ({ type }) => {
    if (!type || type === 'none') return <span className="text-gray-500">?</span>;
    const color = type === 'Top' ? 'text-blue-400' : type === 'Middle' ? 'text-purple-400' : 'text-yellow-400';
    if (type === 'Top') return <span className={`text-[12px] leading-none ${color}`}>▲</span>;
    if (type === 'Middle') return <span className={`text-[12px] leading-none ${color}`}>■</span>;
    if (type === 'Small') return <span className={`text-[12px] leading-none ${color}`}>▼</span>;
    return <span className="text-gray-500">?</span>;
};

interface PredictionDisplayProps {
    prediction: ComplexPrediction | null;
    lastHitStatus?: HitStatus | null;
    lang: Language;
}

export const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ prediction, lastHitStatus, lang }) => {
    const t = labels[lang] || labels['en'];
    if (!prediction) {
        return (
            <div className="bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded flex items-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter animate-pulse">{t.analyzing}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 sm:gap-3 bg-gray-100 dark:bg-gray-700/80 px-2 py-1 rounded-md shadow-inner transition-all">
            <div className={`flex flex-col items-center border-r border-gray-300 dark:border-gray-600 pr-1.5 sm:pr-2 relative ${lastHitStatus?.color ? 'animate-bounce' : ''}`}>
                <span className={`text-[7px] font-bold uppercase leading-none mb-1 ${lastHitStatus?.color ? 'text-green-500' : 'text-gray-400'}`}>
                    {t.color} {lastHitStatus?.color && t.hit}
                </span>
                {prediction.color ? (
                    <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[9px] font-black shadow-sm transition-all ${colorClasses[prediction.color]} ${lastHitStatus?.color ? 'ring-2 ring-green-400' : ''}`}>
                        {prediction.color === 'red' ? 'R' : 'B'}
                    </div>
                ) : <span className="text-[9px] text-gray-500 font-black">?</span>}
            </div>

            <div className={`flex flex-col items-center border-r border-gray-300 dark:border-gray-600 pr-1.5 sm:pr-2 min-w-[32px] ${lastHitStatus?.final ? 'animate-bounce' : ''}`}>
                <span className={`text-[7px] font-bold uppercase leading-none mb-1 ${lastHitStatus?.final ? 'text-green-500' : 'text-gray-400'}`}>
                    {t.final} {lastHitStatus?.final && t.hit}
                </span>
                <div className="flex gap-0.5">
                    {prediction.finalDigits.length > 0 ? (
                        prediction.finalDigits.map((digit, idx) => (
                            <span key={idx} className={`text-[10px] font-black transition-all ${lastHitStatus?.final ? 'text-green-400' : 'text-gold'}`}>
                                {digit}
                            </span>
                        ))
                    ) : ( <span className="text-[10px] font-black text-gray-500">?</span> )}
                </div>
            </div>

            <div className={`flex flex-col items-center border-r border-gray-300 dark:border-gray-600 pr-1.5 sm:pr-2 ${lastHitStatus?.series ? 'animate-bounce' : ''}`}>
                <span className={`text-[7px] font-bold uppercase leading-none mb-1 ${lastHitStatus?.series ? 'text-green-500' : 'text-gray-400'}`}>
                    {t.series} {lastHitStatus?.series && t.hit}
                </span>
                <div className={`flex items-center justify-center h-4 transition-all ${lastHitStatus?.series ? 'scale-125' : ''}`}>
                    <SeriesIcon type={prediction.series} />
                </div>
            </div>

            <div className={`flex flex-col ${lastHitStatus?.top ? 'animate-bounce' : ''}`}>
                <span className={`text-[7px] font-bold uppercase leading-none mb-1 ${lastHitStatus?.top ? 'text-green-500' : 'text-gray-400'}`}>
                    {t.top} {lastHitStatus?.top && t.hit}
                </span>
                <div className="flex gap-1.5">
                    {prediction.topNumbers.map(({ num, confidence }) => (
                        <div key={num} className="flex items-center gap-0.5">
                            <span className={`text-[8px] font-black leading-none ${lastHitStatus?.top ? 'text-green-400' : 'text-gold/80'}`}>{confidence}%</span>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shadow-sm transition-all ${colorClasses[NUMBER_COLORS[num]]} ${lastHitStatus?.top ? 'ring-2 ring-green-400' : ''}`}>{num}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};