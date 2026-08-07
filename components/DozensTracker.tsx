import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Language } from '../types';

interface DozensTrackerProps {
  history: number[];
  lang?: Language;
}

const DOZEN_COLORS = {
  'Zero': '#10b981',
  '1st Dozen (1-12)': '#ef4444',
  '2nd Dozen (13-24)': '#eab308',
  '3rd Dozen (25-36)': '#3b82f6',
};

const labels = {
  en: {
    title: "Dozens & Columns Deep Analytics",
    dozensPie: "Dozens Share (1st, 2nd, 3rd 12)",
    colsBreakdown: "Columns Share (Col 1, Col 2, Col 3)",
    sleepTracker: "Sleep & Delay Monitor (Spins Since Last Hit)",
    intersectionMatrix: "3x3 Dozen-Column Grid Density",
    strategyTitle: "🎯 Dozens & Columns Strategic Signals",
    doubleDozenRec: "Recommended Double-Dozen Strategy",
    doubleColRec: "Recommended Double-Column Strategy",
    sleepAlert: "Sleep Reversion Signal",
    hotGrid: "Hot Street Intersection",
    overdue: "OVERDUE",
    hot: "HOT STREAK",
    normal: "BALANCED",
    spinsAgo: "spins ago",
  },
  zh: {
    title: "几十区与三列深度分析引擎",
    dozensPie: "几十区占比 (前12, 中12, 后12)",
    colsBreakdown: "三列占比 (1列, 2列, 3列)",
    sleepTracker: "漏失与遗漏监控 (距离上次命中轮数)",
    intersectionMatrix: "3x3 几十-列交叉密度矩阵",
    strategyTitle: "🎯 几十区与三列对冲策略引擎",
    doubleDozenRec: "推荐双几十区对冲策略 (覆盖64.8%)",
    doubleColRec: "推荐双列对冲策略 (覆盖64.8%)",
    sleepAlert: "冷号遗漏回补警报",
    hotGrid: "最热交叉街区",
    overdue: "遗漏预警",
    hot: "连庄热号",
    normal: "分布平稳",
    spinsAgo: "轮未开",
  },
  ja: {
    title: "ダズン・カラム詳細分析エンジン",
    dozensPie: "ダズン割合 (1-12, 13-24, 25-36)",
    colsBreakdown: "カラム割合 (1列, 2列, 3列)",
    sleepTracker: "未出現スピン数モニター",
    intersectionMatrix: "3x3 ダズン×カラムグリッド密度",
    strategyTitle: "🎯 ダズン・カラム戦略シグナル",
    doubleDozenRec: "推奨ダブルダズン戦略 (64.8%カバー)",
    doubleColRec: "推奨ダブルカラム戦略 (64.8%カバー)",
    sleepAlert: "スリープ回帰シグナル",
    hotGrid: "最頻出グリッド",
    overdue: "超過未出現",
    hot: "ホット streak",
    normal: "標準分布",
    spinsAgo: "スピン前",
  },
  es: {
    title: "Análisis Profundo de Docenas y Columnas",
    dozensPie: "Proporción de Docenas (1ª, 2ª, 3ª)",
    colsBreakdown: "Proporción de Columnas (Col 1, 2, 3)",
    sleepTracker: "Monitor de Retraso de Giros",
    intersectionMatrix: "Matriz 3x3 de Densidad Docena-Columna",
    strategyTitle: "🎯 Señales Estratégicas de Docenas y Columnas",
    doubleDozenRec: "Estrategia Doble Docena Recomendada",
    doubleColRec: "Estrategia Doble Columna Recomendada",
    sleepAlert: "Alerta de Reversión por Retraso",
    hotGrid: "Intersección Más Frecuente",
    overdue: "RETRASADO",
    hot: "RACHA CALIENTE",
    normal: "EQUILIBRADO",
    spinsAgo: "giros atrás",
  },
  ko: {
    title: "더즌 & 컬럼 심층 분석 엔진",
    dozensPie: "더즌 점유율 (1-12, 13-24, 25-36)",
    colsBreakdown: "컬럼 점유율 (1열, 2열, 3열)",
    sleepTracker: "미출현 스핀 모니터",
    intersectionMatrix: "3x3 더즌x컬럼 밀도 격자",
    strategyTitle: "🎯 더즌 & 컬럼 전략 신호",
    doubleDozenRec: "추천 더블 더즌 전략 (64.8% 커버)",
    doubleColRec: "추천 더블 컬럼 전략 (64.8% 커버)",
    sleepAlert: "지연 미출현 회귀 신호",
    hotGrid: "최다 출현 격자",
    overdue: "지연 경보",
    hot: "핫 스트릭",
    normal: "균형 유지",
    spinsAgo: "스핀 전",
  },
  vi: {
    title: "Phân Tích Chuyên Sâu Hàng & Cột",
    dozensPie: "Tỷ Lệ Hàng (Hàng 1, Hàng 2, Hàng 3)",
    colsBreakdown: "Tỷ Lệ Cột (Cột 1, Cột 2, Cột 3)",
    sleepTracker: "Theo Dõi Khoảng Trống & Chưa Ra (Số Vòng Chưa Trúng)",
    intersectionMatrix: "Mật Độ Lưới Giao Thoa 3x3 Hàng-Cột",
    strategyTitle: "🎯 Tín Hiệu Chiến Lược Hàng & Cột",
    doubleDozenRec: "Chiến Lược Hàng Kép Đề Xuất (Bao Phủ 64.8%)",
    doubleColRec: "Chiến Lược Cột Kép Đề Xuất (Bao Phủ 64.8%)",
    sleepAlert: "Tín Hiệu Quay Lại Cho Số Lạnh",
    hotGrid: "Giao Điểm Rất Nóng",
    overdue: "QUÁ HẠN",
    hot: "CHUỖI NÓNG",
    normal: "CÂN BẰNG",
    spinsAgo: "vòng trước",
  },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value, payload: { percentage } } = payload[0];
    return (
      <div className="bg-zinc-950 p-2 rounded-lg text-white text-xs border border-gray-700 shadow-md">
        <p className="font-black text-gold">{`${name}`}</p>
        <p className="text-gray-300 font-bold">{`${value} hits (${percentage}%)`}</p>
      </div>
    );
  }
  return null;
};

