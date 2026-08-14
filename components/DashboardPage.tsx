import React, { useMemo } from 'react';
import type { Language, FiveCriteriaDepths, SectorSplitMode, StrategyConfig } from '../types';
import { getNeighbours, getMultiCriteriaPrediction, calculateDozensAndColsStrategy } from '../utils/roulette';
import { NUMBER_COLORS, ROULETTE_NUMBERS } from '../constants';

interface DashboardPageProps {
  spinHistory: number[];
  onBack: () => void;
  lang: Language;
  fiveDepths?: FiveCriteriaDepths;
  sectorSplitMode?: SectorSplitMode;
  strategyConfig: StrategyConfig;
  onUpdateStrategyConfig?: (newConfig: StrategyConfig) => void;
}

const dashLabels = {
  en: {
    title: "System Performance Dashboard",
    subtitle: "5-Criteria Prediction Engine Hit Ratio & Return Backtest Analytics",
    back: "Back to Main",
    noDataTitle: "Insufficient Spin Data",
    noDataDesc: "Please enter at least 5 to 8 spin numbers in the main view to generate accurate prediction accuracy metrics.",
    spinsInput: "Total Spins Input",
    roundsPredicted: "Predicted Rounds",
    overallAccuracy: "Engine Consensus Accuracy",
    netReturnUnits: "Net Strategy Return",
    closedTitle: "1) Closed Numbers Strategy & Unit Return",
    closedDesc: "Adjacent closed numbers prediction with configurable spin lookback, neighbour depth, and input unit progression.",
    spinLookback: "Lookback Spins",
    neighbourDepth: "Neighbour Depth",
    progressionMode: "Input Progression",
    gamesPredicted: "Games Predicted",
    gamesHit: "Games Hit",
    hitRatio: "Hit Ratio %",
    basicReturnRatio: "Basic Baseline",
    unitsInput: "Total Input Units",
    unitsReturned: "Total Return Units",
    returnCount: "Return Count",
    returnPct: "Return %",
    colorTitle: "2) Colour Prediction (Red / Black)",
    colorDesc: "Historical color trend consensus prediction compared against standard 48.0% baseline.",
    seriesTitle: "3) Wheel Series Prediction (French Sectors)",
    seriesDesc: "Top series (Voisins), Small series (Tiers), and Orphelins sector hit ratio against 33.0% baseline.",
    vectorTitle: "4) Wheel Vector & Sector Map",
    vectorDesc: "Sector slice prediction hit ratio and unit return based on strategy choice (Next Probable / History / Both).",
    finalTitle: "5) Final Matrix Digit Prediction",
    finalDesc: "0-9 ending digit pattern prediction hit ratio and unit return.",
    pocketTitle: "6) Pockets Distance Step Prediction",
    pocketDesc: "Pocket step displacement predictions hit ratio and unit return.",
    topNumsTitle: "7) Top Core Recommended Numbers",
    topNumsDesc: "Top 3 high-confidence consensus numbers prediction direct hit ratio and unit return.",
    dozensTitle: "8) Dozens & Columns Strategic Signals",
    dozensDesc: "Dozens (1st, 2nd, 3rd) and Columns (1st, 2nd, 3rd) strategic signal hit ratio and unit return.",
    statusAbove: "OVER BASELINE",
    statusBelow: "BELOW BASELINE",
    baseline: "Theoretical Baseline",
    actual: "Actual Hit Rate",
  },
  zh: {
    title: "系统功能命中率与 Return 仪表盘",
    subtitle: "5大预测引擎与策略回测 Return 全维度计算与对照分析",
    back: "返回主页",
    noDataTitle: "旋转数据不足",
    noDataDesc: "请在主界面录入至少 5-8 轮历史数据，以计算系统的预测准确率与 Return 指标。",
    spinsInput: "录入总轮数",
    roundsPredicted: "预测总轮数",
    overallAccuracy: "引擎综合命中率",
    netReturnUnits: "策略净 Return 注数",
    closedTitle: "1) 相邻闭合号码与 Input 收益回测",
    closedDesc: "根据旋转回看轮数、邻号深度和 Input 递进策略进行精准模拟与 Return 计算。",
    spinLookback: "回看轮数",
    neighbourDepth: "邻号深度",
    progressionMode: "Input 策略",
    gamesPredicted: "预测游戏数",
    gamesHit: "命中游戏数",
    hitRatio: "命中率 %",
    basicReturnRatio: "基础理论概率",
    unitsInput: "Input 总注数",
    unitsReturned: "Return 总注数",
    returnCount: "Return 统计",
    returnPct: "Return 百分比",
    colorTitle: "2) 颜色预测 (红/黑/绿)",
    colorDesc: "颜色趋势预测命中率对照 48.0% 基准门槛。",
    seriesTitle: "3) 轮盘分区预测 (法式 Sector)",
    seriesDesc: "大轮区 (Top series)、小轮区 (Tiers) 与孤注区 (Orphelins) 预测对照 33.0% 基准。",
    vectorTitle: "4) 轮盘向量与 Sector 区域",
    vectorDesc: "基于当前策略选择 (Next / History / Both) 的 Sector 预测命中率与 Return 统计。",
    finalTitle: "5) 尾数矩阵预测",
    finalDesc: "0-9 尾数模式预测命中率与 Return 统计。",
    pocketTitle: "6) 轮盘口袋距离步数预测",
    pocketDesc: "口袋距离步数偏移预测命中率与 Return 统计。",
    topNumsTitle: "7) 核心推荐号码",
    topNumsDesc: "Top 3 高置信度号码直接命中率与 Return 统计。",
    dozensTitle: "8) 打列策略信号",
    dozensDesc: "几十区与三列横排策略信号命中率与 Return 统计。",
    statusAbove: "高于基础期望",
    statusBelow: "低于基础期望",
    baseline: "理论基础期望",
    actual: "实际命中率",
  },
  ja: {
    title: "システム的中率＆還元パフォーマンスダッシュボード",
    subtitle: "5基準予測エンジンと戦略バックテストの的中率・Return詳細分析",
    back: "メインに戻る",
    noDataTitle: "データが不足しています",
    noDataDesc: "正確な的中率とReturnを計算するには、メイン画面で最低5〜8回のスピンを入力してください。",
    spinsInput: "入力スピン数",
    roundsPredicted: "予測試行数",
    overallAccuracy: "総合的中率",
    netReturnUnits: "純損益ユニット",
    closedTitle: "1) 隣接閉鎖番号＆Input還元率",
    closedDesc: "ルックバック回数、隣接深度、Inputプログレッションによるバックテスト検証。",
    spinLookback: "ルックバック数",
    neighbourDepth: "隣接深度",
    progressionMode: "Input モード",
    gamesPredicted: "予測ゲーム数",
    gamesHit: "的中ゲーム数",
    hitRatio: "的中率 %",
    basicReturnRatio: "基本理論確率",
    unitsInput: "総 Input ユニット",
    unitsReturned: "総 Return ユニット",
    returnCount: "Return カウント",
    returnPct: "Return %",
    colorTitle: "2) カラー予測 (赤/黒)",
    colorDesc: "ヨーロピアンルーレット48.0%基準との比較検証。",
    seriesTitle: "3) セクター予測 (フレンチセクター)",
    seriesDesc: "Top series, Tiers, Orphelinsセクター予測の33.0%基準比較的中率。",
    vectorTitle: "4) ホイールベクトル＆セクターマップ",
    vectorDesc: "現在の戦略選択(Next / History / Both)に基づく予測的中率とReturn統計。",
    finalTitle: "5) 下一桁マトリックス予測",
    finalDesc: "0-9下一桁パターンの予測的中率とReturn統計。",
    pocketTitle: "6) ポケット距離ステップ予測",
    pocketDesc: "上位ステップ偏移の的中率とReturn統計。",
    topNumsTitle: "7) 推奨コア番号",
    topNumsDesc: "Top 3高信頼度番号の直撃的中率とReturn統計。",
    dozensTitle: "8) ダズン・カラム戦略シグナル",
    dozensDesc: "ダズンおよびカラムシグナルの的中率とReturn統計。",
    statusAbove: "基本確率超え",
    statusBelow: "基本確率未満",
    baseline: "理論基本確率",
    actual: "実際の的中率",
  },
  es: {
    title: "Panel de Rendimiento y Return",
    subtitle: "Análisis de precisión y retorno para los 5 criterios de predicción",
    back: "Volver al Menú",
    noDataTitle: "Datos Insuficientes",
    noDataDesc: "Por favor, introduzca al menos 5-8 giros en la pantalla principal para generar las métricas de rendimiento.",
    spinsInput: "Giros Registrados",
    roundsPredicted: "Rondas Predichas",
    overallAccuracy: "Precisión General Engine",
    netReturnUnits: "Retorno Neto Unidades",
    closedTitle: "1) Estrategia de Números Cerrados y Retorno",
    closedDesc: "Predicción de números cerrados con configuración de giros, profundidad de vecinos y progresión de Input.",
    spinLookback: "Giros Retroceso",
    neighbourDepth: "Vecinos",
    progressionMode: "Progresión Input",
    gamesPredicted: "Juegos Predichos",
    gamesHit: "Juegos Acertados",
    hitRatio: "Tasa Acierto %",
    basicReturnRatio: "Retorno Básico Teórico",
    unitsInput: "Unidades Input",
    unitsReturned: "Unidades Retorno",
    returnCount: "Conteo Return",
    returnPct: "Return %",
    colorTitle: "2) Predicción de Color (Rojo / Negro)",
    colorDesc: "Comparación de acierto con la base estándar del 48.0%.",
    seriesTitle: "3) Predicción de Series del Cilindro",
    seriesDesc: "Tasa de aciertos para Top series, Small series y Orphelins frente al 33.0% base.",
    vectorTitle: "4) Vector de Cilindro y Sectores",
    vectorDesc: "Tasa de aciertos y retorno según modo de estrategia (Next / History / Both).",
    finalTitle: "5) Predicción de Matriz de Números Finales",
    finalDesc: "Tasa de acierto y retorno para patrones de terminación 0-9.",
    pocketTitle: "6) Predicción de Pasos de Distancia de Bolsillo",
    pocketDesc: "Tasa de acierto y retorno para los mejores pasos de desplazamiento.",
    topNumsTitle: "7) Números Núcleo Recomendados",
    topNumsDesc: "Tasa de impacto directo y retorno para los 3 números con mayor confianza.",
    dozensTitle: "8) Señales Estratégicas de Docenas y Columnas",
    dozensDesc: "Tasa de acierto y retorno para señales de docenas y columnas.",
    statusAbove: "SOBRE BASE TEÓRICA",
    statusBelow: "BAJO BASE TEÓRICA",
    baseline: "Base Teórica",
    actual: "Acierto Real",
  },
  ko: {
    title: "대시보드 - 적중률 및 Return 분석",
    subtitle: "5대 예측 엔진의 각 영역별 적중률 및 Return 백테스트 분석",
    back: "메인으로 돌아가기",
    noDataTitle: "스핀 데이터 부족",
    noDataDesc: "정확한 적중률과 Return 분석을 위해 메인 화면에서 최소 5~8회의 스핀 데이터를 입력해 주세요.",
    spinsInput: "입력된 스핀 수",
    roundsPredicted: "예측 진행 라운드",
    overallAccuracy: "엔진 종합 적중률",
    netReturnUnits: "전략 순 Return 유닛",
    closedTitle: "1) 인접 닫힌 번호 및 Input/Return 분석",
    closedDesc: "스핀 회수, 인접 깊이(N3/N5), Input 시스템에 따른 Return 백테스트.",
    spinLookback: "회수 스핀 수",
    neighbourDepth: "인접 깊이",
    progressionMode: "Input 모드",
    gamesPredicted: "예측 게임 수",
    gamesHit: "적중 게임 수",
    hitRatio: "적중률 %",
    basicReturnRatio: "기본 이론 환급률",
    unitsInput: "총 Input 유닛",
    unitsReturned: "총 Return 유닛",
    returnCount: "Return 카운트",
    returnPct: "Return %",
    colorTitle: "2) 색상 예측 (레드 / 블랙)",
    colorDesc: "유러피언 룰렛 기본 48.0% 기준 대비 적중률 검증.",
    seriesTitle: "3) 휠 구역(Series) 예측",
    seriesDesc: "Top series, Tiers, Orphelins 구역 33.0% 기준 대비 적중률.",
    vectorTitle: "4) 휠 벡터 및 섹터 맵",
    vectorDesc: "현재 전략 선택(Next / History / Both) 기준 섹터 적중률 및 Return.",
    finalTitle: "5) 끝수 매트릭스 예측",
    finalDesc: "0-9 끝수 패턴 적중률 및 Return 분석.",
    pocketTitle: "6) 포켓 거리 단계 예측",
    pocketDesc: "상위 이동 거리 단계 적중률 및 Return.",
    topNumsTitle: "7) 핵심 추천 번호",
    topNumsDesc: "상위 3개 핵심 추천 번호 직격 적중률 및 Return.",
    dozensTitle: "8) 더즌 및 컬럼 전략 시그널",
    dozensDesc: "더즌 및 컬럼 신호 적중률 및 Return.",
    statusAbove: "이론치 상회",
    statusBelow: "이론치 하회",
    baseline: "이론 기본치",
    actual: "실제 적중률",
  },
  vi: {
    title: "Bảng Điều Khiển Tỷ Lệ Trúng & Return",
    subtitle: "Phân tích tỷ lệ trúng và Return cho 5 tiêu chuẩn dự đoán",
    back: "Trở Về Trang Chính",
    noDataTitle: "Chưa Đủ Dữ Liệu",
    noDataDesc: "Vui lòng nhập ít nhất 5-8 lượt quay ở màn hình chính để tính toán chỉ số chính xác.",
    spinsInput: "Tổng Số Lượt Nhập",
    roundsPredicted: "Số Lượt Dự Đoán",
    overallAccuracy: "Độ Chính Xác Tổng Thể",
    netReturnUnits: "Lợi Nhuận Return (Đơn Vị)",
    closedTitle: "1) Số Lân Cận Khép Kín & Return",
    closedDesc: "Dự đoán số khép kín lân cận với tùy chỉnh số vòng quay, độ sâu N3/N5 và chế độ Input.",
    spinLookback: "Số Vòng Quay",
    neighbourDepth: "Độ Sâu Lân Cận",
    progressionMode: "Chế Độ Input",
    gamesPredicted: "Số Trận Dự Đoán",
    gamesHit: "Số Trận Trúng",
    hitRatio: "Tỷ Lệ Trúng %",
    basicReturnRatio: "Tỷ Lệ Hoàn Vốn Cơ Bản",
    unitsInput: "Tổng Đơn Vị Input",
    unitsReturned: "Tổng Đơn Vị Return",
    returnCount: "Thống Kê Return",
    returnPct: "Tỷ Lệ Return %",
    colorTitle: "2) Dự Đoán Màu Sắc (Đỏ / Đen)",
    colorDesc: "So sánh tỷ lệ trúng màu sắc với mốc cơ bản 48.0%.",
    seriesTitle: "3) Dự Đoán Phân Vùng Bánh Xe (Series)",
    seriesDesc: "Tỷ lệ trúng phân vùng Top series, Small series và Orphelins so với mốc 33.0%.",
    vectorTitle: "4) Vector Bánh Xe & Bản Đồ Phân Vùng",
    vectorDesc: "Tỷ lệ trúng và Return phân vùng theo chế độ chiến lược (Next / History / Both).",
    finalTitle: "5) Dự Đoán Ma Trận Số Cuối",
    finalDesc: "Tỷ lệ trúng và Return mẫu số cuối 0-9.",
    pocketTitle: "6) Dự Đoán Khoảng Cách Hộc Bánh Xe",
    pocketDesc: "Tỷ lệ trúng và Return các bước dịch chuyển.",
    topNumsTitle: "7) Top Số Đề Xuất Cốt Lõi",
    topNumsDesc: "Tỷ lệ trúng trực tiếp và Return của 3 số đề xuất hàng đầu.",
    dozensTitle: "8) Tín Hiệu Chiến Lược Hàng & Cột",
    dozensDesc: "Tỷ lệ trúng và Return tín hiệu chiến lược Hàng (Dozens) và Cột (Columns).",
    statusAbove: "VƯỢT LÝ THUYẾT",
    statusBelow: "DƯỚI LÝ THUYẾT",
    baseline: "Cơ Bản Lý Thuyết",
    actual: "Thực Tế Trúng",
  }
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  spinHistory,
  onBack,
  lang,
  fiveDepths = { colorDepth: 5, finalDepth: 5, seriesDepth: 5, sectorsDepth: 5, pocketsDepth: 5 },
  sectorSplitMode = '9',
  strategyConfig,
  onUpdateStrategyConfig,
}) => {
  const t = dashLabels[lang] || dashLabels.en;

  // Use strategyConfig directly for controls
  const closedLookback = strategyConfig.closedLookback || 8;
  const neighbourDepth = strategyConfig.closedNeighbourDepth || 3;
  const betStrategyMode = strategyConfig.closedProgression || '235';

  const updatePartial = (partial: Partial<StrategyConfig>) => {
    if (onUpdateStrategyConfig) {
      onUpdateStrategyConfig({ ...strategyConfig, ...partial });
    }
  };

  // Helper for Closed Numbers calculation at a given history step
  const calculateClosedBets = (history: number[], mode: '111' | '123' | '235', depth: 3 | 5, lookback: number) => {
    const bets = new Map<number, number>();
    const recent = history.slice(-lookback);
    const unique = [...new Set([...recent].reverse())];
    if (unique.length < 1) return bets;

    const candidatesPool: number[] = [];
    unique.forEach(num => {
      if (num !== -1) {
        candidatesPool.push(...getNeighbours(num, depth === 5 ? 2 : 1));
      }
    });

    const finalCandidates = [...new Set(candidatesPool)].filter(n => n !== -1);
    if (mode === '111') {
      finalCandidates.forEach(c => bets.set(c, 1));
      return bets;
    }

    const units = mode === '235' ? [5, 3, 2] : [3, 2, 1];
    finalCandidates.forEach((c, idx) => {
      if (idx < 4) bets.set(c, units[0]);
      else if (idx < 10) bets.set(c, units[1]);
      else bets.set(c, units[2]);
    });
    return bets;
  };

  // Full Backtest Pass across all 8 Strategy Sections
  const backtestStats = useMemo(() => {
    let closedPredicted = 0, closedHits = 0, closedUnitsIn = 0, closedUnitsOut = 0;

    let colorOffered = 0, colorWins = 0, colorUnitsIn = 0, colorUnitsOut = 0;
    let seriesOffered = 0, seriesWins = 0, seriesUnitsIn = 0, seriesUnitsOut = 0;
    let sectorOffered = 0, sectorWins = 0, sectorUnitsIn = 0, sectorUnitsOut = 0;
    let finalOffered = 0, finalWins = 0, finalUnitsIn = 0, finalUnitsOut = 0;
    let pocketOffered = 0, pocketWins = 0, pocketUnitsIn = 0, pocketUnitsOut = 0;
    let topOffered = 0, topWins = 0, topUnitsIn = 0, topUnitsOut = 0;
    let dozensOffered = 0, dozensWins = 0, dozensUnitsIn = 0, dozensUnitsOut = 0;

    const activeSectorMode = strategyConfig.vectorSectorAmount || sectorSplitMode;
    const topSectorsCount = strategyConfig.vectorTopSectorsCount || 1;
    const vectorRankingMode = strategyConfig.vectorRankingMode || 'next_probable';

    if (spinHistory.length >= 2) {
      for (let i = 1; i < spinHistory.length; i++) {
        const hist = spinHistory.slice(0, i);
        const winner = spinHistory[i];

        // 1) CLOSED NUMBERS
        const closedBetsMap = calculateClosedBets(hist, betStrategyMode, neighbourDepth, closedLookback);
        let roundClosedInput = 0;
        closedBetsMap.forEach(u => { roundClosedInput += u; });
        if (roundClosedInput > 0) {
          closedPredicted++;
          closedUnitsIn += roundClosedInput;
          const winUnit = closedBetsMap.get(winner) || 0;
          if (winUnit > 0) {
            closedHits++;
            closedUnitsOut += (winUnit * 36);
          }
        }

        // 2) MULTI-CRITERIA PREDICTION ENGINE
        const defaultDepths: FiveCriteriaDepths = fiveDepths || { colorDepth: 5, finalDepth: 5, seriesDepth: 5, sectorsDepth: 5, pocketsDepth: 5 };
        const pred = getMultiCriteriaPrediction(hist, defaultDepths, activeSectorMode, strategyConfig);
        if (!pred) continue;

        // 2) Colour Prediction (10u input per round, 20u return on hit)
        if (pred.color) {
          colorOffered++;
          colorUnitsIn += 10;
          if (pred.color === NUMBER_COLORS[winner]) {
            colorWins++;
            colorUnitsOut += 20;
          }
        }

        // 3) Wheel Series Prediction (Exact European roulette series payout logic)
        if (pred.series && pred.series !== 'none') {
          const pSeries = (pred.series || '').toString().toLowerCase();
          seriesOffered++;
          if (pSeries === 'top' || pSeries === 'voisins') {
            // Voisins du Zéro: 9 units input
            seriesUnitsIn += 9;
            const voisinsNums = [0, 2, 3, 4, 7, 12, 15, 18, 21, 19, 22, 25, 26, 28, 29, 32, 35];
            if (voisinsNums.includes(winner)) {
              seriesWins++;
              if ([0, 2, 3].includes(winner)) {
                seriesUnitsOut += 24; // Trio 0/2/3 pays 24u
              } else if ([25, 26, 28, 29].includes(winner)) {
                seriesUnitsOut += 18; // Corner 25/26/28/29 pays 18u (2u bet * 9)
              } else {
                seriesUnitsOut += 18; // Splits pay 18u
              }
            }
          } else if (pSeries === 'small' || pSeries === 'tiers') {
            // Tiers du Cyber: 6 units input
            seriesUnitsIn += 6;
            const tiersNums = [5, 8, 10, 11, 13, 16, 23, 24, 27, 30, 33, 36];
            if (tiersNums.includes(winner)) {
              seriesWins++;
              seriesUnitsOut += 18; // Splits pay 18u
            }
          } else if (pSeries === 'middle' || pSeries === 'orphelins') {
            // Orphelins: 5 units input
            seriesUnitsIn += 5;
            const orphelinsNums = [1, 6, 9, 14, 17, 20, 31, 34];
            if (orphelinsNums.includes(winner)) {
              seriesWins++;
              if (winner === 1 || winner === 17) {
                seriesUnitsOut += 36; // Straight / double split pays 36u
              } else {
                seriesUnitsOut += 18; // Splits pay 18u
              }
            }
          } else if (pSeries === 'zero') {
            // Zero Game: 4 units input
            seriesUnitsIn += 4;
            const zeroNums = [0, 3, 12, 15, 26, 32, 35];
            if (zeroNums.includes(winner)) {
              seriesWins++;
              if (winner === 26) {
                seriesUnitsOut += 36; // Straight 26 pays 36u
              } else {
                seriesUnitsOut += 18; // Splits pay 18u
              }
            }
          }
        }

        // 4) Wheel Vector & Sector Map (Evaluates Next Probable / History / Both)
        if (pred.sector) {
          let targetSectors: { id: string | number; name: string; numbers: number[] }[] = [];
          if (vectorRankingMode === 'both') {
            const nextSecs = (pred.sector.topNextSectors || []).slice(0, topSectorsCount);
            const histSecs = (pred.sector.topHistorySectors || []).slice(0, topSectorsCount);
            const mergedMap = new Map<string | number, { id: string | number; name: string; numbers: number[] }>();
            nextSecs.forEach(s => mergedMap.set(s.id, s));
            histSecs.forEach(s => mergedMap.set(s.id, s));
            targetSectors = Array.from(mergedMap.values());
          } else if (vectorRankingMode === 'history_frequency') {
            targetSectors = (pred.sector.topHistorySectors || []).slice(0, topSectorsCount);
          } else {
            targetSectors = (pred.sector.topNextSectors || []).slice(0, topSectorsCount);
          }

          const coveredNumbers = Array.from(new Set(targetSectors.flatMap(s => s.numbers)));
          if (coveredNumbers.length > 0) {
            sectorOffered++;
            sectorUnitsIn += coveredNumbers.length;
            if (coveredNumbers.includes(winner)) {
              sectorWins++;
              sectorUnitsOut += 36;
            }
          }
        }

        // 5) Final Matrix Digit Prediction
        if (pred.finalDigits && pred.finalDigits.length > 0) {
          const count = strategyConfig.finalDigitsCount || 3;
          const chosenFinals = pred.finalDigits.slice(0, count);
          const numbersForFinals = ROULETTE_NUMBERS.filter(n => chosenFinals.includes(n % 10));
          if (numbersForFinals.length > 0) {
            finalOffered++;
            finalUnitsIn += numbersForFinals.length;
            if (chosenFinals.includes(winner % 10)) {
              finalWins++;
              finalUnitsOut += 36;
            }
          }
        }

        // 6) Pockets Distance Step Prediction
        if (pred.pocket && pred.pocket.topSteps) {
          const topRanks = strategyConfig.pocketTopRanks || 3;
          const pocketTargets = new Set<number>();
          pred.pocket.topSteps.slice(0, topRanks).forEach(s => {
            pocketTargets.add(s.cwTarget);
            pocketTargets.add(s.acwTarget);
          });
          if (strategyConfig.pocketNextChanceEnabled) {
            pocketTargets.add(pred.pocket.cwTarget);
            pocketTargets.add(pred.pocket.acwTarget);
          }
          if (pocketTargets.size > 0) {
            pocketOffered++;
            pocketUnitsIn += pocketTargets.size;
            if (pocketTargets.has(winner)) {
              pocketWins++;
              pocketUnitsOut += 36;
            }
          }
        }

        // 7) Top Core Recommended Numbers (Top 3 core = 3u input)
        if (pred.topNumbers && pred.topNumbers.length > 0) {
          const top3 = pred.topNumbers.slice(0, 3).map(tn => tn.num);
          topOffered++;
          topUnitsIn += top3.length;
          if (top3.includes(winner)) {
            topWins++;
            topUnitsOut += 36;
          }
        }

        // 8) Dozens and Columns Strategic Signals (2 Dozens 20u + 2 Cols 20u = 40u input)
        const dc = calculateDozensAndColsStrategy(hist);
        dozensOffered++;
        dozensUnitsIn += 40;

        if (winner === 0) {
          // Zero loses both dozen & column bets (0 units returned)
        } else {
          const winningDozen = winner <= 12 ? 1 : winner <= 24 ? 2 : 3;
          const winningCol = (winner - 1) % 3 + 1;

          // Compute predicted 2 dozens based on unified strategy
          const sortedDozensBySleep = [...dc.dozensArr].sort((a, b) => b.sleep - a.sleep);
          const sortedDozensByHit = [...dc.dozensArr].sort((a, b) => b.count - a.count);
          let recDozens: number[] = [];
          if (sortedDozensBySleep[0].sleep >= 5) {
            const overdueD = sortedDozensBySleep[0].id === '1st Dozen' ? 1 : sortedDozensBySleep[0].id === '2nd Dozen' ? 2 : 3;
            const hitPartnerObj = sortedDozensByHit[0].id === sortedDozensBySleep[0].id ? sortedDozensByHit[1] : sortedDozensByHit[0];
            const partnerD = hitPartnerObj.id === '1st Dozen' ? 1 : hitPartnerObj.id === '2nd Dozen' ? 2 : 3;
            recDozens = [overdueD, partnerD];
          } else {
            const d1 = sortedDozensByHit[0].id === '1st Dozen' ? 1 : sortedDozensByHit[0].id === '2nd Dozen' ? 2 : 3;
            const d2 = sortedDozensByHit[1].id === '1st Dozen' ? 1 : sortedDozensByHit[1].id === '2nd Dozen' ? 2 : 3;
            recDozens = [d1, d2];
          }

          // Compute predicted 2 columns based on unified strategy
          const sortedColsBySleep = [...dc.colsArr].sort((a, b) => b.sleep - a.sleep);
          const sortedColsByHit = [...dc.colsArr].sort((a, b) => b.count - a.count);
          let recCols: number[] = [];
          if (sortedColsBySleep[0].sleep >= 5) {
            const overdueC = sortedColsBySleep[0].id === 'Col 1' ? 1 : sortedColsBySleep[0].id === 'Col 2' ? 2 : 3;
            const hitPartnerObj = sortedColsByHit[0].id === sortedColsBySleep[0].id ? sortedColsByHit[1] : sortedColsByHit[0];
            const partnerC = hitPartnerObj.id === 'Col 1' ? 1 : hitPartnerObj.id === 'Col 2' ? 2 : 3;
            recCols = [overdueC, partnerC];
          } else {
            const c1 = sortedColsByHit[0].id === 'Col 1' ? 1 : sortedColsByHit[0].id === 'Col 2' ? 2 : 3;
            const c2 = sortedColsByHit[1].id === 'Col 1' ? 1 : sortedColsByHit[1].id === 'Col 2' ? 2 : 3;
            recCols = [c1, c2];
          }

          const dozenHit = recDozens.includes(winningDozen);
          const colHit = recCols.includes(winningCol);

          if (dozenHit || colHit) {
            dozensWins++;
          }

          if (dozenHit) dozensUnitsOut += 30; // 10u input on winning dozen pays 30u total
          if (colHit) dozensUnitsOut += 30;   // 10u input on winning column pays 30u total
        }
      }
    }

    const calcHit = (wins: number, total: number) => total > 0 ? Math.round((wins / total) * 1000) / 10 : 0;

    const colorRate = calcHit(colorWins, colorOffered);
    const colorBaseline = 48.0; // User rule: <48% is red, >=48% is green

    const seriesRate = calcHit(seriesWins, seriesOffered);
    const seriesBaseline = 33.0; // User rule: <33% is red, >=33% is green

    const sectorRate = calcHit(sectorWins, sectorOffered);
    const numSectors = parseInt(activeSectorMode) || 9;
    const sectorBaseline = Math.round((100 / numSectors) * 10) / 10;

    const finalRate = calcHit(finalWins, finalOffered);
    const finalBaseline = Math.round(((strategyConfig.finalDigitsCount || 3) / 10) * 1000) / 10;

    const pocketRate = calcHit(pocketWins, pocketOffered);
    const pocketBaseline = Math.round((((strategyConfig.pocketTopRanks || 3) * 2) / 37) * 1000) / 10;

    const topRate = calcHit(topWins, topOffered);
    const topBaseline = 8.1;

    const dozensRate = calcHit(dozensWins, dozensOffered);
    const dozensBaseline = 64.9;

    const totalUnitsInAll = closedUnitsIn + colorUnitsIn + seriesUnitsIn + sectorUnitsIn + finalUnitsIn + pocketUnitsIn + topUnitsIn + dozensUnitsIn;
    const totalUnitsOutAll = closedUnitsOut + colorUnitsOut + seriesUnitsOut + sectorUnitsOut + finalUnitsOut + pocketUnitsOut + topUnitsOut + dozensUnitsOut;
    const netReturnAll = totalUnitsOutAll - totalUnitsInAll;
    const combinedROI = totalUnitsInAll > 0 ? Math.round(((netReturnAll / totalUnitsInAll) * 100) * 10) / 10 : 0;

    const totalOfferedAll = closedPredicted + colorOffered + seriesOffered + sectorOffered + finalOffered + pocketOffered + topOffered + dozensOffered;
    const totalWinsAll = closedHits + colorWins + seriesWins + sectorWins + finalWins + pocketWins + topWins + dozensWins;
    const combinedAccuracy = totalOfferedAll > 0 ? Math.round((totalWinsAll / totalOfferedAll) * 1000) / 10 : 0;

    return {
      overview: {
        totalUnitsIn: totalUnitsInAll,
        totalUnitsOut: totalUnitsOutAll,
        netReturn: netReturnAll,
        combinedROI,
        totalOffered: totalOfferedAll,
        totalWins: totalWinsAll,
        combinedAccuracy,
      },
      closed: {
        predicted: closedPredicted,
        hits: closedHits,
        unitsIn: closedUnitsIn,
        unitsOut: closedUnitsOut,
        net: closedUnitsOut - closedUnitsIn,
        rate: closedPredicted > 0 ? Math.round((closedHits / closedPredicted) * 1000) / 10 : 0,
        baseline: neighbourDepth === 5 ? 29.7 : 18.9,
        isAbove: (closedPredicted > 0 ? (closedHits / closedPredicted) * 100 : 0) >= (neighbourDepth === 5 ? 29.7 : 18.9),
      },
      color: {
        offered: colorOffered,
        wins: colorWins,
        unitsIn: colorUnitsIn,
        unitsOut: colorUnitsOut,
        net: colorUnitsOut - colorUnitsIn,
        rate: colorRate,
        baseline: colorBaseline,
        isAbove: colorRate >= colorBaseline,
      },
      series: {
        offered: seriesOffered,
        wins: seriesWins,
        unitsIn: seriesUnitsIn,
        unitsOut: seriesUnitsOut,
        net: seriesUnitsOut - seriesUnitsIn,
        rate: seriesRate,
        baseline: seriesBaseline,
        isAbove: seriesRate >= seriesBaseline,
      },
      sector: {
        offered: sectorOffered,
        wins: sectorWins,
        unitsIn: sectorUnitsIn,
        unitsOut: sectorUnitsOut,
        net: sectorUnitsOut - sectorUnitsIn,
        rate: sectorRate,
        baseline: sectorBaseline,
        isAbove: sectorRate >= sectorBaseline,
      },
      final: {
        offered: finalOffered,
        wins: finalWins,
        unitsIn: finalUnitsIn,
        unitsOut: finalUnitsOut,
        net: finalUnitsOut - finalUnitsIn,
        rate: finalRate,
        baseline: finalBaseline,
        isAbove: finalRate >= finalBaseline,
      },
      pocket: {
        offered: pocketOffered,
        wins: pocketWins,
        unitsIn: pocketUnitsIn,
        unitsOut: pocketUnitsOut,
        net: pocketUnitsOut - pocketUnitsIn,
        rate: pocketRate,
        baseline: pocketBaseline,
        isAbove: pocketRate >= pocketBaseline,
      },
      top: {
        offered: topOffered,
        wins: topWins,
        unitsIn: topUnitsIn,
        unitsOut: topUnitsOut,
        net: topUnitsOut - topUnitsIn,
        rate: topRate,
        baseline: topBaseline,
        isAbove: topRate >= topBaseline,
      },
      dozens: {
        offered: dozensOffered,
        wins: dozensWins,
        unitsIn: dozensUnitsIn,
        unitsOut: dozensUnitsOut,
        net: dozensUnitsOut - dozensUnitsIn,
        rate: dozensRate,
        baseline: dozensBaseline,
        isAbove: dozensRate >= dozensBaseline,
      },
    };
  }, [spinHistory, fiveDepths, sectorSplitMode, strategyConfig, neighbourDepth, closedLookback, betStrategyMode]);

  return (
    <div className="animate-fade-in pb-16 space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between bg-zinc-900 p-3.5 rounded-2xl border border-gray-800 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-gold font-bold transition-all active:scale-95 border border-gold/20 flex items-center gap-1.5 text-xs shadow-md"
          >
            <span>←</span>
            <span>{t.back}</span>
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span>📊</span>
              <span>{t.title}</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-medium">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* No Data Warning */}
      {spinHistory.length < 5 && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">{t.noDataTitle}</h3>
            <p className="text-[11px] text-gray-300 mt-1">{t.noDataDesc}</p>
          </div>
        </div>
      )}

      {/* Combined Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-zinc-900 p-3 rounded-2xl border border-gray-800 shadow-md">
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block">{t.spinsInput}</span>
          <div className="text-xl font-black text-white mt-1">{spinHistory.length} <span className="text-xs text-gray-500 font-normal">spins</span></div>
        </div>

        <div className="bg-zinc-900 p-3 rounded-2xl border border-gray-800 shadow-md">
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block">{t.roundsPredicted}</span>
          <div className="text-xl font-black text-gold mt-1">{Math.max(0, spinHistory.length - 1)} <span className="text-xs text-gray-500 font-normal">rounds</span></div>
        </div>

        <div className="bg-zinc-900 p-3 rounded-2xl border border-gray-800 shadow-md">
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block">{t.overallAccuracy}</span>
          <div className={`text-xl font-black mt-1 ${backtestStats.overview.combinedAccuracy >= 30 ? 'text-green-500' : 'text-red-500'}`}>
            {backtestStats.overview.combinedAccuracy}%
          </div>
        </div>

        <div className="bg-zinc-900 p-3 rounded-2xl border border-gray-800 shadow-md">
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block">{t.netReturnUnits}</span>
          <div className={`text-lg font-black mt-1 ${backtestStats.overview.netReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {backtestStats.overview.totalUnitsIn} in / {backtestStats.overview.totalUnitsOut} out
            <span className="text-xs block font-extrabold mt-0.5">
              {backtestStats.overview.netReturn >= 0 ? `+${backtestStats.overview.netReturn}` : backtestStats.overview.netReturn} ({backtestStats.overview.combinedROI >= 0 ? `+${backtestStats.overview.combinedROI}%` : `${backtestStats.overview.combinedROI}%`})
            </span>
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 1: CLOSED NUMBERS ---------------- */}
      <div className="bg-zinc-900 p-4 rounded-3xl border border-gold/40 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-2">
          <div>
            <h2 className="text-xs font-black text-gold uppercase tracking-wider flex items-center gap-1.5">
              <span>🎯</span>
              <span>{t.closedTitle}</span>
            </h2>
            <p className="text-[10px] text-gray-400 font-medium">{t.closedDesc}</p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Lookback Spin Selector */}
            <div className="flex items-center gap-1 bg-zinc-800 p-1 rounded-xl border border-gray-700/60">
              <span className="text-[9px] font-black text-gray-400 uppercase px-1">{t.spinLookback}:</span>
              {[3, 5, 8, 10, 12].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => updatePartial({ closedLookback: cnt })}
                  className={`px-2 py-0.5 text-[9px] font-black rounded-lg transition-all ${
                    closedLookback === cnt ? 'bg-gold text-black shadow-xs' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>

            {/* Neighbour Depth N3 / N5 */}
            <div className="flex bg-zinc-800 rounded-xl p-1 border border-gray-700/60">
              <button
                onClick={() => updatePartial({ closedNeighbourDepth: 3 })}
                className={`px-2 py-0.5 text-[9px] font-black rounded-lg ${neighbourDepth === 3 ? 'bg-gold text-black' : 'text-gray-400'}`}
              >
                N3 (7#)
              </button>
              <button
                onClick={() => updatePartial({ closedNeighbourDepth: 5 })}
                className={`px-2 py-0.5 text-[9px] font-black rounded-lg ${neighbourDepth === 5 ? 'bg-gold text-black' : 'text-gray-400'}`}
              >
                N5 (11#)
              </button>
            </div>

            {/* Input Progression Mode 111 / 123 / 235 */}
            <div className="flex bg-zinc-800 rounded-xl p-1 border border-gray-700/60">
              {(['111', '123', '235'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => updatePartial({ closedProgression: m })}
                  className={`px-2 py-0.5 text-[9px] font-black rounded-lg transition-all ${
                    betStrategyMode === m
                      ? m === '235' ? 'bg-green-600 text-white' : m === '123' ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white'
                      : 'text-gray-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Closed Numbers Metrics Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="bg-zinc-800/80 p-3 rounded-2xl border border-gray-700/50">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{t.gamesPredicted} / {t.gamesHit}</span>
            <div className="text-base font-black text-white mt-1">
              {backtestStats.closed.hits} hit / {backtestStats.closed.predicted} rounds
            </div>
            <div className="text-[9px] font-bold text-gray-500 mt-0.5">Tested across {spinHistory.length} spins</div>
          </div>

          <div className="bg-zinc-800/80 p-3 rounded-2xl border border-gray-700/50">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t.hitRatio}</span>
              <span className={`px-1.5 py-0.5 text-[8px] font-black rounded ${backtestStats.closed.isAbove ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}`}>
                {backtestStats.closed.isAbove ? t.statusAbove : t.statusBelow}
              </span>
            </div>
            <div className={`text-2xl font-black mt-1 ${backtestStats.closed.isAbove ? 'text-green-500' : 'text-red-500'}`}>
              {backtestStats.closed.rate}%
            </div>
            <div className="text-[9px] font-bold text-gray-400 mt-0.5">{t.baseline}: <strong className="text-white">{backtestStats.closed.baseline}%</strong></div>
          </div>

          <div className="bg-zinc-800/80 p-3 rounded-2xl border border-gray-700/50">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{t.unitsInput} vs {t.unitsReturned}</span>
            <div className="text-base font-black text-white mt-1">
              {backtestStats.closed.unitsIn} <span className="text-gray-500 font-normal">in</span> / {backtestStats.closed.unitsOut} <span className="text-gold font-normal">out</span>
            </div>
            <div className="text-[9px] font-bold text-gray-400 mt-0.5">Unit Flow</div>
          </div>

          <div className="bg-zinc-800/80 p-3 rounded-2xl border border-gray-700/50">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{t.returnCount}</span>
            <div className={`text-2xl font-black mt-1 ${backtestStats.closed.net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {backtestStats.closed.net >= 0 ? `+${backtestStats.closed.net}` : backtestStats.closed.net}
            </div>
            <div className="text-[9px] font-bold text-gray-400 mt-0.5">Mode: {betStrategyMode}</div>
          </div>
        </div>
      </div>

      {/* ---------------- SECTIONS 2 TO 8: MULTI-CRITERIA ENGINE METRICS GRID ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 2) Colour Prediction */}
        <StatCriterionCard
          icon="🎨"
          title={t.colorTitle}
          description={t.colorDesc}
          offered={backtestStats.color.offered}
          wins={backtestStats.color.wins}
          rate={backtestStats.color.rate}
          baseline={backtestStats.color.baseline}
          isAbove={backtestStats.color.isAbove}
          statusAbove={t.statusAbove}
          statusBelow={t.statusBelow}
          unitsIn={backtestStats.color.unitsIn}
          unitsOut={backtestStats.color.unitsOut}
          netUnits={backtestStats.color.net}
        />

        {/* 3) Series Prediction */}
        <StatCriterionCard
          icon="🧭"
          title={t.seriesTitle}
          description={t.seriesDesc}
          offered={backtestStats.series.offered}
          wins={backtestStats.series.wins}
          rate={backtestStats.series.rate}
          baseline={backtestStats.series.baseline}
          isAbove={backtestStats.series.isAbove}
          statusAbove={t.statusAbove}
          statusBelow={t.statusBelow}
          unitsIn={backtestStats.series.unitsIn}
          unitsOut={backtestStats.series.unitsOut}
          netUnits={backtestStats.series.net}
        />

        {/* 4) Wheel Vector & Sector Map */}
        <StatCriterionCard
          icon="🎯"
          title={t.vectorTitle}
          description={t.vectorDesc}
          offered={backtestStats.sector.offered}
          wins={backtestStats.sector.wins}
          rate={backtestStats.sector.rate}
          baseline={backtestStats.sector.baseline}
          isAbove={backtestStats.sector.isAbove}
          statusAbove={t.statusAbove}
          statusBelow={t.statusBelow}
          unitsIn={backtestStats.sector.unitsIn}
          unitsOut={backtestStats.sector.unitsOut}
          netUnits={backtestStats.sector.net}
          controls={
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-gray-800/60 mt-1">
              <div className="flex items-center gap-0.5 bg-zinc-800 p-0.5 rounded-lg border border-gray-700/60">
                <span className="text-[8px] font-black text-gray-400 uppercase px-1">Sectors:</span>
                {(['4', '6', '8', '9', '12'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => updatePartial({ vectorSectorAmount: s })}
                    className={`px-1.5 py-0.5 text-[8px] font-black rounded transition-all ${
                      (strategyConfig.vectorSectorAmount || sectorSplitMode) === s ? 'bg-gold text-black shadow-xs' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {s}S
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-0.5 bg-zinc-800 p-0.5 rounded-lg border border-gray-700/60">
                <span className="text-[8px] font-black text-gray-400 uppercase px-1">Top:</span>
                {([1, 2, 3] as const).map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => updatePartial({ vectorTopSectorsCount: cnt })}
                    className={`px-1.5 py-0.5 text-[8px] font-black rounded transition-all ${
                      (strategyConfig.vectorTopSectorsCount || 1) === cnt ? 'bg-gold text-black shadow-xs' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-0.5 bg-zinc-800 p-0.5 rounded-lg border border-gray-700/60">
                {(['next_probable', 'history_frequency', 'both'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => updatePartial({ vectorRankingMode: m })}
                    className={`px-1.5 py-0.5 text-[8px] font-black rounded transition-all ${
                      (strategyConfig.vectorRankingMode || 'next_probable') === m ? 'bg-emerald-500 text-black font-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {m === 'next_probable' ? 'Next' : m === 'history_frequency' ? 'Hist' : 'Both'}
                  </button>
                ))}
              </div>
            </div>
          }
        />

        {/* 5) Final Matrix Prediction */}
        <StatCriterionCard
          icon="🔢"
          title={t.finalTitle}
          description={t.finalDesc}
          offered={backtestStats.final.offered}
          wins={backtestStats.final.wins}
          rate={backtestStats.final.rate}
          baseline={backtestStats.final.baseline}
          isAbove={backtestStats.final.isAbove}
          statusAbove={t.statusAbove}
          statusBelow={t.statusBelow}
          unitsIn={backtestStats.final.unitsIn}
          unitsOut={backtestStats.final.unitsOut}
          netUnits={backtestStats.final.net}
          controls={
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-gray-800/60 mt-1">
              <div className="flex items-center gap-0.5 bg-zinc-800 p-0.5 rounded-lg border border-gray-700/60">
                <span className="text-[8px] font-black text-gray-400 uppercase px-1">Final Digits:</span>
                {([2, 3, 4] as const).map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => updatePartial({ finalDigitsCount: cnt })}
                    className={`px-2 py-0.5 text-[8px] font-black rounded transition-all ${
                      (strategyConfig.finalDigitsCount || 3) === cnt ? 'bg-gold text-black shadow-xs' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {cnt} Digits
                  </button>
                ))}
              </div>
            </div>
          }
        />

        {/* 6) Pockets Distance Step Prediction */}
        <StatCriterionCard
          icon="📏"
          title={t.pocketTitle}
          description={t.pocketDesc}
          offered={backtestStats.pocket.offered}
          wins={backtestStats.pocket.wins}
          rate={backtestStats.pocket.rate}
          baseline={backtestStats.pocket.baseline}
          isAbove={backtestStats.pocket.isAbove}
          statusAbove={t.statusAbove}
          statusBelow={t.statusBelow}
          unitsIn={backtestStats.pocket.unitsIn}
          unitsOut={backtestStats.pocket.unitsOut}
          netUnits={backtestStats.pocket.net}
          controls={
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-gray-800/60 mt-1">
              <div className="flex items-center gap-0.5 bg-zinc-800 p-0.5 rounded-lg border border-gray-700/60">
                <span className="text-[8px] font-black text-gray-400 uppercase px-1">Top Ranks:</span>
                {([1, 2, 3, 4, 5] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => updatePartial({ pocketTopRanks: r })}
                    className={`px-1.5 py-0.5 text-[8px] font-black rounded transition-all ${
                      (strategyConfig.pocketTopRanks || 3) === r ? 'bg-gold text-black shadow-xs' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    R{r}
                  </button>
                ))}
              </div>

              <button
                onClick={() => updatePartial({ pocketNextChanceEnabled: !strategyConfig.pocketNextChanceEnabled })}
                className={`px-2 py-0.5 text-[8px] font-black rounded-lg border transition-all ${
                  strategyConfig.pocketNextChanceEnabled
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                    : 'bg-zinc-800 text-gray-400 border-gray-700/60'
                }`}
              >
                {strategyConfig.pocketNextChanceEnabled ? '✓ Next Chance' : '+ Next Chance'}
              </button>
            </div>
          }
        />

        {/* 7) Top Core Recommended Numbers */}
        <StatCriterionCard
          icon="⭐"
          title={t.topNumsTitle}
          description={t.topNumsDesc}
          offered={backtestStats.top.offered}
          wins={backtestStats.top.wins}
          rate={backtestStats.top.rate}
          baseline={backtestStats.top.baseline}
          isAbove={backtestStats.top.isAbove}
          statusAbove={t.statusAbove}
          statusBelow={t.statusBelow}
          unitsIn={backtestStats.top.unitsIn}
          unitsOut={backtestStats.top.unitsOut}
          netUnits={backtestStats.top.net}
        />

        {/* 8) Dozens & Columns Strategic Signals */}
        <StatCriterionCard
          icon="📊"
          title={t.dozensTitle}
          description={t.dozensDesc}
          offered={backtestStats.dozens.offered}
          wins={backtestStats.dozens.wins}
          rate={backtestStats.dozens.rate}
          baseline={backtestStats.dozens.baseline}
          isAbove={backtestStats.dozens.isAbove}
          statusAbove={t.statusAbove}
          statusBelow={t.statusBelow}
          unitsIn={backtestStats.dozens.unitsIn}
          unitsOut={backtestStats.dozens.unitsOut}
          netUnits={backtestStats.dozens.net}
        />
      </div>
    </div>
  );
};

