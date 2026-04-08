import React from 'react';
import { format, getYear } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MonthNavigation = ({ currentMonth, prevMonth, nextMonth, handleYearChange }) => {
  const years = Array.from({ length: 21 }, (_, i) => 2010 + i);
  
  return (
    <div className="flex items-center justify-between mb-8">
      <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded transition-all active:scale-95">
        <ChevronLeft className="w-4 h-4 text-gray-500" />
      </button>

      <div className="flex flex-col items-center">
        <div className="text-xl font-black uppercase tracking-[0.2em] text-[#1e2330]">
          {format(currentMonth, 'MMMM')}
        </div>
        <div className="mt-1 relative group">
          <select
            value={getYear(currentMonth)}
            onChange={(e) => handleYearChange(parseInt(e.target.value))}
            className="appearance-none outline-none cursor-pointer text-[10px] font-bold px-3 py-0.5 rounded-full bg-[#1e2330] text-white hover:bg-slate-700 transition-colors text-center"
          >
            {years.map(y => <option key={y} value={y} className="text-gray-800 bg-white">{y}</option>)}
          </select>
        </div>
      </div>

      <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded transition-all active:scale-95">
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

export default MonthNavigation;