import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MonthNavigation = ({ currentMonth, prevMonth, nextMonth, showYearView, setShowYearView }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded transition-all active:scale-95">
        <ChevronLeft className="w-4 h-4 text-gray-500" />
      </button>

      <button 
        onClick={() => setShowYearView(!showYearView)}
        className="text-xl font-black uppercase tracking-[0.2em] text-[#1e2330] hover:text-[#4323a6] transition-colors cursor-pointer px-4 py-1 rounded-lg hover:bg-gray-50"
        title="View all months"
      >
        {format(currentMonth, 'MMMM')}
      </button>

      <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded transition-all active:scale-95">
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

export default MonthNavigation;