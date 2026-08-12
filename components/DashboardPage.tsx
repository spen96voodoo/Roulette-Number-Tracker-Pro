import React, { useState, useEffect, useMemo } from 'react';
import type { Language, FiveCriteriaDepths, SectorSplitMode, StrategyConfig } from '../types';
import { getNeighbours, getSeriesType, getMultiCriteriaPrediction } from '../utils/roulette';
import { NUMBER_COLORS, EUROPEAN_WHEEL_ORDER } from '../constants';

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
    closedDesc: "Adjacent closed numbers prediction with configurable spin lookback, neighbour depth, and bet unit progression.",
    spinLookback: "Lookback Spins",
    neighbourDepth: "Neighbour Depth",
    progressionMode: "Unit Progression",
    gamesPredicted: "Games Predicted",
    gamesHit: "Games Hit",
    hitRatio: "Hit Ratio %",
    basicReturnRatio: "Basic Return Ratio",
    unitsBet: "Total Bet Units",
    unitsReturned: "Total Return Units",
    netPL: "Net P/L Units",
    roi: "ROI %",
    colorTitle: "2) Colour Prediction (Red / Black)",
    colorDesc: "Historical color trend consensus prediction compared against standard 48.65% European roulette probability.",
    seriesTitle: "3) Wheel Series Prediction (French Sectors)",
    seriesDesc: "Top series (Voisins), Small series (Tiers), and Orphelins sector hit ratio.",
    vectorTitle: "4) Wheel Vector & Sector Map",
    vectorDesc: "Sector slice prediction hit ratio based on current wheel split configuration.",
    finalTitle: "5) Final Matrix Digit Prediction",
    finalDesc: "0-9 ending digit pattern prediction hit ratio across spin history.",
    pocketTitle: "6) Pockets Distance Step Prediction",
    pocketDesc: "Top 3 ranked pocket displacement step predictions (0-18 steps).",
    topNumsTitle: "7) Top Core Recommended Numbers",
    topNumsDesc: "Top 3 high-confidence consensus numbers prediction direct hit ratio.",
    dozensTitle: "8) Dozens & Columns Strategic Signals",
    dozensDesc: "Dozens and Columns strategic signal prediction hit ratio.",
    statusAbove: "OVER BASELINE",
    statusBelow: "BELOW BASELINE",
    baseline: "Theoretical Baseline",
    actual: "Actual Hit Rate",
  },
  zh: {
    title: "系统功能命中率与准确率仪表盘",
    subtitle: "5大预测引擎与策略回测收益率全维度计算与对照分析",
    back: "返回主页",
    noDataTitle: "旋转数据不足",
    noDataDesc: "请在主界面录入至少 5-8 轮历史数据，以计算系统的预测准确率与收益指标。",
    spinsInput: "录入总轮数",
    roundsPredicted: "预测总轮数",
    overallAccuracy: "引擎综合命中率",
    netReturnUnits: "策略净盈亏注数",
    closedTitle: "1) 相邻闭合号码与注数收益回测",
    closedDesc: "根据旋转回看轮数、邻号深度和注码递进策略进行精准模拟与盈亏计算。",
    spinLookback: "回看轮数",
    neighbourDepth: "邻号深度",
    progressionMode: "注码策略",
    gamesPredicted: "预测游戏数",
    gamesHit: "命中游戏数",
    hitRatio: "命中率 %",
    basicReturnRatio: "基础基础概率",
    unitsBet: "投注总注数",
    unitsReturned: "派彩总注数",
    netPL: "净盈亏注数",
    roi: "投资回报率 ROI",
    colorTitle: "2) 颜色预测 (红/黑/绿)",
    colorDesc: "颜色趋势预测命中率对照标准 48.65% 理论期望概率。",
    seriesTitle: "3) 轮盘分区预测 (法式 Sector)",
    seriesDesc: "大轮区 (Top series)、小轮区 (Tiers) 与孤注区 (Orphelins) 预测命中率。",
    vectorTitle: "4) 轮盘向量与 Sector 区域",
    vectorDesc: "基于当前切分模式下的 Sector 区域预测命中率。",
    finalTitle: "5) 尾数矩阵预测",
    finalDesc: "0-9 尾数模式预测命中率对照。",
    pocketTitle: "6) 轮盘口袋距离步数预测",
    pocketDesc: "Top 3 步数 (0-18步) 偏移预测命中率。",
    topNumsTitle: "7) 核心推荐号码",
    topNumsDesc: "Top 3 高置信度号码直接命中率。",
    dozensTitle: "8) 打列策略信号",
    dozensDesc: "几十区与三列横排策略信号命中率。",
    statusAbove: "高于基础期望",
    statusBelow: "低于基础期望",
    baseline: "理论基础期望",
    actual: "实际命中率",
  },
  ja: {
    title: "システム的中率＆パフォーマンスダッシュボード",
    subtitle: "5基準予測エンジンと戦略バックテストの的中率・還元率詳細分析",
    back: "メインに戻る",
    noDataTitle: "データが不足しています",
    noDataDesc: "正確な的中率と還元率を計算するには、メイン画面で最低5〜8回のスピンを入力してください。",
    spinsInput: "入力スピン数",
    roundsPredicted: "予測試行数",
    overallAccuracy: "総合的中率",
    netReturnUnits: "純損益ユニット",
    closedTitle: "1) 隣接閉鎖番号＆ユニット還元率",
    closedDesc: "ルックバック回数、隣接深度、注碼プログレッションによるバックテスト検証。",
    spinLookback: "ルックバック数",
    neighbourDepth: "隣接深度",
    progressionMode: "注碼モード",
    gamesPredicted: "予測ゲーム数",
    gamesHit: "的中ゲーム数",
    hitRatio: "的中率 %",
    basicReturnRatio: "基本理論確率",
    unitsBet: "総ベット数",
    unitsReturned: "総配当数",
    netPL: "純損益",
    roi: "ROI %",
    colorTitle: "2) カラー予測 (赤/黒)",
    colorDesc: "ヨーロピアンルーレット基本確率48.65%との比較検証。",
    seriesTitle: "3) セクター予測 (フレンチセクター)",
    seriesDesc: "Top series, Tiers, Orphelinsセクター予測的中率。",
    vectorTitle: "4) ホイールベクトル＆セクターマップ",
    vectorDesc: "現在のセクター分割モードに基づく予測的中率。",
    finalTitle: "5) 下一桁マトリックス予測",
    finalDesc: "0-9下一桁パターンの予測的中率。",
    pocketTitle: "6) ポケット距離ステップ予測",
    pocketDesc: "上位3ステップ (0-18ステップ) 偏移の的中率。",
    topNumsTitle: "7) 推奨コア番号",
    topNumsDesc: "Top 3高信頼度番号の直撃的中率。",
    dozensTitle: "8) ダズン・カラム戦略シグナル",
    dozensDesc: "ダズンおよびカラムシグナルの的中率分析。",
    statusAbove: "基本確率超え",
    statusBelow: "基本確率未満",
    baseline: "理論基本確率",
    actual: "実際の的中率",
  },
  es: {
    title: "Panel de Rendimiento y Tasa de Acierto",
    subtitle: "Análisis de precisión y retorno para los 5 criterios de predicción",
    back: "Volver al Menú",
    noDataTitle: "Datos Insuficientes",
    noDataDesc: "Por favor, introduzca al menos 5-8 giros en la pantalla principal para generar las métricas de rendimiento.",
    spinsInput: "Giros Registrados",
    roundsPredicted: "Rondas Predichas",
    overallAccuracy: "Precisión General Engine",
    netReturnUnits: "Retorno Neto Unidades",
    closedTitle: "1) Estrategia de Números Cerrados y Retorno",
    closedDesc: "Predicción de números cerrados con configuración de giros, profundidad de vecinos y progresión.",
    spinLookback: "Giros Retroceso",
    neighbourDepth: "Vecinos",
    progressionMode: "Progresión",
    gamesPredicted: "Juegos Predichos",
    gamesHit: "Juegos Acertados",
    hitRatio: "Tasa Acierto %",
    basicReturnRatio: "Retorno Básico Teórico",
    unitsBet: "Unidades Apostadas",
    unitsReturned: "Unidades Cobradas",
    netPL: "P/L Neto",
    roi: "ROI %",
    colorTitle: "2) Predicción de Color (Rojo / Negro)",
    colorDesc: "Comparación de acierto con la probabilidad europea estándar del 48.65%.",
    seriesTitle: "3) Predicción de Series del Cilindro",
    seriesDesc: "Tasa de aciertos para Top series, Small series y Orphelins.",
    vectorTitle: "4) Vector de Cilindro y Sectores",
    vectorDesc: "Tasa de aciertos según el modo de división de sectores actual.",
    finalTitle: "5) Predicción de Matriz de Números Finales",
    finalDesc: "Tasa de acierto para patrones de terminación 0-9.",
    pocketTitle: "6) Predicción de Pasos de Distancia de Bolsillo",
    pocketDesc: "Tasa de acierto para los 3 mejores pasos de desplazamiento (0-18).",
    topNumsTitle: "7) Números Núcleo Recomendados",
    topNumsDesc: "Tasa de impacto directo para los 3 números con mayor confianza.",
    dozensTitle: "8) Señales Estratégicas de Docenas y Columnas",
    dozensDesc: "Tasa de acierto para señales de docenas y columnas.",
    statusAbove: "SOBRE BASE TEÓRICA",
    statusBelow: "BAJO BASE TEÓRICA",
    baseline: "Base Teórica",
    actual: "Acierto Real",
  },
  ko: {
    title: "대시보드 - 적중률 및 수익 분석",
    subtitle: "5대 예측 엔진의 각 영역별 적중률 및 수익율 백테스트 분석",
    back: "메인으로 돌아가기",
    noDataTitle: "스핀 데이터 부족",
    noDataDesc: "정확한 적중률과 수익률 분석을 위해 메인 화면에서 최소 5~8회의 스핀 데이터를 입력해 주세요.",
    spinsInput: "입력된 스핀 수",
    roundsPredicted: "예측 진행 라운드",
    overallAccuracy: "엔진 종합 적중률",
    netReturnUnits: "전략 순수익 유닛",
    closedTitle: "1) 인접 닫힌 번호 및 유닛 수익율",
    closedDesc: "스핀 회수, 인접 깊이(N3/N5), 배팅 시스템에 따른 수익율 백테스트.",
    spinLookback: "회수 스핀 수",
    neighbourDepth: "인접 깊이",
    progressionMode: "배팅 모드",
    gamesPredicted: "예측 게임 수",
    gamesHit: "적중 게임 수",
    hitRatio: "적중률 %",
    basicReturnRatio: "기본 이론 환급률",
    unitsBet: "총 배팅 유닛",
    unitsReturned: "총 환급 유닛",
    netPL: "순손익",
    roi: "수익률 ROI",
    colorTitle: "2) 색상 예측 (레드 / 블랙)",
    colorDesc: "유러피언 룰렛 기본 확률 48.65% 대비 적중률 검증.",
    seriesTitle: "3) 휠 구역(Series) 예측",
    seriesDesc: "Top series, Tiers, Orphelins 구역 적중률.",
    vectorTitle: "4) 휠 벡터 및 섹터 맵",
    vectorDesc: "현재 분할 모드 기준 섹터 적중률.",
    finalTitle: "5) 끝수 매트릭스 예측",
    finalDesc: "0-9 끝수 패턴 적중률 분석.",
    pocketTitle: "6) 포켓 거리 단계 예측",
    pocketDesc: "상위 3개 이동 거리(0-18 단계) 적중률.",
    topNumsTitle: "7) 핵심 추천 번호",
    topNumsDesc: "상위 3개 핵심 추천 번호 직격 적중률.",
    dozensTitle: "8) 더즌 및 컬럼 전략 시그널",
    dozensDesc: "더즌 및 컬럼 신호 적중률.",
    statusAbove: "이론치 상회",
    statusBelow: "이론치 하회",
    baseline: "이론 기본치",
    actual: "실제 적중률",
  },
  vi: {
    title: "Bảng Điều Khiển Tỷ Lệ Trúng & Hiệu Suất",
    subtitle: "Phân tích tỷ lệ trúng và lợi nhuận cho 5 tiêu chuẩn dự đoán",
    back: "Trở Về Trang Chính",
    noDataTitle: "Chưa Đủ Dữ Liệu",
    noDataDesc: "Vui lòng nhập ít nhất 5-8 lượt quay ở màn hình chính để tính toán chỉ số chính xác.",
    spinsInput: "Tổng Số Lượt Nhập",
    roundsPredicted: "Số Lượt Dự Đoán",
    overallAccuracy: "Độ Chính Xác Tổng Thể",
    netReturnUnits: "Lợi Nhuận Ròng (Đơn Vị)",
    closedTitle: "1) Số Lân Cận Khép Kín & Lợi Nhuận Đơn Vị",
    closedDesc: "Dự đoán số khép kín lân cận với tùy chỉnh số vòng quay, độ sâu N3/N5 và chế độ đặt cược.",
    spinLookback: "Số Vòng Quay",
    neighbourDepth: "Độ Sâu Lân Cận",
    progressionMode: "Chế Độ Cược",
    gamesPredicted: "Số Trận Dự Đoán",
    gamesHit: "Số Trận Trúng",
    hitRatio: "Tỷ Lệ Trúng %",
    basicReturnRatio: "Tỷ Lệ Hoàn Vốn Cơ Bản",
    unitsBet: "Tổng Đơn Vị Cược",
    unitsReturned: "Tổng Đơn Vị Thắng",
    netPL: "Lời/Lỗ Ròng",
    roi: "ROI %",
    colorTitle: "2) Dự Đoán Màu Sắc (Đỏ / Đen)",
    colorDesc: "So sánh tỷ lệ trúng màu sắc với xác suất tiêu chuẩn 48.65% của roulette Châu Âu.",
    seriesTitle: "3) Dự Đoán Phân Vùng Bánh Xe (Series)",
    seriesDesc: "Tỷ lệ trúng phân vùng Top series, Small series và Orphelins.",
    vectorTitle: "4) Vector Bánh Xe & Bản Đồ Phân Vùng",
    vectorDesc: "Tỷ lệ trúng phân vùng theo chế độ chia hiện tại.",
    finalTitle: "5) Dự Đoán Ma Trận Số Cuối",
    finalDesc: "Tỷ lệ trúng mẫu số cuối 0-9.",
    pocketTitle: "6) Dự Đoán Khoảng Cách Hộc Bánh Xe",
    pocketDesc: "Tỷ lệ trúng Top 3 bước dịch chuyển (0-18 bước).",
    topNumsTitle: "7) Top Số Đề Xuất Cốt Lõi",
    topNumsDesc: "Tỷ lệ trúng trực tiếp của 3 số đề xuất hàng đầu.",
    dozensTitle: "8) Tín Hiệu Chiến Lược Hàng & Cột",
    dozensDesc: "Tỷ lệ trúng tín hiệu chiến lược Hàng (Dozens) và Cột (Columns).",
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

  // Section 1: Closed Numbers Backtest Stats
  const closedStats = useMemo(() => {
    let gamesPredicted = 0;
    let gamesHit = 0;
    let totalUnitsBet = 0;
    let totalUnitsReturned = 0;

    if (spinHistory.length >= 2) {
      for (let i = 1; i < spinHistory.length; i++) {
        const histBefore = spinHistory.slice(0, i);
        const winningNum = spinHistory[i];
        const bets = calculateClosedBets(histBefore, betStrategyMode, neighbourDepth, closedLookback);

        let roundBet = 0;
        bets.forEach(u => { roundBet += u; });

        if (roundBet > 0) {
          gamesPredicted++;
          totalUnitsBet += roundBet;
          const winUnit = bets.get(winningNum) || 0;
          if (winUnit > 0) {
            gamesHit++;
            totalUnitsReturned += (winUnit * 36);
          }
        }
      }
    }

    const hitRatio = gamesPredicted > 0 ? (gamesHit / gamesPredicted) * 100 : 0;
    const basicReturnRatio = neighbourDepth === 5 ? 29.73 : 18.92;
    const netPL = totalUnitsReturned - totalUnitsBet;
    const roi = totalUnitsBet > 0 ? (netPL / totalUnitsBet) * 100 : 0;

    return {
      gamesPredicted,
      gamesHit,
      hitRatio: Math.round(hitRatio * 10) / 10,
      basicReturnRatio,
      totalUnitsBet,
      totalUnitsReturned,
      netPL,
      roi: Math.round(roi * 10) / 10,
      isAboveBaseline: hitRatio >= basicReturnRatio,
    };
  }, [spinHistory, closedLookback, neighbourDepth, betStrategyMode]);

  // Sections 2 to 8: Multi-Criteria Prediction Engine Backtests
  const engineStats = useMemo(() => {
    let colorOffered = 0, colorWins = 0;
    let seriesOffered = 0, seriesWins = 0;
    let sectorOffered = 0, sectorWins = 0;
    let finalOffered = 0, finalWins = 0;
    let pocketOffered = 0, pocketWins = 0;
    let topOffered = 0, topWins = 0;
    let dozensOffered = 0, dozensWins = 0;

    const activeSectorMode = strategyConfig.vectorSectorAmount || sectorSplitMode;

    if (spinHistory.length >= 2) {
      for (let i = 1; i < spinHistory.length; i++) {
        const hist = spinHistory.slice(0, i);
        const winner = spinHistory[i];
        const pred = getMultiCriteriaPrediction(hist, fiveDepths, activeSectorMode);
        if (!pred) continue;

        // 2) Colour
        if (pred.color) {
          colorOffered++;
          if (pred.color === NUMBER_COLORS[winner]) colorWins++;
        }

        // 3) Series
        if (pred.series && pred.series !== 'none') {
          seriesOffered++;
          if (pred.series === getSeriesType(winner)) seriesWins++;
        }

        // 4) Sector Map / Wheel Vector
        if (pred.sector) {
          sectorOffered++;
          if (pred.sector.numbers.includes(winner)) sectorWins++;
        }

        // 5) Final Matrix
        if (pred.finalDigits && pred.finalDigits.length > 0) {
          finalOffered++;
          if (pred.finalDigits.includes(winner % 10)) finalWins++;
        }

        // 6) Pocket Distance Steps
        if (pred.pocket) {
          pocketOffered++;
          if (pred.pocket.topSteps.some(s => s.cwTarget === winner || s.acwTarget === winner)) pocketWins++;
        }

        // 7) Top Numbers
        if (pred.topNumbers && pred.topNumbers.length > 0) {
          topOffered++;
          if (pred.topNumbers.some(tn => tn.num === winner)) topWins++;
        }

        // 8) Dozens & Columns Strategic Signal
        if (winner !== 0) {
          dozensOffered++;
          const winningDozen = winner <= 12 ? 1 : winner <= 24 ? 2 : 3;
          const winningCol = winner % 3 === 1 ? 1 : winner % 3 === 2 ? 2 : 3;
          const topDozen = pred.topNumbers[0] ? (pred.topNumbers[0].num <= 12 ? 1 : pred.topNumbers[0].num <= 24 ? 2 : 3) : 1;
          const topCol = pred.topNumbers[0] ? (pred.topNumbers[0].num % 3 === 1 ? 1 : pred.topNumbers[0].num % 3 === 2 ? 2 : 3) : 1;
          if (winningDozen === topDozen || winningCol === topCol) {
            dozensWins++;
          }
        }
      }
    }

    const calcHit = (wins: number, total: number) => total > 0 ? Math.round((wins / total) * 1000) / 10 : 0;

    const colorRate = calcHit(colorWins, colorOffered);
    const colorBaseline = 48.65;

    const seriesRate = calcHit(seriesWins, seriesOffered);
    const seriesBaseline = 32.43;

    const sectorRate = calcHit(sectorWins, sectorOffered);
    const numSectors = parseInt(activeSectorMode) || 9;
    const sectorBaseline = Math.round((100 / numSectors) * 10) / 10;

    const finalRate = calcHit(finalWins, finalOffered);
    const finalBaseline = Math.round((strategyConfig.finalDigitsCount / 10) * 1000) / 10;

    const pocketRate = calcHit(pocketWins, pocketOffered);
    const pocketBaseline = Math.round(((strategyConfig.pocketTopRanks * 2) / 37) * 1000) / 10;

    const topRate = calcHit(topWins, topOffered);
    const topBaseline = 8.11;

    const dozensRate = calcHit(dozensWins, dozensOffered);
    const dozensBaseline = 64.86; // Double Dozen / Col = 24/37 = 64.86%

    return {
      color: { offered: colorOffered, wins: colorWins, rate: colorRate, baseline: colorBaseline, isAbove: colorRate >= colorBaseline },
      series: { offered: seriesOffered, wins: seriesWins, rate: seriesRate, baseline: seriesBaseline, isAbove: seriesRate >= seriesBaseline },
      sector: { offered: sectorOffered, wins: sectorWins, rate: sectorRate, baseline: sectorBaseline, isAbove: sectorRate >= sectorBaseline },
      final: { offered: finalOffered, wins: finalWins, rate: finalRate, baseline: finalBaseline, isAbove: finalRate >= finalBaseline },
      pocket: { offered: pocketOffered, wins: pocketWins, rate: pocketRate, baseline: pocketBaseline, isAbove: pocketRate >= pocketBaseline },
      top: { offered: topOffered, wins: topWins, rate: topRate, baseline: topBaseline, isAbove: topRate >= topBaseline },
      dozens: { offered: dozensOffered, wins: dozensWins, rate: dozensRate, baseline: dozensBaseline, isAbove: dozensRate >= dozensBaseline },
    };
  }, [spinHistory, fiveDepths, sectorSplitMode, strategyConfig]);

  // Combined Results Math Across All Active Strategy Predictions
  const combinedStats = useMemo(() => {
    const closedBet = closedStats.totalUnitsBet;
    const closedReturn = closedStats.totalUnitsReturned;

    const colorBet = engineStats.color.offered * 1;
    const colorReturn = engineStats.color.wins * 2; // 2:1 payout

    const seriesBet = engineStats.series.offered * 12;
    const seriesReturn = engineStats.series.wins * 36;

    const activeSectorMode = strategyConfig.vectorSectorAmount || sectorSplitMode;
    const sectorUnits = Math.round(37 / (parseInt(activeSectorMode) || 9));
    const sectorBet = engineStats.sector.offered * sectorUnits;
    const sectorReturn = engineStats.sector.wins * 36;

    const finalUnits = (strategyConfig.finalDigitsCount || 3) * 3;
    const finalBet = engineStats.final.offered * finalUnits;
    const finalReturn = engineStats.final.wins * 36;

    const pocketUnits = (strategyConfig.pocketTopRanks || 3) * 2;
    const pocketBet = engineStats.pocket.offered * pocketUnits;
    const pocketReturn = engineStats.pocket.wins * 36;

    const topBet = engineStats.top.offered * 3;
    const topReturn = engineStats.top.wins * 36;

    // Dozens & Columns: 3:1 payout (pays 3 units return on a 2 unit double-dozen/col bet)
    const dozensBet = engineStats.dozens.offered * 2;
    const dozensReturn = engineStats.dozens.wins * 3;

    const totalBet = closedBet + colorBet + seriesBet + sectorBet + finalBet + pocketBet + topBet + dozensBet;
    const totalReturn = closedReturn + colorReturn + seriesReturn + sectorReturn + finalReturn + pocketReturn + topReturn + dozensReturn;
    const netResultPoints = totalReturn - totalBet;
    const combinedROI = totalBet > 0 ? (netResultPoints / totalBet) * 100 : 0;

    const totalOffered = closedStats.gamesPredicted + engineStats.color.offered + engineStats.series.offered + engineStats.sector.offered + engineStats.final.offered + engineStats.pocket.offered + engineStats.top.offered + engineStats.dozens.offered;
    const totalWins = closedStats.gamesHit + engineStats.color.wins + engineStats.series.wins + engineStats.sector.wins + engineStats.final.wins + engineStats.pocket.wins + engineStats.top.wins + engineStats.dozens.wins;
    const combinedAccuracy = totalOffered > 0 ? Math.round((totalWins / totalOffered) * 1000) / 10 : 0;

    return {
      totalBet,
      totalReturn,
      netResultPoints,
      combinedROI: Math.round(combinedROI * 10) / 10,
      totalWins,
      totalOffered,
      combinedAccuracy,
    };
  }, [closedStats, engineStats, sectorSplitMode, strategyConfig]);

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
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block">Combined Accuracy</span>
          <div className={`text-xl font-black mt-1 ${combinedStats.combinedAccuracy >= 30 ? 'text-green-500' : 'text-red-500'}`}>
            {combinedStats.combinedAccuracy}%
          </div>
        </div>

        <div className="bg-zinc-900 p-3 rounded-2xl border border-gray-800 shadow-md">
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block">Result Point (ROI)</span>
          <div className={`text-xl font-black mt-1 ${combinedStats.netResultPoints >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {combinedStats.netResultPoints >= 0 ? `+${combinedStats.netResultPoints}` : combinedStats.netResultPoints} <span className="text-xs font-bold text-gray-400">({combinedStats.combinedROI >= 0 ? `+${combinedStats.combinedROI}%` : `${combinedStats.combinedROI}%`})</span>
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

            {/* Progression Mode 111 / 123 / 235 */}
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
              {closedStats.gamesHit} / {closedStats.gamesPredicted}
            </div>
            <div className="text-[9px] font-bold text-gray-500 mt-0.5">Tested across {spinHistory.length} spins</div>
          </div>

          <div className="bg-zinc-800/80 p-3 rounded-2xl border border-gray-700/50">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t.hitRatio}</span>
              <span className={`px-1.5 py-0.5 text-[8px] font-black rounded ${closedStats.isAboveBaseline ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}`}>
                {closedStats.isAboveBaseline ? t.statusAbove : t.statusBelow}
              </span>
            </div>
            <div className={`text-2xl font-black mt-1 ${closedStats.isAboveBaseline ? 'text-green-500' : 'text-red-500'}`}>
              {closedStats.hitRatio}%
            </div>
            <div className="text-[9px] font-bold text-gray-400 mt-0.5">{t.baseline}: <strong className="text-white">{closedStats.basicReturnRatio}%</strong></div>
          </div>

          <div className="bg-zinc-800/80 p-3 rounded-2xl border border-gray-700/50">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{t.unitsBet} vs {t.unitsReturned}</span>
            <div className="text-base font-black text-white mt-1">
              {closedStats.totalUnitsBet} <span className="text-gray-500 font-normal">in</span> / {closedStats.totalUnitsReturned} <span className="text-gold font-normal">out</span>
            </div>
            <div className="text-[9px] font-bold text-gray-400 mt-0.5">36:1 Single payout math</div>
          </div>

          <div className="bg-zinc-800/80 p-3 rounded-2xl border border-gray-700/50">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{t.netPL} & {t.roi}</span>
            <div className={`text-2xl font-black mt-1 ${closedStats.netPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {closedStats.netPL >= 0 ? `+${closedStats.netPL}` : closedStats.netPL} <span className="text-xs">({closedStats.roi}%)</span>
            </div>
            <div className="text-[9px] font-bold text-gray-400 mt-0.5">Strategy Mode: {betStrategyMode}</div>
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
          offered={engineStats.color.offered}
          wins={engineStats.color.wins}
          rate={engineStats.color.rate}
          baseline={engineStats.color.baseline}
          isAbove={engineStats.color.isAbove}
          statusAbove={t.statusAbove}
          statusBelow={t.statusBelow}
          baselineLabel={t.baseline}
          actualLabel={t.actual}
          targetUnits={1}
          payoutMultiplier={2}
          unitLabel="Red/Black"
        />

        {/* 3) Series Prediction */}
        <StatCriterionCard
          icon="🧭"
          title={t.seriesTitle}
          description={t.seriesDesc}
          offered={engineStats.series.offered}
          wins={engineStats.series.wins}
          rate={engineStats.series.rate}
          baseline={engineStats.series.baseline}
          isAbove={engineStats.series.isAbove}
          statusAbove={t.statusAbove}
          statusBelow={t.statusBelow}
          baselineLabel={t.baseline}
          actualLabel={t.actual}
          targetUnits={12}
          payoutMultiplier={36}
          unitLabel="12/37 Series Track"
        />

        {/* 4) Wheel Vector / Sector Prediction */}
        <StatCriterionCard
          icon="🎯"
          title={t.vectorTitle}
          description={t.vectorDesc}
          offered={engineStats.sector.offered}
          wins={engineStats.sector.wins}
          rate={engineStats.sector.rate}
          baseline={engineStats.sector.baseline}
          isAbove={engineStats.sector.isAbove}
          statusAbove={t.statusAbove}
          statusBelow={t.statusBelow}
          baselineLabel={t.baseline}
          actualLabel={t.actual}
          targetUnits={Math.round(37 / (parseInt(sectorSplitMode) || 9))}
          payoutMultiplier={36}
          unitLabel={`${sectorSplitMode}S Sector`}
        />

        {/* 5) Final Matrix Prediction */}
        <StatCriterionCard
          icon="🔢"
          title={t.finalTitle}
          description={t.finalDesc}
          offered={engineStats.final.offered}
          wins={engineStats.final.wins}
          rate={engineStats.final.rate}
          baseline={engineStats.final.baseline}
          isAbove={engineStats.final.isAbove}
          statusAbove={t.statusAbove}
          statusBelow={t.statusBelow}
          baselineLabel={t.baseline}
          actualLabel={t.actual}
          targetUnits={(strategyConfig.finalDigitsCount || 3) * 3}
          payoutMultiplier={36}
          unitLabel={`${strategyConfig.finalDigitsCount || 3} Digits (${(strategyConfig.finalDigitsCount || 3) * 3}#)`}
        />

        {/* 6) Pockets Distance Step Prediction */}
        <StatCriterionCard
          icon="📏"
          title={t.pocketTitle}
          description={t.pocketDesc}
          offered={engineStats.pocket.offered}
          wins={engineStats.pocket.wins}
          rate={engineStats.pocket.rate}
          baseline={engineStats.pocket.baseline}
          isAbove={engineStats.pocket.isAbove}
          statusAbove={t.statusAbove}
          statusBelow={t.statusBelow}
          baselineLabel={t.baseline}
          actualLabel={t.actual}
          targetUnits={(strategyConfig.pocketTopRanks || 3) * 2}
          payoutMultiplier={36}
          unitLabel={`${strategyConfig.pocketTopRanks || 3} Steps (${(strategyConfig.pocketTopRanks || 3) * 2}#)`}
        />

        {/* 7) Top Core Recommended Numbers */}
        <StatCriterionCard
          icon="⭐"
          title={t.topNumsTitle}
          description={t.topNumsDesc}
          offered={engineStats.top.offered}
          wins={engineStats.top.wins}
          rate={engineStats.top.rate}
          baseline={engineStats.top.baseline}
          isAbove={engineStats.top.isAbove}
          statusAbove={t.statusAbove}
          statusBelow={t.statusBelow}
          baselineLabel={t.baseline}
          actualLabel={t.actual}
          targetUnits={3}
          payoutMultiplier={36}
          unitLabel="Top 3 Core (3#)"
        />

        {/* 8) Dozens & Columns Strategic Signals */}
        <StatCriterionCard
          icon="📊"
          title={t.dozensTitle}
          description={t.dozensDesc}
          offered={engineStats.dozens.offered}
          wins={engineStats.dozens.wins}
          rate={engineStats.dozens.rate}
          baseline={engineStats.dozens.baseline}
          isAbove={engineStats.dozens.isAbove}
          statusAbove={t.statusAbove}
          statusBelow={t.statusBelow}
          baselineLabel={t.baseline}
          actualLabel={t.actual}
          targetUnits={2}
          payoutMultiplier={3}
          unitLabel="Double Dozen/Col (3:1)"
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
  baselineLabel: string;
  actualLabel: string;
  targetUnits: number;
  payoutMultiplier: number;
  unitLabel: string;
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
  targetUnits,
  payoutMultiplier,
  unitLabel,
}) => {
  const totalBetUnits = offered * targetUnits;
  const totalReturnUnits = wins * payoutMultiplier;
  const netUnits = totalReturnUnits - totalBetUnits;
  const roi = totalBetUnits > 0 ? ((netUnits / totalBetUnits) * 100).toFixed(1) : '0.0';
  const roiNum = parseFloat(roi);

  return (
    <div className="bg-zinc-900 p-3 rounded-2xl border border-gray-800 shadow-lg space-y-2 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{icon}</span>
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
      </div>

      {/* Compact Metrics Strip */}
      <div className="bg-zinc-950/80 p-2 rounded-xl border border-gray-800/80 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-black">
          <span className="text-gray-400">Targets: <strong className="text-gold">{targetUnits}#</strong> <span className="text-gray-500 font-normal">({unitLabel})</span></span>
          <span className="text-gray-400">Payout: <strong className="text-amber-300">{payoutMultiplier}:1</strong></span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-gray-800/60 text-[10px]">
          <div className="bg-zinc-900/90 p-1.5 rounded-lg border border-gray-800 flex items-center justify-between">
            <span className="text-[9px] font-bold text-gray-400">Hit Rate</span>
            <div className="text-right">
              <span className={`font-black ${isAbove ? 'text-green-400' : 'text-red-400'}`}>{rate}%</span>
              <span className="text-[8px] text-gray-500 block">vs {baseline}% base</span>
            </div>
          </div>

          <div className="bg-zinc-900/90 p-1.5 rounded-lg border border-gray-800 flex items-center justify-between">
            <span className="text-[9px] font-bold text-gray-400">Est. ROI</span>
            <div className="text-right">
              <span className={`font-black ${roiNum >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {roiNum >= 0 ? `+${roi}%` : `${roi}%`}
              </span>
              <span className="text-[8px] text-gray-500 block">{wins}/{offered} Hits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
