import React from 'react';
import type { ToastData } from '../types';
import { NUMBER_COLORS } from '../constants';

const colorClasses = {
    red: 'bg-roulette-red text-white',
    black: 'bg-roulette-black text-white',
    green: 'bg-roulette-green text-white',
};

const NumberChip: React.FC<{ num: number }> = ({ num }) => (
    <div className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] leading-none ${colorClasses[NUMBER_COLORS[num]]}`}>
      {num}
    </div>
);

export const Toast: React.FC<{ data: ToastData, onRemove: (id: number) => void }> = ({ data, onRemove }) => {
    const { id, trigger, predictions } = data;
    
    return (
        <div className="bg-gray-800 border border-gold text-white p-1.5 rounded-md shadow-lg w-full relative animate-fade-in">
             <button 
              onClick={() => onRemove(id)} 
              className="absolute top-0.5 right-0.5 text-gray-400 hover:text-white"
              aria-label="Close alert"
            >
              <CloseIcon />
            </button>
            <div className="flex items-start space-x-1.5">
                <div className="flex-shrink-0 pt-0.5">
                    <div className="bg-gold p-0.5 rounded-full">
                       <BellIcon />
                    </div>
                </div>
                <div className="flex-1 pr-3">
                    <p className="font-bold text-gold text-xs">Pattern Alert</p>
                    <div className="flex items-center space-x-1 mt-0.5">
                        <span className="text-[10px] text-gray-300">After</span>
                        {trigger.map((num, i) => <NumberChip key={`${num}-${i}`} num={num} />)}
                        <span className="text-[10px] text-gray-300">look for:</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                        {predictions.map((pred, i) => (
                            <div key={i} className="flex items-center space-x-0.5 bg-gray-700 px-1 py-0.5 rounded-sm">
                                {pred.map((num, j) => <NumberChip key={`${num}-${j}`} num={num} />)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ToastContainer: React.FC<{ toasts: ToastData[], onRemoveToast: (id: number) => void }> = ({ toasts, onRemoveToast }) => {
    if (toasts.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-4">No active alerts.</p>;
    }

    const leftColumnToasts = toasts.filter((_, index) => index % 2 === 0);
    const rightColumnToasts = toasts.filter((_, index) => index % 2 === 1);

    return (
        <div className="grid grid-cols-2 gap-2 max-h-48 md:max-h-80 overflow-y-auto pr-2">
            <div className="space-y-2">
                {leftColumnToasts.map(toast => (
                    <Toast key={toast.id} data={toast} onRemove={onRemoveToast} />
                ))}
            </div>
            <div className="space-y-2">
                {rightColumnToasts.map(toast => (
                    <Toast key={toast.id} data={toast} onRemove={onRemoveToast} />
                ))}
            </div>
        </div>
    );
};

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
    </svg>
);