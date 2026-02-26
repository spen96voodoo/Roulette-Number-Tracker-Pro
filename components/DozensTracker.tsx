import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DozensTrackerProps {
  history: number[];
}

const COLORS = {
  'Zero': '#2E7D32',
  '1-12': '#C62828',
  '13-24': '#121212',
  '25-36': '#B71C1C', // a slightly different red to distinguish
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: { percentage } } = payload[0];
      return (
        <div className="bg-gray-700/80 p-2 rounded-md text-white text-sm border border-gray-600">
          <p>{`${name}: ${value} hits (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
};

export const DozensTracker: React.FC<DozensTrackerProps> = ({ history }) => {
  const { data, total } = useMemo(() => {
    const counts = { 'Zero': 0, '1-12': 0, '13-24': 0, '25-36': 0 };
    history.forEach(num => {
      if (num === 0) counts['Zero']++;
      else if (num >= 1 && num <= 12) counts['1-12']++;
      else if (num >= 13 && num <= 24) counts['13-24']++;
      else if (num >= 25 && num <= 36) counts['25-36']++;
    });
    
    const total = history.length;
    const chartData = Object.entries(counts).map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? ((value / total) * 100).toFixed(1) : '0.0',
    })).filter(d => d.value > 0);

    return { data: chartData, total };
  }, [history]);

  if (total === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-4">No data to display.</p>;
  }
  
  return (
    <div className="w-full h-40 flex items-center">
        <ResponsiveContainer width="50%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={3}
                    fill="#8884d8"
                >
                    {data.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
        <div className="w-1/2 pl-4">
            <Legend
                layout="vertical"
                verticalAlign="middle"
                align="left"
                iconSize={10}
                formatter={(value, entry) => {
                    const { color, payload } = entry;
                    return (
                      <span className="text-gray-700 dark:text-gray-300 text-xs">
                        <span style={{ color }}>{value}: </span>
                        {`${payload?.value} (${payload?.percentage}%)`}
                      </span>
                    );
                }}
            />
        </div>
    </div>
  );
};
