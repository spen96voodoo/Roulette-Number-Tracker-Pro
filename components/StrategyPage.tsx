import React from 'react';
import type { StrategyConfig, Language, SectorSplitMode } from '../types';
import { DEFAULT_STRATEGY_CONFIG } from '../types';

interface StrategyPageProps {
  strategyConfig: StrategyConfig;
  onUpdateStrategy: (newConfig: StrategyConfig) => void;
  onBack: () => void;
  lang: Language;
  spinHistory: number[];
  activeBettingCount: number;
}

const strategyLabels = {
  en: {
    title: "Strategy Customizer",
    subtitle: "Customize active prediction engines & combine strategy signals for the strategy chart",
    back: "Back to Main",
    apply: "Apply & View Strategy Chart",
    presets: "Quick Strategy Presets",
    presetAll: "All Engines Active",
    presetVector: "Wheel Vector Only",
    presetClosed: "Closed Numbers Only",
    presetPrecision: "Precision Combo (Closed + Vector + Final)",
    activeSummary: "Active Target Numbers:",
    activeEngines: "Active Engines:",
    
    // Part 1
    p1Title: "1) Closed Numbers Strategy",
    p1Desc: "Target adjacent wheel numbers based on recent spin history recency and progression.",
    spinLookback: "Related Spin Count",
    neighbourDepth: "Neighbour Range",
    progression: "Unit Progression",

    // Part 2
    p2Title: "2) Wheel Vector & Sectors",
    p2Desc: "Filter prediction by wheel sector density slices and most hit sector clusters.",
    sectorAmount: "Sector Amount (Slices)",
    mostHitSectors: "Most Hit Sector Pick Count",
    highestSector: "Highest Hit Sector Emphasis",

    // Part 3
    p3Title: "3) Pocket Distance Steps",
    p3Desc: "Target wheel displacement step intervals and repeating distance chances.",
    popularRanks: "Popular Next Distance Ranks",
    nextChance: "Next Distance Repeat Chance",

    // Part 4
    p4Title: "4) Final Matrix Digits",
    p4Desc: "Predict following numbers based on ending digit transitions.",
    finalCount: "Following Numbers/Digits Count",

    // Part 5
    p5Title: "5) Dozens, Columns & Colour",
    p5Desc: "Strategic signals for 12-number groups, 3 vertical columns, and Red/Black.",
    dozensSignal: "Dozen & Column Strategic Signal",
    colorSignal: "Colour Trend Prediction",

    // Part 6
    p6Title: "6) Pattern Intelligence",
    p6Desc: "History sequence matching and next-spin transition prediction.",
    nextNumTransition: "History Transition Next Number",
    samePatternMatch: "Same Pattern Sequence Match Alert",

    // Part 7
    p7Title: "7) Series Strategy",
    p7Desc: "Strategic signals for Wheel Series (Voisins/Top, Tiers/Small, Orphelins, Zero).",
    seriesSignal: "Wheel Series Signal Prediction",

    enabled: "ON",
    disabled: "OFF",
  },
  zh: {
    title: "投注策略自定义配置 (Strategy)",
    subtitle: "自由开关 7 大预测引擎与参数组合，结果实时同步至首页投注图表",
    back: "返回主页",
    apply: "保存并查看投注图表",
    presets: "快捷策略预设",
    presetAll: "全功能开启 (默认)",
    presetVector: "仅轮盘 Vector 扇区",
    presetClosed: "仅相邻闭合号码",
    presetPrecision: "高精度组合 (闭合+Vector+尾数)",
    activeSummary: "当前策略命中目标号码数:",
    activeEngines: "已开启引擎:",

    // Part 1
    p1Title: "1) 相邻闭合号码策略 (Closed Numbers)",
    p1Desc: "基于历史出号热度与轮盘物理邻号进行注码策略下注。",
    spinLookback: "关联历史轮数",
    neighbourDepth: "邻号范围",
    progression: "注码递进模式",

    // Part 2
    p2Title: "2) 轮盘向量与 Sector 扇区 (Wheel Vector)",
    p2Desc: "根据轮盘切分模式计算高频 Hit 扇区与最强向量区块。",
    sectorAmount: "扇区切分数量",
    mostHitSectors: "热门 Sector 选取数量",
    highestSector: "最高命中 Sector 加权",

    // Part 3
    p3Title: "3) 口袋距离步数 (Pocket Distance)",
    p3Desc: "计算旋转步数位移 (0-18步) 与重复距离步数概率。",
    popularRanks: "热门位移步数 Rank 排名",
    nextChance: "相同距离重复二次触发",

    // Part 4
    p4Title: "4) 尾数矩阵 (Final Matrix)",
    p4Desc: "分析历史 0-9 尾数转折规律并预测下一轮尾数。",
    finalCount: "下一轮推荐尾数数量",

    // Part 5
    p5Title: "5) 打列与颜色 (Dozens, Cols & Colour)",
    p5Desc: "几十区、三列横排策略信号与红黑颜色趋势预测。",
    dozensSignal: "打列与 Columns 策略信号",
    colorSignal: "红黑颜色趋势预测",

    // Part 6
    p6Title: "6) 模式智能 (Pattern Intelligence)",
    p6Desc: "历史序列接续号码与相同 Pattern 匹配预测。",
    nextNumTransition: "历史接续号码预测",
    samePatternMatch: "相同 Pattern 序列匹配警报",

    // Part 7
    p7Title: "7) 轮盘 Series 区块策略 (Series)",
    p7Desc: "预测轮盘 Series (Voisins/Top, Tiers/Small, Orphelins, Zero) 信号。",
    seriesSignal: "Series 区块预测信号",

    enabled: "开启",
    disabled: "关闭",
  },
  ja: {
    title: "ベット戦略カスタム設定 (Strategy)",
    subtitle: "7つの予測エンジンを自由にカスタマイズし、メインチャートに即座に反映",
    back: "メインに戻る",
    apply: "保存してチャートを表示",
    presets: "クイック戦略プリセット",
    presetAll: "全エンジン有効",
    presetVector: "ホイールベクターのみ",
    presetClosed: "隣接番号のみ",
    presetPrecision: "高精度コンボ (隣接+ベクター+下一桁)",
    activeSummary: "アクティブターゲット番号数:",
    activeEngines: "有効エンジン数:",

    p1Title: "1) 隣接閉鎖番号戦略",
    p1Desc: "直近スピン履歴とホイール隣接位置に基づくベット戦略。",
    spinLookback: "ルックバック回数",
    neighbourDepth: "隣接範囲",
    progression: "注碼プログレッション",

    p2Title: "2) ホイールベクター＆セクター",
    p2Desc: "セクター分割モードと最もHitしたクラスタをフィルタリング。",
    sectorAmount: "セクター分割数",
    mostHitSectors: "上位セクター選択数",
    highestSector: "最高Hitセクター強調",

    p3Title: "3) ポケット距離ステップ",
    p3Desc: "ホイール移動距離 (0-18ステップ) と繰り返しパターン。",
    popularRanks: "人気ステップRank数",
    nextChance: "同一距離リピート確率",

    p4Title: "4) 下一桁マトリックス",
    p4Desc: "0-9下一桁のパターン遷移から次回の数字を予測。",
    finalCount: "推奨下一桁の数量",

    p5Title: "5) ダズン・カラム＆カラー",
    p5Desc: "ダズン/カラムの戦略シグナルおよび赤黒トレンド予測。",
    dozensSignal: "ダズン＆カラム戦略シグナル",
    colorSignal: "カラー予測シグナル",

    p6Title: "6) パターンインテリジェンス",
    p6Desc: "履歴シーケンスの遷移とパターン一致予測。",
    nextNumTransition: "履歴遷移の次回番号",
    samePatternMatch: "同一パターン一致アラート",

    p7Title: "7) シリーズ戦略 (Series)",
    p7Desc: "ホイールシリーズ (Voisins, Tiers, Orphelins, Zero) 予測シグナル。",
    seriesSignal: "シリーズ予測シグナル",

    enabled: "ON",
    disabled: "OFF",
  },
  es: {
    title: "Personalizador de Estrategias de Apuesta",
    subtitle: "Configura los 7 motores de predicción y visualiza los números objetivo en el gráfico",
    back: "Volver",
    apply: "Guardar y Ver Gráfico",
    presets: "Ajustes Rápidos",
    presetAll: "Todos los Motores Activos",
    presetVector: "Solo Vector de Cilindro",
    presetClosed: "Solo Números Cerrados",
    presetPrecision: "Combo de Precisión",
    activeSummary: "Números Objetivo Activos:",
    activeEngines: "Motores Activos:",

    p1Title: "1) Estrategia de Números Cerrados",
    p1Desc: "Apuesta a números adyacentes según historial reciente y progresión.",
    spinLookback: "Giros Históricos",
    neighbourDepth: "Rango Vecino",
    progression: "Progresión de Unidades",

    p2Title: "2) Vector de Cilindro y Sectores",
    p2Desc: "Filtra por sectores más frecuentes del cilindro.",
    sectorAmount: "Sectores del Cilindro",
    mostHitSectors: "Sectores Principales",
    highestSector: "Enfocar Sector Más Frecuente",

    p3Title: "3) Pasos de Distancia de Bolsillos",
    p3Desc: "Pasos de desplazamiento en el cilindro y patrones repetidos.",
    popularRanks: "Rango de Pasos Populares",
    nextChance: "Repetición de Distancia Anterior",

    p4Title: "4) Matriz de Terminación Final",
    p4Desc: "Predicción de terminaciones de dígitos (0-9).",
    finalCount: "Cantidad de Dígitos Finales",

    p5Title: "5) Docenas, Columnas y Color",
    p5Desc: "Señales estratégicas para docenas, columnas y color.",
    dozensSignal: "Señal de Docenas y Columnas",
    colorSignal: "Predicción de Color",

    p6Title: "6) Inteligencia de Patrones",
    p6Desc: "Transición de historial y coincidencia de secuencias.",
    nextNumTransition: "Siguiente Número Histórico",
    samePatternMatch: "Alerta de Coincidencia de Patrón",

    p7Title: "7) Estrategia de Series (Series)",
    p7Desc: "Señal de predicción para series de ruleta (Voisins, Tiers, Orphelins, Zero).",
    seriesSignal: "Señal de Series",

    enabled: "ON",
    disabled: "OFF",
  },
  ko: {
    title: "맞춤 전략 설정 (Strategy)",
    subtitle: "7가지 예측 엔진의 활성화 및 세부 옵션을 설정하여 배팅 차트에 반영합니다",
    back: "메인으로",
    apply: "저장 후 차트 확인",
    presets: "빠른 전략 프리셋",
    presetAll: "전체 엔진 활성화",
    presetVector: "휠 벡터 전용",
    presetClosed: "인접 번호 전용",
    presetPrecision: "정밀 조합 (인접+벡터+끝수)",
    activeSummary: "활성 타겟 번호 수:",
    activeEngines: "활성 엔진 수:",

    p1Title: "1) 인접 닫힌 번호 전략",
    p1Desc: "최근 스핀 히스토리와 룰렛 휠 인접 번호 기반 전략.",
    spinLookback: "참조 스핀 수",
    neighbourDepth: "인접 범위",
    progression: "배팅 유닛 시스템",

    p2Title: "2) 휠 벡터 및 섹터",
    p2Desc: "휠 분할 섹터 및 최다 적중 클러스터를 필터링.",
    sectorAmount: "섹터 분할 수",
    mostHitSectors: "상위 섹터 선택 수",
    highestSector: "최고 적중 섹터 강조",

    p3Title: "3) 포켓 거리 단계",
    p3Desc: "휠 이동 거리(0-18 단계) 및 반복 거리 패턴.",
    popularRanks: "인기 거리 단계 Rank",
    nextChance: "동일 거리 재출현 기회",

    p4Title: "4) 끝수 매트릭스",
    p4Desc: "0-9 끝수 트렌드를 분석하여 다음 번호를 예측.",
    finalCount: "추천 끝수 개수",

    p5Title: "5) 더즌, 컬럼 및 색상",
    p5Desc: "더즌/컬럼 전략 시그널 및 레드/블랙 트렌드.",
    dozensSignal: "더즌 & 컬럼 전략 신호",
    colorSignal: "색상 예측 신호",

    p6Title: "6) 패턴 지능",
    p6Desc: "히스토리 연속 패턴 및 일치 알림.",
    nextNumTransition: "히스토리 다음 번호",
    samePatternMatch: "동일 패턴 일치 알림",

    p7Title: "7) 시리즈 전략 (Series)",
    p7Desc: "룰렛 시리즈 (Voisins, Tiers, Orphelins, Zero) 신호 예측.",
    seriesSignal: "시리즈 예측 신호",

    enabled: "켜짐",
    disabled: "꺼짐",
  },
  vi: {
    title: "Tùy Chỉnh Chiến Lược Đặt Cược (Strategy)",
    subtitle: "Tùy chỉnh 6 công cụ dự đoán và đồng bộ hóa trực tiếp lên bảng cược",
    back: "Quay Lại",
    apply: "Lưu & Xem Bảng Cược",
    presets: "Mẫu Chiến Lược Nhanh",
    presetAll: "Bật Tất Cả (Mặc Định)",
    presetVector: "Chỉ Vector Bánh Xe",
    presetClosed: "Chỉ Số Khép Kín Lân Cận",
    presetPrecision: "Kết Hợp Chính Xác",
    activeSummary: "Số Mục Tiêu Đang Bật:",
    activeEngines: "Số Công Cụ Đang Bật:",

    p1Title: "1) Chiến Lược Số Lân Cận Khép Kín",
    p1Desc: "Cược các số lân cận theo xu hướng gần đây và mức tiến tiền.",
    spinLookback: "Số Lượt Quay Tham Chiếu",
    neighbourDepth: "Độ Sâu Lân Cận",
    progression: "Chế Độ Tiến Tiền Cược",

    p2Title: "2) Vector Bánh Xe & Phân Vùng",
    p2Desc: "Lọc theo các phân vùng trúng cao nhất trên bánh xe.",
    sectorAmount: "Số Lượng Phân Vùng",
    mostHitSectors: "Số Phân Vùng Hàng Đầu",
    highestSector: "Nhấn Mạnh Phân Vùng Cao Nhất",

    p3Title: "3) Khoảng Cách Hộc Bánh Xe",
    p3Desc: "Dự đoán khoảng cách dịch chuyển hộc và chuỗi lặp.",
    popularRanks: "Hạng Khoảng Cách Phổ Biến",
    nextChance: "Cơ Hội Lặp Khoảng Cách",

    p4Title: "4) Ma Trận Số Cuối",
    p4Desc: "Dự đoán số theo xu hướng số cuối 0-9.",
    finalCount: "Số Lượng Số Cuối Dự Đoán",

    p5Title: "5) Hàng, Cột & Màu Sắc",
    p5Desc: "Tín hiệu chiến lược cho Hàng (Dozens), Cột (Columns) và Đỏ/Đen.",
    dozensSignal: "Tín Hiệu Chiến Lược Hàng & Cột",
    colorSignal: "Dự Đoán Xu Hướng Màu Sắc",

    p6Title: "6) Trí Tuệ Mẫu Xu Hướng",
    p6Desc: "Dự đoán số tiếp theo theo chuỗi lịch sử.",
    nextNumTransition: "Số Tiếp Theo Trong Lịch Sử",
    samePatternMatch: "Cảnh Báo Khớp Chuỗi Mẫu",

    p7Title: "7) Chiến Lược Chuỗi Vòng Wheel (Series)",
    p7Desc: "Tín hiệu dự đoán chuỗi bánh xe (Voisins, Tiers, Orphelins, Zero).",
    seriesSignal: "Tín Hiệu Dự Đoán Chuỗi Series",

    enabled: "BẬT",
    disabled: "TẮT",
  }
};

