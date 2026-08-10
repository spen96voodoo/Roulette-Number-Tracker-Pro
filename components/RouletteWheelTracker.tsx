import React, { useState, useMemo } from 'react';
import { NUMBER_COLORS, EUROPEAN_WHEEL_ORDER } from '../constants';
import type { Language, SectorSplitMode } from '../types';

interface RouletteWheelTrackerProps {
  history: number[];
  lang?: Language;
  splitMode?: SectorSplitMode;
  onSplitModeChange?: (mode: SectorSplitMode) => void;
}

export type { SectorSplitMode };

interface SectorDef {
  id: string;
  name: string;
  shortName: string;
  numbers: number[];
  color: string; // Tailwind text/border color class
  fillHex: string; // Hex for SVG fills
  bgClass: string;
  borderClass: string;
  startWheelIdx?: number;
  endWheelIdx?: number;
}

const SECTOR_COLORS_PALETTE = [
  { fillHex: '#f59e0b', color: 'text-amber-400', bgClass: 'bg-amber-500/10', borderClass: 'border-amber-500/40' }, // Gold / Amber
  { fillHex: '#3b82f6', color: 'text-blue-400', bgClass: 'bg-blue-500/10', borderClass: 'border-blue-500/40' }, // Blue
  { fillHex: '#10b981', color: 'text-emerald-400', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/40' }, // Emerald
  { fillHex: '#a855f7', color: 'text-purple-400', bgClass: 'bg-purple-500/10', borderClass: 'border-purple-500/40' }, // Purple
  { fillHex: '#06b6d4', color: 'text-cyan-400', bgClass: 'bg-cyan-500/10', borderClass: 'border-cyan-500/40' }, // Cyan
  { fillHex: '#f43f5e', color: 'text-rose-400', bgClass: 'bg-rose-500/10', borderClass: 'border-rose-500/40' }, // Rose
  { fillHex: '#6366f1', color: 'text-indigo-400', bgClass: 'bg-indigo-500/10', borderClass: 'border-indigo-500/40' }, // Indigo
  { fillHex: '#eab308', color: 'text-yellow-400', bgClass: 'bg-yellow-500/10', borderClass: 'border-yellow-500/40' }, // Yellow
  { fillHex: '#14b8a6', color: 'text-teal-400', bgClass: 'bg-teal-500/10', borderClass: 'border-teal-500/40' }, // Teal
  { fillHex: '#f97316', color: 'text-orange-400', bgClass: 'bg-orange-500/10', borderClass: 'border-orange-500/40' }, // Orange
  { fillHex: '#d946ef', color: 'text-fuchsia-400', bgClass: 'bg-fuchsia-500/10', borderClass: 'border-fuchsia-500/40' }, // Fuchsia
  { fillHex: '#84cc16', color: 'text-lime-400', bgClass: 'bg-lime-500/10', borderClass: 'border-lime-500/40' }, // Lime
];

// Helper to slice wheel array into contiguous sectors
const buildContiguousSectors = (sliceSizes: number[], prefix: 'SC' | 'S' = 'SC'): SectorDef[] => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
  const sectors: SectorDef[] = [];
  let currentIdx = 0;

  sliceSizes.forEach((size, sIdx) => {
    const palette = SECTOR_COLORS_PALETTE[sIdx % SECTOR_COLORS_PALETTE.length];
    const endIdx = currentIdx + size - 1;
    const nums = EUROPEAN_WHEEL_ORDER.slice(currentIdx, currentIdx + size);
    const letter = letters[sIdx] || `${sIdx + 1}`;
    const codeName = `${prefix}-${letter}`;

    sectors.push({
      id: `sec-${sIdx + 1}`,
      name: `${codeName} (${nums.join(', ')})`,
      shortName: codeName,
      numbers: nums,
      fillHex: palette.fillHex,
      color: palette.color,
      bgClass: palette.bgClass,
      borderClass: palette.borderClass,
      startWheelIdx: currentIdx,
      endWheelIdx: endIdx,
    });

    currentIdx += size;
  });

  return sectors;
};

// French Wheel / 0-Sector Special Divisions
const FRENCH_0_SECTORS: SectorDef[] = [
  {
    id: 'zero-spiel',
    name: '0-Spiel Sector (Jeu 0)',
    shortName: '0-Spiel',
    numbers: [12, 35, 3, 26, 0, 32, 15],
    fillHex: '#10b981',
    color: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/40',
  },
  {
    id: 'voisins',
    name: 'Top series',
    shortName: 'Top series',
    numbers: [22, 18, 29, 7, 28, 19, 4, 21, 2, 25],
    fillHex: '#f59e0b',
    color: 'text-amber-400',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/40',
  },
  {
    id: 'orphelins',
    name: 'Orphelins Sector',
    shortName: 'Orphelins',
    numbers: [1, 20, 14, 31, 9, 17, 34, 6],
    fillHex: '#a855f7',
    color: 'text-purple-400',
    bgClass: 'bg-purple-500/10',
    borderClass: 'border-purple-500/40',
  },
  {
    id: 'tiers',
    name: 'Small series',
    shortName: 'Small series',
    numbers: [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33],
    fillHex: '#06b6d4',
    color: 'text-cyan-400',
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/40',
  },
];

