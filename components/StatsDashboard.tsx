import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { NUMBER_COLORS } from '../constants';
import type { Language } from '../types';

interface StatsDashboardProps {
  stats?: { red: number; black: number; green: number };
  totalSpins?: number;
  history?: number[];
  lang?: Language;
}

const COLOR_PIE = {
  red: '#dc2626',
  black: '#27272a',
  green: '#10b981',
};

const labels = {
  en: {
    title: "Color & Even-Money Odds Analysis",
    pieHeader: "Color Distribution (Red / Black / Green)",
    evenOddHeader: "Parity Distribution (Even vs Odd)",
    highLowHeader: "Range Distribution (Low 1-18 vs High 19-36)",
    streaksHeader: "Active Streak & Sleep Monitors",
    varianceHeader: "Theoretical Deviation & Variance (% off 48.6%)",
    strategyTitle: "🎯 Even-Money Strategy Recommendations",
    riderRec: "Trend Following (Rider)",
    reversionRec: "Mean Reversion (Deficit Hedge)",
    comboRec: "Optimal Combo Signal",
    spinsAgo: "spins ago",
    currentStreak: "Current Streak",
  },
  zh: {
    title: "颜色与双面玩法深度分析引擎",
    pieHeader: "颜色占比 (红 / 黑 / 绿0)",
    evenOddHeader: "单双奇偶比例 (偶数 vs 奇数)",
    highLowHeader: "大小区间比例 (小号 1-18 vs 大号 19-36)",
    streaksHeader: "当前连庄与漏失监控",
    varianceHeader: "理论偏差值与标准差 (% 对比理论48.6%)",
    strategyTitle: "🎯 颜色与双面投注策略推荐",
    riderRec: "顺势追龙策略 (Rider)",
    reversionRec: "反向回补策略 (Deficit Hedge)",
    comboRec: "最优组合信号",
    spinsAgo: "轮未开",
    currentStreak: "当前连庄",
  },
  ja: {
    title: "カラー・イーブンマネー分析",
    pieHeader: "カラー分布 (赤 / 黒 / 緑0)",
    evenOddHeader: "偶数 / 奇数 比率",
    highLowHeader: "ロー(1-18) / ハイ(19-36) 比率",
    streaksHeader: "連続・未出現スピン数",
    varianceHeader: "理論値偏差 (% 48.6%基準)",
    strategyTitle: "🎯 イーブンマネー戦略シグナル",
    riderRec: "トレンド追従 (Rider)",
    reversionRec: "平均回帰 (Hedge)",
    comboRec: "最適コンボシグナル",
    spinsAgo: "スピン前",
    currentStreak: "現在の連続",
  },
  es: {
    title: "Análisis de Color y Apuestas 1:1",
    pieHeader: "Distribución de Color (Rojo / Negro / Verde)",
    evenOddHeader: "Distribución Par / Impar",
    highLowHeader: "Distribución Bajo / Alto",
    streaksHeader: "Rachas Activas y Retrasos",
    varianceHeader: "Desviación Teórica (% base 48.6%)",
    strategyTitle: "🎯 Estrategia de Apuestas Simples",
    riderRec: "Tendencia (Rider)",
    reversionRec: "Reversión a la Media",
    comboRec: "Señal Combo Óptima",
    spinsAgo: "giros atrás",
    currentStreak: "Racha Actual",
  },
  ko: {
    title: "색상 및 홀짝 심층 분석",
    pieHeader: "색상 점유율 (레드 / 블랙 / 그린0)",
    evenOddHeader: "짝수 vs 홀수 비율",
    highLowHeader: "로우(1-18) vs 하이(19-36) 비율",
    streaksHeader: "현재 연속 및 지연 모니터",
    varianceHeader: "이론적 편차 (% 기준 48.6%)",
    strategyTitle: "🎯 1:1 배당 전략 신호",
    riderRec: "추세 추종 (Rider)",
    reversionRec: "평균 회귀 (Hedge)",
    comboRec: "최적 콤보 신호",
    spinsAgo: "스핀 전",
    currentStreak: "현재 연속",
  },
  vi: {
    title: "Phân Tích Màu Sắc & Tỷ Lệ Đặt 1:1",
    pieHeader: "Phân Bố Màu Sắc (Đỏ / Đen / Xanh 0)",
    evenOddHeader: "Phân Bố Chẵn Lẻ (Chẵn vs Lẻ)",
    highLowHeader: "Phân Bố Khoảng (Xỉu 1-18 vs Tài 19-36)",
    streaksHeader: "Theo Dõi Chuỗi Nóng & Số Chưa Ra",
    varianceHeader: "Độ Lệch Lý Thuyết & Biến Động (% so với 48.6%)",
    strategyTitle: "🎯 Khuyến Nghị Chiến Lược Cược 1:1",
    riderRec: "Theo Xu Hướng (Rider)",
    reversionRec: "Đảo Chiều Trung Bình (Deficit Hedge)",
    comboRec: "Tín Hiệu Kết Hợp Tối Ưu",
    spinsAgo: "vòng trước",
    currentStreak: "Chuỗi Hiện Tại",
  },
};

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats, totalSpins, history = [], lang = 'en' }) => {
  const t = labels[lang] || labels['en'];

  const computed = useMemo(() => {
    const total = history.length;
    if (total === 0) return null;

    let red = 0, black = 0, green = 0;
    let even = 0, odd = 0;
    let high = 0, low = 0;

    let sleepRed = -1, sleepBlack = -1, sleepGreen = -1;
    let sleepEven = -1, sleepOdd = -1;
    let sleepHigh = -1, sleepLow = -1;

    let currentColorStreakType: 'red' | 'black' | 'green' | null = null;
    let currentColorStreakLen = 0;

    let currentParityStreakType: 'even' | 'odd' | null = null;
    let currentParityStreakLen = 0;

    let currentRangeStreakType: 'high' | 'low' | null = null;
    let currentRangeStreakLen = 0;

    // Scan forward
    for (let i = 0; i < history.length; i++) {
      const num = history[i];
      const color = NUMBER_COLORS[num];
      if (color === 'red') red++;
      else if (color === 'black') black++;
      else green++;

      if (num !== 0) {
        if (num % 2 === 0) even++;
        else odd++;

        if (num >= 19) high++;
        else low++;
      }
    }

    // Scan backward for sleep & streaks
    for (let i = history.length - 1; i >= 0; i--) {
      const num = history[i];
      const revDist = history.length - 1 - i;
      const color = NUMBER_COLORS[num];

      if (color === 'red' && sleepRed === -1) sleepRed = revDist;
      if (color === 'black' && sleepBlack === -1) sleepBlack = revDist;
      if (color === 'green' && sleepGreen === -1) sleepGreen = revDist;

      if (num !== 0) {
        if (num % 2 === 0 && sleepEven === -1) sleepEven = revDist;
        if (num % 2 !== 0 && sleepOdd === -1) sleepOdd = revDist;

        if (num >= 19 && sleepHigh === -1) sleepHigh = revDist;
        if (num < 19 && sleepLow === -1) sleepLow = revDist;
      }

      // Streaks calculation from latest spin
      if (i === history.length - 1) {
        currentColorStreakType = color as any;
        currentColorStreakLen = 1;
        if (num !== 0) {
          currentParityStreakType = num % 2 === 0 ? 'even' : 'odd';
          currentParityStreakLen = 1;
          currentRangeStreakType = num >= 19 ? 'high' : 'low';
          currentRangeStreakLen = 1;
        }
      } else {
        // Color streak
        if (currentColorStreakType && color === currentColorStreakType) {
          currentColorStreakLen++;
        }
        // Parity streak
        if (num !== 0 && currentParityStreakType) {
          const p = num % 2 === 0 ? 'even' : 'odd';
          if (p === currentParityStreakType) {
            currentParityStreakLen++;
          }
        }
        // Range streak
        if (num !== 0 && currentRangeStreakType) {
          const r = num >= 19 ? 'high' : 'low';
          if (r === currentRangeStreakType) {
            currentRangeStreakLen++;
          }
        }
      }
    }

    if (sleepRed === -1) sleepRed = total;
    if (sleepBlack === -1) sleepBlack = total;
    if (sleepGreen === -1) sleepGreen = total;
    if (sleepEven === -1) sleepEven = total;
    if (sleepOdd === -1) sleepOdd = total;
    if (sleepHigh === -1) sleepHigh = total;
    if (sleepLow === -1) sleepLow = total;

    // Percentages
    const redPct = (red / total) * 100;
    const blackPct = (black / total) * 100;
    const evenPct = (even / total) * 100;
    const oddPct = (odd / total) * 100;
    const highPct = (high / total) * 100;
    const lowPct = (low / total) * 100;

    // Deviation from European expectation (48.6%)
    const redDev = (redPct - 48.6).toFixed(1);
    const blackDev = (blackPct - 48.6).toFixed(1);
    const evenDev = (evenPct - 48.6).toFixed(1);
    const oddDev = (oddPct - 48.6).toFixed(1);

    // Strategy signals
    let riderSignal = "Neutral";
    if (currentColorStreakLen >= 3) {
      riderSignal = `Ride ${currentColorStreakType?.toUpperCase()} (${currentColorStreakLen} in a row)`;
    } else if (currentParityStreakLen >= 3) {
      riderSignal = `Ride ${currentParityStreakType?.toUpperCase()} (${currentParityStreakLen} in a row)`;
    } else {
      riderSignal = redPct > blackPct ? "Follow RED Trend" : "Follow BLACK Trend";
    }

    let reversionSignal = "Balanced";
    if (sleepRed >= 5) reversionSignal = `Hedge RED (Slept ${sleepRed} spins)`;
    else if (sleepBlack >= 5) reversionSignal = `Hedge BLACK (Slept ${sleepBlack} spins)`;
    else if (sleepEven >= 5) reversionSignal = `Hedge EVEN (Slept ${sleepEven} spins)`;
    else if (sleepOdd >= 5) reversionSignal = `Hedge ODD (Slept ${sleepOdd} spins)`;
    else {
      reversionSignal = redPct < blackPct ? "Hedge Deficit RED" : "Hedge Deficit BLACK";
    }

    // Combo signal
    const bestColor = redPct >= blackPct ? "RED" : "BLACK";
    const bestParity = evenPct >= oddPct ? "EVEN" : "ODD";
    const bestRange = highPct >= lowPct ? "HIGH (19-36)" : "LOW (1-18)";
    const comboSignal = `${bestColor} + ${bestParity} + ${bestRange}`;

    const chartData = [
      { name: 'Red', value: red, percentage: redPct.toFixed(1) },
      { name: 'Black', value: black, percentage: blackPct.toFixed(1) },
      { name: 'Green', value: green, percentage: ((green / total) * 100).toFixed(1) },
    ].filter(d => d.value > 0);

    return {
      total,
      red, black, green,
      even, odd, high, low,
      sleepRed, sleepBlack, sleepGreen,
      sleepEven, sleepOdd, sleepHigh, sleepLow,
      currentColorStreakType, currentColorStreakLen,
      currentParityStreakType, currentParityStreakLen,
      currentRangeStreakType, currentRangeStreakLen,
      redPct, blackPct, evenPct, oddPct, highPct, lowPct,
      redDev, blackDev, evenDev, oddDev,
      riderSignal, reversionSignal, comboSignal,
      chartData,
    };
  }, [history]);

  if (!computed) {
    return (
      <div className="bg-zinc-950 p-6 rounded-2xl border border-gray-800 text-center space-y-2">
        <p className="text-xs font-black text-gold uppercase tracking-widest">{t.title}</p>
        <p className="text-xs text-gray-500 font-medium">No spin records available yet.</p>
      </div>
    );
  }

  const {
    total,
    red, black, green,
    even, odd, high, low,
    sleepRed, sleepBlack,
    sleepEven, sleepOdd, sleepHigh, sleepLow,
    currentColorStreakType, currentColorStreakLen,
    currentParityStreakType, currentParityStreakLen,
    redPct, blackPct, evenPct, oddPct, highPct, lowPct,
    redDev, blackDev, evenDev, oddDev,
    riderSignal, reversionSignal, comboSignal,
    chartData,
  } = computed;

  return (
    <div className="bg-zinc-950 p-3 sm:p-4 rounded-2xl border border-gray-800 space-y-4 shadow-lg">
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
        <h4 className="text-xs font-black text-gold uppercase tracking-widest flex items-center gap-1.5">
          <span>📈</span>
          <span>{t.title}</span>
        </h4>
        <span className="text-[10px] text-gray-400 font-bold bg-zinc-900 px-2 py-0.5 rounded border border-gray-800">
          Total Spins: <strong className="text-white">{total}</strong>
        </span>
      </div>

      {/* Main Grid: Pie + Proportions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Color Pie */}
        <div className="bg-zinc-900/60 p-2 rounded-xl border border-gray-800/80 flex flex-col items-center">
          <span className="text-[10px] font-black text-gray-400 uppercase mb-1">{t.pieHeader}</span>
          <div className="w-full h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={55}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLOR_PIE[entry.name.toLowerCase() as keyof typeof COLOR_PIE]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="space-y-3">
          {/* Red / Black Bars */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
              <span className="text-red-400">🔴 Red ({red})</span>
              <span>{redPct.toFixed(1)}% ({Number(redDev) >= 0 ? `+${redDev}` : redDev}%)</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-gray-800">
              <div className="bg-red-600 h-full transition-all" style={{ width: `${redPct}%` }} />
            </div>

            <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
              <span className="text-gray-300">⚫ Black ({black})</span>
              <span>{blackPct.toFixed(1)}% ({Number(blackDev) >= 0 ? `+${blackDev}` : blackDev}%)</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-gray-800">
              <div className="bg-zinc-500 h-full transition-all" style={{ width: `${blackPct}%` }} />
            </div>

            <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
              <span className="text-emerald-400">🟢 Zero ({green})</span>
              <span>{((green / total) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-gray-800">
              <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(green / total) * 100}%` }} />
            </div>
          </div>

          {/* Even / Odd and High / Low Summary Boxes */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-800">
            <div className="bg-zinc-900 p-2 rounded-xl border border-gray-800">
              <span className="text-[8px] font-black uppercase text-gray-400 block mb-0.5">{t.evenOddHeader}</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-black text-amber-400">{even} / {odd}</span>
                <span className="text-[9px] text-gray-500 font-bold">{evenPct.toFixed(0)}% vs {oddPct.toFixed(0)}%</span>
              </div>
            </div>

            <div className="bg-zinc-900 p-2 rounded-xl border border-gray-800">
              <span className="text-[8px] font-black uppercase text-gray-400 block mb-0.5">{t.highLowHeader}</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-black text-cyan-400">{low} / {high}</span>
                <span className="text-[9px] text-gray-500 font-bold">{lowPct.toFixed(0)}% vs {highPct.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Streaks & Sleep Monitors */}
      <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-gray-800 space-y-2">
        <span className="text-[10px] font-black text-gold uppercase tracking-wider flex items-center gap-1">
          <span>⚡</span> {t.streaksHeader}
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-zinc-950 p-2 rounded-lg border border-gray-800 text-center">
            <span className="text-[8px] font-black text-gray-400 uppercase block">Color Streak</span>
            <span className="text-xs font-black text-red-400">
              {currentColorStreakType?.toUpperCase()} × {currentColorStreakLen}
            </span>
          </div>

          <div className="bg-zinc-950 p-2 rounded-lg border border-gray-800 text-center">
            <span className="text-[8px] font-black text-gray-400 uppercase block">Parity Streak</span>
            <span className="text-xs font-black text-amber-400">
              {currentParityStreakType?.toUpperCase()} × {currentParityStreakLen}
            </span>
          </div>

          <div className={`p-2 rounded-lg border text-center ${sleepRed >= 5 ? 'bg-red-950/60 border-red-500/50' : 'bg-zinc-950 border-gray-800'}`}>
            <span className="text-[8px] font-black text-gray-400 uppercase block">Red Sleep</span>
            <span className="text-xs font-black text-gray-200">{sleepRed} {t.spinsAgo}</span>
          </div>

          <div className={`p-2 rounded-lg border text-center ${sleepBlack >= 5 ? 'bg-zinc-800 border-zinc-600' : 'bg-zinc-950 border-gray-800'}`}>
            <span className="text-[8px] font-black text-gray-400 uppercase block">Black Sleep</span>
            <span className="text-xs font-black text-gray-200">{sleepBlack} {t.spinsAgo}</span>
          </div>
        </div>
      </div>

      {/* Actionable Strategy Recommendations */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 p-3 rounded-xl border border-gold/40 space-y-2 shadow-md">
        <span className="text-[11px] font-black text-gold uppercase tracking-wider block">
          {t.strategyTitle}
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="bg-zinc-950/90 p-2 rounded-lg border border-gray-800 space-y-0.5">
            <span className="text-[9px] font-black text-gray-400 uppercase block">{t.riderRec}</span>
            <span className="text-xs font-black text-emerald-400">{riderSignal}</span>
          </div>

          <div className="bg-zinc-950/90 p-2 rounded-lg border border-gray-800 space-y-0.5">
            <span className="text-[9px] font-black text-gray-400 uppercase block">{t.reversionRec}</span>
            <span className="text-xs font-black text-amber-400">{reversionSignal}</span>
          </div>

          <div className="bg-zinc-950/90 p-2 rounded-lg border border-gray-800 space-y-0.5">
            <span className="text-[9px] font-black text-gray-400 uppercase block">{t.comboRec}</span>
            <span className="text-xs font-black text-cyan-400">{comboSignal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
