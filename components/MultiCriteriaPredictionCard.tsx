import React from 'react';
import type { ComplexPrediction, Language, SectorSplitMode, StrategyConfig, HitStatus } from '../types';
import { NUMBER_COLORS } from '../constants';
import { getSeriesType } from '../utils/roulette';
import { VipActivationCard } from './VipActivationCard';

const colorClasses = {
  red: 'bg-roulette-red text-white border-red-500/50',
  black: 'bg-roulette-black text-white border-zinc-700',
  green: 'bg-roulette-green text-white border-emerald-500/50',
};

const labels = {
  en: {
    title: "5-Criteria Prediction Engine",
    top3: "Top 3 Recommended Numbers",
    color: "Colour",
    final: "Final Digit",
    series: "Series",
    sector: "Wheel Sector",
    pocket: "Pocket Distance Steps",
    depth: "Depth",
    spins: "Spins",
    cw: "CW",
    acw: "ACW",
    matched: "Matched Criteria",
    hit: "HIT!",
    predictionHit: "PREDICTION HIT!",
    lastSpinHit: "LAST SPIN PREDICTION HIT!",
    waiting: "Enter at least 3 spins to activate 5-criteria prediction engine.",
  },
  zh: {
    title: "5维智能预测引擎",
    top3: "核心推荐 Top 3 号码",
    color: "颜色趋势",
    final: "尾数趋势",
    series: "轮盘分区",
    sector: "轮盘扇区",
    pocket: "口袋步距 (Top 1-3)",
    depth: "深度",
    spins: "转",
    cw: "顺时针",
    acw: "逆时针",
    matched: "契合维度",
    hit: "命中!",
    predictionHit: "预测命中!",
    lastSpinHit: "上一局预测成功命中!",
    waiting: "请输入至少 3 次旋转数据以激活 5 维智能预测引擎。",
  },
  ja: {
    title: "5基準AI予測エンジン",
    top3: "推奨番号 Top 3",
    color: "カラー",
    final: "下一桁",
    series: "セクター",
    sector: "ホイール扇区",
    pocket: "ポケット距離 (Top 1-3)",
    depth: "深度",
    spins: "スピン",
    cw: "時計回り",
    acw: "反時計回り",
    matched: "一致基準",
    hit: "当たり!",
    predictionHit: "予測命中!",
    lastSpinHit: "前回スピン予測命中!",
    waiting: "5基準AI予測を有効にするには最低3スピンのデータが必要です。",
  },
  es: {
    title: "Motor de Predicción de 5 Criterios",
    top3: "Top 3 Números Recomendados",
    color: "Color",
    final: "Dígito Final",
    series: "Serie",
    sector: "Sector de Rueda",
    pocket: "Pasos de Bolsillos (Top 1-3)",
    depth: "Profundidad",
    spins: "Giros",
    cw: "CW",
    acw: "ACW",
    matched: "Criterios Coincidentes",
    hit: "¡ACIERTO!",
    predictionHit: "¡PREDICCIÓN ACERTADA!",
    lastSpinHit: "¡PREDICCIÓN DEL ÚLTIMO GIRO ACERTADA!",
    waiting: "Ingresa al menos 3 giros para activar el modelo de 5 criterios.",
  },
  ko: {
    title: "5가지 기준 예측 엔진",
    top3: "추천 번호 Top 3",
    color: "색상",
    final: "끝수",
    series: "구역",
    sector: "휠 섹터",
    pocket: "포켓 디스턴스 (Top 1-3)",
    depth: "깊이",
    spins: "스핀",
    cw: "시계방향",
    acw: "반시계방향",
    matched: "일치 기준",
    hit: "적중!",
    predictionHit: "예측 적중!",
    lastSpinHit: "이전 스핀 예측 적중 성공!",
    waiting: "5가지 기준 예측을 활성화하려면 최소 3회의 스핀을 입력하세요.",
  },
  vi: {
    title: "Động Cơ Dự Đoán 5 Tiêu Chí",
    top3: "Top 3 Số Đề Xuất Phổ Biến",
    color: "Xu Hướng Màu Sắc",
    final: "Xu Hướng Số Cuối",
    series: "Phân Vùng Bánh Xe",
    sector: "Khối Bánh Xe",
    pocket: "Khoảng Cách Ô (Top 1-3)",
    depth: "Độ Sâu",
    spins: "Vòng Quay",
    cw: "Theo Kim ĐH",
    acw: "Ngược Kim ĐH",
    matched: "Tiêu Chí Trùng Khớp",
    hit: "TRÚNG!",
    predictionHit: "DỰ ĐOÁN TRÚNG!",
    lastSpinHit: "DỰ ĐOÁN VÒNG TRƯỚC ĐÃ TRÚNG!",
    waiting: "Vui lòng nhập ít nhất 3 vòng quay để kích hoạt động cơ dự đoán 5 tiêu chí.",
  },
};

