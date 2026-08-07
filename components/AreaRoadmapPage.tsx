import React, { useState } from 'react';
import type { Language, ComplexPrediction } from '../types';
import { RouletteWheelTracker } from './RouletteWheelTracker';
import { DozensTracker } from './DozensTracker';
import { SeriesTracker } from './SeriesTracker';
import { FinalNumberMatrix } from './FinalNumberMatrix';
import { PatternDisplay } from './PatternDisplay';
import { StatsDashboard } from './StatsDashboard';

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
  </svg>
);

export type RoadmapArea = 'cylinder' | 'dozens' | 'series' | 'matrix' | 'patterns' | 'stats';

interface AreaRoadmapPageProps {
  spinHistory: number[];
  onBack: () => void;
  prediction: ComplexPrediction | null;
  lang: Language;
  colorLookback?: number;
  seriesLookback?: number;
  initialArea?: RoadmapArea;
}


const areaDefs: { id: RoadmapArea; icon: string; name: Record<Language, string>; sub: Record<Language, string> }[] = [
  {
    id: 'cylinder',
    icon: '🎯',
    name: {
      en: 'Wheel Sector & Vector Map',
      zh: '轮盘扇区与向量图',
      ja: 'ホイールセクター＆ベクターマップ',
      es: 'Mapa de Sectores y Vectores',
      ko: '휠 섹터 및 벡터 맵',
      vi: 'Bản Đồ Véctơ & Khối Bánh Xe',
    },
    sub: {
      en: 'Contiguous pocket slices (4/6/9/12/0) & physical jump vectors',
      zh: '连续口袋切片 (4/6/9/12/0) 与物理跳跃向量',
      ja: '連続ポケットスライス (4/6/9/12/0) とジャンプベクター',
      es: 'Divisiones de sectores contiguos y vectores de salto',
      ko: '연속 포켓 슬라이스 및 점프 벡터',
      vi: 'Các lát cắt ô liên tiếp (4/6/9/12/0) & véctơ nhảy vật lý',
    },
  },
  {
    id: 'dozens',
    icon: '📊',
    name: {
      en: 'Dozens & Columns Roadmap',
      zh: '十二数与列走势图',
      ja: 'ダズン＆カラム・ロードマップ',
      es: 'Hoja de Ruta de Docenas y Columnas',
      ko: '더즌 및 컬럼 로드맵',
      vi: 'Sơ Đồ Luồng Hàng & Cột',
    },
    sub: {
      en: '1st/2nd/3rd Dozens & 1st/2nd/3rd Columns streak & gap analysis',
      zh: '前/中/后十二数与第1/2/3列连中与间隔分析',
      ja: '1st/2nd/3rdダズンおよび1st/2nd/3rdカラムの連勝・ギャップ分析',
      es: 'Análisis de racha y desfase de docenas y columnas',
      ko: '더즌 및 컬럼 연승 및 갭 분석',
      vi: 'Phân tích chuỗi liên tiếp & khoảng trống cho Hàng 1/2/3 & Cột 1/2/3',
    },
  },
  {
    id: 'series',
    icon: '🧭',
    name: {
      en: 'French Sector & Series Roadmap',
      zh: '法式轮盘与分区走势图',
      ja: 'フレンチセクター＆シリーズロードマップ',
      es: 'Hoja de Ruta de Sectores Franceses',
      ko: '프랑스 섹터 및 시리즈 로드맵',
      vi: 'Sơ Đồ Luồng Phân Vùng Pháp',
    },
    sub: {
      en: 'Voisins, Orphelins, Tiers & Zero Spiel spatial heat distribution',
      zh: '零区、孤注、三区与零角区的空间分布热图',
      ja: 'Voisins、Orphelins、Tiers、0-Spielの空間ヒートマップ',
      es: 'Distribución espacial de sectores franceses y Voisins',
      ko: 'Voisins, Orphelins, Tiers, 0-Spiel 공간 분포',
      vi: 'Phân bố nhiệt không gian Voisins, Orphelins, Tiers & Zero Spiel',
    },
  },
  {
    id: 'matrix',
    icon: '🔢',
    name: {
      en: 'Final Number Transition Matrix',
      zh: '尾数转换频率矩阵',
      ja: '下一桁遷移マトリックス',
      es: 'Matriz de Transición de Dígito Final',
      ko: '끝수 전환 매트릭스',
      vi: 'Ma Trận Chuyển Tiếp Số Cuối',
    },
    sub: {
      en: 'Last digit (0-9) next occurrence probability & hit counts',
      zh: '末位数字 (0-9) 下一出现概率与历史命中',
      ja: '下一桁（0-9）の次回発生確率とヒット数',
      es: 'Probabilidad de aparición y matriz de dígitos finales',
      ko: '마지막 자릿수(0-9) 다음 발생 확률 및 적중 수',
      vi: 'Xác suất xuất hiện tiếp theo & số lần trúng của chữ số cuối (0-9)',
    },
  },
  {
    id: 'patterns',
    icon: '🔍',
    name: {
      en: 'Pattern & Sequence Matrix',
      zh: '序列与重叠模式矩阵',
      ja: 'パターン＆シーケンスマトリックス',
      es: 'Matriz de Patrones y Secuencias',
      ko: '패턴 및 시퀀스 매特릭스',
      vi: 'Ma Trận Mẫu & Chuỗi Lặp',
    },
    sub: {
      en: 'Repeating pairs, gapped sequences & trigger alert memory',
      zh: '重复号码对、间隙序列与触发警报记忆',
      ja: 'リピートペア、ギャップシーケンス、トリガーアラート',
      es: 'Pares repetidos, secuencias con espacio y memoria de alertas',
      ko: '반복 쌍, 갭 시퀀스 및 트리거 알림 메모리',
      vi: 'Cặp số lặp, chuỗi cách khoảng & bộ nhớ cảnh báo kích hoạt',
    },
  },
  {
    id: 'stats',
    icon: '📈',
    name: {
      en: 'Statistical Analytics Dashboard',
      zh: '综合统计分析仪表盘',
      ja: '総合統計アナリティクスダッシュボード',
      es: 'Panel de Análisis Estadístico',
      ko: '통합 통계 분석 대시보드',
      vi: 'Bảng Điều Khiển Thống Kê Tổng Hợp',
    },
    sub: {
      en: 'Hot/Cold number ranking, Color, High/Low & Even/Odd metrics',
      zh: '冷热号码排行榜、颜色、大小与单双指标',
      ja: 'ホット/コールドランキング、カラー、ハイ/ロー、奇数/偶数',
      es: 'Ranking de números calientes/fríos, color, alto/bajo y par/impar',
      ko: '핫/콜드 번호 랭킹, 색상, 하이/로우 및 홀/짝 지표',
      vi: 'Xếp hạng số Nóng/Lạnh, chỉ số Màu, Tài/Xỉu & Chẵn/Lẻ',
    },
  },
];

