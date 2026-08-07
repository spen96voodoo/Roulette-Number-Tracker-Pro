import React, { useMemo } from 'react';
import { EUROPEAN_WHEEL_ORDER, NUMBER_COLORS } from '../constants';
import type { Language, ComplexPrediction } from '../types';

interface PocketDistancePageProps {
  spinHistory: number[];
  onBack?: () => void;
  prediction?: ComplexPrediction | null;
  lang?: Language;
  colorLookback?: number;
  seriesLookback?: number;
}

export function getPocketDistanceInfo(fromNum: number, toNum: number) {
  const fromIdx = EUROPEAN_WHEEL_ORDER.indexOf(fromNum);
  const toIdx = EUROPEAN_WHEEL_ORDER.indexOf(toNum);
  if (fromIdx === -1 || toIdx === -1) {
    return { distance: 0, cwSteps: 0, acwSteps: 0, direction: 'SAME' as const };
  }

  const cwSteps = (toIdx - fromIdx + 37) % 37;
  const acwSteps = (fromIdx - toIdx + 37) % 37;
  const distance = Math.min(cwSteps, acwSteps);

  let direction: 'CW' | 'ACW' | 'SAME' | 'OPPOSITE' = 'CW';
  if (cwSteps === 0) direction = 'SAME';
  else if (cwSteps === 18 || acwSteps === 18) direction = 'OPPOSITE';
  else if (cwSteps <= acwSteps) direction = 'CW';
  else direction = 'ACW';

  return { distance, cwSteps, acwSteps, direction };
}

export function getTargetsForDistance(latestNum: number, distance: number) {
  const idx = EUROPEAN_WHEEL_ORDER.indexOf(latestNum);
  if (idx === -1) return { cwNum: latestNum, acwNum: latestNum };

  const cwIdx = (idx + distance) % 37;
  const acwIdx = (idx - distance + 37) % 37;

  return {
    cwNum: EUROPEAN_WHEEL_ORDER[cwIdx],
    acwNum: EUROPEAN_WHEEL_ORDER[acwIdx],
  };
}

