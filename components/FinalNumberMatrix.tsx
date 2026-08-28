import React, { useMemo } from 'react';
import type { Language } from '../types';

interface FinalNumberMatrixProps {
  history: number[];
  lang?: Language;
}

const matrixLabels = {
  en: {
    lastFinal: 'Last Final:',
    activeRow: 'Active Row:',
    none: 'None',
    lastHit: 'Last Hit',
    nextPossible2x: 'Next Possible (≥2 Hits - Predicted)',
    under2x: '1 Hit (<2 Rounds - No Prediction)',
    freqScale: 'Freq Scale:',
    predTitle: '5-Criteria Predicted Next Finals (≥2 Rounds):',
    noPredNotice: 'No final digit prediction: all transitions following active digit are under 2 rounds (<2x hits).',
    hits: 'hits',
    ruleNotice: 'Only transitions with 2 or more hits (≥2 rounds) in the active row are predicted by the 5 Criteria engine.',
  },
  zh: {
    lastFinal: '最新尾数：',
    activeRow: '活跃行：',
    none: '无',
    lastHit: '最新命中',
    nextPossible2x: '下一可能 (≥2次命中 - 纳入预测)',
    under2x: '1次命中 (<2轮 - 不予预测)',
    freqScale: '频次阶梯：',
    predTitle: '5大预测标准推荐下一尾数 (≥2轮)：',
    noPredNotice: '无尾数预测：当前活跃尾数的所有后置转移均未达2轮（<2次命中）。',
    hits: '次',
    ruleNotice: '只有活跃行中命中2次或以上（≥2轮）的后置尾数才会进入5大预测标准系统。',
  },
  ja: {
    lastFinal: '最新下一桁:',
    activeRow: 'アクティブ行:',
    none: 'なし',
    lastHit: '最新ヒット',
    nextPossible2x: '次回予測 (≥2回ヒット - 予測対象)',
    under2x: '1回ヒット (<2周 - 予測対象外)',
    freqScale: '頻度スケール:',
    predTitle: '5大基準予測の次回下一桁 (≥2周):',
    noPredNotice: '下一桁予測なし: アクティブ下一桁の全遷移が2周未満（<2回）のため予測しません。',
    hits: '回',
    ruleNotice: 'アクティブ行で2回以上（≥2周）ヒットした下一桁のみが5大予測基準エンジンで予測されます。',
  },
  es: {
    lastFinal: 'Último Dígito:',
    activeRow: 'Fila Activa:',
    none: 'Ninguno',
    lastHit: 'Último Acierto',
    nextPossible2x: 'Siguiente Posible (≥2 Aciertos - Predicho)',
    under2x: '1 Acierto (<2 Rondas - Sin Predicción)',
    freqScale: 'Escala Frec.:',
    predTitle: 'Dígitos Finales Predichos (≥2 Rondas):',
    noPredNotice: 'Sin predicción: todas las transiciones del dígito activo tienen menos de 2 rondas (<2 aciertos).',
    hits: 'aciertos',
    ruleNotice: 'Solo las transiciones con 2 o más aciertos (≥2 rondas) en la fila activa se predicen.',
  },
  ko: {
    lastFinal: '최근 끝수:',
    activeRow: '활성 행:',
    none: '없음',
    lastHit: '최근 적중',
    nextPossible2x: '다음 예측 (≥2회 적중 - 예측 활성)',
    under2x: '1회 적중 (<2라운드 - 예측 미포함)',
    freqScale: '빈도 스케일:',
    predTitle: '5대 기준 추천 다음 끝수 (≥2라운드):',
    noPredNotice: '끝수 예측 없음: 현재 활성 끝수 이후의 모든 전환이 2라운드 미만(<2회)입니다.',
    hits: '회',
    ruleNotice: '활성 행에서 2회 이상(≥2라운드) 적중한 끝수만 5대 예측 엔진에 반영됩니다.',
  },
  vi: {
    lastFinal: 'Số Cuối Mới Nhất:',
    activeRow: 'Hàng Đang Hoạt Động:',
    none: 'Không',
    lastHit: 'Vừa Trúng',
    nextPossible2x: 'Có Khả Năng Tiếp Theo (≥2 Lần - Dự Đoán)',
    under2x: '1 Lần Trúng (<2 Vòng - Không Dự Đoán)',
    freqScale: 'Thang Tần Suất:',
    predTitle: 'Số Cuối Được Dự Đoán (≥2 Vòng):',
    noPredNotice: 'Không có dự đoán số cuối: tất cả các bước chuyển của số cuối hiện tại đều dưới 2 vòng (<2 lần).',
    hits: 'lần',
    ruleNotice: 'Chỉ các bước chuyển đạt từ 2 lần trúng trở lên (≥2 vòng) mới được đưa vào dự đoán 5 tiêu chí.',
  },
};

