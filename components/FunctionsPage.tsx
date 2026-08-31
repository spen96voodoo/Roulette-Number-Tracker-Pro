import React, { useState } from 'react';
import { RouletteWheelTracker } from './RouletteWheelTracker';
import { DozensTracker } from './DozensTracker';
import { StatsDashboard } from './StatsDashboard';
import { SeriesTracker } from './SeriesTracker';
import { FinalNumberMatrix } from './FinalNumberMatrix';
import { PatternDisplay } from './PatternDisplay';
import { VipPage } from './VipPage';
import { NumberGrid } from './NumberGrid';
import { VipActivationCard } from './VipActivationCard';
import { EmptySpinReminderBanner } from './EmptySpinReminderBanner';
import type { Language, ComplexPrediction, Pattern, GappedPattern, SectorSplitMode } from '../types';
import { NUMBER_COLORS, RED_NUMBERS, BLACK_NUMBERS } from '../constants';

export type FunctionTab = 'cylinder' | 'distance' | 'dozens' | 'stats' | 'series' | 'matrix' | 'patterns' | 'strategy';

interface FunctionsPageProps {
  spinHistory: number[];
  onAddSpin: (num: number) => void;
  onRemoveLastSpin: () => void;
  onClearSession: () => void;
  onBack: () => void;
  onOpenDashboard?: () => void;
  onOpenStrategy?: () => void;
  prediction: ComplexPrediction | null;
  lang: Language;
  colorLookback?: number;
  seriesLookback?: number;
  initialTab?: FunctionTab;
  sectorSplitMode?: SectorSplitMode;
  onSectorSplitChange?: (mode: SectorSplitMode) => void;
  isPro?: boolean;
  onActivated?: () => void;
}


