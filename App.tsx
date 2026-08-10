import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { NumberGrid } from './components/NumberGrid';
import { SpinHistory } from './components/SpinHistory';
import { BettingChart } from './components/BettingChart';
import { ToastContainer } from './components/Toast';
import { AreaRoadmapPage } from './components/AreaRoadmapPage';
import { SetupPage } from './components/SetupPage';
import { DashboardPage } from './components/DashboardPage';
import { FunctionsPage, FunctionTab } from './components/FunctionsPage';
import { ConfirmationModal } from './components/ConfirmationModal';
import type { ToastData, SeriesType, ComplexPrediction, RouletteColor, Language, PageType, FiveCriteriaDepths, SectorSplitMode } from './types';
import { getNeighbours, getSeriesType, getMultiCriteriaPrediction } from './utils/roulette';
import { PredictionDisplay } from './components/PredictionDisplay';
import { MultiCriteriaPredictionCard } from './components/MultiCriteriaPredictionCard';
import { NUMBER_COLORS, ROULETTE_NUMBERS, EUROPEAN_WHEEL_ORDER } from './constants';
import { getIsVipActivated } from './lib/license';

const MIN_SPINS_FOR_PATTERNS = 6;
const SESSION_STORAGE_KEY = 'rouletteSession_v10';
const INPUT_THROTTLE_MS = 400;

export interface HitStatus {
    color: boolean;
    final: boolean;
    series: boolean;
    top: boolean;
    sector?: boolean;
    pocket?: boolean;
}


