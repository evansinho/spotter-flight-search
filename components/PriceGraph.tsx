'use client';

import { useMemo } from 'react';
import { FlightOffer } from '@/types/flight';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface PriceGraphProps {
  flights: FlightOffer[];
  currency?: string;
}

interface PriceBin {
  range: string;
  count: number;
  minPrice: number;
  maxPrice: number;
  color: string;
}

export function PriceGraph({ flights, currency = 'EUR' }: PriceGraphProps) {
  const priceData = useMemo(() => {
    if (!flights || flights.length === 0) return [];

    // Extract all prices
    const prices = flights.map(f => parseFloat(f.price.total));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Calculate bin size (aim for 5-8 bins)
    const binCount = Math.min(8, Math.max(5, Math.ceil(flights.length / 10)));
    const binSize = Math.ceil((maxPrice - minPrice) / binCount);

    // Create bins
    const bins: PriceBin[] = [];
    for (let i = 0; i < binCount; i++) {
      const binMin = minPrice + (i * binSize);
      const binMax = i === binCount - 1 ? maxPrice : binMin + binSize;

      const count = prices.filter(p => p >= binMin && p <= binMax).length;

      // Color coding based on relative price
      let color = '#10b981'; // green - affordable
      if (i >= binCount * 0.66) {
        color = '#ef4444'; // red - expensive
      } else if (i >= binCount * 0.33) {
        color = '#f59e0b'; // yellow/orange - moderate
      }

      bins.push({
        range: `${Math.floor(binMin)}-${Math.floor(binMax)}`,
        count,
        minPrice: binMin,
        maxPrice: binMax,
        color,
      });
    }

    return bins;
  }, [flights]);

  if (!flights || flights.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">
            {currency} {data.range}
          </p>
          <p className="text-sm text-gray-600">
            {data.count} flight{data.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Price Distribution</h3>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={priceData} margin={{ top: 10, right: 5, left: -5, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="range"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={{ stroke: '#e5e7eb' }}
            label={{ value: `Price (${currency})`, position: 'bottom', offset: 0, style: { fill: '#6b7280', fontSize: 11 } }}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={{ stroke: '#e5e7eb' }}
            label={{ value: 'Number of Flights', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 11 } }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} animationDuration={500}>
            {priceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-green-500"></div>
          <span className="text-gray-600">Affordable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-orange-500"></div>
          <span className="text-gray-600">Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-red-500"></div>
          <span className="text-gray-600">Expensive</span>
        </div>
      </div>
    </div>
  );
}