const funcTranslations = {
  en: {
    title: "Analysis Functions",
    subtitle: "Select a specialized module to analyze spin data",
    back: "Back to Main",
    quickInput: "Quick Spin Entry",
    lastSpins: "Recent Spins",
    clear: "Clear",
    undo: "Undo",
    tabs: {
      cylinder: "Wheel Vector",
      distance: "Pocket Distance",
      dozens: "Dozens & Cols",
      stats: "Color & Odds",
      series: "Series Heat",
      matrix: "Final Matrix",
      patterns: "Patterns"
    },
    cylinderDesc: "Visualizes ball movement vectors, cylinder jump distances, and pocket spacing on the European wheel.",
    distanceDesc: "Analyzes wheel pocket step distances (0-18), step jump history, and top 5 projected CW/ACW target numbers.",
    dozensDesc: "Breakdown of Dozens (1st 12, 2nd 12, 3rd 12) and Columns (1st, 2nd, 3rd) distribution.",
    statsDesc: "Color distribution, Even/Odd, High/Low ratios, and streak tracking.",
    seriesDesc: "Roadmap for French wheel sectors: Top series, Orphelins, and Small series.",
    matrixDesc: "10x10 Final Digits transition matrix tracking ending numbers from 0-9.",
    patternsDesc: "Automatic pattern detection for 2, 3, 4-number sequences and gapped repetitions.",
    column1: "Col 1 (1,4,7...)",
    column2: "Col 2 (2,5,8...)",
    column3: "Col 3 (3,6,9...)",
    even: "Even",
    odd: "Odd",
    high: "High (19-36)",
    low: "Low (1-18)",
    streaks: "Current Streaks",
    noData: "No spin data recorded yet. Add spins above or on the main page."
  },
  zh: {
    title: "分析功能中心",
    subtitle: "选择专用分析模块对轮盘数据进行深度分析",
    back: "返回主页",
    quickInput: "快速录入",
    lastSpins: "最新开号",
    clear: "清空",
    undo: "撤销",
    tabs: {
      cylinder: "轮盘间距",
      distance: "口袋距离",
      dozens: "几十与列",
      stats: "颜色奇偶",
      series: "分区走势",
      matrix: "尾数矩阵",
      patterns: "模式警报"
    },
    cylinderDesc: "可视化展示球落点轨迹、轮盘跳转间距和欧洲盘物理分布。",
    distanceDesc: "分析轮盘口袋步长距离(0-18)、历史跳转记录与前5热门预测顺逆时针目标。",
    dozensDesc: "几十区（前12、中12、后12）与三列分布统计图表。",
    statsDesc: "红黑绿比例、奇偶比、大小比以及连续连庄记录。",
    seriesDesc: "Top series、孤注(Orphelins)、Small series分区走势路单。",
    matrixDesc: "10x10尾数转移矩阵，追踪末尾数字0-9的演化关系。",
    patternsDesc: "自动扫描2连、3连、4连及隔号重复模式警报。",
    column1: "第一列 (1,4,7...)",
    column2: "第二列 (2,5,8...)",
    column3: "第三列 (3,6,9...)",
    even: "偶数",
    odd: "奇数",
    high: "大号 (19-36)",
    low: "小号 (1-18)",
    streaks: "当前连庄",
    noData: "尚无开号数据，请在上方或主页添加号码。"
  },
  ja: {
    title: "分析機能ハブ",
    subtitle: "スピンデータを分析するための専用モジュールを選択",
    back: "メインへ戻る",
    quickInput: "クイック入力",
    lastSpins: "直近の履歴",
    clear: "クリア",
    undo: "元に戻す",
    tabs: {
      cylinder: "ホイールベクトル",
      distance: "ポケット距離",
      dozens: "ダズン＆カラム",
      stats: "カラー・奇偶",
      series: "セクター分析",
      matrix: "末尾マトリックス",
      patterns: "パターン検出"
    },
    cylinderDesc: "ボールの移動ベクトル、ホイールジャンプ距離、ポケット間隔を視化。",
    distanceDesc: "ホイールポケットステップ距離(0-18)、ステップジャンプ履歴、トップ5予測CW/ACWターゲットナンバーの分析。",
    dozensDesc: "ダズン（1-12, 13-24, 25-36）とカラム（1列, 2列, 3列）の分布。",
    statsDesc: "赤/黒/緑の割合、奇数/偶数、ハイ/ロー比率、連続出現記録。",
    seriesDesc: "フレンチホイールセクター（Top series, 孤立区, Small series）のロードマップ。",
    matrixDesc: "0-9の下一桁ナンバー遷移を追化する10x10マトリックス。",
    patternsDesc: "2、3、4連番およびスキップパターンの自動検出アラート。",
    column1: "1列 (1,4,7...)",
    column2: "2列 (2,5,8...)",
    column3: "3列 (3,6,9...)",
    even: "偶数",
    odd: "奇数",
    high: "ハイ (19-36)",
    low: "ロー (1-18)",
    streaks: "現在の連続",
    noData: "データがありません。上部またはメインページでスピンを追加してください。"
  },
  es: {
    title: "Funciones de Análisis",
    subtitle: "Seleccione un módulo para analizar los datos de tiradas",
    back: "Volver al Menú",
    quickInput: "Entrada Rápida",
    lastSpins: "Tiradas Recientes",
    clear: "Borrar",
    undo: "Deshacer",
    tabs: {
      cylinder: "Vector Rueda",
      distance: "Distancia Bolsillo",
      dozens: "Docenas y Col",
      stats: "Color y Pares",
      series: "Sectores Rueda",
      matrix: "Matriz Final",
      patterns: "Patrones"
    },
    cylinderDesc: "Visualiza los vectores de movimiento de la bola, distancias de salto y espaciado en la rueda europea.",
    distanceDesc: "Analiza distancias de bolsillos (0-18), historial de saltos y los 5 números objetivo proyectados (CW/ACW).",
    dozensDesc: "Desglose de Docenas (1ª, 2ª, 3ª) y Columnas (1ª, 2ª, 3ª).",
    statsDesc: "Distribución de color, pares/impares, altos/bajos y rachas consecutivas.",
    seriesDesc: "Hoja de ruta para sectores: Top series, Orphelins y Small series.",
    matrixDesc: "Matriz de transición 10x10 para dígitos finales del 0 al 9.",
    patternsDesc: "Detección automática de patrones de 2, 3, 4 números y secuencias espaciadas.",
    column1: "Col 1 (1,4,7...)",
    column2: "Col 2 (2,5,8...)",
    column3: "Col 3 (3,6,9...)",
    even: "Pares",
    odd: "Impares",
    high: "Altos (19-36)",
    low: "Bajos (1-18)",
    streaks: "Rachas Actuales",
    noData: "Sin datos registrados. Añada tiradas arriba o en la página principal."
  },
  ko: {
    title: "분석 기능 센터",
    subtitle: "스핀 데이터를 분석할 전문 모듈을 선택하세요",
    back: "메인으로",
    quickInput: "빠른 입력",
    lastSpins: "최근 스핀",
    clear: "초기화",
    undo: "실행 취소",
    tabs: {
      cylinder: "휠 벡터",
      distance: "포켓 거리",
      dozens: "더즌 & 컬럼",
      stats: "색상 및 홀짝",
      series: "구역 로드맵",
      matrix: "끝수 행렬",
      patterns: "패턴 감지"
    },
    cylinderDesc: "유러피언 휠 상에서 볼의 이동 벡터, 점프 거리, 간격을 시각화합니다.",
    distanceDesc: "휠 포켓 스텝 거리(0-18), 스텝 점프 히스토리 및 상위 5개 예측 CW/ACW 타겟 번호를 분석합니다.",
    dozensDesc: "더즌(1-12, 13-24, 25-36) 및 컬럼(1, 2, 3열) 분포 분석.",
    statsDesc: "색상 비율, 홀/짝, 대/소 비율 및 연승/연패 스트릭 트래킹.",
    seriesDesc: "휠 섹터(Top series, 고립구역, Small series) 흐름 로드맵.",
    matrixDesc: "0-9 끝수 간 이동 트렌드를 분석하는 10x10 행렬.",
    patternsDesc: "2연속, 3연속, 4연속 및 갭 패턴 자동 감지 알림.",
    column1: "1열 (1,4,7...)",
    column2: "2열 (2,5,8...)",
    column3: "3열 (3,6,9...)",
    even: "짝수",
    odd: "홀수",
    high: "대호 (19-36)",
    low: "소호 (1-18)",
    streaks: "현재 연속",
    noData: "데이터가 없습니다. 위쪽이나 메인 페이지에서 스핀을 추가하세요."
  },
  vi: {
    title: "Trung Tâm Phân Tích",
    subtitle: "Chọn mô-đun chuyên sâu để phân tích dữ liệu vòng quay",
    back: "Về Trang Chính",
    quickInput: "Nhập Nhanh",
    lastSpins: "Kết Quả Gần Đây",
    clear: "Xóa Hết",
    undo: "Hoàn Tác",
    tabs: {
      cylinder: "Véctơ Vòng Quay",
      distance: "Khoảng Cách Ô",
      dozens: "Hàng & Cột",
      stats: "Màu & Chẵn Lẻ",
      series: "Phân Vùng Bánh Xe",
      matrix: "Ma Trận Số Cuối",
      patterns: "Cảnh Báo Mẫu"
    },
    cylinderDesc: "Trực quan hóa quỹ đạo di chuyển của bóng, khoảng cách nhảy và phân bố vật lý vòng quay Châu Âu.",
    distanceDesc: "Phân tích khoảng cách bước ô (0-18), lịch sử nhảy bước và top 5 mục tiêu theo/ngược chiều kim đồng hồ.",
    dozensDesc: "Thống kê phân bố Dozens (12 số đầu, giữa, cuối) và 3 Cột ngang.",
    statsDesc: "Tỷ lệ Màu (Đỏ/Đen/Xanh), Chẵn/Lẻ, Tài/Xỉu và theo dõi chuỗi liên tiếp.",
    seriesDesc: "Sơ đồ luồng cho các khu vực vòng quay Pháp: Top series, Orphelins, Small series.",
    matrixDesc: "Ma trận chuyển tiếp 10x10 theo dõi biến đổi của các chữ số cuối 0-9.",
    patternsDesc: "Tự động phát hiện mẫu lặp 2, 3, 4 số và mẫu lặp cách khoảng.",
    column1: "Cột 1 (1,4,7...)",
    column2: "Cột 2 (2,5,8...)",
    column3: "Cột 3 (3,6,9...)",
    even: "Chẵn",
    odd: "Lẻ",
    high: "Tài (19-36)",
    low: "Xỉu (1-18)",
    streaks: "Chuỗi Hiện Tại",
    noData: "Chưa có dữ liệu vòng quay. Vui lòng thêm số ở trên hoặc trang chính."
  }
};