export const DozensTracker: React.FC<DozensTrackerProps> = ({ history, lang = 'en' }) => {
  const t = labels[lang] || labels['en'];

  const metrics = useMemo(() => {
    const total = history.length;
    if (total === 0) {
      return null;
    }

    // Dozen counts
    let d1 = 0, d2 = 0, d3 = 0, zeroCount = 0;
    // Column counts
    let c1 = 0, c2 = 0, c3 = 0;

    // Sleep tracking (spins since hit)
    let sleepD1 = -1, sleepD2 = -1, sleepD3 = -1;
    let sleepC1 = -1, sleepC2 = -1, sleepC3 = -1;

    // 3x3 Grid: matrix[dIdx][cIdx]
    const grid3x3 = Array.from({ length: 3 }, () => [0, 0, 0]);

    for (let i = 0; i < history.length; i++) {
      const num = history[i];
      if (num === 0) {
        zeroCount++;
      } else {
        // Dozen
        const dIdx = num <= 12 ? 0 : num <= 24 ? 1 : 2;
        if (dIdx === 0) d1++;
        else if (dIdx === 1) d2++;
        else d3++;

        // Column
        const cIdx = (num - 1) % 3; // 0 for Col1, 1 for Col2, 2 for Col3
        if (cIdx === 0) c1++;
        else if (cIdx === 1) c2++;
        else c3++;

        // Grid
        grid3x3[dIdx][cIdx]++;
      }
    }

    // Calculate sleep count backwards from end of history
    for (let i = history.length - 1; i >= 0; i--) {
      const num = history[i];
      const revDist = history.length - 1 - i;

      if (num === 0) continue;

      const dIdx = num <= 12 ? 0 : num <= 24 ? 1 : 2;
      const cIdx = (num - 1) % 3;

      if (dIdx === 0 && sleepD1 === -1) sleepD1 = revDist;
      if (dIdx === 1 && sleepD2 === -1) sleepD2 = revDist;
      if (dIdx === 2 && sleepD3 === -1) sleepD3 = revDist;

      if (cIdx === 0 && sleepC1 === -1) sleepC1 = revDist;
      if (cIdx === 1 && sleepC2 === -1) sleepC2 = revDist;
      if (cIdx === 2 && sleepC3 === -1) sleepC3 = revDist;
    }

    // Default sleep if never hit
    if (sleepD1 === -1) sleepD1 = total;
    if (sleepD2 === -1) sleepD2 = total;
    if (sleepD3 === -1) sleepD3 = total;
    if (sleepC1 === -1) sleepC1 = total;
    if (sleepC2 === -1) sleepC2 = total;
    if (sleepC3 === -1) sleepC3 = total;

    // Strategic Recommendations
    const dozensArr = [
      { id: '1st Dozen', count: d1, sleep: sleepD1, label: '1-12' },
      { id: '2nd Dozen', count: d2, sleep: sleepD2, label: '13-24' },
      { id: '3rd Dozen', count: d3, sleep: sleepD3, label: '25-36' },
    ];

    const colsArr = [
      { id: 'Col 1', count: c1, sleep: sleepC1, label: '1,4,7...' },
      { id: 'Col 2', count: c2, sleep: sleepC2, label: '2,5,8...' },
      { id: 'Col 3', count: c3, sleep: sleepC3, label: '3,6,9...' },
    ];

    // Double dozen strategy: Pick top 2 most active or overdue
    const sortedDozensBySleep = [...dozensArr].sort((a, b) => b.sleep - a.sleep);
    const sortedDozensByHit = [...dozensArr].sort((a, b) => b.count - a.count);

    let recDozenStrategy = "";
    if (sortedDozensBySleep[0].sleep >= 5) {
      recDozenStrategy = `Hedge ${sortedDozensBySleep[0].id} (${sortedDozensBySleep[0].label}) + ${sortedDozensByHit[0].id}`;
    } else {
      recDozenStrategy = `Play ${sortedDozensByHit[0].id} + ${sortedDozensByHit[1].id}`;
    }

    const sortedColsBySleep = [...colsArr].sort((a, b) => b.sleep - a.sleep);
    const sortedColsByHit = [...colsArr].sort((a, b) => b.count - a.count);

    let recColStrategy = "";
    if (sortedColsBySleep[0].sleep >= 5) {
      recColStrategy = `Hedge ${sortedColsBySleep[0].id} + ${sortedColsByHit[0].id}`;
    } else {
      recColStrategy = `Play ${sortedColsByHit[0].id} + ${sortedColsByHit[1].id}`;
    }

    // Find hot grid cell
    let maxGridVal = -1;
    let hotGridStr = "N/A";
    for (let d = 0; d < 3; d++) {
      for (let c = 0; c < 3; c++) {
        if (grid3x3[d][c] > maxGridVal) {
          maxGridVal = grid3x3[d][c];
          hotGridStr = `Dozen ${d + 1} × Col ${c + 1} (${grid3x3[d][c]} hits)`;
        }
      }
    }

    const chartData = [
      { name: '1st Dozen (1-12)', value: d1, percentage: ((d1 / total) * 100).toFixed(1) },
      { name: '2nd Dozen (13-24)', value: d2, percentage: ((d2 / total) * 100).toFixed(1) },
      { name: '3rd Dozen (25-36)', value: d3, percentage: ((d3 / total) * 100).toFixed(1) },
      { name: 'Zero', value: zeroCount, percentage: ((zeroCount / total) * 100).toFixed(1) },
    ].filter(d => d.value > 0);

    return {
      total,
      d1, d2, d3, zeroCount,
      c1, c2, c3,
      sleepD1, sleepD2, sleepD3,
      sleepC1, sleepC2, sleepC3,
      grid3x3,
      chartData,
      recDozenStrategy,
      recColStrategy,
      hotGridStr,
      sortedDozensBySleep,
      sortedColsBySleep,
    };
  }, [history]);

  if (!metrics) {
    return (
      <div className="bg-zinc-950 p-4 rounded-xl border border-gray-800 text-center space-y-1">
        <p className="text-xs font-black text-gold uppercase tracking-wider">{t.title}</p>
        <p className="text-xs text-gray-500 font-bold">No spin history available yet.</p>
      </div>
    );
  }

  const {
    total,
    d1, d2, d3, zeroCount,
    c1, c2, c3,
    sleepD1, sleepD2, sleepD3,
    sleepC1, sleepC2, sleepC3,
    grid3x3,
    chartData,
    recDozenStrategy,
    recColStrategy,
    hotGridStr,
  } = metrics;

  return (
    <div className="bg-zinc-950 p-3 sm:p-4 rounded-2xl border border-gray-800 space-y-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
        <h3 className="text-xs font-black text-gold uppercase tracking-widest flex items-center gap-1.5">
          <span>📊</span>
          <span>{t.title}</span>
        </h3>
        <span className="text-[10px] text-gray-400 font-bold bg-zinc-900 px-2 py-0.5 rounded border border-gray-800">
          Total Spins: <strong className="text-white">{total}</strong>
        </span>
      </div>

      {/* Main Grid: Pie Chart + Breakdown Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
        {/* Dozens Pie Chart */}
        <div className="bg-zinc-900/60 p-2 rounded-xl border border-gray-800/80 flex flex-col items-center">
          <span className="text-[10px] font-black text-gray-400 uppercase mb-1">{t.dozensPie}</span>
          <div className="w-full h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={55}
                  paddingAngle={3}
                  label={({ name, percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={DOZEN_COLORS[entry.name as keyof typeof DOZEN_COLORS] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Columns & Dozens Progress Bars */}
        <div className="space-y-3">
          {/* Dozens Stats */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-gold uppercase tracking-wider block">Dozens Frequency</span>
            <div className="space-y-1">
              <div>
                <div className="flex justify-between text-[9px] font-black text-gray-400">
                  <span>1st Dozen (1-12)</span>
                  <span className="text-red-400">{d1} hits ({((d1 / total) * 100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-gray-800">
                  <div className="bg-red-500 h-full transition-all" style={{ width: `${(d1 / total) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[9px] font-black text-gray-400">
                  <span>2nd Dozen (13-24)</span>
                  <span className="text-yellow-400">{d2} hits ({((d2 / total) * 100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-gray-800">
                  <div className="bg-yellow-500 h-full transition-all" style={{ width: `${(d2 / total) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[9px] font-black text-gray-400">
                  <span>3rd Dozen (25-36)</span>
                  <span className="text-blue-400">{d3} hits ({((d3 / total) * 100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-gray-800">
                  <div className="bg-blue-500 h-full transition-all" style={{ width: `${(d3 / total) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Columns Stats */}
          <div className="space-y-1.5 pt-1 border-t border-gray-800">
            <span className="text-[10px] font-black text-gold uppercase tracking-wider block">{t.colsBreakdown}</span>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-zinc-900 p-1.5 rounded-lg border border-gray-800">
                <span className="text-[8px] font-black text-gray-400 uppercase block">Col 1</span>
                <span className="text-xs font-black text-amber-400">{c1}</span>
                <span className="text-[8px] font-bold text-gray-500 block">({((c1 / total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="bg-zinc-900 p-1.5 rounded-lg border border-gray-800">
                <span className="text-[8px] font-black text-gray-400 uppercase block">Col 2</span>
                <span className="text-xs font-black text-amber-400">{c2}</span>
                <span className="text-[8px] font-bold text-gray-500 block">({((c2 / total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="bg-zinc-900 p-1.5 rounded-lg border border-gray-800">
                <span className="text-[8px] font-black text-gray-400 uppercase block">Col 3</span>
                <span className="text-xs font-black text-amber-400">{c3}</span>
                <span className="text-[8px] font-bold text-gray-500 block">({((c3 / total) * 100).toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sleep & Delay Monitor (Spins since last hit) */}
      <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-gray-800 space-y-2">
        <span className="text-[10px] font-black text-gold uppercase tracking-wider flex items-center gap-1">
          <span>⏰</span> {t.sleepTracker}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5">
          <div className={`p-1.5 rounded-lg border text-center ${sleepD1 >= 5 ? 'bg-red-950/60 border-red-500/50' : 'bg-zinc-950 border-gray-800'}`}>
            <span className="text-[8px] font-black text-gray-400 uppercase block">1st Dozen</span>
            <span className={`text-xs font-black ${sleepD1 >= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{sleepD1} {t.spinsAgo}</span>
          </div>

          <div className={`p-1.5 rounded-lg border text-center ${sleepD2 >= 5 ? 'bg-yellow-950/60 border-yellow-500/50' : 'bg-zinc-950 border-gray-800'}`}>
            <span className="text-[8px] font-black text-gray-400 uppercase block">2nd Dozen</span>
            <span className={`text-xs font-black ${sleepD2 >= 5 ? 'text-yellow-400 animate-pulse' : 'text-white'}`}>{sleepD2} {t.spinsAgo}</span>
          </div>

          <div className={`p-1.5 rounded-lg border text-center ${sleepD3 >= 5 ? 'bg-blue-950/60 border-blue-500/50' : 'bg-zinc-950 border-gray-800'}`}>
            <span className="text-[8px] font-black text-gray-400 uppercase block">3rd Dozen</span>
            <span className={`text-xs font-black ${sleepD3 >= 5 ? 'text-blue-400 animate-pulse' : 'text-white'}`}>{sleepD3} {t.spinsAgo}</span>
          </div>

          <div className={`p-1.5 rounded-lg border text-center ${sleepC1 >= 5 ? 'bg-emerald-950/60 border-emerald-500/50' : 'bg-zinc-950 border-gray-800'}`}>
            <span className="text-[8px] font-black text-gray-400 uppercase block">Col 1</span>
            <span className={`text-xs font-black ${sleepC1 >= 5 ? 'text-emerald-400 animate-pulse' : 'text-white'}`}>{sleepC1} {t.spinsAgo}</span>
          </div>

          <div className={`p-1.5 rounded-lg border text-center ${sleepC2 >= 5 ? 'bg-cyan-950/60 border-cyan-500/50' : 'bg-zinc-950 border-gray-800'}`}>
            <span className="text-[8px] font-black text-gray-400 uppercase block">Col 2</span>
            <span className={`text-xs font-black ${sleepC2 >= 5 ? 'text-cyan-400 animate-pulse' : 'text-white'}`}>{sleepC2} {t.spinsAgo}</span>
          </div>

          <div className={`p-1.5 rounded-lg border text-center ${sleepC3 >= 5 ? 'bg-purple-950/60 border-purple-500/50' : 'bg-zinc-950 border-gray-800'}`}>
            <span className="text-[8px] font-black text-gray-400 uppercase block">Col 3</span>
            <span className={`text-xs font-black ${sleepC3 >= 5 ? 'text-purple-400 animate-pulse' : 'text-white'}`}>{sleepC3} {t.spinsAgo}</span>
          </div>
        </div>
      </div>

      {/* 3x3 Grid Density Matrix */}
      <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-gray-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-gold uppercase tracking-wider flex items-center gap-1">
            <span>🧩</span> {t.intersectionMatrix}
          </span>
          <span className="text-[9px] font-bold text-gray-400">Hot Grid: <strong className="text-amber-300">{hotGridStr}</strong></span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {[2, 1, 0].map((cIdx) =>
            [0, 1, 2].map((dIdx) => {
              const val = grid3x3[dIdx][cIdx];
              return (
                <div
                  key={`${dIdx}-${cIdx}`}
                  className="bg-zinc-950 p-2 rounded-lg border border-gray-800 flex flex-col items-center justify-center text-center hover:border-gold/50 transition-all"
                >
                  <span className="text-[8px] font-black text-gray-400 uppercase">
                    D{dIdx + 1} × C{cIdx + 1}
                  </span>
                  <span className="text-sm font-black text-gold">{val}</span>
                  <span className="text-[7px] font-bold text-gray-500">
                    {total > 0 ? ((val / total) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Actionable Strategy Signals Card */}
      <div className="bg-gradient-to-r from-amber-950/40 via-zinc-950 to-amber-950/40 p-3 rounded-xl border border-gold/40 space-y-2 shadow-md">
        <span className="text-[11px] font-black text-gold uppercase tracking-wider block">
          {t.strategyTitle}
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="bg-zinc-950/90 p-2 rounded-lg border border-gray-800 space-y-0.5">
            <span className="text-[9px] font-black text-gray-400 uppercase block">{t.doubleDozenRec}</span>
            <span className="text-xs font-black text-emerald-400">{recDozenStrategy}</span>
          </div>

          <div className="bg-zinc-950/90 p-2 rounded-lg border border-gray-800 space-y-0.5">
            <span className="text-[9px] font-black text-gray-400 uppercase block">{t.doubleColRec}</span>
            <span className="text-xs font-black text-cyan-400">{recColStrategy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