export const StrategyPage: React.FC<StrategyPageProps> = ({
  strategyConfig,
  onUpdateStrategy,
  onBack,
  lang,
  spinHistory,
  activeBettingCount,
}) => {
  const t = strategyLabels[lang] || strategyLabels.en;

  // Calculate active engine count
  const activeEnginesCount = [
    strategyConfig.closedEnabled,
    strategyConfig.vectorEnabled,
    strategyConfig.pocketEnabled,
    strategyConfig.finalEnabled,
    strategyConfig.dozensEnabled || strategyConfig.colsEnabled || strategyConfig.colorEnabled,
    strategyConfig.seriesEnabled,
    strategyConfig.patternNextNumEnabled || strategyConfig.patternMatchSequenceEnabled,
  ].filter(Boolean).length;

  // Handler helpers
  const updatePartial = (patch: Partial<StrategyConfig>) => {
    onUpdateStrategy({ ...strategyConfig, ...patch });
  };

  const applyPreset = (presetType: 'all' | 'vector' | 'closed' | 'precision') => {
    if (presetType === 'all') {
      onUpdateStrategy(DEFAULT_STRATEGY_CONFIG);
    } else if (presetType === 'vector') {
      onUpdateStrategy({
        ...strategyConfig,
        closedEnabled: false,
        vectorEnabled: true,
        pocketEnabled: false,
        finalEnabled: false,
        dozensEnabled: false,
        colsEnabled: false,
        colorEnabled: false,
        patternNextNumEnabled: false,
        patternMatchSequenceEnabled: false,
      });
    } else if (presetType === 'closed') {
      onUpdateStrategy({
        ...strategyConfig,
        closedEnabled: true,
        vectorEnabled: false,
        pocketEnabled: false,
        finalEnabled: false,
        dozensEnabled: false,
        colsEnabled: false,
        colorEnabled: false,
        patternNextNumEnabled: false,
        patternMatchSequenceEnabled: false,
      });
    } else if (presetType === 'precision') {
      onUpdateStrategy({
        ...strategyConfig,
        closedEnabled: true,
        vectorEnabled: true,
        pocketEnabled: false,
        finalEnabled: true,
        dozensEnabled: false,
        colsEnabled: false,
        colorEnabled: false,
        patternNextNumEnabled: false,
        patternMatchSequenceEnabled: false,
      });
    }
  };

  return (
    <div className="animate-fade-in pb-16 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between bg-zinc-900 p-3.5 rounded-2xl border border-gray-800 shadow-xl gap-2">
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
              <span>⚙️</span>
              <span>{t.title}</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-medium">{t.subtitle}</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-gold text-black hover:bg-yellow-400 font-black text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95"
        >
          <span>✓</span>
          <span>{t.apply}</span>
        </button>
      </div>

      {/* Live Status Bar & Presets */}
      <div className="bg-zinc-900 p-3.5 rounded-2xl border border-gold/40 shadow-lg space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-2">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{t.activeEngines}</span>
              <span className="text-sm font-black text-gold">{activeEnginesCount} / 7</span>
            </div>
            <div className="h-6 w-px bg-gray-800" />
            <div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{t.activeSummary}</span>
              <span className="text-sm font-black text-emerald-400">{activeBettingCount} <span className="text-xs text-gray-400 font-normal">/ 37 numbers</span></span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[9px] font-black text-gray-400 uppercase px-1">{t.presets}:</span>
            <button
              onClick={() => applyPreset('all')}
              className="px-2 py-1 text-[9px] font-black rounded-lg bg-zinc-800 text-gold border border-gold/30 hover:bg-zinc-700 transition-all"
            >
              {t.presetAll}
            </button>
            <button
              onClick={() => applyPreset('closed')}
              className="px-2 py-1 text-[9px] font-black rounded-lg bg-zinc-800 text-gray-300 border border-gray-700 hover:bg-zinc-700 transition-all"
            >
              {t.presetClosed}
            </button>
            <button
              onClick={() => applyPreset('vector')}
              className="px-2 py-1 text-[9px] font-black rounded-lg bg-zinc-800 text-gray-300 border border-gray-700 hover:bg-zinc-700 transition-all"
            >
              {t.presetVector}
            </button>
            <button
              onClick={() => applyPreset('precision')}
              className="px-2 py-1 text-[9px] font-black rounded-lg bg-zinc-800 text-emerald-400 border border-emerald-500/40 hover:bg-zinc-700 transition-all"
            >
              {t.presetPrecision}
            </button>
          </div>
        </div>
      </div>

      {/* 6 Strategy Part Cards */}
      <div className="space-y-3">
        {/* PART 1: CLOSED NUMBERS */}
        <StrategyCard
          title={t.p1Title}
          description={t.p1Desc}
          icon="🎯"
          isEnabled={strategyConfig.closedEnabled}
          onToggle={() => updatePartial({ closedEnabled: !strategyConfig.closedEnabled })}
          enabledText={t.enabled}
          disabledText={t.disabled}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            {/* Related Spin Count */}
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">{t.spinLookback}</span>
              <div className="flex flex-wrap gap-1">
                {[3, 5, 8, 10, 12].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => updatePartial({ closedLookback: cnt })}
                    className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all ${
                      strategyConfig.closedLookback === cnt ? 'bg-gold text-black shadow-xs' : 'bg-zinc-900 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>

            {/* Neighbour Range */}
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">{t.neighbourDepth}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => updatePartial({ closedNeighbourDepth: 3 })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    strategyConfig.closedNeighbourDepth === 3 ? 'bg-gold text-black shadow-xs' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  Near 3 (N3)
                </button>
                <button
                  onClick={() => updatePartial({ closedNeighbourDepth: 5 })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    strategyConfig.closedNeighbourDepth === 5 ? 'bg-gold text-black shadow-xs' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  Near 5 (N5)
                </button>
              </div>
            </div>

            {/* Unit Progression */}
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">{t.progression}</span>
              <div className="flex gap-1">
                {(['111', '123', '235'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => updatePartial({ closedProgression: mode })}
                    className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                      strategyConfig.closedProgression === mode
                        ? mode === '235' ? 'bg-green-600 text-white' : mode === '123' ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white'
                        : 'bg-zinc-900 text-gray-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </StrategyCard>

        {/* PART 2: WHEEL VECTOR */}
        <StrategyCard
          title={t.p2Title}
          description={t.p2Desc}
          icon="🎡"
          isEnabled={strategyConfig.vectorEnabled}
          onToggle={() => updatePartial({ vectorEnabled: !strategyConfig.vectorEnabled })}
          enabledText={t.enabled}
          disabledText={t.disabled}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
            {/* Sector Ranking Algorithm Mode */}
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50 col-span-1 sm:col-span-2">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">
                Sector Ranking Algorithm
              </span>
              <div className="flex gap-1 flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => updatePartial({ vectorRankingMode: 'next_probable' })}
                  className={`flex-1 py-1.5 px-2 text-[10px] font-black rounded-lg transition-all flex items-center justify-center gap-1 ${
                    (strategyConfig.vectorRankingMode || 'next_probable') === 'next_probable'
                      ? 'bg-amber-400 text-black shadow-md font-extrabold'
                      : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>🎯</span>
                  <span>Next Probable</span>
                </button>
                <button
                  onClick={() => updatePartial({ vectorRankingMode: 'history_frequency' })}
                  className={`flex-1 py-1.5 px-2 text-[10px] font-black rounded-lg transition-all flex items-center justify-center gap-1 ${
                    strategyConfig.vectorRankingMode === 'history_frequency'
                      ? 'bg-orange-500 text-white shadow-md font-extrabold'
                      : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>🔥</span>
                  <span>Top History</span>
                </button>
                <button
                  onClick={() => updatePartial({ vectorRankingMode: 'both' })}
                  className={`flex-1 py-1.5 px-2 text-[10px] font-black rounded-lg transition-all flex items-center justify-center gap-1 ${
                    strategyConfig.vectorRankingMode === 'both'
                      ? 'bg-purple-500 text-white shadow-md font-extrabold'
                      : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>⚡</span>
                  <span>Both (Next & History)</span>
                </button>
              </div>
            </div>

            {/* Sector Amount */}
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">{t.sectorAmount}</span>
              <div className="flex gap-1">
                {(['9', '12', '6', '4'] as SectorSplitMode[]).map(amt => (
                  <button
                    key={amt}
                    onClick={() => updatePartial({ vectorSectorAmount: amt })}
                    className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                      strategyConfig.vectorSectorAmount === amt ? 'bg-gold text-black shadow-xs' : 'bg-zinc-900 text-gray-400 hover:text-white'
                    }`}
                  >
                    {amt}s
                  </button>
                ))}
              </div>
            </div>

            {/* Most Hit Sector Pick Count */}
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">{t.mostHitSectors}</span>
              <div className="flex gap-1">
                {([1, 2, 3] as const).map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => updatePartial({ vectorTopSectorsCount: cnt })}
                    className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                      strategyConfig.vectorTopSectorsCount === cnt ? 'bg-gold text-black shadow-xs' : 'bg-zinc-900 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cnt} Sector{cnt > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </StrategyCard>

        {/* PART 3: POCKET DISTANCE */}
        <StrategyCard
          title={t.p3Title}
          description={t.p3Desc}
          icon="📏"
          isEnabled={strategyConfig.pocketEnabled}
          onToggle={() => updatePartial({ pocketEnabled: !strategyConfig.pocketEnabled })}
          enabledText={t.enabled}
          disabledText={t.disabled}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {/* Popular Distance Ranks */}
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">{t.popularRanks}</span>
              <div className="flex gap-1">
                {([1, 2, 3, 4, 5] as const).map(rnk => (
                  <button
                    key={rnk}
                    onClick={() => updatePartial({ pocketTopRanks: rnk })}
                    className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                      strategyConfig.pocketTopRanks === rnk ? 'bg-gold text-black shadow-xs' : 'bg-zinc-900 text-gray-400 hover:text-white'
                    }`}
                  >
                    Rank {rnk}
                  </button>
                ))}
              </div>
            </div>

            {/* Next Distance Chance */}
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">{t.nextChance}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => updatePartial({ pocketNextChanceEnabled: true })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    strategyConfig.pocketNextChanceEnabled ? 'bg-emerald-500 text-black font-extrabold' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.enabled}
                </button>
                <button
                  onClick={() => updatePartial({ pocketNextChanceEnabled: false })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    !strategyConfig.pocketNextChanceEnabled ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.disabled}
                </button>
              </div>
            </div>
          </div>
        </StrategyCard>

        {/* PART 4: FINAL MATRIX */}
        <StrategyCard
          title={t.p4Title}
          description={t.p4Desc}
          icon="🔢"
          isEnabled={strategyConfig.finalEnabled}
          onToggle={() => updatePartial({ finalEnabled: !strategyConfig.finalEnabled })}
          enabledText={t.enabled}
          disabledText={t.disabled}
        >
          <div className="pt-2">
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50 max-w-sm">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">{t.finalCount}</span>
              <div className="flex gap-1">
                {([2, 3, 4] as const).map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => updatePartial({ finalDigitsCount: cnt })}
                    className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                      strategyConfig.finalDigitsCount === cnt ? 'bg-gold text-black shadow-xs' : 'bg-zinc-900 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cnt} Digits (0-{cnt})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </StrategyCard>

        {/* PART 5: DOZENS, COLS & COLOUR */}
        <StrategyCard
          title={t.p5Title}
          description={t.p5Desc}
          icon="📊"
          isEnabled={strategyConfig.dozensEnabled || strategyConfig.colsEnabled || strategyConfig.colorEnabled}
          onToggle={() => {
            const next = !(strategyConfig.dozensEnabled || strategyConfig.colsEnabled || strategyConfig.colorEnabled);
            updatePartial({ dozensEnabled: next, colsEnabled: next, colorEnabled: next });
          }}
          enabledText={t.enabled}
          disabledText={t.disabled}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            {/* Dozen Strategy Signal */}
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">Dozen Signal (1st/2nd/3rd)</span>
              <div className="flex gap-1">
                <button
                  onClick={() => updatePartial({ dozensEnabled: true })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    strategyConfig.dozensEnabled ? 'bg-emerald-500 text-black font-extrabold' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.enabled}
                </button>
                <button
                  onClick={() => updatePartial({ dozensEnabled: false })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    !strategyConfig.dozensEnabled ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.disabled}
                </button>
              </div>
            </div>

            {/* Column Strategy Signal */}
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">Column Signal (Col 1/2/3)</span>
              <div className="flex gap-1">
                <button
                  onClick={() => updatePartial({ colsEnabled: true })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    strategyConfig.colsEnabled ? 'bg-emerald-500 text-black font-extrabold' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.enabled}
                </button>
                <button
                  onClick={() => updatePartial({ colsEnabled: false })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    !strategyConfig.colsEnabled ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.disabled}
                </button>
              </div>
            </div>

            {/* Colour Signal */}
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">{t.colorSignal}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => updatePartial({ colorEnabled: true })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    strategyConfig.colorEnabled ? 'bg-emerald-500 text-black font-extrabold' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.enabled}
                </button>
                <button
                  onClick={() => updatePartial({ colorEnabled: false })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    !strategyConfig.colorEnabled ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.disabled}
                </button>
              </div>
            </div>
          </div>
        </StrategyCard>

        {/* PART 6: PATTERN INTELLIGENCE */}
        <StrategyCard
          title={t.p6Title}
          description={t.p6Desc}
          icon="⚡"
          isEnabled={strategyConfig.patternNextNumEnabled || strategyConfig.patternMatchSequenceEnabled}
          onToggle={() => {
            const next = !(strategyConfig.patternNextNumEnabled || strategyConfig.patternMatchSequenceEnabled);
            updatePartial({ patternNextNumEnabled: next, patternMatchSequenceEnabled: next });
          }}
          enabledText={t.enabled}
          disabledText={t.disabled}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {/* Next Num Transition */}
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">{t.nextNumTransition}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => updatePartial({ patternNextNumEnabled: true })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    strategyConfig.patternNextNumEnabled ? 'bg-emerald-500 text-black font-extrabold' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.enabled}
                </button>
                <button
                  onClick={() => updatePartial({ patternNextNumEnabled: false })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    !strategyConfig.patternNextNumEnabled ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.disabled}
                </button>
              </div>
            </div>

            {/* Same Pattern Sequence Match */}
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">{t.samePatternMatch}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => updatePartial({ patternMatchSequenceEnabled: true })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    strategyConfig.patternMatchSequenceEnabled ? 'bg-emerald-500 text-black font-extrabold' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.enabled}
                </button>
                <button
                  onClick={() => updatePartial({ patternMatchSequenceEnabled: false })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    !strategyConfig.patternMatchSequenceEnabled ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.disabled}
                </button>
              </div>
            </div>
          </div>
        </StrategyCard>

        {/* PART 7: SERIES STRATEGY */}
        <StrategyCard
          title={t.p7Title}
          description={t.p7Desc}
          icon="🎡"
          isEnabled={strategyConfig.seriesEnabled}
          onToggle={() => updatePartial({ seriesEnabled: !strategyConfig.seriesEnabled })}
          enabledText={t.enabled}
          disabledText={t.disabled}
        >
          <div className="pt-2 max-w-sm">
            <div className="bg-zinc-800/80 p-2.5 rounded-xl border border-gray-700/50">
              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1.5">{t.seriesSignal}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => updatePartial({ seriesEnabled: true })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    strategyConfig.seriesEnabled ? 'bg-emerald-500 text-black font-extrabold' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.enabled}
                </button>
                <button
                  onClick={() => updatePartial({ seriesEnabled: false })}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition-all ${
                    !strategyConfig.seriesEnabled ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {t.disabled}
                </button>
              </div>
            </div>
          </div>
        </StrategyCard>
      </div>
    </div>
  );
};

interface StrategyCardProps {
  title: string;
  description: string;
  icon: string;
  isEnabled: boolean;
  onToggle: () => void;
  enabledText: string;
  disabledText: string;
  children: React.ReactNode;
}

const StrategyCard: React.FC<StrategyCardProps> = ({
  title,
  description,
  icon,
  isEnabled,
  onToggle,
  enabledText,
  disabledText,
  children,
}) => {
  return (
    <div
      className={`p-4 rounded-3xl border transition-all shadow-xl space-y-2 ${
        isEnabled ? 'bg-zinc-900 border-gold/40' : 'bg-zinc-950/60 border-gray-800 opacity-60'
      }`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-gray-800/80 pb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{icon}</span>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">{title}</h3>
            <p className="text-[10px] text-gray-400 font-medium">{description}</p>
          </div>
        </div>

        {/* Master Toggle Switch */}
        <button
          onClick={onToggle}
          className={`px-3 py-1 text-[10px] font-black rounded-xl border transition-all active:scale-95 flex items-center gap-1.5 shrink-0 ${
            isEnabled
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-xs'
              : 'bg-zinc-800 text-gray-400 border-gray-700'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
          <span>{isEnabled ? enabledText : disabledText}</span>
        </button>
      </div>

      {/* Internal Strategy Controls */}
      {isEnabled && <div className="animate-fade-in">{children}</div>}
    </div>
  );
};