interface StatCriterionCardProps {
  icon: string;
  title: string;
  description: string;
  offered: number;
  wins: number;
  rate: number;
  baseline: number;
  isAbove: boolean;
  statusAbove: string;
  statusBelow: string;
  unitsIn: number;
  unitsOut: number;
  netUnits: number;
  controls?: React.ReactNode;
}

const StatCriterionCard: React.FC<StatCriterionCardProps> = ({
  icon,
  title,
  description,
  offered,
  wins,
  rate,
  baseline,
  isAbove,
  statusAbove,
  statusBelow,
  unitsIn,
  unitsOut,
  netUnits,
  controls,
}) => {
  return (
    <div className="bg-zinc-900 p-3.5 rounded-2xl border border-gray-800 shadow-lg space-y-2 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{icon}</span>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">{title}</h3>
          </div>
          <span
            className={`px-2 py-0.5 text-[8px] font-black rounded-md border uppercase tracking-wider shrink-0 ${
              isAbove
                ? 'bg-green-500/20 text-green-400 border-green-500/40'
                : 'bg-red-500/20 text-red-400 border-red-500/40'
            }`}
          >
            {isAbove ? statusAbove : statusBelow}
          </span>
        </div>
        <p className="text-[9px] text-gray-400 font-medium mt-0.5 line-clamp-1">{description}</p>
        {controls}
      </div>

      {/* Two-Square Metrics Display: Left = Hit Rate, Right = Return Count */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Left Square: Hit Rate */}
        <div className="bg-zinc-950/90 p-2.5 rounded-xl border border-gray-800/80 flex flex-col justify-between">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Hit Rate</span>
          <div className="my-1">
            <div className={`text-xl font-black ${isAbove ? 'text-green-400' : 'text-red-400'}`}>
              {rate}%
            </div>
            <div className="text-[9px] font-bold text-gray-300">
              {wins} hit / {offered} round
            </div>
          </div>
          <div className="text-[8px] text-gray-500 font-semibold">vs {baseline}% base</div>
        </div>

        {/* Right Square: Return Count */}
        <div className="bg-zinc-950/90 p-2.5 rounded-xl border border-gray-800/80 flex flex-col justify-between">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Return Count</span>
          <div className="my-1">
            <div className={`text-xl font-black ${netUnits >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {netUnits >= 0 ? `+${netUnits}` : netUnits}
            </div>
            <div className="text-[9px] font-bold text-gray-300">
              {unitsIn} in / {unitsOut} out
            </div>
          </div>
          <div className="text-[8px] text-gray-500 font-semibold">Unit Net Flow</div>
        </div>
      </div>
    </div>
  );
};
