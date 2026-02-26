import React, { useMemo } from 'react';
import { NUMBER_COLORS, EUROPEAN_WHEEL_ORDER } from '../constants';

interface RouletteWheelTrackerProps {
  history: number[];
}

const colorClasses = {
  red: 'bg-roulette-red text-white',
  black: 'bg-roulette-black text-white',
  green: 'bg-roulette-green text-white',
};

export const RouletteWheelTracker: React.FC<RouletteWheelTrackerProps> = ({ history }) => {
    const recentSpins = useMemo(() => history.slice(-6), [history]); // Track last 6 spins for 5 lines

    const { positions, lines } = useMemo(() => {
        const radius = 130;
        const size = (radius * 2) + 40;
        const center = { x: size / 2, y: size / 2 };
        
        const posMap = new Map<number, { x: number, y: number }>();
        
        EUROPEAN_WHEEL_ORDER.forEach((num, index) => {
            const angle = (index / EUROPEAN_WHEEL_ORDER.length) * 2 * Math.PI - (Math.PI / 2); // start at top
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            posMap.set(num, { x, y });
        });

        const lineData = [];
        if (recentSpins.length > 1) {
            for (let i = 1; i < recentSpins.length; i++) {
                const startNum = recentSpins[i - 1];
                const endNum = recentSpins[i];
                const startPos = posMap.get(startNum);
                const endPos = posMap.get(endNum);
                const isLastLine = i === recentSpins.length - 1;

                if (startPos && endPos) {
                    lineData.push({
                        key: `line-${i}`,
                        x1: startPos.x,
                        y1: startPos.y,
                        x2: endPos.x,
                        y2: endPos.y,
                        opacity: isLastLine ? 1 : (i / (recentSpins.length - 1)) * 0.7 + 0.2,
                        strokeWidth: isLastLine ? 3 : 2,
                    });
                }
            }
        }
        return { positions: posMap, lines: lineData };
    }, [recentSpins]);
    
    if (history.length === 0) {
      return <p className="text-center text-gray-500 dark:text-gray-400 py-4">No data to display.</p>;
    }

    const radius = 130;
    const size = (radius * 2) + 40;

    return (
      <div className="p-2 flex justify-center items-center h-80">
          <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
              <svg 
                className="absolute top-0 left-0 w-full h-full" 
                viewBox={`0 0 ${size} ${size}`}
                style={{ pointerEvents: 'none' }}
              >
                  <defs>
                      <marker
                          id="arrowhead"
                          markerWidth="12"
                          markerHeight="8"
                          refX="9"
                          refY="4"
                          orient="auto"
                          markerUnits="strokeWidth">
                          <path d="M0,0 L12,4 L0,8 Z" fill="#FFD700" />
                      </marker>
                  </defs>
                  {lines.map(line => (
                      <line
                          key={line.key}
                          x1={line.x1}
                          y1={line.y1}
                          x2={line.x2}
                          y2={line.y2}
                          stroke="#FFD700"
                          strokeWidth={line.strokeWidth}
                          strokeOpacity={line.opacity}
                          markerEnd="url(#arrowhead)"
                      />
                  ))}
              </svg>

              {EUROPEAN_WHEEL_ORDER.map((num) => {
                  const pos = positions.get(num);
                  if (!pos) return null;
                  
                  const isRecentHit = recentSpins.includes(num);
                  
                  return (
                      <div
                          key={num}
                          className={`absolute w-9 h-9 rounded-full flex items-center justify-center font-bold text-base shadow-md transition-all duration-300 ease-out ${colorClasses[NUMBER_COLORS[num]]} ${isRecentHit ? 'ring-2 ring-gold' : ''}`}
                          style={{
                              top: `${pos.y}px`,
                              left: `${pos.x}px`,
                              transform: 'translate(-50%, -50%)',
                              zIndex: isRecentHit ? 10 : 1,
                          }}
                      >
                          {num}
                      </div>
                  );
              })}
          </div>
      </div>
    );
};