// Helper pattern generator for PatternDisplay
const detectPatterns = (history: number[]) => {
  const p2Map = new Map<string, { sequence: number[]; count: number }>();
  const p3Map = new Map<string, { sequence: number[]; count: number }>();
  const p4Map = new Map<string, { sequence: number[]; count: number }>();
  const gappedMap = new Map<string, { sequence: [number, number]; count: number }>();

  if (history.length >= 2) {
    for (let i = 0; i < history.length - 1; i++) {
      const key = `${history[i]}-${history[i+1]}`;
      const existing = p2Map.get(key);
      p2Map.set(key, { sequence: [history[i], history[i+1]], count: (existing?.count || 0) + 1 });
    }
  }

  if (history.length >= 3) {
    for (let i = 0; i < history.length - 2; i++) {
      const key = `${history[i]}-${history[i+1]}-${history[i+2]}`;
      const existing = p3Map.get(key);
      p3Map.set(key, { sequence: [history[i], history[i+1], history[i+2]], count: (existing?.count || 0) + 1 });

      const gapKey = `${history[i]}-X-${history[i+2]}`;
      const existingGap = gappedMap.get(gapKey);
      gappedMap.set(gapKey, { sequence: [history[i], history[i+2]], count: (existingGap?.count || 0) + 1 });
    }
  }

  if (history.length >= 4) {
    for (let i = 0; i < history.length - 3; i++) {
      const key = `${history[i]}-${history[i+1]}-${history[i+2]}-${history[i+3]}`;
      const existing = p4Map.get(key);
      p4Map.set(key, { sequence: [history[i], history[i+1], history[i+2], history[i+3]], count: (existing?.count || 0) + 1 });
    }
  }

  return {
    patterns2: Array.from(p2Map.values()).filter(p => p.count >= 2).sort((a,b) => b.count - a.count),
    patterns3: Array.from(p3Map.values()).filter(p => p.count >= 2).sort((a,b) => b.count - a.count),
    patterns4: Array.from(p4Map.values()).filter(p => p.count >= 2).sort((a,b) => b.count - a.count),
    gappedPatterns: Array.from(gappedMap.values()).filter(p => p.count >= 2).sort((a,b) => b.count - a.count),
  };
};