export const AreaRoadmapPage: React.FC<AreaRoadmapPageProps> = ({
  spinHistory,
  onBack,
  lang,
  initialArea = 'cylinder',
}) => {
  const [activeArea, setActiveArea] = useState<RoadmapArea>(initialArea);

  const currentDef = areaDefs.find((a) => a.id === activeArea) || areaDefs[0];

  return (
    <div className="animate-fade-in pb-16 space-y-4">
      {/* Top Title & Navigation Header */}
      <div className="flex items-center justify-between mt-2 sticky top-0 bg-black/90 backdrop-blur-md z-30 py-2 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-95 transition-all border border-gray-800 text-gray-200"
            aria-label="Back"
          >
            <BackIcon />
          </button>
          <div>
            <h2 className="text-lg font-black text-white tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              🗺️ <span className="text-gold">Area Roadmap</span> Center
            </h2>
            <p className="text-[10px] text-gray-400 font-semibold">
              Separate Function Views • Select an area roadmap below
            </p>
          </div>
        </div>

        <div className="text-[10px] font-black text-gray-400 bg-zinc-900 px-3 py-1 rounded-full border border-gray-800">
          Spins: <strong className="text-white">{spinHistory.length}</strong>
        </div>
      </div>

      {/* Area Selector Sub-Nav Tabs (Separate View per Function) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 bg-zinc-950 p-1.5 rounded-2xl border border-gray-800 shadow-inner">
        {areaDefs.map((area) => {
          const isActive = activeArea === area.id;
          return (
            <button
              key={area.id}
              onClick={() => setActiveArea(area.id)}
              className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-b from-amber-500 to-yellow-600 text-black border-gold shadow-lg shadow-amber-500/20 font-black'
                  : 'bg-zinc-900 text-gray-300 border-gray-800 hover:bg-zinc-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base">{area.icon}</span>
                <span className="text-[11px] font-black leading-tight line-clamp-1">
                  {area.name[lang] || area.name.en}
                </span>
              </div>
              <span
                className={`text-[9px] font-bold line-clamp-1 ${
                  isActive ? 'text-black/80' : 'text-gray-500'
                }`}
              >
                {area.sub[lang] || area.sub.en}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Area Banner Header */}
      <div className="bg-zinc-900/90 p-3.5 rounded-2xl border border-gray-800 flex items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl p-2 bg-zinc-950 rounded-xl border border-gray-800">{currentDef.icon}</span>
          <div>
            <h3 className="text-sm font-black text-gold uppercase tracking-wider">
              {currentDef.name[lang] || currentDef.name.en}
            </h3>
            <p className="text-xs text-gray-400 font-medium">
              {currentDef.sub[lang] || currentDef.sub.en}
            </p>
          </div>
        </div>

        {/* Quick Area Switch Arrows */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => {
              const idx = areaDefs.findIndex((a) => a.id === activeArea);
              const prev = areaDefs[(idx - 1 + areaDefs.length) % areaDefs.length];
              setActiveArea(prev.id);
            }}
            className="px-2 py-1 text-xs text-gray-400 hover:text-white font-black hover:bg-zinc-800 rounded-lg"
            title="Previous Area Page"
          >
            ◀
          </button>
          <span className="text-[9px] font-black text-gold px-1">
            {areaDefs.findIndex((a) => a.id === activeArea) + 1} / {areaDefs.length}
          </span>
          <button
            onClick={() => {
              const idx = areaDefs.findIndex((a) => a.id === activeArea);
              const next = areaDefs[(idx + 1) % areaDefs.length];
              setActiveArea(next.id);
            }}
            className="px-2 py-1 text-xs text-gray-400 hover:text-white font-black hover:bg-zinc-800 rounded-lg"
            title="Next Area Page"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Individual Dedicated Page View Content */}
      <div className="bg-zinc-900/40 p-3 rounded-3xl border border-gray-800/80 shadow-2xl">
        {activeArea === 'cylinder' && (
          <div className="animate-fade-in space-y-4">
            <RouletteWheelTracker history={spinHistory} lang={lang} />
          </div>
        )}

        {activeArea === 'dozens' && (
          <div className="animate-fade-in space-y-4">
            <DozensTracker history={spinHistory} />
          </div>
        )}

        {activeArea === 'series' && (
          <div className="animate-fade-in space-y-4">
            <SeriesTracker history={spinHistory} />
          </div>
        )}

        {activeArea === 'matrix' && (
          <div className="animate-fade-in space-y-4">
            <FinalNumberMatrix history={spinHistory} />
          </div>
        )}

        {activeArea === 'patterns' && (
          <div className="animate-fade-in space-y-4">
            <PatternDisplay history={spinHistory} />
          </div>
        )}

        {activeArea === 'stats' && (
          <div className="animate-fade-in space-y-4">
            <StatsDashboard history={spinHistory} />
          </div>
        )}
      </div>
    </div>
  );
};