export const FinalNumberMatrix: React.FC<FinalNumberMatrixProps> = ({ history, lang = 'en' }) => {
  const t = matrixLabels[lang] || matrixLabels.en;

  // Sequence as requested: 1, 2, 3, 4, 5, 6, 7, 8, 9, 0
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const rowDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const lastFinalDigit = history.length > 0 ? history[history.length - 1] % 10 : null;

  const { matrix, lastTransition } = useMemo(() => {
    const m = Array.from({ length: 10 }, () => Array(10).fill(0));
    let lastT: { prev: number, next: number } | null = null;
    
    if (history.length < 2) return { matrix: m, lastTransition: null };

    for (let i = 0; i < history.length - 1; i++) {
      const prevFinal = history[i] % 10;
      const nextFinal = history[i + 1] % 10;
      m[prevFinal][nextFinal]++;
      
      if (i === history.length - 2) {
        lastT = { prev: prevFinal, next: nextFinal };
      }
    }
    
    return { matrix: m, lastTransition: lastT };
  }, [history]);

  const maxVal = useMemo(() => {
    let max = 0;
    matrix.forEach(row => row.forEach(val => {
      if (val > max) max = val;
    }));
    return max || 1;
  }, [matrix]);

  // Compute qualified next final digits (hits >= 2) for the active row
  const qualifiedNextFinals = useMemo(() => {
    if (lastFinalDigit === null) return [];
    const candidates: { digit: number; count: number }[] = [];
    for (let d = 0; d < 10; d++) {
      const cnt = matrix[lastFinalDigit][d];
      if (cnt >= 2) {
        candidates.push({ digit: d, count: cnt });
      }
    }
    return candidates.sort((a, b) => b.count - a.count);
  }, [matrix, lastFinalDigit]);

  const getCellStyles = (val: number, isLast: boolean, isActiveRow: boolean) => {
    if (isLast) {
      return 'bg-gold text-black z-10 scale-110 shadow-[0_0_15px_rgba(255,215,0,0.9)] ring-2 ring-white dark:ring-gray-900 border-none font-black';
    }
    
    // Active row with >= 2 rounds: QUALIFIED NEXT PREDICTED FINAL
    if (isActiveRow && val >= 2) {
      return 'bg-gradient-to-br from-yellow-500/50 to-amber-500/60 text-white border-yellow-400 ring-2 ring-yellow-400 shadow-[0_0_12px_rgba(255,215,0,0.6)] animate-pulse font-black';
    }

    // Active row with 1 hit: under 2 rounds (< 2x), not qualified for prediction
    if (isActiveRow && val === 1) {
      return 'bg-yellow-500/15 text-amber-300 border-yellow-500/40 font-semibold';
    }

    if (val === 0) {
      return 'bg-gray-100 dark:bg-gray-800/40 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700/50';
    }
    
    const intensity = (val / maxVal);
    if (intensity > 0.8) return 'bg-yellow-500 text-white border-yellow-600';
    if (intensity > 0.5) return 'bg-yellow-500/60 text-white border-yellow-500/40';
    if (intensity > 0.2) return 'bg-yellow-500/30 text-gray-800 dark:text-gray-100 border-yellow-500/20';
    return 'bg-yellow-500/10 text-gray-600 dark:text-gray-400 border-yellow-500/10';
  };

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Matrix Header Labels */}
      <div className="flex justify-between items-center px-1 mb-0.5">
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{t.lastFinal}</span>
           {lastFinalDigit !== null ? (
             <div className="w-7 h-7 rounded-full bg-gold text-black flex items-center justify-center font-black text-sm shadow-md animate-bounce">
                {lastFinalDigit}
             </div>
           ) : <span className="text-gray-400 text-[10px] font-bold">-</span>}
        </div>
        <div className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-2">
          <span>{t.activeRow} {lastFinalDigit !== null ? `${lastFinalDigit}-X` : t.none}</span>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* 5-Criteria Prediction Connection Banner */}
      <div className="bg-zinc-900/90 border border-gold/30 p-2.5 rounded-xl flex flex-col gap-1.5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black text-gold flex items-center gap-1">
              <span>🎯</span> {t.predTitle}
            </span>
          </div>
          {lastFinalDigit !== null && (
            <span className="text-[9px] font-bold text-gray-400 bg-zinc-950 px-2 py-0.5 rounded border border-gray-800">
              Active Row {lastFinalDigit}-X
            </span>
          )}
        </div>

        {qualifiedNextFinals.length > 0 ? (
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            {qualifiedNextFinals.map(({ digit, count }) => (
              <div
                key={digit}
                className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-400/80 px-2.5 py-1 rounded-lg shadow-sm"
              >
                <span className="text-xs font-black text-gold">Final {digit}</span>
                <span className="text-[10px] font-black bg-gold text-black px-1.5 py-0.2 rounded font-mono">
                  {count}x {t.hits}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[10.5px] font-semibold text-gray-400 italic bg-zinc-950/70 p-2 rounded-lg border border-gray-800/80">
            {lastFinalDigit !== null ? (
              <span>⚠️ {t.noPredNotice}</span>
            ) : (
              <span>⏳ {t.ruleNotice}</span>
            )}
          </div>
        )}
      </div>

      {/* 10x10 Grid */}
      <div className="grid grid-cols-10 gap-0.5 sm:gap-1 bg-zinc-800/50 p-1 rounded-lg border border-gray-700/50">
        {rowDigits.map(rowIdx => (
          <React.Fragment key={`row-${rowIdx}`}>
            {digits.map(colIdx => {
              const val = matrix[rowIdx][colIdx];
              const isLast = lastTransition?.prev === rowIdx && lastTransition?.next === colIdx;
              const isActiveRow = lastFinalDigit === rowIdx;
              const isQualified = isActiveRow && val >= 2;
              
              return (
                <div 
                  key={`${rowIdx}-${colIdx}`} 
                  className={`
                    aspect-square flex flex-col items-center justify-center rounded-sm transition-all duration-300 border
                    ${getCellStyles(val, isLast, isActiveRow)}
                  `}
                >
                  <span className={`text-[10px] sm:text-[12px] font-black leading-none mb-0.5 ${
                    isLast 
                      ? 'text-black' 
                      : isQualified 
                      ? 'text-white drop-shadow' 
                      : (isActiveRow && val > 0 ? 'text-yellow-600 dark:text-gold' : 'opacity-90')
                  }`}>
                    {rowIdx}-{colIdx}
                  </span>
                  {val > 0 && (
                    <span className={`text-[11px] sm:text-[13px] font-black leading-none ${
                      isLast 
                        ? 'text-black' 
                        : isQualified 
                        ? 'text-white' 
                        : 'text-inherit'
                    }`}>
                      {val}x
                    </span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Legend & Help Text */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[9px] font-bold text-gray-400 px-1 mt-1 gap-2 uppercase tracking-tighter">
        <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 bg-gold rounded-sm shadow-[0_0_4px_gold]"></div>
                <span className="text-gold">{t.lastHit}</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 bg-yellow-500/50 border border-yellow-400 ring-1 ring-yellow-400 animate-pulse"></div>
                <span className="text-yellow-400">{t.nextPossible2x}</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 bg-yellow-500/15 border border-yellow-500/40"></div>
                <span className="text-gray-400">{t.under2x}</span>
            </div>
        </div>
        <div className="flex items-center gap-1">
            <span>{t.freqScale}</span>
            <div className="flex h-1.5 w-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                <div className="w-1/3 bg-yellow-500/20"></div>
                <div className="w-1/3 bg-yellow-500/60"></div>
                <div className="w-1/3 bg-yellow-500"></div>
            </div>
        </div>
      </div>
    </div>
  );
};