const labels = {
  en: {
    title: "Pocket Distance Analytics",
    subtitle: "Historical wheel pocket step distances (0-18) & Top 5 projected next chance targets",
    top5Title: "Top 5 Popular Next Chance Pocket Distances",
    top5Sub: "Based on historical wheel jump step frequencies from latest spin",
    latestSpin: "Latest Spin",
    distance: "Pocket Distance",
    cwTarget: "CW Number",
    acwTarget: "ACW Number",
    historyTitle: "Spin Pocket Distance History",
    historySub: "Step-by-step pocket jump distances between consecutive spins",
    spectrumTitle: "Pocket Distance Spectrum (0 - 18 Pockets)",
    rank: "Rank",
    hits: "hits",
    noData: "Add at least 2 spins to calculate pocket distance analytics.",
    sameSpot: "Same Pocket",
    oppositeSide: "Opposite Side",
    back: "Back",
  },
  zh: {
    title: "口袋距离深度分析",
    subtitle: "历史盘面口袋步长距离(0-18)与前5热门预测目标号码",
    top5Title: "前5热门下一手高概率口袋距离",
    top5Sub: "基于历史盘面跳跃步长频率推算最新开号的顺时针与逆时针目标",
    latestSpin: "最新开号",
    distance: "口袋距离",
    cwTarget: "顺时针号码 (CW)",
    acwTarget: "逆时针号码 (ACW)",
    historyTitle: "每手开号口袋距离历史",
    historySub: "连续开号之间的盘面跳转口袋距离与方向记录",
    spectrumTitle: "0-18 全盘距离频率分布图",
    rank: "排名",
    hits: "次",
    noData: "请至少录入 2 次开号数据以分析口袋距离。",
    sameSpot: "原位重合",
    oppositeSide: "正对对面",
    back: "返回",
  },
  ja: {
    title: "ポケット距離アナリティクス",
    subtitle: "ホイールのポケット距離履歴(0-18)とトップ5予測ターゲット",
    top5Title: "トップ5出現確率ポケット距離予測",
    top5Sub: "履歴ジャンプ頻度から算出した最新ナンバーからの時計回り/反時計回りターゲット",
    latestSpin: "最新ナンバー",
    distance: "距離",
    cwTarget: "時計回り (CW)",
    acwTarget: "反時計回り (ACW)",
    historyTitle: "スピンポケット距離履歴",
    historySub: "連続スピン間のポケットステップ距離と方向の記録",
    spectrumTitle: "0-18 ポケット距離スペクトラム",
    rank: "ランク",
    hits: "回",
    noData: "ポケット距離を分析するには2つ以上のスピンデータが必要です。",
    sameSpot: "同位置",
    oppositeSide: "反対側",
    back: "戻る",
  },
  es: {
    title: "Análisis de Distancia de Bolsillos",
    subtitle: "Distancias históricas de bolsillos (0-18) y los 5 números objetivo con mayor probabilidad",
    top5Title: "Top 5 Distancias de Mayor Probabilidad",
    top5Sub: "Basado en la frecuencia de saltos desde el último número",
    latestSpin: "Última Tirada",
    distance: "Distancia",
    cwTarget: "Sentido Horario (CW)",
    acwTarget: "Antihorario (ACW)",
    historyTitle: "Historial de Distancia entre Tiradas",
    historySub: "Distancia y dirección paso a paso entre tiradas consecutivas",
    spectrumTitle: "Espectro de Distancias (0 - 18 Bolsillos)",
    rank: "Rango",
    hits: "veces",
    noData: "Añada al menos 2 tiradas para analizar las distancias.",
    sameSpot: "Mismo Bolsillo",
    oppositeSide: "Lado Opuesto",
    back: "Volver",
  },
  ko: {
    title: "포켓 거리 분석기",
    subtitle: "휠 포켓 거리 히스토리(0-18) 및 상위 5개 다음 회차 예측 타겟 번호",
    top5Title: "상위 5개 최다 출현 포켓 거리 예측",
    top5Sub: "과거 점프 빈도를 바탕으로 계산된 최신 번호 기준 시계/반시계 방향 타겟",
    latestSpin: "최신 번호",
    distance: "포켓 거리",
    cwTarget: "시계 방향 (CW)",
    acwTarget: "반시계 방향 (ACW)",
    historyTitle: "회차별 포켓 거리 히스토리",
    historySub: "연속된 회차 간 포켓 점프 거리 및 방향 기록",
    spectrumTitle: "0 - 18 전체 포켓 거리 분포",
    rank: "순위",
    hits: "회",
    noData: "포켓 거리를 분석하려면 최소 2개 이상의 스핀 데이터가 필요합니다.",
    sameSpot: "제자리",
    oppositeSide: "정반대쪽",
    back: "뒤로",
  },
  vi: {
    title: "Phân Tích Khoảng Cách Ô Khoảng",
    subtitle: "Lịch sử khoảng cách bước ô (0-18) & Top 5 mục tiêu dự đoán vòng quay tiếp theo",
    top5Title: "Top 5 Khoảng Cách Ô Phổ Biến Nhất Cho Vòng Tiếp Theo",
    top5Sub: "Dựa trên tần suất bước nhảy lịch sử tính từ số quay gần nhất",
    latestSpin: "Số Mới Nhất",
    distance: "Khoảng Cách Ô",
    cwTarget: "Số Theo Kim ĐH",
    acwTarget: "Số Ngược Kim ĐH",
    historyTitle: "Lịch Sử Khoảng Cách Giữa Các Vòng Quay",
    historySub: "Khoảng cách bước nhảy ô và hướng giữa các vòng quay liên tiếp",
    spectrumTitle: "Phổ Khoảng Cách Ô (0 - 18 Ô)",
    rank: "Hạng",
    hits: "lần",
    noData: "Vui lòng nhập ít nhất 2 vòng quay để tính toán phân tích khoảng cách ô.",
    sameSpot: "Cùng Vị Trí",
    oppositeSide: "Đối Diện Trực Tiếp",
    back: "Quay Lại",
  },
};

const NumberBadge: React.FC<{ num: number; label?: string }> = ({ num, label }) => {
  const c = NUMBER_COLORS[num];
  const bg =
    c === 'green'
      ? 'bg-roulette-green text-white'
      : c === 'red'
      ? 'bg-roulette-red text-white'
      : 'bg-zinc-900 text-white border border-gray-700';

  return (
    <div className="flex flex-col items-center gap-0.5">
      {label && <span className="text-[8px] font-black uppercase text-gray-400">{label}</span>}
      <span className={`w-8 h-8 rounded-full text-xs font-black flex items-center justify-center shadow-md ${bg}`}>
        {num}
      </span>
    </div>
  );
};

