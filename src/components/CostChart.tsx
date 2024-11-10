import React from 'react';
import { SimCard } from '../types';

interface CostChartProps {
  simCards: SimCard[];
}

export function CostChart({ simCards }: CostChartProps) {
  const totalCost = simCards.reduce((sum, card) => sum + card.monthlyCost, 0);
  
  return (
    <div className="space-y-4">
      {simCards.map((card) => {
        const percentage = (card.monthlyCost / totalCost) * 100;
        
        return (
          <div key={card.id} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{card.number}</span>
              <span className="text-gray-900 font-medium">{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
      
      {simCards.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          أضف شرائح لعرض تحليل التكاليف
        </div>
      )}
    </div>
  );
}