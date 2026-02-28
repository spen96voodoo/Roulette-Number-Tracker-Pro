import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { NumberGrid } from './components/NumberGrid';
import { SpinHistory } from './components/SpinHistory';
import { BettingChart } from './components/BettingChart';
import { ToastContainer } from './components/Toast';
import { VipPage } from './components/VipPage';
import { IntroductionPage } from './components/IntroductionPage';
import { ConfirmationModal } from './components/ConfirmationModal';
import type { ToastData, SeriesType, ComplexPrediction, RouletteColor, Language } from './types';
import { getNeighbours, getSeriesType } from './utils/roulette';
import { PredictionDisplay } from './components/PredictionDisplay';
import { NUMBER_COLORS, ROULETTE_NUMBERS, EUROPEAN_WHEEL_ORDER } from './constants';

const MIN_SPINS_FOR_PATTERNS = 6;
const SESSION_STORAGE_KEY = 'rouletteSession_v10';
const INPUT_THROTTLE_MS = 400;

type PageType = 'main' | 'vip' | 'info';

export interface HitStatus {
    color: boolean;
    final: boolean;
    series: boolean;
    top: boolean;
}

const translations = {
    en: {
        title: "Roulette Tracker", strategy: "Strategy", history: "History", alerts: "Alerts", undo: "Undo", clear: "Clear",
        vip: "VIP", help: "Help", pl: "P/L", bet: "Bet", waiting: "Waiting", analyzing: "Analyzing...", empty: "Empty",
        clearTitle: "Clear Records", clearMsg: "This will clear all history. Continue?", color: "Color", final: "Final",
        series: "Series", topNums: "Top Numbers", hit: "HIT!", voisins: "Voisins", orphelins: "Orphelins", tiers: "Tiers",
        restoreTitle: "Restore Session", restoreMsg: "Previous session data found. Restore it?", restoreBtn: "Restore", newSessionBtn: "New Session"
    },
    zh: {
        title: "轮盘走势追踪", strategy: "策略", history: "历史记录", alerts: "模式警报", undo: "撤销", clear: "清除",
        vip: "会员", help: "说明", pl: "盈亏", bet: "下注", waiting: "等待中", analyzing: "正在分析...", empty: "无数据",
        clearTitle: "清除记录", clearMsg: "这将清除所有历史记录。是否继续？", color: "颜色", final: "尾数",
        series: "分区", topNums: "核心推荐", hit: "命中!", voisins: "零区", orphelins: "孤注", tiers: "三区",
        restoreTitle: "恢复会话", restoreMsg: "发现之前的会話数据。是否恢复？", restoreBtn: "恢复", newSessionBtn: "新会话"
    },
    ja: {
        title: "ルーレットトラッカー", strategy: "ストラテジー", history: "履歴", alerts: "アラート", undo: "戻る", clear: "削除",
        vip: "VIP", help: "ヘルプ", pl: "損益", bet: "ベット", waiting: "待機中", analyzing: "分析中...", empty: "データなし",
        clearTitle: "記録の削除", clearMsg: "すべての履歴を削除します。よろしいですか？", color: "カラー", final: "下一桁",
        series: "セクター", topNums: "推奨番号", hit: "当たり!", voisins: "0区", orphelins: "孤立区", tiers: "3区",
        restoreTitle: "セッションの復元", restoreMsg: "以前のセッションデータが見つかりました。復元しますか？", restoreBtn: "復元", newSessionBtn: "新規"
    },
    es: {
        title: "Rastreador Ruleta", strategy: "Estrategia", history: "Historial", alerts: "Alertas", undo: "Deshacer", clear: "Limpiar",
        vip: "VIP", help: "Ayuda", pl: "G/P", bet: "Apuesta", waiting: "Esperando", analyzing: "Analizando...", empty: "Vacío",
        clearTitle: "Limpiar Registros", clearMsg: "¿Esto borrará todo el historial. Continuar?", color: "Color", final: "Final",
        series: "Serie", topNums: "Números Top", hit: "¡ACIERTO!", voisins: "Voisins", orphelins: "Orphelins", tiers: "Tiers",
        restoreTitle: "Restaurar Sesión", restoreMsg: "Se encontraron datos de la sesión anterior. ¿Restaurar?", restoreBtn: "Restaurar", newSessionBtn: "Nueva"
    },
    ko: {
        title: "룰렛 트래커", strategy: "전략", history: "히스토리", alerts: "알림", undo: "실행 취소", clear: "초기화",
        vip: "VIP", help: "도움말", pl: "손익", bet: "베팅", waiting: "대기 중", analyzing: "분석 중...", empty: "데이터 없음",
        clearTitle: "기록 초기화", clearMsg: "모든 히스토리가 삭제됩니다. 계속하시겠습니까?", color: "색상", final: "끝수",
        series: "구역", topNums: "추천 번호", hit: "적중!", voisins: "0구역", orphelins: "고립구역", tiers: "3구역",
        restoreTitle: "세션 복구", restoreMsg: "이전 세션 데이터가 있습니다. 복구하시겠습니까?", restoreBtn: "복구", newSessionBtn: "새 세션"
    }
};