const translations = {
    en: {
        title: "Roulette Tracker Pro All in one", strategy: "Closed Numbers", history: "History", alerts: "Alerts", undo: "Undo", clear: "Clear",
        roadmap: "Roadmap", functions: "Functions", setup: "Set Up", dashboard: "Dashboard", pl: "P/L", bet: "Unit", waiting: "Waiting for spin...", analyzing: "Analyzing...", empty: "Empty",
        clearTitle: "Clear Records", clearMsg: "This will clear all history. Continue?", confirmBtn: "Yes, Clear", cancelBtn: "Cancel", color: "Color", final: "Final",
        series: "Series", topNums: "Top Numbers", hit: "HIT!", voisins: "Top series", orphelins: "Orphelins", tiers: "Small series",
        restoreTitle: "Restore Session", restoreMsg: "Previous session data found. Restore it?", restoreBtn: "Restore", newSessionBtn: "New Session",
        spinsLookback: "Spins"
    },
    zh: {
        title: "Roulette Tracker Pro All in one", strategy: "相邻闭合号码", history: "历史记录", alerts: "模式警报", undo: "撤销", clear: "清空重置",
        roadmap: "区域路单", functions: "分析功能", setup: "设置", pl: "盈亏", bet: "注数", waiting: "等待旋转...", analyzing: "正在分析...", empty: "无数据",
        clearTitle: "清空重置应用数据", clearMsg: "确定要清空所有历史数据与分析记录吗？此操作无法撤销。", confirmBtn: "确认清空", cancelBtn: "取消", color: "颜色", final: "尾数",
        series: "分区", topNums: "核心推荐", hit: "命中!", voisins: "Top series", orphelins: "孤注", tiers: "Small series",
        restoreTitle: "恢复会话", restoreMsg: "发现之前的会話数据。是否恢复？", restoreBtn: "恢复", newSessionBtn: "新会话",
        spinsLookback: "最近轮次"
    },
    ja: {
        title: "Roulette Tracker Pro All in one", strategy: "隣接閉鎖番号", history: "履歴", alerts: "アラート", undo: "戻る", clear: "リセット",
        roadmap: "ロードマップ", functions: "分析機能", setup: "設定", pl: "損益", bet: "ユニット", waiting: "スピン待機中...", analyzing: "分析中...", empty: "データなし",
        clearTitle: "データのリセット", clearMsg: "すべてのスピン履歴およびデータを削除します。実行しますか？", confirmBtn: "リセット実行", cancelBtn: "キャンセル", color: "カラー", final: "下一桁",
        series: "セクター", topNums: "推奨番号", hit: "当たり!", voisins: "Top series", orphelins: "孤立区", tiers: "Small series",
        restoreTitle: "セッションの復元", restoreMsg: "以前のセッションデータが見つかりました。復元しますか？", restoreBtn: "復元", newSessionBtn: "新規",
        spinsLookback: "直近スピン"
    },
    es: {
        title: "Roulette Tracker Pro All in one", strategy: "Números Cerrados", history: "Historial", alerts: "Alertas", undo: "Deshacer", clear: "Limpiar App",
        roadmap: "Hoja de Ruta", functions: "Funciones", setup: "Ajustes", pl: "G/P", bet: "Unidades", waiting: "Esperando giro...", analyzing: "Analizando...", empty: "Vacío",
        clearTitle: "Limpiar y Reiniciar App", clearMsg: "¿Esta seguro de que desea borrar todo el historial y reiniciar? Esta acción no se puede deshacer.", confirmBtn: "Sí, Reiniciar", cancelBtn: "Cancelar", color: "Color", final: "Final",
        series: "Serie", topNums: "Números Top", hit: "¡ACIERTO!", voisins: "Top series", orphelins: "Orphelins", tiers: "Small series",
        restoreTitle: "Restaurar Sesión", restoreMsg: "Se encontraron datos de la sesión anterior. ¿Restaurar?", restoreBtn: "Restaurar", newSessionBtn: "Nueva",
        spinsLookback: "Giros"
    },
    ko: {
        title: "Roulette Tracker Pro All in one", strategy: "인접 닫힌 번호", history: "히스토리", alerts: "알림", undo: "실행 취소", clear: "앱 초기화",
        roadmap: "로드맵", functions: "기능 센터", setup: "설정", pl: "손익", bet: "유닛", waiting: "스핀 대기 중...", analyzing: "분석 중...", empty: "데이터 없음",
        clearTitle: "앱 데이터 초기화", clearMsg: "모든 히스토리와 분석 데이터가 삭제됩니다. 초기화하시겠습니까?", confirmBtn: "예, 초기화", cancelBtn: "취소", color: "색상", final: "끝수",
        series: "구역", topNums: "추천 번호", hit: "적중!", voisins: "Top series", orphelins: "고립구역", tiers: "Small series",
        restoreTitle: "세션 복구", restoreMsg: "이전 세션 데이터가 있습니다. 복구하시겠습니까?", restoreBtn: "복구", newSessionBtn: "새 세션",
        spinsLookback: "최근 스핀"
    },
    vi: {
        title: "Roulette Tracker Pro All in one", strategy: "Số Lân Cận Khép Kín", history: "Lịch Sử", alerts: "Cảnh Báo Mẫu", undo: "Hoàn Tác", clear: "Xóa Dữ Liệu",
        roadmap: "Sơ Đồ Luồng", functions: "Chức Năng", setup: "Cài Đặt", pl: "Lời/Lỗ", bet: "Đơn Vị", waiting: "Đang chờ vòng quay...", analyzing: "Đang phân tích...", empty: "Trống",
        clearTitle: "Xóa Dữ Liệu Ứng Dụng", clearMsg: "Thao tác này sẽ xóa toàn bộ lịch sử và ghi chép. Bạn có chắc chắn muốn tiếp tục?", confirmBtn: "Đồng Ý Xóa", cancelBtn: "Hủy Bỏ", color: "Màu Sắc", final: "Số Cuối",
        series: "Phân Vùng", topNums: "Top Đề Xuất", hit: "TRÚNG!", voisins: "Top series", orphelins: "Orphelins", tiers: "Small series",
        restoreTitle: "Khôi Phục Phiên", restoreMsg: "Tìm thấy dữ liệu phiên trước. Bạn có muốn khôi phục không?", restoreBtn: "Khôi Phục", newSessionBtn: "Phiên Mới",
        spinsLookback: "Vòng Quay Gần Đây"
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
    const sLook = Math.min(seriesLookback, seriesHistory.length - 1);
    if (sLook > 0) {
        const targetSeriesSlice = seriesHistory.slice(-sLook);
        for (let i = 0; i <= seriesHistory.length - 1 - sLook; i++) {
            const currentSlice = seriesHistory.slice(i, i + sLook);
            const matches = currentSlice.length === sLook && currentSlice.every((s, idx) => s === targetSeriesSlice[idx]);
            if (matches && i + sLook < seriesHistory.length) {
                const next = seriesHistory[i + sLook];
                if (next && next !== 'none') sTransitions.set(next, (sTransitions.get(next) || 0) + 1);
            }
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
        const cLook = Math.min(colorLookback, colorHistory.length - 1);
        if (cLook > 0) {
            const targetColorSlice = colorHistory.slice(-cLook);
            for (let i = 0; i <= colorHistory.length - 1 - cLook; i++) {
                 const currentSlice = colorHistory.slice(i, i + cLook);
                 const matches = currentSlice.length === cLook && currentSlice.every((c, idx) => c === targetColorSlice[idx]);
                 if (matches && i + cLook < colorHistory.length) {
                     const next = colorHistory[i + cLook];
                     if (next) cTransitions.set(next, (cTransitions.get(next) || 0) + 1);
                 }
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

const getInitialSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Session parse error:", e);
  }
  return null;
};

const App: React.FC = () => {
  const initialSession = useMemo(() => getInitialSession(), []);

  const [theme] = useState<'dark'>('dark');
  const [lang, setLang] = useState<Language>(() => initialSession?.lang || 'en');
  const [spinHistory, setSpinHistory] = useState<number[]>(() => initialSession?.history || []);
  const [alerts, setAlerts] = useState<ToastData[]>(() => initialSession?.alerts || []);
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);
  const [activeFunctionTab, setActiveFunctionTab] = useState<FunctionTab>('cylinder');
  const [currentPage, setCurrentPage] = useState<PageType>('main');
  const [showClearConfirmation, setShowClearConfirmation] = useState<boolean>(false);
  const [bettingMap, setBettingMap] = useState<Map<number, number>>(new Map());
  const [balance, setBalance] = useState<number>(0);
  const [lastHitStatus, setLastHitStatus] = useState<HitStatus | null>(null);
  const [lastPrediction, setLastPrediction] = useState<ComplexPrediction | null>(null);

  // VIP activation state
  const [isPro, setIsPro] = useState<boolean>(() => getIsVipActivated());

  const handleActivated = useCallback(() => {
    setIsPro(true);
  }, []);

  useEffect(() => {
    // Check VIP activation on window load / app init
    const checkVipStatus = () => {
      if (getIsVipActivated()) {
        setIsPro(true);
      }
    };
    checkVipStatus();
    window.addEventListener('load', checkVipStatus);
    return () => {
      window.removeEventListener('load', checkVipStatus);
    };
  }, []);
  
  const [fiveDepths, setFiveDepths] = useState<FiveCriteriaDepths>(() => {
    const d = initialSession?.fiveDepths;
    return {
      colorDepth: d?.colorDepth || 5,
      finalDepth: d?.finalDepth || 5,
      seriesDepth: d?.seriesDepth || 5,
      sectorsDepth: d?.sectorsDepth || 5,
      pocketsDepth: d?.pocketsDepth || 5,
    };
  });

  const [sectorSplitMode, setSectorSplitMode] = useState<SectorSplitMode>('9');

  const lastInputTime = useRef<number>(0);
  const [isStrategyEnabled, setIsStrategyEnabled] = useState<boolean>(() => initialSession?.strategyEnabled ?? true);
  const [unitMultiplier, setUnitMultiplier] = useState<number>(() => initialSession?.multiplier || 1);
  const [unitMultiplierInput, setUnitMultiplierInput] = useState<string>(() => (initialSession?.multiplier || 1).toString());
  const [betStrategyMode, setBetStrategyMode] = useState<'235' | '123' | '111'>(() => initialSession?.strategyMode || '235');
  const [neighbourDepth, setNeighbourDepth] = useState<3 | 5>(() => initialSession?.depth || 3);
  const [closedLookback, setClosedLookback] = useState<number>(() => initialSession?.closedLookback || 8);

  const safeSetStorage = (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // Ignore storage write error
    }
  };

  const safeRemoveStorage = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Ignore storage removal error
    }
  };

  const t = (key: keyof typeof translations['en']) => translations[lang]?.[key] || translations['en'][key] || '';

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'error' | 'success') => {
    try {
      if (typeof navigator === 'undefined' || !('vibrate' in navigator) || typeof navigator.vibrate !== 'function') return;
      switch (type) {
        case 'light': navigator.vibrate(10); break;
        case 'medium': navigator.vibrate(25); break;
        case 'heavy': navigator.vibrate(50); break;
        case 'success': navigator.vibrate([30, 50, 30]); break;
        case 'error': navigator.vibrate([40, 30, 40]); break;
      }
    } catch (e) {
      // Ignore vibration error in iframe
    }
  };

  useEffect(() => {
    const sessionData = { 
      history: spinHistory, 
      alerts: alerts, 
      multiplier: unitMultiplier, 
      strategyMode: betStrategyMode, 
      depth: neighbourDepth, 
      closedLookback: closedLookback,
      strategyEnabled: isStrategyEnabled, 
      theme: theme, 
      lang: lang, 
      fiveDepths 
    };
    safeSetStorage(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  }, [spinHistory, alerts, unitMultiplier, betStrategyMode, neighbourDepth, closedLookback, isStrategyEnabled, theme, lang, fiveDepths]);


  const calculateBets = useCallback((history: number[], mode: '235' | '123' | '111', depth: 3 | 5, lookbackCount: number = 5): Map<number, number> => {
    const newBettingMap = new Map<number, number>();
    const recentHistory = history.slice(-lookbackCount);
    const uniqueHistoryByRecency = [...new Set([...recentHistory].reverse())];
    if (uniqueHistoryByRecency.length < 1) return newBettingMap;
    const masterCandidatePool: number[] = [];
    uniqueHistoryByRecency.forEach(num => { 
      if (num !== -1) { 
        masterCandidatePool.push(...getNeighbours(num, depth === 5 ? 2 : 1)); 
      } 
    });
    const finalCandidates = [...new Set(masterCandidatePool)].filter(n => n !== -1);
    if (mode === '111') { 
      finalCandidates.forEach(candidate => newBettingMap.set(candidate, 1)); 
      return newBettingMap; 
    }
    const units = mode === '235' ? [5, 3, 2] : [3, 2, 1];
    finalCandidates.forEach((candidate, idx) => {
      if (idx < 4) {
        newBettingMap.set(candidate, units[0]);
      } else if (idx < 10) {
        newBettingMap.set(candidate, units[1]);
      } else {
        newBettingMap.set(candidate, units[2]);
      }
    });
    return newBettingMap;
  }, []);

  useEffect(() => { 
    if (spinHistory.length > 0) setBettingMap(calculateBets(spinHistory, betStrategyMode, neighbourDepth, closedLookback)); 
    else setBettingMap(new Map()); 
  }, [spinHistory, betStrategyMode, neighbourDepth, closedLookback, calculateBets]);

  const totalBaseBetUnits = useMemo(() => { let total = 0; for (const unit of bettingMap.values()) total += unit; return total; }, [bettingMap]);

  useEffect(() => {
    if (!isStrategyEnabled) { setBalance(0); return; }
    let cumulative = 0;
    for (let i = 1; i < spinHistory.length; i++) {
        const h = spinHistory.slice(0, i); const winner = spinHistory[i];
        const bets = calculateBets(h, betStrategyMode, neighbourDepth, closedLookback);
        const total = (Array.from(bets.values()) as number[]).reduce((sum, val) => sum + val, 0);
        if (total > 0) { const winUnit = bets.get(winner) || 0; cumulative += winUnit > 0 ? (winUnit * 36) - total : -total; }
    }
    setBalance(cumulative * unitMultiplier);
  }, [spinHistory, calculateBets, isStrategyEnabled, unitMultiplier, betStrategyMode, neighbourDepth, closedLookback]);

  useEffect(() => { 
    document.documentElement.classList.add('dark');
  }, []);

  const checkForAlerts = useCallback((history: number[]): Omit<ToastData, 'id'>[] => {
    if (history.length < MIN_SPINS_FOR_PATTERNS || !alertsEnabled) return [];
    const newAlerts: Omit<ToastData, 'id'>[] = []; const lastSpin = history[history.length - 1]; const predictions = new Map<string, number[]>();
    for (let i = 0; i <= history.length - 3; i++) { if (history[i] === lastSpin) { const p = [history[i + 1], history[i + 2]]; predictions.set(p.join(','), p); } }
    if (predictions.size > 0) newAlerts.push({ trigger: [lastSpin], predictions: Array.from(predictions.values()) });
    return newAlerts;
  }, [alertsEnabled]);

  const prediction = useMemo<ComplexPrediction | null>(
    () => getMultiCriteriaPrediction(spinHistory, fiveDepths, sectorSplitMode),
    [spinHistory, fiveDepths, sectorSplitMode]
  );

  const handleAddSpin = useCallback((num: number) => {
    const now = Date.now(); if (now - lastInputTime.current < INPUT_THROTTLE_MS) return; lastInputTime.current = now;
    if (prediction) {
        setLastPrediction(prediction);
        setLastHitStatus({
            color: prediction.color === NUMBER_COLORS[num],
            final: prediction.finalDigits.includes(num % 10),
            series: prediction.series === getSeriesType(num),
            top: prediction.topNumbers.some(tn => tn.num === num),
            sector: prediction.sector?.numbers.includes(num),
            pocket: prediction.pocket?.topSteps.some(s => s.cwTarget === num || s.acwTarget === num)
        });
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

  const handleRemoveLastSpin = useCallback(() => { if (spinHistory.length === 0) return; triggerHaptic('light'); setSpinHistory(prev => prev.slice(0, -1)); setLastHitStatus(null); setLastPrediction(null); }, [spinHistory]);
  const handleRemoveAlert = (id: number) => { triggerHaptic('light'); setAlerts(current => current.filter(alert => alert.id !== id)); };
  const handleClearSession = () => { triggerHaptic('error'); setSpinHistory([]); setAlerts([]); setLastHitStatus(null); setLastPrediction(null); localStorage.removeItem(SESSION_STORAGE_KEY); setShowClearConfirmation(false); };
  const switchPage = (page: PageType) => { triggerHaptic('light'); setCurrentPage(page); };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-gold/30 flex flex-col overflow-hidden">
      <header className="bg-zinc-900/90 backdrop-blur-md sticky top-0 z-40 border-b border-gray-800 pt-[env(safe-area-inset-top)] shadow-xl">
        <div className="container mx-auto px-3 py-2 flex flex-col gap-2">
          {/* Title and Status Row */}
          <div className="flex justify-between items-center">
            <h1 className="text-base font-bold text-white cursor-pointer flex items-center gap-1.5" style={{fontFamily: "'Playfair Display', serif"}} onClick={() => switchPage('main')}>
              <span>🎰</span>
              <span>{t('title').split(' ')[0]} <span className="text-gold">{t('title').split(' ').slice(1).join(' ')}</span></span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-300 bg-zinc-800/90 px-2.5 py-0.5 rounded-full border border-gray-700 shadow-sm">
                {spinHistory.length} {spinHistory.length === 1 ? 'Spin' : 'Spins'}
              </span>
            </div>
          </div>

          {/* Persistent Top Navigation Bar */}
          <div className="grid grid-cols-4 gap-1 bg-zinc-950 p-1 rounded-xl border border-gray-800 shadow-inner">
            <button
              type="button"
              onClick={() => switchPage('main')}
              className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center space-x-1 text-xs font-black uppercase active:scale-95 ${
                currentPage === 'main' ? 'bg-gold text-black shadow-md font-extrabold' : 'text-gray-300 hover:bg-zinc-800/80 hover:text-white'
              }`}
            >
              <span>🏠</span>
              <span className="truncate">Main</span>
            </button>

            <button
              type="button"
              onClick={() => switchPage('functions')}
              className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center space-x-1 text-xs font-black uppercase active:scale-95 ${
                currentPage === 'functions'
                  ? 'bg-gold text-black shadow-md font-extrabold'
                  : 'text-gold bg-gold/10 border border-gold/40 hover:bg-gold/20'
              }`}
            >
              <span>⚡</span>
              <span className="truncate">{t('functions')}</span>
            </button>

            <button
              type="button"
              onClick={() => switchPage('roadmap')}
              className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center space-x-1 text-xs font-black uppercase active:scale-95 ${
                currentPage === 'roadmap' ? 'bg-gold text-black shadow-md font-extrabold' : 'text-amber-400 hover:bg-zinc-800/80'
              }`}
            >
              <span>🗺️</span>
              <span className="truncate">{t('roadmap')}</span>
            </button>

            <button
              type="button"
              onClick={() => switchPage('dashboard')}
              className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center space-x-1 text-xs font-black uppercase active:scale-95 ${
                currentPage === 'dashboard' ? 'bg-gold text-black shadow-md font-extrabold' : 'text-emerald-400 hover:bg-zinc-800/80'
              }`}
            >
              <span>📊</span>
              <span className="truncate">Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => switchPage('setup')}
              className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center space-x-1 text-xs font-black uppercase active:scale-95 ${
                currentPage === 'setup' ? 'bg-gold text-black shadow-md font-extrabold' : 'text-gray-400 hover:bg-zinc-800/80 hover:text-white'
              }`}
            >
              <span>⚙️</span>
              <span className="truncate">{t('setup')}</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-[env(safe-area-inset-bottom)]">
        <div className="container mx-auto px-1.5 py-2 max-w-5xl">
            {currentPage === 'main' ? (
            <div className="flex flex-col gap-2 animate-fade-in">
                <div className="w-full bg-zinc-900 p-2 rounded-xl shadow-md border border-gray-800/50">
                    <NumberGrid onNumberSelect={handleAddSpin} disabled={false} />
                </div>

                {/* Quick Functions Hub Section Banner */}
                <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 p-3 rounded-2xl border border-gold/40 shadow-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold font-black text-sm shadow-sm">
                          ⚡
                        </div>
                        <div>
                          <h2 className="text-xs font-black text-gold uppercase tracking-wider flex items-center gap-1">
                            <span>{t('functions')} Section</span>
                          </h2>
                          <p className="text-[10px] text-gray-400 font-medium">
                            7 specialized analysis modules using shared spin data ({spinHistory.length})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => switchPage('dashboard')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 font-black text-xs transition-all active:scale-95 flex items-center gap-1"
                        >
                          <span>📊</span>
                          <span>Dashboard</span>
                        </button>
                        <button
                          onClick={() => switchPage('functions')}
                          className="px-3 py-1.5 rounded-xl bg-gold text-black font-black text-xs hover:bg-yellow-400 transition-all active:scale-95 shadow-md flex items-center gap-1"
                        >
                          <span>Open Hub</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                      {[
                        { id: 'cylinder', label: '🎯 Wheel Vector', desc: 'Cylinder Spacing' },
                        { id: 'distance', label: '📏 Pocket Distance', desc: '0-18 Wheel Steps' },
                        { id: 'dozens', label: '📊 Dozens & Cols', desc: 'Distribution' },
                        { id: 'stats', label: '🎨 Color & Odds', desc: 'Ratios & Streaks' },
                        { id: 'series', label: '🧭 Series Heat', desc: 'Top series/Small series' },
                        { id: 'matrix', label: '🔢 Final Matrix', desc: '0-9 Endings' },
                        { id: 'patterns', label: '⚡ Pattern Alerts', desc: 'Sequences' },
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => {
                            setActiveFunctionTab(f.id as FunctionTab);
                            switchPage('functions');
                          }}
                          className="bg-zinc-800/90 hover:bg-zinc-700/80 p-2 rounded-xl border border-gray-700/60 text-left transition-all active:scale-95 group shadow-sm"
                        >
                          <div className="text-xs font-black text-white group-hover:text-gold transition-colors">{f.label}</div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{f.desc}</div>
                        </button>
                      ))}
                    </div>
                </div>

                <div className="bg-zinc-900 p-1.5 rounded-xl shadow-md border border-gray-800/50">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-1 px-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[10px] font-black text-gold uppercase tracking-widest">{t('strategy')}</h2>
                            <button onClick={() => setIsStrategyEnabled(!isStrategyEnabled)} className={`relative inline-flex items-center h-3.5 rounded-full w-7 transition-colors ${isStrategyEnabled ? 'bg-roulette-green' : 'bg-gray-700'}`}>
                                <span className={`inline-block w-2.5 h-2.5 transform bg-white rounded-full transition-transform ${isStrategyEnabled ? 'translate-x-3.5' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <div className="flex items-center gap-0.5 bg-zinc-800/50 p-0.5 rounded-lg border border-gray-700/30">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter px-1">
                                    {t('spinsLookback')}:
                                </span>
                                {([3, 5, 8, 10, 12] as const).map(count => (
                                    <button
                                        key={count}
                                        onClick={() => { triggerHaptic('light'); setClosedLookback(count); }}
                                        disabled={!isStrategyEnabled}
                                        className={`px-1.5 py-0.5 text-[9px] font-black rounded transition-all ${
                                            closedLookback === count
                                                ? 'bg-gold text-black shadow-xs font-extrabold'
                                                : 'text-gray-400 hover:text-white disabled:opacity-40'
                                        }`}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>

                            <div className="flex bg-zinc-800/50 rounded-lg p-0.5 border border-gray-700/30">
                                <button onClick={() => {triggerHaptic('light'); setNeighbourDepth(3)}} disabled={!isStrategyEnabled} className={`px-2 py-0.5 text-[9px] font-black rounded ${neighbourDepth === 3 ? 'bg-gold text-black' : 'text-gray-500'}`}>N3</button>
                                <button onClick={() => {triggerHaptic('light'); setNeighbourDepth(5)}} disabled={!isStrategyEnabled} className={`px-2 py-0.5 text-[9px] font-black rounded ${neighbourDepth === 5 ? 'bg-gold text-black' : 'text-gray-500'}`}>N5</button>
                            </div>

                            <button onClick={() => {triggerHaptic('light'); setBetStrategyMode(m => m === '235' ? '123' : m === '123' ? '111' : '235')}} disabled={!isStrategyEnabled} className={`px-2 py-0.5 text-[9px] font-black rounded transition-all shadow-sm ${betStrategyMode === '235' ? 'bg-green-600 text-white' : betStrategyMode === '123' ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white'} disabled:opacity-30`}>{betStrategyMode}</button>
                        </div>
                    </div>
                    {isStrategyEnabled && (
                        <div className="animate-fade-in space-y-1.5">
                            {spinHistory.length >= 1 ? (
                                <>
                                    {bettingMap.size > 0 && (
                                        <div className="flex justify-between items-center py-1 border-t border-gray-800/50 px-1">
                                            <div className="text-[9px] font-bold text-gray-400">
                                                Last {Math.min(spinHistory.length, closedLookback)} spins (N{neighbourDepth}): {bettingMap.size} closed numbers
                                            </div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                                {t('bet')}: <span className="text-gold text-xs">{totalBaseBetUnits * unitMultiplier}</span>
                                            </div>
                                        </div>
                                    )}
                                    <BettingChart bettingMap={bettingMap} />
                                </>
                            ) : (
                                <div className="border-t border-gray-800/50 pt-1.5 pb-0.5 text-center">
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic animate-pulse">{t('waiting')}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 5-Criteria Prediction Engine Card */}
                <MultiCriteriaPredictionCard
                    prediction={prediction}
                    lastPrediction={lastPrediction}
                    lang={lang}
                    sectorSplitMode={sectorSplitMode}
                    onSectorSplitChange={setSectorSplitMode}
                    lastSpin={spinHistory.length > 0 ? spinHistory[spinHistory.length - 1] : null}
                    lastHitStatus={lastHitStatus}
                    isPro={isPro}
                    onActivated={handleActivated}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    <div className="bg-zinc-900 p-2 rounded-xl shadow-md border border-gray-800/50">
                        <div className="flex justify-between items-center mb-1.5">
                            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t('history')} ({spinHistory.length})</h2>
                            <PredictionDisplay prediction={prediction} lastPrediction={lastPrediction} lastHitStatus={lastHitStatus} lastSpin={spinHistory.length > 0 ? spinHistory[spinHistory.length - 1] : null} lang={lang} />
                        </div>
                        {spinHistory.length > 0 ? <SpinHistory history={spinHistory} /> : <p className="text-gray-400 text-center py-4 text-[9px] font-black uppercase italic tracking-widest">{t('empty')}</p>}
                    </div>
                    <div className="bg-zinc-900 p-2 rounded-xl shadow-md border border-gray-800/50">
                        <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5">{t('alerts')}</h2>
                        <ToastContainer toasts={alerts} onRemoveToast={handleRemoveAlert} />
                    </div>
                </div>

                <div className="bg-zinc-900 p-2 rounded-xl shadow-md border border-gray-800/50 mt-0.5 mb-2">
                    <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2 bg-zinc-800/50 px-2 py-1.5 rounded-lg flex-1 border border-gray-700/50">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('alerts')}</span>
                            <button onClick={() => {triggerHaptic('light'); setAlertsEnabled(!alertsEnabled)}} className={`relative inline-flex items-center h-3.5 rounded-full w-7 transition-colors ${alertsEnabled ? 'bg-roulette-green' : 'bg-gray-700'}`}>
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
            ) : currentPage === 'functions' ? (
            <div className="animate-slide-up">
                <FunctionsPage
                    spinHistory={spinHistory}
                    onAddSpin={handleAddSpin}
                    onRemoveLastSpin={handleRemoveLastSpin}
                    onClearSession={handleClearSession}
                    onBack={() => switchPage('main')}
                    onOpenDashboard={() => switchPage('dashboard')}
                    prediction={prediction}
                    lang={lang}
                    initialTab={activeFunctionTab}
                    sectorSplitMode={sectorSplitMode}
                    onSectorSplitChange={setSectorSplitMode}
                    isPro={isPro}
                    onActivated={handleActivated}
                />
            </div>
            ) : currentPage === 'roadmap' ? (
            <div className="animate-slide-up">
                <AreaRoadmapPage 
                    spinHistory={spinHistory} 
                    onBack={() => switchPage('main')} 
                    prediction={prediction} 
                    lang={lang}
                />
            </div>
            ) : currentPage === 'dashboard' ? (
            <div className="animate-slide-up">
                <DashboardPage
                    spinHistory={spinHistory}
                    onBack={() => switchPage('main')}
                    lang={lang}
                    fiveDepths={fiveDepths}
                    sectorSplitMode={sectorSplitMode}
                />
            </div>
            ) : (
            <div className="animate-slide-up">
                <SetupPage 
                    onBack={() => switchPage('main')} 
                    lang={lang} 
                    setLang={setLang}
                    fiveDepths={fiveDepths}
                    setFiveDepths={setFiveDepths}
                    onClearSession={handleClearSession}
                    isPro={isPro}
                    onActivated={handleActivated}
                />
            </div>

            )}
        </div>
      </main>
      <ConfirmationModal
        isOpen={showClearConfirmation}
        onClose={() => setShowClearConfirmation(false)}
        onConfirm={handleClearSession}
        title={t('clearTitle')}
        message={t('clearMsg')}
        confirmText={t('confirmBtn')}
        cancelText={t('cancelBtn')}
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
    <circle cx="12" cy="12" r="5" strokeWidth="2" stroke="currentColor" fill="none" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.071-7.071l-1.414 1.414M6.343 17.657l-1.414 1.414m12.728 0l-1.414-1.414M6.343 6.343L4.929 4.929" />
  </svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);
export default App;