const wheelOrderMap = new Map<number, number>(
  EUROPEAN_WHEEL_ORDER.map((num, idx) => [num, idx])
);

// Calculate pocket jump distance along wheel order
const calculateWheelJump = (fromNum: number, toNum: number) => {
  const fromIdx = wheelOrderMap.get(fromNum) ?? 0;
  const toIdx = wheelOrderMap.get(toNum) ?? 0;

  const cwSteps = (toIdx - fromIdx + 37) % 37;
  const ccwSteps = (fromIdx - toIdx + 37) % 37;

  if (cwSteps === 0) return { steps: 0, dir: 'SAME', label: '0 pockets' };
  if (cwSteps <= 18) {
    return { steps: cwSteps, dir: 'CW', label: `+${cwSteps} CW` };
  } else {
    return { steps: ccwSteps, dir: 'CCW', label: `-${ccwSteps} CCW` };
  }
};

export const RouletteWheelTracker: React.FC<RouletteWheelTrackerProps> = ({
  history,
  lang = 'en',
  splitMode: controlledSplitMode,
  onSplitModeChange,
}) => {
  const [internalSplitMode, setInternalSplitMode] = useState<SectorSplitMode>('9');
  const splitMode = controlledSplitMode || internalSplitMode;

  const handleSetSplitMode = (mode: SectorSplitMode) => {
    setInternalSplitMode(mode);
    if (onSplitModeChange) {
      onSplitModeChange(mode);
    }
  };
  const [vectorPathLength, setVectorPathLength] = useState<number>(10);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);

  // Generate Sectors based on selected mode
  const sectors = useMemo<SectorDef[]>(() => {
    switch (splitMode) {
      case '4':
        return buildContiguousSectors([9, 9, 9, 10], 'SC');
      case '6':
        return buildContiguousSectors([6, 6, 6, 6, 6, 7], 'SC');
      case '9':
        return buildContiguousSectors([4, 4, 4, 4, 4, 4, 4, 4, 5], 'S');
      case '12':
        return buildContiguousSectors([4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], 'S');
      case '0':
        return FRENCH_0_SECTORS;
      default:
        return buildContiguousSectors([9, 9, 9, 10], 'SC');
    }
  }, [splitMode]);

  // Map each roulette number to its assigned sector
  const numberSectorMap = useMemo(() => {
    const map = new Map<number, SectorDef>();
    sectors.forEach((sec) => {
      sec.numbers.forEach((num) => {
        map.set(num, sec);
      });
    });
    return map;
  }, [sectors]);

  // Sector Statistics Calculation
  const sectorStats = useMemo(() => {
    const totalSpins = history.length;
    const statsMap = new Map<
      string,
      {
        count: number;
        percentage: number;
        lastHitDistance: number | null;
        isHot: boolean;
        isCold: boolean;
      }
    >();

    const hitCounts = new Map<string, number>();
    const lastHitIndices = new Map<string, number>();

    sectors.forEach((s) => {
      hitCounts.set(s.id, 0);
      lastHitIndices.set(s.id, -1);
    });

    history.forEach((num, idx) => {
      const sec = numberSectorMap.get(num);
      if (sec) {
        hitCounts.set(sec.id, (hitCounts.get(sec.id) || 0) + 1);
        lastHitIndices.set(sec.id, idx);
      }
    });

    const expectedPct = 100 / sectors.length;

    sectors.forEach((s) => {
      const count = hitCounts.get(s.id) || 0;
      const percentage = totalSpins > 0 ? (count / totalSpins) * 100 : 0;
      const lastIdx = lastHitIndices.get(s.id) ?? -1;
      const lastHitDistance = lastIdx !== -1 ? totalSpins - 1 - lastIdx : null;

      const isHot = totalSpins >= 10 && percentage >= expectedPct * 1.3;
      const isCold = totalSpins >= 10 && (count === 0 || percentage <= expectedPct * 0.6);

      statsMap.set(s.id, {
        count,
        percentage,
        lastHitDistance,
        isHot,
        isCold,
      });
    });

    return statsMap;
  }, [history, sectors, numberSectorMap]);

  // Recent vector jumps calculations
  const recentSpins = useMemo(() => {
    return history.slice(-vectorPathLength);
  }, [history, vectorPathLength]);

  const recentJumps = useMemo(() => {
    if (history.length < 2) return [];
    const jumps = [];
    const list = history.slice(-(vectorPathLength + 1));
    for (let i = 1; i < list.length; i++) {
      const fromNum = list[i - 1];
      const toNum = list[i];
      const jump = calculateWheelJump(fromNum, toNum);
      const fromSec = numberSectorMap.get(fromNum);
      const toSec = numberSectorMap.get(toNum);

      jumps.push({
        id: `jump-${i}`,
        stepNum: i,
        fromNum,
        toNum,
        fromSec,
        toSec,
        ...jump,
      });
    }
    return jumps.reverse(); // Most recent first
  }, [history, vectorPathLength, numberSectorMap]);

  // Sector-to-Sector Pairwise Transitions across entire spin history
  const sectorTransitions = useMemo(() => {
    if (history.length < 2) return { transitionList: [], totalTransitions: 0 };

    const matrix = new Map<string, Map<string, number>>();
    const totalTransitions = history.length - 1;

    // Initialize map for all sector pairs
    sectors.forEach((s1) => {
      const inner = new Map<string, number>();
      sectors.forEach((s2) => inner.set(s2.id, 0));
      matrix.set(s1.id, inner);
    });

    for (let i = 0; i < history.length - 1; i++) {
      const fromSec = numberSectorMap.get(history[i]);
      const toSec = numberSectorMap.get(history[i + 1]);
      if (fromSec && toSec) {
        const inner = matrix.get(fromSec.id);
        if (inner) {
          inner.set(toSec.id, (inner.get(toSec.id) || 0) + 1);
        }
      }
    }

    const list: {
      fromSec: SectorDef;
      toSec: SectorDef;
      count: number;
      percentage: number;
      sectorPercentage: number;
    }[] = [];

    sectors.forEach((fromSec) => {
      const inner = matrix.get(fromSec.id);
      let fromTotal = 0;
      inner?.forEach((cnt) => (fromTotal += cnt));

      sectors.forEach((toSec) => {
        const cnt = inner?.get(toSec.id) || 0;
        if (cnt > 0) {
          list.push({
            fromSec,
            toSec,
            count: cnt,
            percentage: (cnt / totalTransitions) * 100,
            sectorPercentage: fromTotal > 0 ? (cnt / fromTotal) * 100 : 0,
          });
        }
      });
    });

    list.sort((a, b) => b.count - a.count);

    return { transitionList: list, totalTransitions };
  }, [history, sectors, numberSectorMap]);

  // Next Sector Predictive Probabilities based on the Latest Spin's Sector
  const nextSectorPrediction = useMemo(() => {
    if (history.length === 0) return null;

    const latestSpin = history[history.length - 1];
    const latestSec = numberSectorMap.get(latestSpin);

    if (!latestSec) return null;

    let pastOccurrences = 0;
    const nextSectorCounts = new Map<string, number>();
    sectors.forEach((s) => nextSectorCounts.set(s.id, 0));

    for (let i = 0; i < history.length - 1; i++) {
      const sec = numberSectorMap.get(history[i]);
      if (sec && sec.id === latestSec.id) {
        pastOccurrences++;
        const nextSec = numberSectorMap.get(history[i + 1]);
        if (nextSec) {
          nextSectorCounts.set(nextSec.id, (nextSectorCounts.get(nextSec.id) || 0) + 1);
        }
      }
    }

    const breakdown = sectors
      .map((s) => {
        const count = nextSectorCounts.get(s.id) || 0;
        const probability = pastOccurrences > 0 ? (count / pastOccurrences) * 100 : 0;
        return {
          sector: s,
          count,
          probability,
        };
      })
      .sort((a, b) => b.count - a.count);

    const topPick = breakdown.length > 0 && breakdown[0].count > 0 ? breakdown[0] : null;

    return {
      latestSpin,
      latestSec,
      pastOccurrences,
      breakdown,
      topPick,
    };
  }, [history, sectors, numberSectorMap]);

  // Visual Wheel Coordinates & SVG Arc Paths
  const radiusInner = 105;
  const radiusOuter = 142;
  const radiusNodes = 125;
  const centerSize = 340;
  const center = { x: centerSize / 2, y: centerSize / 2 };

  const pocketPositions = useMemo(() => {
    const posMap = new Map<number, { x: number; y: number; angle: number }>();
    EUROPEAN_WHEEL_ORDER.forEach((num, index) => {
      const angle = (index / 37) * 2 * Math.PI - Math.PI / 2; // start at top (12 o'clock)
      const x = center.x + radiusNodes * Math.cos(angle);
      const y = center.y + radiusNodes * Math.sin(angle);
      posMap.set(num, { x, y, angle });
    });
    return posMap;
  }, [center.x, center.y, radiusNodes]);

  // Sector Pie Slice Paths for SVG background
  const sectorArcPaths = useMemo(() => {
    return sectors.map((sec) => {
      let startAngle = 0;
      let endAngle = 0;

      if (sec.startWheelIdx !== undefined && sec.endWheelIdx !== undefined) {
        startAngle = (sec.startWheelIdx / 37) * 2 * Math.PI - Math.PI / 2 - Math.PI / 37;
        endAngle = (sec.endWheelIdx / 37) * 2 * Math.PI - Math.PI / 2 + Math.PI / 37;
      } else {
        // For non-contiguous sectors (like French mode), generate multi-part arcs
        // find indices in EUROPEAN_WHEEL_ORDER
        const indices = sec.numbers.map((n) => wheelOrderMap.get(n) ?? 0).sort((a, b) => a - b);

        // find min & max index or group
        const minIdx = Math.min(...indices);
        const maxIdx = Math.max(...indices);
        startAngle = (minIdx / 37) * 2 * Math.PI - Math.PI / 2 - Math.PI / 37;
        endAngle = (maxIdx / 37) * 2 * Math.PI - Math.PI / 2 + Math.PI / 37;
      }

      // Large arc flag check
      let diff = endAngle - startAngle;
      if (diff < 0) diff += 2 * Math.PI;
      const largeArcFlag = diff > Math.PI ? 1 : 0;

      const rIn = radiusInner - 12;
      const rOut = radiusOuter + 10;

      const x1_in = center.x + rIn * Math.cos(startAngle);
      const y1_in = center.y + rIn * Math.sin(startAngle);
      const x2_in = center.x + rIn * Math.cos(endAngle);
      const y2_in = center.y + rIn * Math.sin(endAngle);

      const x1_out = center.x + rOut * Math.cos(startAngle);
      const y1_out = center.y + rOut * Math.sin(startAngle);
      const x2_out = center.x + rOut * Math.cos(endAngle);
      const y2_out = center.y + rOut * Math.sin(endAngle);

      const d = `M ${x1_in} ${y1_in} L ${x1_out} ${y1_out} A ${rOut} ${rOut} 0 ${largeArcFlag} 1 ${x2_out} ${y2_out} L ${x2_in} ${y2_in} A ${rIn} ${rIn} 0 ${largeArcFlag} 0 ${x1_in} ${y1_in} Z`;

      let midAngle = (startAngle + endAngle) / 2;
      if (endAngle < startAngle) {
        midAngle = (startAngle + endAngle + 2 * Math.PI) / 2;
      }
      const beaconRadius = radiusOuter + 22;
      const beaconX = center.x + beaconRadius * Math.cos(midAngle);
      const beaconY = center.y + beaconRadius * Math.sin(midAngle);

      return {
        id: sec.id,
        sec,
        path: d,
        color: sec.fillHex,
        midAngle,
        beaconX,
        beaconY,
      };
    });
  }, [sectors, center.x, center.y, radiusInner, radiusOuter]);

  // Vector lines between recent spins with clear directional arrow geometry
  const vectorLines = useMemo(() => {
    const lines = [];
    if (recentSpins.length > 1) {
      for (let i = 1; i < recentSpins.length; i++) {
        const startNum = recentSpins[i - 1];
        const endNum = recentSpins[i];
        const startPos = pocketPositions.get(startNum);
        const endPos = pocketPositions.get(endNum);
        const isLatest = i === recentSpins.length - 1;

        if (startPos && endPos) {
          const dx = endPos.x - startPos.x;
          const dy = endPos.y - startPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const nodeRadius = 14;
          const sx = dist > 0 ? startPos.x + (dx / dist) * nodeRadius : startPos.x;
          const sy = dist > 0 ? startPos.y + (dy / dist) * nodeRadius : startPos.y;
          const ex = dist > 0 ? endPos.x - (dx / dist) * (nodeRadius + 4) : endPos.x;
          const ey = dist > 0 ? endPos.y - (dy / dist) * (nodeRadius + 4) : endPos.y;

          const mx = (startPos.x + endPos.x) / 2;
          const my = (startPos.y + endPos.y) / 2;

          lines.push({
            key: `vline-${i}-${startNum}-${endNum}`,
            stepIndex: i,
            startNum,
            endNum,
            x1: sx,
            y1: sy,
            x2: ex,
            y2: ey,
            mx,
            my,
            opacity: isLatest ? 1 : (i / (recentSpins.length - 1)) * 0.7 + 0.3,
            strokeWidth: isLatest ? 3.5 : 2,
            isLatest,
          });
        }
      }
    }
    return lines;
  }, [recentSpins, pocketPositions]);

  const latestSpinNumber = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="space-y-4">
      {/* Top Controls Bar: Sector Split Selector & Vector Range */}
      <div className="bg-zinc-950 p-3 rounded-2xl border border-gray-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-2.5">
          <div>
            <span className="text-[10px] font-black uppercase text-gold tracking-widest block">
              Wheel Sector Division Mode
            </span>
            <p className="text-[11px] text-gray-400 font-medium">
              Select wheel slice count & toggle last 5 / 10 spin trajectory vectors
            </p>
          </div>
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-gray-800">
            <span className="text-[9px] font-black uppercase text-gray-400 px-1.5">Vectors:</span>
            {[5, 10, 15].map((len) => (
              <button
                key={len}
                onClick={() => setVectorPathLength(len)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                  vectorPathLength === len
                    ? 'bg-gold text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {len} Spins
              </button>
            ))}
          </div>
        </div>

        {/* Sector Split Buttons (4, 6, 9, 12, 0) */}
        <div className="grid grid-cols-5 gap-1.5">
          {(
            [
              { mode: '4', label: '4 Sectors', sub: '9-10 pockets' },
              { mode: '6', label: '6 Sectors', sub: '6-7 pockets' },
              { mode: '9', label: '9 Sectors', sub: '4-5 pockets' },
              { mode: '12', label: '12 Sectors', sub: '3-4 pockets' },
              { mode: '0', label: '0 / French', sub: 'French 4-Zone' },
            ] as const
          ).map((item) => {
            const isActive = splitMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => {
                  handleSetSplitMode(item.mode);
                  setSelectedSectorId(null);
                }}
                className={`py-2 px-1.5 rounded-xl border font-black text-center transition-all active:scale-95 flex flex-col items-center justify-center ${
                  isActive
                    ? 'bg-gradient-to-b from-amber-500 to-yellow-600 text-black border-gold shadow-lg shadow-amber-500/20'
                    : 'bg-zinc-900 text-gray-300 border-gray-800 hover:bg-zinc-800 hover:border-gold/30'
                }`}
              >
                <span className="text-xs font-black tracking-tight">{item.label}</span>
                <span className={`text-[9px] font-bold ${isActive ? 'text-black/80' : 'text-gray-500'}`}>
                  {item.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wheel Vector Canvas Display */}
      <div className="bg-zinc-950 p-4 rounded-3xl border border-gray-800 shadow-2xl flex flex-col items-center relative overflow-hidden">
        {/* Subtle radial background glow */}
        <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase text-gold tracking-wider">
              Wheel Vector & Sector Map ({splitMode === '0' ? 'French 0-Sectors' : `${splitMode} Sectors`})
            </span>
          </div>
          {selectedSectorId && (
            <button
              onClick={() => setSelectedSectorId(null)}
              className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 hover:bg-amber-500/20"
            >
              Reset Sector Filter ✕
            </button>
          )}
        </div>

        {/* SVG Wheel Visualizer */}
        <div className="relative flex justify-center items-center my-2" style={{ width: `${centerSize}px`, height: `${centerSize}px` }}>
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox={`0 0 ${centerSize} ${centerSize}`}
            style={{ overflow: 'visible' }}
          >
            <defs>
              <marker
                id="vectorArrowHead"
                markerWidth="10"
                markerHeight="7"
                refX="8"
                refY="3.5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L10,3.5 L0,7 Z" fill="#FFD700" />
              </marker>
            </defs>

            {/* Background Outer & Inner Wheel Rings */}
            <circle cx={center.x} cy={center.y} r={radiusOuter + 12} fill="none" stroke="#27272a" strokeWidth="2" />
            <circle cx={center.x} cy={center.y} r={radiusInner - 12} fill="#18181b" stroke="#27272a" strokeWidth="2" />

            {/* Sector Background Arcs */}
            {sectorArcPaths.map((arc) => {
              const isSelected = selectedSectorId === arc.id;
              const isDimmed = selectedSectorId !== null && !isSelected;
              const topSectorPickId = nextSectorPrediction?.topPick?.sector?.id || (nextSectorPrediction?.breakdown?.[0]?.sector?.id) || sectors[0]?.id;
              const isTopPick = topSectorPickId === arc.id;

              return (
                <g key={`arc-group-${arc.id}`}>
                  <path
                    d={arc.path}
                    fill={arc.color}
                    fillOpacity={isSelected ? 0.35 : isDimmed ? 0.05 : isTopPick ? 0.3 : 0.15}
                    stroke={isTopPick ? '#FFD700' : arc.color}
                    strokeWidth={isSelected ? 3 : isTopPick ? 3 : 1}
                    strokeOpacity={isDimmed ? 0.1 : isTopPick ? 0.9 : 0.4}
                    className={`transition-all duration-300 cursor-pointer ${isTopPick ? 'animate-sector-flash' : ''}`}
                    onClick={() => setSelectedSectorId(selectedSectorId === arc.id ? null : arc.id)}
                  />

                  {/* Flashlight Spotlight & Searchlight Beacon for Next Top Sector Pick */}
                  {isTopPick && (
                    <g className="pointer-events-none">
                      {/* Beam ray towards sector center */}
                      <line
                        x1={arc.beaconX}
                        y1={arc.beaconY}
                        x2={center.x + (radiusInner + 5) * Math.cos(arc.midAngle)}
                        y2={center.y + (radiusInner + 5) * Math.sin(arc.midAngle)}
                        stroke="#FFD700"
                        strokeWidth="3"
                        strokeDasharray="4,2"
                        className="animate-pulse"
                      />
                      {/* Flashing Flashlight Beacon */}
                      <circle cx={arc.beaconX} cy={arc.beaconY} r="18" fill="#FFD700" fillOpacity="0.25" className="animate-ping" />
                      <circle cx={arc.beaconX} cy={arc.beaconY} r="13" fill="#09090b" stroke="#FFD700" strokeWidth="2" />
                      <text x={arc.beaconX} y={arc.beaconY + 4} textAnchor="middle" fontSize="12">
                        🔦
                      </text>
                      {/* Flash Badge Label */}
                      <g transform={`translate(${arc.beaconX}, ${arc.beaconY + 20})`}>
                        <rect x="-38" y="-9" width="76" height="18" rx="9" fill="#FFD700" stroke="#000" strokeWidth="1.5" />
                        <text x="0" y="3" textAnchor="middle" fill="#000" fontSize="9" fontWeight="900" letterSpacing="0.5">
                          ⚡ NEXT TOP HIT
                        </text>
                      </g>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Vector Movement Arrow Lines with Step Labels */}
            {vectorLines.map((line) => (
              <g key={line.key}>
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={line.isLatest ? '#FFD700' : '#38bdf8'}
                  strokeWidth={line.strokeWidth}
                  strokeOpacity={line.opacity}
                  markerEnd="url(#vectorArrowHead)"
                  strokeDasharray={line.isLatest ? 'none' : '4,3'}
                />
                {/* Step Index Badge at line midpoint */}
                <g transform={`translate(${line.mx}, ${line.my})`}>
                  <circle
                    r="8"
                    fill="#09090b"
                    stroke={line.isLatest ? '#FFD700' : '#38bdf8'}
                    strokeWidth="1.5"
                    fillOpacity="0.95"
                  />
                  <text
                    y="3"
                    textAnchor="middle"
                    fill={line.isLatest ? '#FFD700' : '#38bdf8'}
                    fontSize="8"
                    fontWeight="900"
                  >
                    {line.stepIndex}
                  </text>
                </g>
              </g>
            ))}

            {/* Center Wheel Hub Badge */}
            <circle cx={center.x} cy={center.y} r={42} fill="#09090b" stroke="#3f3f46" strokeWidth="2" />
            <text x={center.x} y={center.y - 8} textAnchor="middle" fill="#FFD700" fontSize="10" fontWeight="900" letterSpacing="1">
              WHEEL
            </text>
            <text x={center.x} y={center.y + 10} textAnchor="middle" fill="#a1a1aa" fontSize="9" fontWeight="700">
              {splitMode === '0' ? 'FRENCH 0' : `${splitMode} SECTORS`}
            </text>
          </svg>

          {/* HTML Number Nodes Overlay */}
          {EUROPEAN_WHEEL_ORDER.map((num) => {
            const pos = pocketPositions.get(num);
            if (!pos) return null;

            const isLatest = latestSpinNumber === num;
            const isRecent = recentSpins.includes(num);
            const numColor = NUMBER_COLORS[num];
            const assignedSec = numberSectorMap.get(num);

            const isFilteredIn = !selectedSectorId || assignedSec?.id === selectedSectorId;

            // Background class for node
            const bgBg =
              numColor === 'green'
                ? 'bg-roulette-green text-white border-emerald-400'
                : numColor === 'red'
                ? 'bg-roulette-red text-white border-red-400'
                : 'bg-zinc-900 text-white border-zinc-700';

            const lastRecentIdx = recentSpins.lastIndexOf(num);
            const stepTag = lastRecentIdx !== -1 ? (lastRecentIdx === recentSpins.length - 1 ? 'NOW' : `#${lastRecentIdx + 1}`) : null;

            return (
              <button
                key={num}
                onClick={() => {
                  if (assignedSec) {
                    setSelectedSectorId(selectedSectorId === assignedSec.id ? null : assignedSec.id);
                  }
                }}
                className={`absolute w-7 h-7 rounded-full flex items-center justify-center font-black text-xs border shadow-md transition-all duration-300 ${bgBg} ${
                  isLatest ? 'ring-4 ring-gold scale-125 z-30 shadow-gold/50 shadow-lg' : isRecent ? 'ring-2 ring-yellow-400 z-20' : 'z-10'
                } ${!isFilteredIn ? 'opacity-25 scale-90' : 'opacity-100 hover:scale-110'}`}
                style={{
                  top: `${pos.y}px`,
                  left: `${pos.x}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                title={`Number ${num} (${numColor.toUpperCase()}) • ${assignedSec?.name || ''}`}
              >
                {num}
                {stepTag && (
                  <span className={`absolute -top-1.5 -right-1.5 text-[8px] font-black px-1 rounded-full border shadow-sm ${
                    isLatest ? 'bg-gold text-black border-yellow-300 scale-110' : 'bg-sky-500 text-white border-sky-300'
                  }`}>
                    {stepTag}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold text-gray-400 pt-2 border-t border-gray-800/80 w-full">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-roulette-red inline-block" />
            <span>Red</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-700 inline-block" />
            <span>Black</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-roulette-green inline-block" />
            <span>Green 0</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full border-2 border-gold inline-block" />
            <span>Latest Spin</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-0.5 bg-gold inline-block" />
            <span>Vector Line</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gold/10 border border-gold/40 text-gold font-black text-[10px] animate-pulse">
            <span>🔦</span>
            <span>Flashlight Top Sector Hit: <strong className="text-white">{sectors.find(s => s.id === (nextSectorPrediction?.topPick?.sector?.id || nextSectorPrediction?.breakdown?.[0]?.sector?.id || sectors[0]?.id))?.name || 'Top Pick'}</strong></span>
          </div>
        </div>
      </div>

      {/* 1️⃣ Next Sector Predictive Intelligence */}
      {nextSectorPrediction && nextSectorPrediction.latestSec && (
        <div className="bg-zinc-950 p-3 sm:p-4 rounded-2xl border border-gold/40 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg">🎯</span>
              <div>
                <h4 className="text-xs font-black text-gold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="bg-gold text-black text-[9px] px-1.5 py-0.2 rounded font-black">1</span>
                  <span>Next Sector Predictive Intelligence</span>
                </h4>
                <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">
                  Latest Spin: <strong className="text-white">#{nextSectorPrediction.latestSpin}</strong> in <strong className={nextSectorPrediction.latestSec.color}>{nextSectorPrediction.latestSec.name}</strong> • History: <strong className="text-white">{nextSectorPrediction.pastOccurrences} hits</strong>
                </p>
              </div>
            </div>

            {nextSectorPrediction.topPick && nextSectorPrediction.topPick.count > 0 && (
              <div className="bg-gold/10 border border-gold/40 px-3 py-1.5 rounded-xl flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm">🏆</span>
                <div>
                  <div className="text-[9px] text-gray-400 font-extrabold uppercase">Highest Probability Next:</div>
                  <div className={`text-xs font-black ${nextSectorPrediction.topPick.sector.color}`}>
                    {nextSectorPrediction.topPick.sector.name} ({nextSectorPrediction.topPick.probability.toFixed(1)}%) • {nextSectorPrediction.topPick.count} hits
                  </div>
                </div>
              </div>
            )}
          </div>

          {nextSectorPrediction.pastOccurrences === 0 ? (
            <div className="text-[11px] text-gray-400 italic py-3 text-center bg-zinc-900/50 rounded-xl border border-gray-800">
              No prior historical spins starting from {nextSectorPrediction.latestSec.name} recorded yet. Add more spins to calculate next sector probabilities.
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold px-1">
                <span>NEXT SECTOR PROBABILITY AFTER {nextSectorPrediction.latestSec.shortName.toUpperCase()}</span>
                <span>CHANCE %</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {nextSectorPrediction.breakdown.map((item, i) => {
                  const isTop = i === 0 && item.count > 0;
                  return (
                    <div
                      key={item.sector.id}
                      className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                        isTop
                          ? 'bg-gold/15 border-gold/60 shadow-lg ring-1 ring-gold/40'
                          : 'bg-zinc-900/80 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-black ${item.sector.color}`}>
                          {item.sector.name}
                        </span>
                        {isTop && (
                          <span className="text-[8px] font-black uppercase text-black bg-gold px-1.5 py-0.5 rounded shadow">
                            TOP PICK
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-xs font-black text-white">
                          {item.count} <span className="text-[10px] font-medium text-gray-400">hits</span>
                        </span>
                        <span className={`text-xs font-black ${isTop ? 'text-gold' : 'text-sky-400'}`}>
                          {item.probability.toFixed(1)}%
                        </span>
                      </div>

                      {/* Probability Progress Bar */}
                      <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-gray-800">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, item.probability)}%`,
                            backgroundColor: item.sector.fillHex,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2️⃣ Vector Jump Distances & Sector Transitions */}
      {recentJumps.length > 0 && (
        <div className="bg-zinc-950 p-3 sm:p-4 rounded-2xl border border-gray-800 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-gray-800 pb-2">
            <h4 className="text-xs font-black text-gold uppercase tracking-widest flex items-center gap-1.5">
              <span className="bg-gold text-black text-[9px] px-1.5 py-0.2 rounded font-black">2</span>
              <span>Vector Jump Distances & Sector Transitions</span>
            </h4>
            <span className="text-[10px] text-gray-400 font-bold">Last {vectorPathLength} Vector Moves</span>
          </div>

          <div className="overflow-x-auto custom-scrollbar -mx-1 px-1">
            <table className="w-full text-left text-xs font-bold min-w-[500px]">
              <thead>
                <tr className="text-[9px] text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  <th className="py-1.5 px-2">Step</th>
                  <th className="py-1.5 px-2">Transition</th>
                  <th className="py-1.5 px-2">Sector Route</th>
                  <th className="py-1.5 px-2">Jump Step</th>
                  <th className="py-1.5 px-2">Vector Span</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 text-gray-200">
                {recentJumps.map((jump, idx) => {
                  const fromColor = NUMBER_COLORS[jump.fromNum];
                  const toColor = NUMBER_COLORS[jump.toNum];

                  const fromBg =
                    fromColor === 'green'
                      ? 'bg-roulette-green'
                      : fromColor === 'red'
                      ? 'bg-roulette-red'
                      : 'bg-zinc-800 border border-gray-700';

                  const toBg =
                    toColor === 'green'
                      ? 'bg-roulette-green'
                      : toColor === 'red'
                      ? 'bg-roulette-red'
                      : 'bg-zinc-800 border border-gray-700';

                  return (
                    <tr key={jump.id} className={idx === 0 ? 'bg-gold/10' : ''}>
                      <td className="py-2 px-2">
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          idx === 0 ? 'bg-gold text-black' : 'bg-zinc-800 text-sky-400'
                        }`}>
                          {idx === 0 ? 'LATEST' : `#${recentJumps.length - idx}`}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-5 h-5 rounded-full text-[10px] text-white font-black flex items-center justify-center ${fromBg}`}>
                            {jump.fromNum}
                          </span>
                          <span className="text-gray-500">➔</span>
                          <span className={`w-5 h-5 rounded-full text-[10px] text-white font-black flex items-center justify-center ${toBg}`}>
                            {jump.toNum}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <span className={`text-[10px] font-black ${jump.fromSec?.color || 'text-gray-400'}`}>
                          {jump.fromSec?.shortName || '?'}
                        </span>
                        <span className="text-gray-500 mx-1">➔</span>
                        <span className={`text-[10px] font-black ${jump.toSec?.color || 'text-gray-400'}`}>
                          {jump.toSec?.shortName || '?'}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-gold font-black">{jump.label}</span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-[9px] font-black uppercase text-gray-400 bg-zinc-900 px-2 py-0.5 rounded border border-gray-800">
                          {jump.steps <= 6
                            ? '🎯 Short Jump (1-6)'
                            : jump.steps <= 12
                            ? '⚡ Mid Jump (7-12)'
                            : '🚀 Long Jump (13-18)'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3️⃣ Sector-to-Sector Transition Matrix & Hits */}
      {sectorTransitions.transitionList.length > 0 && (
        <div className="bg-zinc-950 p-3 sm:p-4 rounded-2xl border border-gray-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-2">
            <div>
              <h4 className="text-xs font-black text-gold uppercase tracking-widest flex items-center gap-1.5">
                <span className="bg-gold text-black text-[9px] px-1.5 py-0.2 rounded font-black">3</span>
                <span>Sector-to-Sector Transition Matrix & Hits</span>
              </h4>
              <p className="text-[10px] text-gray-400 font-medium">
                Transition frequencies between origin and destination sectors ({sectorTransitions.totalTransitions} total moves)
              </p>
            </div>
            <span className="text-[10px] font-black text-gray-300 bg-zinc-900 px-2.5 py-1 rounded-lg border border-gray-800">
              {sectorTransitions.transitionList.length} Active Routes
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar -mx-1 px-1">
            <table className="w-full text-left text-xs font-bold min-w-[550px]">
              <thead>
                <tr className="text-[9px] text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  <th className="py-2 px-2.5">Origin ➔ Destination Sector</th>
                  <th className="py-2 px-2">Times Hit</th>
                  <th className="py-2 px-2">Origin Exit %</th>
                  <th className="py-2 px-2">% of All Spins</th>
                  <th className="py-2 px-2">Frequency Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 text-gray-200">
                {sectorTransitions.transitionList.map((t, idx) => {
                  const isTopRanked = idx < 3;
                  return (
                    <tr
                      key={`${t.fromSec.id}-${t.toSec.id}`}
                      className={isTopRanked ? 'bg-gold/5' : 'hover:bg-zinc-900/50'}
                    >
                      <td className="py-2.5 px-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-black ${t.fromSec.color}`}>
                            {t.fromSec.name}
                          </span>
                          <span className="text-gray-500 font-black">➔</span>
                          <span className={`text-[11px] font-black ${t.toSec.color}`}>
                            {t.toSec.name}
                          </span>
                          {idx === 0 && (
                            <span className="text-[8px] font-black uppercase text-black bg-gold px-1.5 py-0.5 rounded">
                              🔥 TOP ROUTE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="text-white font-black">{t.count}</span>
                        <span className="text-[10px] text-gray-400 font-normal ml-1">times</span>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="text-sky-400 font-black">{t.sectorPercentage.toFixed(1)}%</span>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="text-gray-300 font-bold">{t.percentage.toFixed(1)}%</span>
                      </td>
                      <td className="py-2.5 px-2 w-32">
                        <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-gray-800">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(100, t.sectorPercentage)}%`,
                              backgroundColor: t.toSec.fillHex,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4️⃣ Sector Heat Breakdown */}
      <div className="bg-zinc-950 p-3 sm:p-4 rounded-2xl border border-gray-800 space-y-3">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <h4 className="text-xs font-black text-gold uppercase tracking-widest flex items-center gap-1.5">
            <span className="bg-gold text-black text-[9px] px-1.5 py-0.2 rounded font-black">4</span>
            <span>Series Heat Breakdown ({sectors.length} Sectors)</span>
          </h4>
          <span className="text-[10px] text-gray-400 font-medium">
            Total Spins: <strong className="text-white">{history.length}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {sectors.map((sec) => {
            const stats = sectorStats.get(sec.id) || {
              count: 0,
              percentage: 0,
              lastHitDistance: null,
              isHot: false,
              isCold: false,
            };

            const isSelected = selectedSectorId === sec.id;

            return (
              <div
                key={sec.id}
                onClick={() => setSelectedSectorId(isSelected ? null : sec.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  sec.bgClass
                } ${sec.borderClass} ${
                  isSelected ? 'ring-2 ring-gold scale-[1.02] shadow-xl' : 'hover:border-gold/50'
                }`}
              >
                {/* Card Header: Sector Name, Badges & Hits */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-black ${sec.color}`}>{sec.name}</span>
                    {stats.isHot && (
                      <span className="text-[9px] font-black uppercase text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40">
                        🔥 HOT
                      </span>
                    )}
                    {stats.isCold && (
                      <span className="text-[9px] font-black uppercase text-blue-300 bg-blue-500/20 px-1.5 py-0.5 rounded border border-blue-500/40">
                        ❄️ COLD
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-white">{stats.count}</span>
                    <span className="text-[10px] text-gray-400 font-bold ml-1">
                      ({stats.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden mb-2 border border-gray-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, stats.percentage * 2)}%`,
                      backgroundColor: sec.fillHex,
                    }}
                  />
                </div>

                {/* Number Badges List */}
                <div className="flex flex-wrap items-center gap-1 my-2">
                  {sec.numbers.map((n) => {
                    const c = NUMBER_COLORS[n];
                    const bg =
                      c === 'green'
                        ? 'bg-roulette-green text-white'
                        : c === 'red'
                        ? 'bg-roulette-red text-white'
                        : 'bg-zinc-900 text-white border border-gray-700';

                    const isHitLatest = latestSpinNumber === n;

                    return (
                      <span
                        key={n}
                        className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${bg} ${
                          isHitLatest ? 'ring-2 ring-gold scale-110 font-black' : ''
                        }`}
                      >
                        {n}
                      </span>
                    );
                  })}
                </div>

                {/* Last Hit Distance Footer */}
                <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 border-t border-gray-800/60 pt-1.5 mt-1">
                  <span>Pockets: {sec.numbers.length}</span>
                  <span>
                    {stats.lastHitDistance === null
                      ? 'No hits yet'
                      : stats.lastHitDistance === 0
                      ? '⚡ Just Hit!'
                      : `Hit ${stats.lastHitDistance} spins ago`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