export const getGeniusPrediction = (history: number[], colorLookback: number = 3, seriesLookback: number = 4): ComplexPrediction | null => {
    if (history.length < 5) return null;
    const seriesHistory = history.map(getSeriesType);
    const colorHistory = history.map(n => NUMBER_COLORS[n]);
    const lastNumber = history[history.length - 1];
    const lastFinalDigit = lastNumber % 10;
    const lastSeries = seriesHistory[seriesHistory.length - 1];

    const displacements: number[] = [];
    for (let i = 0; i < history.length - 1; i++) {
        const start = EUROPEAN_WHEEL_ORDER.indexOf(history[i]);
        const end = EUROPEAN_WHEEL_ORDER.indexOf(history[i+1]);
        displacements.push((end - start + 37) % 37);
    }
    const freqDisplacements: Map<number, number> = new Map();
    displacements.forEach(d => freqDisplacements.set(d, (freqDisplacements.get(d) || 0) + 1));
    const validDisps = Array.from(freqDisplacements.entries()).filter(e => e[1] >= 2).sort((a,b) => b[1]-a[1]);
    const targetWheelIndices = validDisps.map(([d]) => (EUROPEAN_WHEEL_ORDER.indexOf(lastNumber) + d) % 37);

    const sTransitions: Map<SeriesType, number> = new Map();
    const relevantSeriesHistory = seriesHistory;
    for (let i = 0; i < relevantSeriesHistory.length - 1; i++) {
        const matches = relevantSeriesHistory.slice(i, i + seriesLookback).every((s, idx) => s === seriesHistory.slice(-seriesLookback)[idx]);
        if (matches && i + seriesLookback < relevantSeriesHistory.length) {
            const next = relevantSeriesHistory[i + seriesLookback];
            if (next !== 'none') sTransitions.set(next, (sTransitions.get(next) || 0) + 1);
        }
    }
    const likelySeries = Array.from(sTransitions.entries()).sort((a,b) => b[1]-a[1])[0]?.[0] || null;

    const dTransitions: Map<number, number> = new Map();
    for (let i = 0; i < history.length - 1; i++) {
        if (history[i] % 10 === lastFinalDigit) {
            const next = history[i+1] % 10;
            dTransitions.set(next, (dTransitions.get(next) || 0) + 1);
        }
    }
    const finalDigits = Array.from(dTransitions.entries()).filter(([_, count]) => count >= 2).sort((a,b) => b[1]-a[1]).slice(0, 3).map(e => e[0]);

    let likelyColor: RouletteColor | null = null;
    if (targetWheelIndices.length > 0) {
        likelyColor = NUMBER_COLORS[EUROPEAN_WHEEL_ORDER[targetWheelIndices[0]]];
    } else {
        const cTransitions: Map<RouletteColor, number> = new Map();
        const relevantColorHistory = colorHistory;
        for (let i = 0; i < relevantColorHistory.length - 1; i++) {
             const matches = relevantColorHistory.slice(i, i + colorLookback).every((c, idx) => c === colorHistory.slice(-colorLookback)[idx]);
             if (matches && i + colorLookback < relevantColorHistory.length) {
                 const next = relevantColorHistory[i + colorLookback];
                 cTransitions.set(next, (cTransitions.get(next) || 0) + 1);
             }
        }
        likelyColor = Array.from(cTransitions.entries()).sort((a,b) => b[1]-a[1])[0]?.[0] || null;
    }

    const scores: Map<number, number> = new Map();
    ROULETTE_NUMBERS.forEach(n => {
        let s = 0;
        const nIdx = EUROPEAN_WHEEL_ORDER.indexOf(n);
        const nFD = n % 10;
        const nSeries = getSeriesType(n);
        if (finalDigits.includes(nFD)) s += 40;
        if (likelySeries && nSeries === likelySeries) s += 25;
        if (targetWheelIndices.includes(nIdx)) s += 50;
        if (likelyColor && NUMBER_COLORS[n] === likelyColor) s += 10;
        const last2 = history.slice(-2);
        for (let i = 0; i < history.length - 2; i++) {
            if (history[i] === last2[0] && history[i+1] === last2[1] && history[i+2] === n) s += 100;
        }
        let count = (finalDigits.includes(nFD)?1:0) + (likelySeries && nSeries === likelySeries?1:0) + (targetWheelIndices.includes(nIdx)?1:0);
        if (count >= 2) s *= 2;
        scores.set(n, s);
    });

    const tops = Array.from(scores.entries()).sort((a,b) => b[1]-a[1]).slice(0, 3).filter(e => e[1] > 20).map(([num, score]) => ({
            num, confidence: Math.min(99, Math.round((score / 250) * 100))
    }));
    return { series: likelySeries, topNumbers: tops, color: likelyColor, finalDigits: finalDigits };
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [lang, setLang] = useState<Language>('en');
  const [spinHistory, setSpinHistory] = useState<number[]>([]);
  const [alerts, setAlerts] = useState<ToastData[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<PageType>('main');
  const [showClearConfirmation, setShowClearConfirmation] = useState<boolean>(false);
  const [bettingMap, setBettingMap] = useState<Map<number, number>>(new Map());
  const [balance, setBalance] = useState<number>(0);
  const [lastHitStatus, setLastHitStatus] = useState<HitStatus | null>(null);
  
  const [colorLookback, setColorLookback] = useState<number>(3);
  const [seriesLookback, setSeriesLookback] = useState<number>(4);

  const lastInputTime = useRef<number>(0);
  const [isStrategyEnabled, setIsStrategyEnabled] = useState<boolean>(true);
  const [unitMultiplier, setUnitMultiplier] = useState<number>(1);
  const [unitMultiplierInput, setUnitMultiplierInput] = useState<string>('1');
  const [betStrategyMode, setBetStrategyMode] = useState<'235' | '123' | '111'>('235');
  const [neighbourDepth, setNeighbourDepth] = useState<3 | 5>(3);
  const [showRestoreConfirmation, setShowRestoreConfirmation] = useState<boolean>(false);
  const [pendingSessionData, setPendingSessionData] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'error' | 'success') => {
    if (!('vibrate' in navigator)) return;
    switch (type) {
      case 'light': navigator.vibrate(10); break;
      case 'medium': navigator.vibrate(25); break;
      case 'heavy': navigator.vibrate(50); break;
      case 'success': navigator.vibrate([30, 50, 30]); break;
      case 'error': navigator.vibrate([40, 30, 40]); break;
    }
  };

  const applySessionData = useCallback((data: any) => {
    if (data.history) setSpinHistory(data.history);
    if (data.alerts) setAlerts(data.alerts);
    if (data.lang) setLang(data.lang as Language);
    if (data.theme) setTheme(data.theme);
    if (data.colorLookback) setColorLookback(data.colorLookback);
    if (data.seriesLookback) setSeriesLookback(data.seriesLookback);
    if (data.multiplier) { setUnitMultiplier(data.multiplier); setUnitMultiplierInput(data.multiplier.toString()); }
    if (data.strategyMode) setBetStrategyMode(data.strategyMode);
    if (data.depth) setNeighbourDepth(data.depth);
    if (data.strategyEnabled !== undefined) setIsStrategyEnabled(data.strategyEnabled);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            if (parsed.history && parsed.history.length > 0) {
                setPendingSessionData(parsed);
                setShowRestoreConfirmation(true);
            } else {
                applySessionData(parsed);
                setIsInitialized(true);
            }
        } catch (error) { 
            console.error("Failed to restore session:", error);
            setIsInitialized(true);
        }
    } else {
        setIsInitialized(true);
    }
  }, [applySessionData]);

  const handleRestoreSession = () => {
    if (pendingSessionData) applySessionData(pendingSessionData);
    setPendingSessionData(null);
    setShowRestoreConfirmation(false);
    setIsInitialized(true);
    triggerHaptic('success');
  };

  const handleDiscardSession = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setPendingSessionData(null);
    setShowRestoreConfirmation(false);
    setIsInitialized(true);
    triggerHaptic('light');
  };

  useEffect(() => {
    if (!isInitialized) return;
    const sessionData = { history: spinHistory, alerts: alerts, multiplier: unitMultiplier, strategyMode: betStrategyMode, depth: neighbourDepth, strategyEnabled: isStrategyEnabled, theme: theme, lang: lang, colorLookback, seriesLookback };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  }, [spinHistory, alerts, unitMultiplier, betStrategyMode, neighbourDepth, isStrategyEnabled, theme, lang, colorLookback, seriesLookback, isInitialized]);

  const calculateBets = useCallback((history: number[], mode: '235' | '123' | '111', depth: 3 | 5): Map<number, number> => {
    const newBettingMap = new Map<number, number>();
    const uniqueHistoryByRecency = [...new Set([...history].reverse())];
    if (uniqueHistoryByRecency.length < 2) return newBettingMap;
    const masterCandidatePool: number[] = [];
    uniqueHistoryByRecency.forEach(num => { if (num !== -1) { masterCandidatePool.push(...getNeighbours(num, depth === 5 ? 2 : 1)); } });
    const finalCandidates = [...new Set(masterCandidatePool)].filter(n => n !== -1);
    if (mode === '111') { finalCandidates.slice(0, 20).forEach(candidate => newBettingMap.set(candidate, 1)); return newBettingMap; }
    const b5 = new Set<number>(); const b3 = new Set<number>(); const b2 = new Set<number>(); const taken = new Set<number>();
    for (const c of finalCandidates) {
      if (taken.has(c)) continue;
      if (b5.size < 4) b5.add(c); else if (b3.size < 6) b3.add(c); else if (b2.size < 10) b2.add(c);
      taken.add(c); if (b2.size >= 10) break;
    }
    const units = mode === '235' ? [5, 3, 2] : [3, 2, 1];
    b5.forEach(num => newBettingMap.set(num, units[0])); b3.forEach(num => newBettingMap.set(num, units[1])); b2.forEach(num => newBettingMap.set(num, units[2]));
    return newBettingMap;
  }, []);

  useEffect(() => { if (spinHistory.length > 0) setBettingMap(calculateBets(spinHistory, betStrategyMode, neighbourDepth)); else setBettingMap(new Map()); }, [spinHistory, betStrategyMode, neighbourDepth, calculateBets]);

  const totalBaseBetUnits = useMemo(() => { let total = 0; for (const unit of bettingMap.values()) total += unit; return total; }, [bettingMap]);

  useEffect(() => {
    if (!isStrategyEnabled) { setBalance(0); return; }
    let cumulative = 0;
    for (let i = 8; i < spinHistory.length; i++) {
        const h = spinHistory.slice(0, i); const winner = spinHistory[i];
        const bets = calculateBets(h, betStrategyMode, neighbourDepth);
        const total = (Array.from(bets.values()) as number[]).reduce((sum, val) => sum + val, 0);
        if (total > 0) { const winUnit = bets.get(winner) || 0; cumulative += winUnit > 0 ? (winUnit * 36) - total : -total; }
    }
    setBalance(cumulative * unitMultiplier);
  }, [spinHistory, calculateBets, isStrategyEnabled, unitMultiplier, betStrategyMode, neighbourDepth]);

  useEffect(() => { if (theme === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [theme]);

  const toggleTheme = () => { triggerHaptic('light'); setTheme(prev => (prev === 'light' ? 'dark' : 'light')); };

  const checkForAlerts = useCallback((history: number[]): Omit<ToastData, 'id'>[] => {
    if (history.length < MIN_SPINS_FOR_PATTERNS || !alertsEnabled) return [];
    const newAlerts: Omit<ToastData, 'id'>[] = []; const lastSpin = history[history.length - 1]; const predictions = new Map<string, number[]>();
    for (let i = 0; i <= history.length - 3; i++) { if (history[i] === lastSpin) { const p = [history[i + 1], history[i + 2]]; predictions.set(p.join(','), p); } }
    if (predictions.size > 0) newAlerts.push({ trigger: [lastSpin], predictions: Array.from(predictions.values()) });
    return newAlerts;
  }, [alertsEnabled]);

  const prediction = useMemo<ComplexPrediction | null>(() => getGeniusPrediction(spinHistory, colorLookback, seriesLookback), [spinHistory, colorLookback, seriesLookback]);

  const handleAddSpin = useCallback((num: number) => {
    const now = Date.now(); if (now - lastInputTime.current < INPUT_THROTTLE_MS) return; lastInputTime.current = now;
    if (prediction) {
        setLastHitStatus({ color: prediction.color === NUMBER_COLORS[num], final: prediction.finalDigits.includes(num % 10), series: prediction.series === getSeriesType(num), top: prediction.topNumbers.some(tn => tn.num === num) });
    }
    const newHistory = [...spinHistory, num]; setSpinHistory(newHistory); triggerHaptic(prediction?.topNumbers.some(t => t.num === num) ? 'success' : 'medium');
    if (newHistory.length >= MIN_SPINS_FOR_PATTERNS) {
        const alertsFromCheck = checkForAlerts(newHistory);
        if (alertsFromCheck.length > 0) {
            const fresh = alertsFromCheck.map((alert, index) => ({ ...alert, id: Date.now() + index })).reverse();
            setAlerts(current => [...fresh, ...current].slice(0, 5));
        }
    }
  }, [spinHistory, checkForAlerts, prediction]);

  const handleRemoveLastSpin = useCallback(() => { if (spinHistory.length === 0) return; triggerHaptic('light'); setSpinHistory(prev => prev.slice(0, -1)); setLastHitStatus(null); }, [spinHistory]);
  const handleRemoveAlert = (id: number) => { triggerHaptic('light'); setAlerts(current => current.filter(alert => alert.id !== id)); };
  const handleClearSession = () => { triggerHaptic('error'); setSpinHistory([]); setAlerts([]); setLastHitStatus(null); localStorage.removeItem(SESSION_STORAGE_KEY); setShowClearConfirmation(false); };
  const switchPage = (page: PageType) => { triggerHaptic('light'); setCurrentPage(page); };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 font-sans selection:bg-gold/30 flex flex-col overflow-hidden">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40 shadow-sm border-b border-gray-200 dark:border-gray-800 pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-4 py-1.5 flex justify-between items-center h-11">
          <h1 className="text-base font-bold text-gray-900 dark:text-white" style={{fontFamily: "'Playfair Display', serif"}}>
            {t('title').split(' ')[0]} <span className="text-gold">{t('title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <div className="flex items-center space-x-1.5">
            <button type="button" onClick={() => switchPage('info')} className="p-1 rounded-lg text-gray-500 border border-gray-200 dark:border-gray-700 active:scale-95" title={t('help')}>
                <div className="w-3.5 h-3.5 rounded border-2 border-current flex items-center justify-center font-black text-[9px]">?</div>
            </button>
            <button type="button" onClick={() => switchPage(currentPage === 'vip' ? 'main' : 'vip')} className={`p-1 rounded-lg transition-all flex items-center space-x-1 border active:scale-95 ${currentPage === 'vip' ? 'bg-gold text-black border-gold' : 'text-gold border-gold/20'}`}>
              <CrownIcon />
              <span className="text-[10px] font-black uppercase tracking-tighter">{t('vip')}</span>
            </button>
            <button onClick={toggleTheme} className="p-1 rounded-lg text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 active:scale-95">
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-[env(safe-area-inset-bottom)]">
        <div className="container mx-auto px-1.5 py-2 max-w-5xl">
            {currentPage === 'main' ? (
            <div className="flex flex-col gap-1.5 animate-fade-in">
                <div className="w-full bg-white dark:bg-gray-800 p-2 rounded-xl shadow-md border border-gray-100 dark:border-gray-700/50">
                    <NumberGrid onNumberSelect={handleAddSpin} disabled={false} />
                </div>

                <div className="bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-md border border-gray-100 dark:border-gray-700/50">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-1 px-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('strategy')}</h2>
                            <button onClick={() => setIsStrategyEnabled(!isStrategyEnabled)} className={`relative inline-flex items-center h-3.5 rounded-full w-7 transition-colors ${isStrategyEnabled ? 'bg-roulette-green' : 'bg-gray-400 dark:bg-gray-600'}`}>
                                <span className={`inline-block w-2.5 h-2.5 transform bg-white rounded-full transition-transform ${isStrategyEnabled ? 'translate-x-3.5' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                             <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900/40 p-0.5 px-1.5 rounded-lg border border-gray-100 dark:border-gray-700/30">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">U:</span>
                                <input type="number" value={unitMultiplierInput} onChange={(e) => { setUnitMultiplierInput(e.target.value); const num = parseInt(e.target.value, 10); if (!isNaN(num) && num > 0) setUnitMultiplier(num); }} onBlur={() => { const num = parseInt(unitMultiplierInput, 10); if (isNaN(num) || num < 1) { setUnitMultiplierInput('1'); setUnitMultiplier(1); } }} disabled={!isStrategyEnabled} className="w-8 bg-transparent text-center font-black text-[11px] outline-none disabled:opacity-40" />
                            </div>
                            <div className="flex bg-gray-50 dark:bg-gray-900/40 rounded-lg p-0.5 border border-gray-100 dark:border-gray-700/30">
                                <button onClick={() => {triggerHaptic('light'); setNeighbourDepth(3)}} disabled={!isStrategyEnabled} className={`px-2 py-0.5 text-[9px] font-black rounded ${neighbourDepth === 3 ? 'bg-gold text-black' : 'text-gray-500'}`}>N3</button>
                                <button onClick={() => {triggerHaptic('light'); setNeighbourDepth(5)}} disabled={!isStrategyEnabled} className={`px-2 py-0.5 text-[9px] font-black rounded ${neighbourDepth === 5 ? 'bg-gold text-black' : 'text-gray-500'}`}>N5</button>
                            </div>
                            <button onClick={() => {triggerHaptic('light'); setBetStrategyMode(m => m === '235' ? '123' : m === '123' ? '111' : '235')}} disabled={!isStrategyEnabled} className={`px-2 py-0.5 text-[9px] font-black rounded transition-all shadow-sm ${betStrategyMode === '235' ? 'bg-green-600 text-white' : betStrategyMode === '123' ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white'} disabled:opacity-30`}>{betStrategyMode}</button>
                        </div>
                    </div>
                    {isStrategyEnabled && (
                        <div className="animate-fade-in space-y-1.5">
                            {spinHistory.length >= 8 ? (
                                <>
                                    <div className="flex justify-between items-center py-1 border-t border-gray-100 dark:border-gray-700/50">
                                        <div className="text-[10px] font-black uppercase tracking-tighter">
                                            <span className="text-gray-400">{t('pl')}: </span>
                                            <span className={balance >= 0 ? 'text-green-500' : 'text-red-500'}>{balance >= 0 ? '+' : ''}{balance}</span>
                                        </div>
                                        {bettingMap.size > 0 && <div className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{t('bet')}: <span className="text-gold text-xs">{totalBaseBetUnits * unitMultiplier}</span></div>}
                                    </div>
                                    <BettingChart bettingMap={bettingMap} />
                                </>
                            ) : (
                                <div className="border-t border-gray-100 dark:border-gray-700/50 pt-1.5 pb-0.5 text-center">
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic animate-pulse">{t('waiting')} ({8 - spinHistory.length})</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-md border border-gray-100 dark:border-gray-700/50">
                        <div className="flex justify-between items-center mb-1.5">
                            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t('history')} ({spinHistory.length})</h2>
                            <PredictionDisplay prediction={prediction} lastHitStatus={lastHitStatus} lang={lang} />
                        </div>
                        {spinHistory.length > 0 ? <SpinHistory history={spinHistory} /> : <p className="text-gray-400 text-center py-4 text-[9px] font-black uppercase italic tracking-widest">{t('empty')}</p>}
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-md border border-gray-100 dark:border-gray-700/50">
                        <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5">{t('alerts')}</h2>
                        <ToastContainer toasts={alerts} onRemoveToast={handleRemoveAlert} />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-md border border-gray-100 dark:border-gray-700/50 mt-0.5 mb-2">
                    <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900/50 px-2 py-1.5 rounded-lg flex-1 border border-gray-200 dark:border-gray-700/50">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('alerts')}</span>
                            <button onClick={() => {triggerHaptic('light'); setAlertsEnabled(!alertsEnabled)}} className={`relative inline-flex items-center h-3.5 rounded-full w-7 transition-colors ${alertsEnabled ? 'bg-roulette-green' : 'bg-gray-400 dark:bg-gray-600'}`}>
                                <span className={`inline-block w-2.5 h-2.5 transform bg-white rounded-full transition-transform ${alertsEnabled ? 'translate-x-3.5' : 'translate-x-1'}`}/>
                            </button>
                        </div>
                        <div className="flex gap-1.5 flex-1">
                            <button onClick={handleRemoveLastSpin} disabled={spinHistory.length === 0} className="flex-1 bg-yellow-500 text-black font-black py-1.5 rounded-lg hover:bg-yellow-600 disabled:opacity-40 text-[10px] uppercase tracking-widest transition-all active:scale-95">{t('undo')}</button>
                            <button onClick={() => {triggerHaptic('medium'); setShowClearConfirmation(true)}} className="flex-1 bg-roulette-red text-white font-black py-1.5 rounded-lg hover:bg-red-700 text-[10px] uppercase tracking-widest transition-all active:scale-95">{t('clear')}</button>
                        </div>
                    </div>
                </div>
            </div>
            ) : currentPage === 'vip' ? (
            <div className="animate-slide-up">
                <VipPage 
                    spinHistory={spinHistory} 
                    onBack={() => switchPage('main')} 
                    prediction={prediction} 
                    lang={lang}
                    colorLookback={colorLookback}
                    seriesLookback={seriesLookback}
                />
            </div>
            ) : (
            <div className="animate-slide-up">
                <IntroductionPage 
                    onBack={() => switchPage('main')} 
                    lang={lang} 
                    setLang={setLang}
                    colorLookback={colorLookback}
                    setColorLookback={setColorLookback}
                    seriesLookback={seriesLookback}
                    setSeriesLookback={setSeriesLookback}
                />
            </div>
            )}
        </div>
      </main>
      <ConfirmationModal isOpen={showClearConfirmation} onClose={() => setShowClearConfirmation(false)} onConfirm={handleClearSession} title={t('clearTitle')} message={t('clearMsg')} />
      <ConfirmationModal 
        isOpen={showRestoreConfirmation} 
        onClose={handleDiscardSession} 
        onConfirm={handleRestoreSession} 
        title={t('restoreTitle')} 
        message={t('restoreMsg')} 
        confirmText={t('restoreBtn')} 
        cancelText={t('newSessionBtn')}
        confirmButtonClass="bg-roulette-green text-white hover:bg-green-700"
      />
    </div>
  );
};

const CrownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"></path>
  </svg>
);
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);
export default App;