interface MultiCriteriaPredictionCardProps {
  prediction: ComplexPrediction | null; // Prediction for upcoming spin
  lastPrediction?: ComplexPrediction | null; // Prediction for last spin
  lang: Language;
  sectorSplitMode?: SectorSplitMode;
  onSectorSplitChange?: (mode: SectorSplitMode) => void;
  lastSpin?: number | null;
  lastHitStatus?: HitStatus | null;
  isPro?: boolean;
  onActivated?: () => void;
  strategyConfig?: StrategyConfig;
  onUpdateStrategyConfig?: (newConfig: StrategyConfig) => void;
}

export const MultiCriteriaPredictionCard: React.FC<MultiCriteriaPredictionCardProps> = ({
  prediction,
  lastPrediction,
  lang,
  sectorSplitMode = '9',
  onSectorSplitChange,
  lastSpin,
  lastHitStatus,
  isPro = true,
  onActivated = () => {},
  strategyConfig,
  onUpdateStrategyConfig,
}) => {
  const t = labels[lang] || labels['en'];

  if (!isPro) {
    return (
      <div className="bg-zinc-950 p-3.5 sm:p-4 rounded-xl border border-amber-500/50 shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">
              {t.title} (VIP Locked)
            </h3>
          </div>
          <span className="text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
            请输入有效激活码解锁
          </span>
        </div>

        <div className="bg-zinc-900/90 p-3 rounded-xl border border-gray-800 text-center space-y-2">
          <p className="text-xs font-bold text-amber-300">
            🔒 请输入有效激活码解锁 5 维智能预测引擎
          </p>
          <p className="text-[11px] text-gray-400">
            Please enter a valid activation code to unlock the 5-criteria prediction engine.
          </p>
        </div>

        <VipActivationCard isPro={isPro} onActivated={onActivated} lang={lang} compact={true} />
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="bg-zinc-950 p-2.5 rounded-xl border border-gray-800 text-center space-y-1 shadow-sm">
        <div className="flex items-center justify-center gap-1.5 text-gold text-xs font-black uppercase tracking-wider">
          <span>{t.title}</span>
        </div>
        <p className="text-[10px] text-gray-400 font-bold italic animate-pulse">
          {t.waiting}
        </p>
      </div>
    );
  }

  const { color, finalDigits, series, sector, pocket, topNumbers } = prediction;

  const isLastSpinValid = lastSpin !== undefined && lastSpin !== null;

  // Evaluate hit status ONLY for the LAST spin against the LAST prediction
  const isClosedHit = isLastSpinValid && Boolean(lastHitStatus?.closed);
  const isTopHit = isLastSpinValid && (lastHitStatus?.top ?? (lastPrediction?.topNumbers.some(tn => tn.num === lastSpin) ?? false));
  const isColorHit = isLastSpinValid && (lastHitStatus?.color ?? (lastPrediction?.color !== null && lastPrediction?.color === NUMBER_COLORS[lastSpin]));
  const isFinalHit = isLastSpinValid && (lastHitStatus?.final ?? (Boolean(lastPrediction?.finalDigits && lastPrediction.finalDigits.length > 0 && lastPrediction.finalDigits.slice(0, strategyConfig?.finalDigitsCount || 3).includes(lastSpin % 10))));
  const isSeriesHit = isLastSpinValid && (lastHitStatus?.series ?? (lastPrediction?.series !== null && lastPrediction?.series !== 'none' && lastPrediction?.series === getSeriesType(lastSpin)));
  const topSectorsCount = strategyConfig?.vectorTopSectorsCount || 1;
  const activeSectorsInLast = lastPrediction?.sector?.topSectors
    ? lastPrediction.sector.topSectors.slice(0, topSectorsCount)
    : lastPrediction?.sector?.numbers ? [{ numbers: lastPrediction.sector.numbers }] : [];
  const isSectorHit = isLastSpinValid && (lastHitStatus?.sector ?? activeSectorsInLast.some(sec => sec.numbers.includes(lastSpin)));
  const isPocketHit = isLastSpinValid && (lastHitStatus?.pocket ?? (lastPrediction?.pocket?.topSteps?.slice(0, strategyConfig?.pocketTopRanks || 3).some((s) => s.cwTarget === lastSpin || s.acwTarget === lastSpin) ?? false));
  const isDozenHit = isLastSpinValid && Boolean(lastHitStatus?.dozen);
  const isColHit = isLastSpinValid && Boolean(lastHitStatus?.col);

  const hasAnyHit = isClosedHit || isTopHit || isColorHit || isFinalHit || isSeriesHit || isSectorHit || isPocketHit || isDozenHit || isColHit;

  // Rank of lastSpin in last prediction if hit
  const hitTopIndex = lastPrediction?.topNumbers.findIndex(tn => tn.num === lastSpin);
  const hitTopRank = hitTopIndex !== undefined && hitTopIndex !== -1 ? hitTopIndex + 1 : null;

  const getDozenName = (num: number) => {
    if (num === 0) return '0 (Zero)';
    if (num >= 1 && num <= 12) return '1st Dozen (1-12)';
    if (num >= 13 && num <= 24) return '2nd Dozen (13-24)';
    return '3rd Dozen (25-36)';
  };

  const getColumnName = (num: number) => {
    if (num === 0) return '0 (Zero)';
    if (num % 3 === 1) return '1st Col (1,4,7...)';
    if (num % 3 === 2) return '2nd Col (2,5,8...)';
    return '3rd Col (3,6,9...)';
  };

  return (
    <div className="bg-zinc-950 p-2.5 sm:p-3 rounded-xl border border-gold/40 shadow-lg space-y-2.5 transition-all">
      {/* LAST SPIN HIT ANNOUNCEMENT BANNER (No number shown, only which prediction hit) */}
      {isLastSpinValid && hasAnyHit && (
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border-2 border-emerald-400 p-2.5 rounded-xl shadow-lg shadow-emerald-500/25 space-y-1.5 transition-all">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-1">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-300 uppercase tracking-wider">
              <span className="text-sm">🎯</span>
              <span>🎯 PREDICTION HIT!</span>
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-400 text-black px-2.5 py-0.5 rounded-full uppercase shadow-sm">
              {t.hit}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-black">
            {isClosedHit && (
              <span className="bg-gold text-black font-black px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                🎯 Target Number Hit (+{(lastHitStatus?.hitUnits || 1) * 36}u)
              </span>
            )}
            {isTopHit && (
              <span className="bg-emerald-400 text-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                🎯 Top 3 Recommended Hit {lastHitStatus?.topRank || hitTopRank ? `(Rank #${lastHitStatus?.topRank || hitTopRank})` : ''}
              </span>
            )}
            {isColorHit && (
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/80 px-2 py-0.5 rounded-md">
                🎨 Colour Hit ({lastPrediction?.color ? lastPrediction.color.toUpperCase() : 'MATCH'})
              </span>
            )}
            {isFinalHit && (
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/80 px-2 py-0.5 rounded-md">
                🔢 Final Digit Hit
              </span>
            )}
            {isSeriesHit && (
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/80 px-2 py-0.5 rounded-md">
                🧭 Series Hit ({lastPrediction?.series || 'MATCH'})
              </span>
            )}
            {isSectorHit && (
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/80 px-2 py-0.5 rounded-md">
                🎡 Sector Hit ({lastPrediction?.sector?.predictedSectorName || 'MATCH'})
              </span>
            )}
            {isPocketHit && (
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/80 px-2 py-0.5 rounded-md">
                📏 Pocket Distance Step Hit
              </span>
            )}
            {isDozenHit && (
              <span className="bg-amber-950/90 text-amber-300 border border-amber-500/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                📊 Dozen Hit (+30u)
              </span>
            )}
            {isColHit && (
              <span className="bg-blue-950/90 text-blue-300 border border-blue-500/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                📊 Column Hit (+30u)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Engine Header */}
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h3 className="text-xs font-black text-gold uppercase tracking-wider">
            {t.title}
          </h3>
          <span className="text-[9px] font-bold text-gray-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-gray-800">
            For Next Spin
          </span>
        </div>

        {/* Sector Split Mode Selector */}
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-gray-800">
          <span className="text-[9px] font-black text-gray-400 uppercase px-1">Sector:</span>
          {(['9', '12', '6', '4'] as const).map((m) => (
            <button
              key={m}
              onClick={() => onSectorSplitChange?.(m)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-black transition-all ${
                sectorSplitMode === m
                  ? 'bg-gold text-black shadow-xs font-extrabold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {m}S
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Recommended Numbers Section for Upcoming Spin */}
      <div className={`p-2 rounded-xl border space-y-1.5 transition-all ${
        isTopHit 
          ? 'bg-emerald-950/30 border-emerald-400 ring-2 ring-emerald-400 shadow-md shadow-emerald-500/20' 
          : 'bg-zinc-900/90 border-gray-800'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            <span>🎯</span> 
            <span className={isTopHit ? 'text-emerald-300' : 'text-gold'}>{t.top3}</span>
            {isTopHit && (
              <span className="bg-emerald-400 text-black text-[8px] font-black px-1.5 py-0.2 rounded uppercase ml-1 shadow-xs">
                🎯 HIT
              </span>
            )}
          </span>
          <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.2 rounded-full uppercase">
            AI Score Active
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {topNumbers.map(({ num, confidence, matchedCriteria }, idx) => {
            const colorName = NUMBER_COLORS[num];
            const isRank1 = idx === 0;

            return (
              <div
                key={num}
                className={`flex items-center justify-between p-1.5 rounded-lg border transition-all ${
                  isRank1
                    ? 'bg-zinc-950 border-gold/70 ring-1 ring-gold/40'
                    : 'bg-zinc-950/80 border-gray-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-black w-4 h-4 rounded flex items-center justify-center ${
                      isRank1
                        ? 'bg-gold text-black'
                        : 'bg-zinc-800 text-gray-400'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shadow-md border ${colorClasses[colorName]}`}
                  >
                    {num}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black leading-none text-amber-400">
                    {confidence}%
                  </span>
                  <div className="flex gap-0.5 mt-0.5 flex-wrap justify-end">
                    {matchedCriteria && matchedCriteria.length > 0 ? (
                      matchedCriteria.slice(0, 4).map((crit, cIdx) => {
                        const tagMap: Record<string, string> = {
                          Colour: 'Clr',
                          Final: 'Fin',
                          Series: 'Ser',
                          Sector: 'Sec',
                          Pocket: 'Pkt',
                          Pattern: 'Pat',
                        };
                        const shortTag = tagMap[crit] || crit.slice(0, 3);
                        return (
                          <span
                            key={cIdx}
                            className={`text-[7px] font-black px-1 py-0.2 rounded border ${
                              crit === 'Pattern'
                                ? 'text-amber-300 bg-amber-950/80 border-amber-500/40'
                                : 'text-gold bg-zinc-800/90 border-gold/20'
                            }`}
                            title={crit}
                          >
                            {shortTag}
                          </span>
                        );
                      })
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5 Prediction Criteria Sub-Grid for Upcoming Spin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
        {/* Row 1: 3 Compact Criteria (Colour, Final, Series) */}
        <div className="md:col-span-3 grid grid-cols-3 gap-1">
          {/* Colour */}
          <div className={`p-1 px-1.5 rounded-lg border flex flex-col justify-between gap-0.5 min-h-[38px] transition-all ${
            isColorHit 
              ? 'bg-emerald-950/30 border-emerald-400 ring-2 ring-emerald-400 shadow-md shadow-emerald-500/20' 
              : 'bg-zinc-900/90 border-gray-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase flex items-center gap-1">
                <span className={isColorHit ? 'text-emerald-300' : 'text-gray-400'}>🎨 {t.color}</span>
                {isColorHit && (
                  <span className="bg-emerald-400 text-black text-[7px] font-black px-1 rounded uppercase">
                    HIT
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-center">
              {color ? (
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-black transition-all ${
                    color === 'red'
                      ? 'bg-roulette-red text-white'
                      : color === 'black'
                      ? 'bg-roulette-black text-white border border-gray-700'
                      : 'bg-roulette-green text-white'
                  }`}
                >
                  {color === 'red' ? 'RED 🔴' : color === 'black' ? 'BLACK ⬛' : 'GREEN 🟢'}
                </span>
              ) : (
                <span className="text-[9px] font-black text-gray-500">?</span>
              )}
            </div>
          </div>

          {/* Final Digit */}
          <div className={`p-1 px-1.5 rounded-lg border flex flex-col justify-between gap-0.5 min-h-[38px] transition-all ${
            isFinalHit 
              ? 'bg-emerald-950/30 border-emerald-400 ring-2 ring-emerald-400 shadow-md shadow-emerald-500/20' 
              : 'bg-zinc-900/90 border-gray-800'
          }`}>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] font-black uppercase flex items-center gap-1">
                <span className={isFinalHit ? 'text-emerald-300' : 'text-gray-400'}>🔢 {t.final}</span>
                {isFinalHit && (
                  <span className="bg-emerald-400 text-black text-[7px] font-black px-1 rounded uppercase">
                    HIT
                  </span>
                )}
              </span>
              <div className="flex items-center gap-0.5 bg-zinc-950 px-1 py-0.2 rounded border border-gray-800">
                {([2, 3, 4] as const).map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => {
                      if (onUpdateStrategyConfig && strategyConfig) {
                        onUpdateStrategyConfig({ ...strategyConfig, finalDigitsCount: cnt });
                      }
                    }}
                    className={`px-1 py-0 rounded text-[8px] font-black transition-all ${
                      (strategyConfig?.finalDigitsCount || 3) === cnt
                        ? 'bg-gold text-black shadow-xs font-extrabold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title={`Top ${cnt} Final Digits`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {finalDigits.length > 0 ? (
                finalDigits.map((f, i) => (
                  <span key={i} className="text-[9.5px] font-black text-gold bg-zinc-950 px-1.5 py-0.2 rounded border border-gold/30">
                    {f}
                  </span>
                ))
              ) : (
                <span className="text-[8.5px] font-bold text-gray-500 italic px-1" title="Needs ≥2 rounds (≥2 hits) following last hit in Final Matrix">-</span>
              )}
            </div>
          </div>

          {/* Series */}
          <div className={`p-1 px-1.5 rounded-lg border flex flex-col justify-between gap-0.5 min-h-[38px] transition-all ${
            isSeriesHit 
              ? 'bg-emerald-950/30 border-emerald-400 ring-2 ring-emerald-400 shadow-md shadow-emerald-500/20' 
              : 'bg-zinc-900/90 border-gray-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase flex items-center gap-1">
                <span className={isSeriesHit ? 'text-emerald-300' : 'text-gray-400'}>🧭 {t.series}</span>
                {isSeriesHit && (
                  <span className="bg-emerald-400 text-black text-[7px] font-black px-1 rounded uppercase">
                    HIT
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span
                className={`text-[9px] font-black truncate px-1.5 py-0.2 rounded bg-zinc-950 border border-gray-800 ${
                  series === 'Top'
                    ? 'text-blue-400 border-blue-500/30'
                    : series === 'Small'
                    ? 'text-yellow-400 border-yellow-500/30'
                    : series === 'Middle'
                    ? 'text-purple-400 border-purple-500/30'
                    : 'text-gray-400'
                }`}
              >
                {series === 'Top' ? 'Top series' : series === 'Small' ? 'Small series' : series === 'Middle' ? 'Orphelins' : '?'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Sector Prediction */}
        <div className={`p-1.5 sm:p-2 rounded-lg border space-y-2 transition-all ${
          isSectorHit 
            ? 'bg-emerald-950/30 border-emerald-400 ring-2 ring-emerald-400 shadow-md shadow-emerald-500/20' 
            : 'bg-zinc-900/90 border-gray-800'
        }`}>
          <div className="flex flex-wrap items-center justify-between text-[9px] font-black uppercase gap-1">
            <span className="flex items-center gap-1">
              <span className={isSectorHit ? 'text-emerald-300' : 'text-gray-400'}>🎡 {t.sector} ({sectorSplitMode}S)</span>
              {isSectorHit && (
                <span className="bg-emerald-400 text-black text-[7px] font-black px-1.5 py-0.2 rounded uppercase shadow-xs">
                  HIT
                </span>
              )}
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Ranking Mode Toggle: Next Probable vs History Top vs Both */}
              <div className="flex items-center bg-zinc-950 p-0.5 rounded border border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateStrategyConfig && strategyConfig) {
                      onUpdateStrategyConfig({ ...strategyConfig, vectorRankingMode: 'next_probable' });
                    }
                  }}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-black transition-all flex items-center gap-1 ${
                    (strategyConfig?.vectorRankingMode || 'next_probable') === 'next_probable'
                      ? 'bg-amber-400 text-black shadow-xs font-extrabold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Rank sectors by Next Probable Transition"
                >
                  <span>🎯</span>
                  <span>Top Next</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateStrategyConfig && strategyConfig) {
                      onUpdateStrategyConfig({ ...strategyConfig, vectorRankingMode: 'history_frequency' });
                    }
                  }}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-black transition-all flex items-center gap-1 ${
                    strategyConfig?.vectorRankingMode === 'history_frequency'
                      ? 'bg-orange-500 text-white shadow-xs font-extrabold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Rank sectors by Top Section of History"
                >
                  <span>🔥</span>
                  <span>Top History</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateStrategyConfig && strategyConfig) {
                      onUpdateStrategyConfig({ ...strategyConfig, vectorRankingMode: 'both' });
                    }
                  }}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-black transition-all flex items-center gap-1 ${
                    strategyConfig?.vectorRankingMode === 'both'
                      ? 'bg-purple-500 text-white shadow-xs font-extrabold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Include Both Top Next & Top History Sectors"
                >
                  <span>⚡</span>
                  <span>Both</span>
                </button>
              </div>

              {/* Quick Top 1/2/3 Sector Pick Count Selector */}
              <div className="flex items-center gap-0.5 bg-zinc-950 p-0.5 rounded border border-gray-800">
                <span className="text-[7px] text-gray-500 font-bold px-0.5">Pick:</span>
                {([1, 2, 3] as const).map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => {
                      if (onUpdateStrategyConfig && strategyConfig) {
                        onUpdateStrategyConfig({ ...strategyConfig, vectorTopSectorsCount: cnt });
                      }
                    }}
                    className={`px-1.5 py-0.2 rounded text-[8px] font-black transition-all ${
                      (strategyConfig?.vectorTopSectorsCount || 1) === cnt
                        ? 'bg-gold text-black shadow-xs font-extrabold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mode Indicator Banner */}
          <div className="flex items-center justify-between text-[8px] font-black px-1.5 py-0.5 rounded bg-zinc-950/80 border border-gray-800/60">
            <span className="text-gray-400 flex items-center gap-1">
              {strategyConfig?.vectorRankingMode === 'history_frequency' ? (
                <span className="text-orange-400">🔥 Mode: Top History Frequency</span>
              ) : strategyConfig?.vectorRankingMode === 'both' ? (
                <span className="text-purple-300">⚡ Mode: Both Next & History</span>
              ) : (
                <span className="text-amber-300">🎯 Mode: Top Next Probable</span>
              )}
            </span>
            <span className="text-gray-500 text-[7px]">
              {strategyConfig?.vectorTopSectorsCount || 1} Sector{(strategyConfig?.vectorTopSectorsCount || 1) > 1 ? 's' : ''} Active
            </span>
          </div>

          {sector && sector.topSectors && sector.topSectors.length > 0 ? (
            <div className="space-y-1.5 pt-0.5">
              {sector.topSectors.slice(0, strategyConfig?.vectorTopSectorsCount || 1).map((secItem, idx) => (
                <div key={secItem.id || idx} className="bg-zinc-950 p-1.5 rounded-md border border-gray-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[8px] font-black">
                    <span className="text-amber-300 flex items-center gap-1">
                      <span className={`px-1 py-0.2 rounded text-[7px] border font-black ${
                        strategyConfig?.vectorRankingMode === 'history_frequency'
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        #{idx + 1} {strategyConfig?.vectorRankingMode === 'history_frequency' ? 'History' : 'Next'}
                      </span>
                      <span>{secItem.name}</span>
                    </span>
                    <span className="text-gray-500 text-[7px]">{secItem.numbers.length} #s</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-0.5">
                    {secItem.numbers.map((n) => {
                      const nColor = NUMBER_COLORS[n];
                      const bgClass =
                        nColor === 'red'
                          ? 'bg-roulette-red text-white'
                          : nColor === 'black'
                          ? 'bg-roulette-black text-white border border-gray-700'
                          : 'bg-roulette-green text-white';
                      return (
                        <span
                          key={n}
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black shadow-xs ${bgClass}`}
                        >
                          {n}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : sector && sector.numbers && sector.numbers.length > 0 ? (
            <div className="bg-zinc-950 p-1.5 rounded-md border border-gray-800/80 space-y-1">
              <div className="flex items-center justify-between text-[8px] font-black text-amber-300">
                <span>#1 {sector.predictedSectorName}</span>
                <span className="text-gray-500 text-[7px]">{sector.numbers.length} #s</span>
              </div>
              <div className="flex flex-wrap items-center gap-0.5">
                {sector.numbers.map((n) => {
                  const nColor = NUMBER_COLORS[n];
                  const bgClass =
                    nColor === 'red'
                      ? 'bg-roulette-red text-white'
                      : nColor === 'black'
                      ? 'bg-roulette-black text-white border border-gray-700'
                      : 'bg-roulette-green text-white';
                  return (
                    <span
                      key={n}
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black shadow-xs ${bgClass}`}
                    >
                      {n}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <span className="text-[9px] font-bold text-gray-500">?</span>
          )}
        </div>

        {/* Pocket Distance Prediction */}
        <div className={`p-1.5 sm:p-2 rounded-lg border space-y-1 md:col-span-2 transition-all ${
          isPocketHit 
            ? 'bg-emerald-950/30 border-emerald-400 ring-2 ring-emerald-400 shadow-md shadow-emerald-500/20' 
            : 'bg-zinc-900/90 border-gray-800'
        }`}>
          <div className="flex items-center justify-between text-[9px] font-black uppercase">
            <span className="flex items-center gap-1">
              <span className={isPocketHit ? 'text-emerald-300' : 'text-gray-400'}>📏 {t.pocket}</span>
              {isPocketHit && (
                <span className="bg-emerald-400 text-black text-[7px] font-black px-1.5 py-0.2 rounded uppercase shadow-xs">
                  HIT
                </span>
              )}
            </span>
            <span className="text-gold font-bold text-[8px]">Top 1-3 History Steps</span>
          </div>

          {pocket && pocket.topSteps && pocket.topSteps.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 pt-0.5">
              {pocket.topSteps.slice(0, 3).map((stepItem, sIdx) => {
                const cwColor = NUMBER_COLORS[stepItem.cwTarget];
                const acwColor = NUMBER_COLORS[stepItem.acwTarget];

                const cwBg =
                  cwColor === 'red'
                    ? 'bg-roulette-red text-white'
                    : cwColor === 'black'
                    ? 'bg-roulette-black text-white border border-gray-700'
                    : 'bg-roulette-green text-white';

                const acwBg =
                  acwColor === 'red'
                    ? 'bg-roulette-red text-white'
                    : acwColor === 'black'
                    ? 'bg-roulette-black text-white border border-gray-700'
                    : 'bg-roulette-green text-white';

                return (
                  <div
                    key={sIdx}
                    className="p-1 rounded border bg-zinc-950 border-gray-800/80 flex flex-col justify-between transition-all"
                  >
                    <div className="flex items-center justify-between text-[8px] font-black text-gray-400 mb-0.5">
                      <span className="text-gold">#{sIdx + 1}</span>
                      <span className="flex items-center gap-1">
                        <span>Dist {stepItem.distance}</span>
                        {stepItem.hits !== undefined && stepItem.hits > 0 && (
                          <span className="text-[7px] text-emerald-400 font-black bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-800/50">
                            {stepItem.hits}h
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-around gap-0.5">
                      {/* CW Target */}
                      <div className="flex items-center gap-0.5">
                        <span className="text-[7px] font-black text-emerald-400">CW</span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black shadow-xs ${cwBg}`}>
                          {stepItem.cwTarget}
                        </div>
                      </div>

                      {/* ACW Target */}
                      <div className="flex items-center gap-0.5">
                        <span className="text-[7px] font-black text-cyan-400">ACW</span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black shadow-xs ${acwBg}`}>
                          {stepItem.acwTarget}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : pocket ? (
            <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400">
              <span>CW: {pocket.cwTarget}</span>
              <span className="text-gray-500">•</span>
              <span className="text-cyan-400">ACW: {pocket.acwTarget}</span>
            </div>
          ) : (
            <span className="text-[9px] font-bold text-gray-500">?</span>
          )}
        </div>
      </div>
    </div>
  );
};