export const FunctionsPage: React.FC<FunctionsPageProps> = ({
  spinHistory,
  onAddSpin,
  onRemoveLastSpin,
  onClearSession,
  onBack,
  onOpenDashboard,
  onOpenStrategy,
  prediction,
  lang,
  colorLookback,
  seriesLookback,
  initialTab = 'cylinder',
  sectorSplitMode = '9',
  onSectorSplitChange,
  isPro = true,
  onActivated = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<FunctionTab>(initialTab);
  const [showQuickGrid, setShowQuickGrid] = useState(false);
  const t = funcTranslations[lang] || funcTranslations.en;

  const handleTabClick = (tabId: FunctionTab) => {
    if (tabId === 'strategy') {
      onOpenStrategy?.();
      return;
    }
    setActiveTab(tabId);
  };

  const colorStats = React.useMemo(() => {
    let red = 0, black = 0, green = 0;
    spinHistory.forEach(n => {
      if (n === 0) green++;
      else if (RED_NUMBERS.includes(n)) red++;
      else if (BLACK_NUMBERS.includes(n)) black++;
    });
    return { red, black, green };
  }, [spinHistory]);

  const extendedStats = React.useMemo(() => {
    let col1 = 0, col2 = 0, col3 = 0, zeroCount = 0;
    let even = 0, odd = 0;
    let high = 0, low = 0;

    spinHistory.forEach(n => {
      if (n === 0) {
        zeroCount++;
      } else {
        if (n % 3 === 1) col1++;
        else if (n % 3 === 2) col2++;
        else if (n % 3 === 0) col3++;

        if (n % 2 === 0) even++;
        else odd++;

        if (n >= 19) high++;
        else low++;
      }
    });

    return { col1, col2, col3, zeroCount, even, odd, high, low };
  }, [spinHistory]);

  const streakInfo = React.useMemo(() => {
    if (spinHistory.length === 0) return { current: 'None', length: 0 };
    const last = spinHistory[spinHistory.length - 1];
    let type = last === 0 ? 'Green' : RED_NUMBERS.includes(last) ? 'Red' : 'Black';
    let count = 0;
    for (let i = spinHistory.length - 1; i >= 0; i--) {
      const item = spinHistory[i];
      const itemType = item === 0 ? 'Green' : RED_NUMBERS.includes(item) ? 'Red' : 'Black';
      if (itemType === type) count++;
      else break;
    }
    return { current: type, length: count };
  }, [spinHistory]);

  const patternData = React.useMemo(() => detectPatterns(spinHistory), [spinHistory]);

  const tabList: { id: FunctionTab; label: string; icon: string }[] = [
    { id: 'cylinder', label: t.tabs.cylinder, icon: '🎯' },
    { id: 'distance', label: t.tabs.distance, icon: '📏' },
    { id: 'dozens', label: t.tabs.dozens, icon: '📊' },
    { id: 'stats', label: t.tabs.stats, icon: '🎨' },
    { id: 'series', label: t.tabs.series, icon: '🧭' },
    { id: 'matrix', label: t.tabs.matrix, icon: '🔢' },
    { id: 'patterns', label: t.tabs.patterns, icon: '⚡' },
    { id: 'strategy', label: 'Strategy', icon: '⚙️' },
  ];

  return (
    <div className="animate-fade-in pb-16 space-y-3">
      {/* Header & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900 p-3 rounded-2xl border border-gray-800/80 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-gold font-bold transition-all active:scale-95 border border-gold/20 flex items-center gap-1.5 text-xs"
          >
            <span>←</span>
            <span>{t.back}</span>
          </button>
          <div>
            <h2 className="text-base font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.title}
            </h2>
            <p className="text-[10px] text-gray-400 font-medium">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenStrategy && (
            <button
              onClick={onOpenStrategy}
              className="px-3 py-1.5 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 hover:bg-yellow-500/30 font-black text-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>⚙️</span>
              <span>Strategy</span>
            </button>
          )}
          {onOpenDashboard && (
            <button
              onClick={onOpenDashboard}
              className="px-3 py-1.5 rounded-xl bg-gold text-black hover:bg-yellow-400 font-black text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </button>
          )}
          <button
            onClick={() => setShowQuickGrid(!showQuickGrid)}
            className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 border active:scale-95 ${
              showQuickGrid ? 'bg-gold text-black border-gold shadow-md' : 'bg-zinc-800 text-gold border-gold/30 hover:bg-zinc-700'
            }`}
          >
            <span>⚡</span>
            <span>{t.quickInput}</span>
          </button>
          <button
            onClick={onRemoveLastSpin}
            disabled={spinHistory.length === 0}
            className="px-2.5 py-1.5 rounded-xl bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 text-xs font-black border border-yellow-500/30 disabled:opacity-30 active:scale-95"
          >
            {t.undo}
          </button>
        </div>
      </div>

      {/* Quick Spin Entry Bar (Collapsible / Toggleable) */}
      {showQuickGrid && (
        <div className="bg-zinc-900 p-3 rounded-2xl border border-gold/40 shadow-xl space-y-2 animate-slide-down">
          <NumberGrid onNumberSelect={onAddSpin} disabled={false} />
        </div>
      )}

      {spinHistory.length === 0 && (
        <EmptySpinReminderBanner lang={lang} />
      )}

      {/* Recent Spins Strip (Latest spin first on the left) */}
      <div className="bg-zinc-900/90 p-2.5 rounded-xl border border-gray-800/80 flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex-shrink-0">
          {t.lastSpins} ({spinHistory.length}):
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar flex-1 py-0.5">
          {spinHistory.length === 0 ? (
            <span className="text-xs text-gray-500 italic">{t.noData}</span>
          ) : (
            [...spinHistory].reverse().slice(0, 15).map((n, idx) => {
              const bg = n === 0 ? 'bg-roulette-green' : RED_NUMBERS.includes(n) ? 'bg-roulette-red' : 'bg-roulette-black border border-gray-700';
              const isLatest = idx === 0;
              return (
                <div
                  key={idx}
                  className={`w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm transition-transform ${bg} ${
                    isLatest ? 'ring-2 ring-gold scale-110 shadow-gold/30' : ''
                  }`}
                  title={`Spin #${spinHistory.length - idx}`}
                >
                  {n}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Function Modules Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 pt-0.5">
        {tabList.map(tab => {
          const isStrategyTab = tab.id === 'strategy';
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border active:scale-95 ${
                isStrategyTab
                  ? 'bg-gradient-to-r from-amber-500/30 to-yellow-500/20 text-gold border-gold hover:bg-amber-500/40 shadow-sm'
                  : activeTab === tab.id
                  ? 'bg-gold text-black border-gold shadow-md'
                  : 'bg-zinc-900 text-gray-300 border-gray-800 hover:bg-zinc-800 hover:border-gold/30'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Function Page Module */}
      <div className="bg-zinc-900 p-4 rounded-3xl border border-gray-800/80 shadow-2xl space-y-4">
        {/* Module Description Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div>
            <h3 className="text-sm font-black text-gold uppercase tracking-widest flex items-center gap-2">
              <span>{tabList.find(t => t.id === activeTab)?.icon}</span>
              <span>{tabList.find(t => t.id === activeTab)?.label}</span>
            </h3>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              {activeTab === 'cylinder' && t.cylinderDesc}
              {activeTab === 'distance' && t.distanceDesc}
              {activeTab === 'dozens' && t.dozensDesc}
              {activeTab === 'stats' && t.statsDesc}
              {activeTab === 'series' && t.seriesDesc}
              {activeTab === 'matrix' && t.matrixDesc}
              {activeTab === 'patterns' && t.patternsDesc}
            </p>
          </div>
          <span className="text-[9px] font-black uppercase text-gold bg-gold/10 px-2 py-1 rounded-full border border-gold/20 flex-shrink-0">
            Shared Spin Engine ({spinHistory.length})
          </span>
        </div>

        {/* Function 1: Cylinder Spacing Engine */}
        {activeTab === 'cylinder' && (
          <div className="space-y-4">
            <RouletteWheelTracker history={spinHistory} lang={lang} splitMode={sectorSplitMode} onSplitModeChange={onSectorSplitChange} />
            {spinHistory.length >= 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-800">
                <div className="bg-zinc-800/60 p-2.5 rounded-xl border border-gray-700/50 text-center">
                  <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Last Jump</span>
                  <span className="text-sm font-black text-gold">
                    {spinHistory[spinHistory.length - 2]} → {spinHistory[spinHistory.length - 1]}
                  </span>
                </div>
                <div className="bg-zinc-800/60 p-2.5 rounded-xl border border-gray-700/50 text-center">
                  <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Wheel Status</span>
                  <span className="text-sm font-black text-green-400">Synchronized</span>
                </div>
                <div className="bg-zinc-800/60 p-2.5 rounded-xl border border-gray-700/50 text-center">
                  <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Vector Angle</span>
                  <span className="text-sm font-black text-blue-400">European 37-Pocket</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Function 2: Pocket Distance Analytics */}
        {activeTab === 'distance' && (
          <div>
            <VipPage spinHistory={spinHistory} lang={lang} onBack={onBack} />
          </div>
        )}

        {/* Function 2: Dozens & Columns Analysis */}
        {activeTab === 'dozens' && (
          <div>
            <DozensTracker history={spinHistory} lang={lang} />
          </div>
        )}

        {/* Function 3: Color, Even/Odd & High/Low Stats */}
        {activeTab === 'stats' && (
          <div>
            <StatsDashboard history={spinHistory} lang={lang} />
          </div>
        )}

        {/* Function 4: Sector & Series Roadmap */}
        {activeTab === 'series' && (
          <div className="h-80 sm:h-96">
            <SeriesTracker history={spinHistory} lang={lang} />
          </div>
        )}

        {/* Function 5: Final Number Matrix */}
        {activeTab === 'matrix' && (
          <div>
            <FinalNumberMatrix history={spinHistory} lang={lang} />
          </div>
        )}

        {/* Function 6: Pattern & Sequence Alerts */}
        {activeTab === 'patterns' && (
          <div>
            <PatternDisplay
              patterns2={patternData.patterns2}
              patterns3={patternData.patterns3}
              patterns4={patternData.patterns4}
              gappedPatterns={patternData.gappedPatterns}
              history={spinHistory}
              lang={lang}
            />
          </div>
        )}
      </div>
    </div>
  );
};
