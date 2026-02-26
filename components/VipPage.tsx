import React, { useMemo } from 'react';
import { NUMBER_COLORS, ROULETTE_NUMBERS, EUROPEAN_WHEEL_ORDER } from '../constants';
import { SeriesTracker } from './SeriesTracker';
import { getSeriesType } from '../utils/roulette';
import type { ComplexPrediction, Language } from '../types';
import { FinalNumberMatrix } from './FinalNumberMatrix';
import { getGeniusPrediction } from '../App';

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
    </svg>
);

const labels = {
    en: { 
        vipIntel: "VIP Intelligence", setup: "System Setup", colorDepth: "Color Lookback", seriesDepth: "Series Lookback",
        sectorHeat: "Sector Heatmap Tracking", finalMatrix: "Final Digit Frequency Matrix", hotNums: "Hot Number Ranking", 
        rank: "Rank", hits: "Hits", performance: "Unified Performance Data", color: "Color", final: "Finals", 
        series: "Series", top: "Top Number", calibrating: "Calibrating Sync Engine...", 
        stable: "Sync engine stable. Accuracy target: 60%+ Consensus hits." 
    },
    zh: { 
        vipIntel: "会员核心情报", setup: "分析系统设置", colorDepth: "颜色分析深度", seriesDepth: "扇区分析深度",
        sectorHeat: "扇区热力追踪", finalMatrix: "尾数出现频率矩阵", hotNums: "高频号码排行榜", 
        rank: "排名", hits: "次数", performance: "综合预测表现数据", color: "颜色", final: "尾数", 
        series: "扇区", top: "核心推荐", calibrating: "正在校准引擎...", 
        stable: "同步引擎已稳定。目标准确率：60%+ 共识命中。" 
    },
    ja: { 
        vipIntel: "VIPインテリジェンス", setup: "システム設定", colorDepth: "カラー分析深度", seriesDepth: "セクター分析深度",
        sectorHeat: "セクターヒートマップ", finalMatrix: "下一桁頻度マトリックス", hotNums: "ホットナンバーランキング", 
        rank: "ランク", hits: "ヒット", performance: "統合パフォーマンスデータ", color: "カラー", final: "下一桁", 
        series: "セクター", top: "推奨番号", calibrating: "エンジン調整中...", 
        stable: "同期エンジン安定。目標精度：60%+ コンセンサス的中。" 
    },
    es: { 
        vipIntel: "Inteligencia VIP", setup: "Ajustes del Sistema", colorDepth: "Profundidad de Color", seriesDepth: "Profundidad de Serie",
        sectorHeat: "Seguimiento de Mapa de Calor", finalMatrix: "Matriz de Frecuencia de Dígito Final", hotNums: "Ranking de Números Calientes", 
        rank: "Rango", hits: "Aciertos", performance: "Datos de Rendimiento Unificados", color: "Color", final: "Finales", 
        series: "Serie", top: "Número Top", calibrating: "Calibrando Motor...", 
        stable: "Motor estable. Objetivo: 60%+ aciertos de consenso." 
    },
    ko: { 
        vipIntel: "VIP 인텔리전스", setup: "시스템 설정", colorDepth: "색상 분석 깊이", seriesDepth: "구역 분석 깊이",
        sectorHeat: "섹터 히트맵 트래킹", finalMatrix: "끝수 빈도 매트릭스", hotNums: "핫 넘버 랭킹", 
        rank: "순위", hits: "적중", performance: "통합 성능 데이터", color: "색상", final: "끝수", 
        series: "구역", top: "추천 번호", calibrating: "엔진 교정 중...", 
        stable: "동기화 엔진 안정. 목표 정확도: 60%+ 합의 적중." 
    }
};

