
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StatsDashboardProps {
  stats: { red: number; black: number; green: number };
  totalSpins: number;
}

const COLORS = {
  red: '#C62828',
  black: '#121212',
  green: '#2E7D32',
};

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats, totalSpins }) => {
  const data = [
    { name: 'Red', value: stats.red },
    { name: 'Black', value: stats.black },
    { name: 'Green', value: stats.green },
  ].filter(entry => entry.value > 0);

  if (totalSpins === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400">No data to display.</p>;
  }

  return (
    <div className="w-full h-48 sm:h-52">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.9)', 
              borderColor: '#4b5563',
              borderRadius: '0.5rem'
            }}
            itemStyle={{ color: '#e5e7eb' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