export const VipPage: React.FC<PocketDistancePageProps> = ({
  spinHistory,
  onBack,
  lang = 'en',
}) => {
  const t = labels[lang] || labels.en;

  const latestSpin = spinHistory.length > 0 ? spinHistory[spinHistory.length - 1] : null;

  // Calculate step transitions between consecutive spins
  const transitions = useMemo(() => {
    if (spinHistory.length < 2) return [];

    const list = [];
    for (let i = 0; i < spinHistory.length - 1; i++) {
      const fromNum = spinHistory[i];
      const toNum = spinHistory[i + 1];
      const info = getPocketDistanceInfo(fromNum, toNum);
      list.push({
        spinIndex: i + 1,
        fromNum,
        toNum,
        ...info,
      });
    }
    return list;
  }, [spinHistory]);

  // Distance frequency map (0-18)
  const distanceFreq = useMemo(() => {
    const map = new Map<number, number>();
    for (let d = 0; d <= 18; d++) map.set(d, 0);

    transitions.forEach((tr) => {
      map.set(tr.distance, (map.get(tr.distance) || 0) + 1);
    });

    return map;
  }, [transitions]);

  // Top 5 popular pocket distances
  const top5Distances = useMemo(() => {
    const sorted = Array.from(distanceFreq.entries()).sort((a, b) => b[1] - a[1]);
    const totalTransitions = transitions.length;

    // Pick top 5
    return sorted.slice(0, 5).map(([distance, count], rankIndex) => {
      const percentage = totalTransitions > 0 ? (count / totalTransitions) * 100 : 0;
      const targets = latestSpin !== null ? getTargetsForDistance(latestSpin, distance) : { cwNum: 0, acwNum: 0 };

      return {
        rank: rankIndex + 1,
        distance,
        count,
        percentage,
        targets,
      };
    });
  }, [distanceFreq, transitions.length, latestSpin]);

  return (
    <div className="animate-fade-in space-y-4 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-950 p-3.5 rounded-2xl border border-gold/40 shadow-xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gold font-black transition-all active:scale-95 border border-gold/30 text-xs flex items-center gap-1"
            >
              <span>←</span>
              <span>{t.back}</span>
            </button>
          )}
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span>📏</span>
              <span>{t.title}</span>
            </h2>
            <p className="text-[10px] text-gray-400 font-medium">{t.subtitle}</p>
          </div>
        </div>

        {latestSpin !== null && (
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 font-black uppercase">{t.latestSpin}:</span>
            <NumberBadge num={latestSpin} />
          </div>
        )}
      </div>

      {spinHistory.length < 2 ? (
        <div className="bg-zinc-950 p-8 rounded-2xl border border-gray-800 text-center space-y-2">
          <span className="text-2xl">📏</span>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t.noData}</p>
        </div>
      ) : (
        <>
          {/* 🌟 Top 5 Popular Next Chance Pocket Distances */}
          <div className="bg-zinc-950 p-3.5 sm:p-4 rounded-2xl border border-gold/60 shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-2.5">
              <div>
                <h3 className="text-xs font-black text-gold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="bg-gold text-black text-[9px] px-1.5 py-0.2 rounded font-black">🏆</span>
                  <span>{t.top5Title}</span>
                </h3>
                <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">{t.top5Sub}</p>
              </div>
              {latestSpin !== null && (
                <div className="bg-gold/10 border border-gold/40 px-2.5 py-1 rounded-xl text-right">
                  <span className="text-[9px] text-gray-400 font-black uppercase block">PROJECTING FROM</span>
                  <span className="text-xs font-black text-gold">Latest Spin #{latestSpin}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {top5Distances.map((item) => {
                const isTop1 = item.rank === 1;
                return (
                  <div
                    key={item.distance}
                    className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${
                      isTop1
                        ? 'bg-gradient-to-b from-amber-500/20 to-zinc-900 border-gold shadow-lg shadow-gold/20'
                        : 'bg-zinc-900/90 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    {/* Top Row: Rank & Distance Tag */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isTop1 ? 'bg-gold text-black' : 'bg-zinc-800 text-gray-300 border border-gray-700'
                        }`}
                      >
                        {t.rank} #{item.rank}
                      </span>
                      <span className="text-xs font-black text-gold">
                        Dist {item.distance}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="mb-2 text-center bg-black/40 py-1.5 px-2 rounded-xl border border-gray-800/80">
                      <div className="text-sm font-black text-white">
                        {item.count} <span className="text-[10px] text-gray-400 font-medium">{t.hits}</span>
                      </div>
                      <div className="text-[10px] font-bold text-sky-400">
                        {item.percentage.toFixed(1)}% Chance
                      </div>
                    </div>

                    {/* Target Numbers (CW & ACW) */}
                    <div className="border-t border-gray-800/80 pt-2 space-y-1">
                      <span className="text-[8px] font-black uppercase text-gray-400 block text-center">
                        Projected Target Numbers
                      </span>
                      <div className="flex items-center justify-around gap-2 pt-0.5">
                        <NumberBadge num={item.targets.cwNum} label="CW" />
                        <span className="text-gray-600 font-black text-xs">|</span>
                        <NumberBadge num={item.targets.acwNum} label="ACW" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 📋 History of Each Spin's Pocket Distance */}
          <div className="bg-zinc-950 p-3.5 sm:p-4 rounded-2xl border border-gray-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-2">
              <div>
                <h3 className="text-xs font-black text-gold uppercase tracking-widest flex items-center gap-1.5">
                  <span>📜</span>
                  <span>{t.historyTitle}</span>
                </h3>
                <p className="text-[10px] text-gray-400 font-medium">{t.historySub}</p>
              </div>
              <span className="text-[10px] font-black text-gray-300 bg-zinc-900 px-2.5 py-1 rounded-lg border border-gray-800">
                {transitions.length} Jump Records
              </span>
            </div>

            <div className="overflow-x-auto custom-scrollbar -mx-1 px-1">
              <table className="w-full text-left text-xs font-bold min-w-[500px]">
                <thead>
                  <tr className="text-[9px] text-gray-400 uppercase tracking-wider border-b border-gray-800">
                    <th className="py-2 px-2.5">Spin Transition</th>
                    <th className="py-2 px-2">From ➔ To Number</th>
                    <th className="py-2 px-2">Pocket Distance</th>
                    <th className="py-2 px-2">Direction</th>
                    <th className="py-2 px-2">CW / ACW Steps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50 text-gray-200">
                  {[...transitions].reverse().map((tr, idx) => {
                    const isTop5Match = top5Distances.some((t5) => t5.distance === tr.distance);
                    return (
                      <tr key={idx} className={idx === 0 ? 'bg-gold/5' : 'hover:bg-zinc-900/50'}>
                        <td className="py-2.5 px-2.5 font-black text-gray-400 text-[10px]">
                          Spin #{tr.spinIndex} ➔ #{tr.spinIndex + 1}
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-1.5">
                            <NumberBadge num={tr.fromNum} />
                            <span className="text-gray-500 font-black">➔</span>
                            <NumberBadge num={tr.toNum} />
                          </div>
                        </td>
                        <td className="py-2.5 px-2">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-black inline-block ${
                              isTop5Match
                                ? 'bg-gold text-black shadow-sm'
                                : 'bg-zinc-900 text-sky-400 border border-gray-800'
                            }`}
                          >
                            Dist {tr.distance}
                          </span>
                        </td>
                        <td className="py-2.5 px-2">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded ${
                              tr.direction === 'SAME'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : tr.direction === 'OPPOSITE'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : tr.direction === 'CW'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {tr.direction === 'SAME'
                              ? t.sameSpot
                              : tr.direction === 'OPPOSITE'
                              ? t.oppositeSide
                              : tr.direction === 'CW'
                              ? 'Clockwise (CW)'
                              : 'Anti-Clockwise (ACW)'}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-[10px] text-gray-400 font-medium">
                          CW: +{tr.cwSteps} | ACW: -{tr.acwSteps}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 📊 Full 0 - 18 Pocket Distance Spectrum */}
          <div className="bg-zinc-950 p-3.5 sm:p-4 rounded-2xl border border-gray-800 space-y-3">
            <div className="border-b border-gray-800 pb-2">
              <h3 className="text-xs font-black text-gold uppercase tracking-widest flex items-center gap-1.5">
                <span>📊</span>
                <span>{t.spectrumTitle}</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {Array.from({ length: 19 }, (_, d) => d).map((dist) => {
                const count = distanceFreq.get(dist) || 0;
                const total = transitions.length;
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const isTop5 = top5Distances.some((t5) => t5.distance === dist);

                return (
                  <div
                    key={dist}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                      isTop5
                        ? 'bg-gold/10 border-gold/50 shadow-sm'
                        : 'bg-zinc-900/70 border-gray-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-white">Dist {dist}</span>
                      {isTop5 && (
                        <span className="text-[8px] font-black bg-gold text-black px-1 rounded uppercase">
                          TOP 5
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-xs font-black text-gold">{count} {t.hits}</span>
                      <span className="text-[10px] text-sky-400 font-bold">{percentage.toFixed(1)}%</span>
                    </div>

                    <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-gray-800">
                      <div
                        className="h-full bg-gold rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, percentage * 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const PocketDistancePage = VipPage;