const HotNumbers: React.FC<{ history: number[], lang: Language }> = ({ history, lang }) => {
    const t = labels[lang] || labels['en'];
    const hotNumbers = useMemo(() => {
        if (history.length === 0) return [];
        const counts = new Map<number, number>();
        history.forEach(num => counts.set(num, (counts.get(num) || 0) + 1));
        return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
    }, [history]);

    if (hotNumbers.length === 0) return <div className="flex items-center justify-center h-16"><p className="text-center text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest italic">Insufficient data</p></div>;
    const colorClasses = { red: 'bg-roulette-red text-white', black: 'bg-roulette-black text-white', green: 'bg-roulette-green text-white' };
    return (
        <div className="flex justify-start items-start text-center gap-4 py-2 custom-scrollbar overflow-x-auto">
            {hotNumbers.map(([num, count], index) => (
                <div key={num} className="flex flex-col items-center flex-shrink-0">
                    <span className="font-black text-[9px] text-gold mb-1 uppercase tracking-tighter">{t.rank} {index + 1}</span>
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${colorClasses[NUMBER_COLORS[num]]}`}>{num}</div>
                    <div className="mt-1.5 text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-tighter">{count} {t.hits}</div>
                </div>
            ))}
        </div>
    );
};

interface StatReportCardProps { label: string; wins: number; total: number; }
const StatReportCard: React.FC<StatReportCardProps> = ({ label, wins, total }) => {
    const rate = total > 0 ? Math.round((wins / total) * 100) : 0;
    return (
        <div className="bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700 p-3 rounded-2xl flex flex-col items-center shadow-sm">
            <span className="text-[10px] font-black uppercase text-gold mb-1 tracking-widest">{label}</span>
            <div className="flex flex-col items-center">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter flex gap-2">
                    <span>In: {total}</span><span>Hit: {wins}</span>
                </div>
                <div className={`text-lg font-black mt-1 ${rate >= 40 ? 'text-green-500' : 'text-gray-400'}`}>{rate}%</div>
            </div>
        </div>
    );
};

interface VipPageProps { 
    spinHistory: number[]; 
    onBack: () => void; 
    prediction: ComplexPrediction | null; 
    lang: Language;
    colorLookback: number;
    seriesLookback: number;
}

export const VipPage: React.FC<VipPageProps> = ({ 
    spinHistory, onBack, prediction, lang, colorLookback, seriesLookback 
}) => {
    const t = labels[lang] || labels['en'];
    
    const reportStats = useMemo(() => {
        const stats = { color: { offered: 0, wins: 0 }, final: { offered: 0, wins: 0 }, series: { offered: 0, wins: 0 }, top: { offered: 0, wins: 0 } };
        for (let j = 8; j < spinHistory.length; j++) {
            const h = spinHistory.slice(0, j); const winner = spinHistory[j];
            const p = getGeniusPrediction(h, colorLookback, seriesLookback); 
            if (!p) continue;
            if (p.color) { stats.color.offered++; if (p.color === NUMBER_COLORS[winner]) stats.color.wins++; }
            if (p.finalDigits.length > 0) { stats.final.offered++; if (p.finalDigits.includes(winner % 10)) stats.final.wins++; }
            if (p.series && p.series !== 'none') { stats.series.offered++; if (p.series === getSeriesType(winner)) stats.series.wins++; }
            if (p.topNumbers.length > 0) { stats.top.offered++; if (p.topNumbers.some(tn => tn.num === winner)) stats.top.wins++; }
        }
        return stats;
    }, [spinHistory, colorLookback, seriesLookback]);

    return (
        <div className="animate-fade-in pb-12">
            <div className="flex items-center mb-6 mt-2">
                <button onClick={onBack} className="p-2.5 rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all mr-4 border border-gray-100 dark:border-gray-700"><BackIcon /></button>
                <h2 className="text-2xl font-black" style={{fontFamily: "'Playfair Display', serif"}}>{t.vipIntel.split(' ')[0]} <span className="text-gold">{t.vipIntel.split(' ').slice(1).join(' ')}</span></h2>
            </div>

            <div className="flex flex-col gap-6">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">{t.sectorHeat}</h3>
                    <div className="h-64 sm:h-80"><SeriesTracker history={spinHistory} /></div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">{t.finalMatrix}</h3>
                    <FinalNumberMatrix history={spinHistory} />
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div><h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">{t.hotNums}</h3><HotNumbers history={spinHistory} lang={lang} /></div>
                        <div className="flex flex-col">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-3">{t.performance}<div className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-700/50"></div></h3>
                            <div className="grid grid-cols-2 gap-3">
                                <StatReportCard label={t.color} wins={reportStats.color.wins} total={reportStats.color.offered} />
                                <StatReportCard label={t.final} wins={reportStats.final.wins} total={reportStats.final.offered} />
                                <StatReportCard label={t.series} wins={reportStats.series.wins} total={reportStats.series.offered} />
                                <StatReportCard label={t.top} wins={reportStats.top.wins} total={reportStats.top.offered} />
                            </div>
                            <div className="mt-4 bg-gray-50 dark:bg-gray-900/30 p-3 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                <p className="text-[9px] font-black text-gray-400 italic text-center uppercase tracking-widest leading-relaxed">{spinHistory.length < 15 ? `${t.calibrating} (${15 - spinHistory.length})` : t.stable}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};