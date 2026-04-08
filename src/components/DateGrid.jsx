import React from 'react';
import {
  format,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isBefore,
  isAfter,
  isWithinInterval,
  startOfMonth
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { getDaysInMonthGrid } from '../utils/dateUtils';

const DateGrid = ({
  currentMonth,
  direction,
  startDate,
  endDate,
  hoverDate,
  events,
  notes,
  handleMouseDown,
  handleMouseEnterDrag,
  handleMouseUp,
  setSelectedNoteDate,
  holidays,
  theme
}) => {
  const weekStart = startOfWeek(currentMonth, { weekStartsOn: 1 });
  const gridDays = getDaysInMonthGrid(currentMonth);
  const monthStart = startOfMonth(currentMonth);

  const flipVariants = {
    enter: (dir) => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0
    }),
    center: {
      rotateY: 0,
      opacity: 1
    },
    exit: (dir) => ({
      rotateY: dir < 0 ? 90 : -90,
      opacity: 0
    })
  };

  return (
    <div className="overflow-hidden">
      {/* Week Labels */}
      <div className="grid grid-cols-7 mb-4">
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="text-center text-[9px] font-bold uppercase tracking-widest text-gray-400">
            {format(addDays(weekStart, i), 'EEE')}
          </div>
        ))}
      </div>

      <div className="relative min-h-[250px] perspective-[1200px]">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentMonth.toString()}
            custom={direction}
            variants={flipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}

            /* 🔥 MOBILE TOUCH HANDLING (FIXED) */
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const el = document.elementFromPoint(touch.clientX, touch.clientY);
              if (el?.dataset?.date) {
                handleMouseDown(new Date(el.dataset.date));
              }
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              const el = document.elementFromPoint(touch.clientX, touch.clientY);
              if (el?.dataset?.date) {
                handleMouseEnterDrag(new Date(el.dataset.date));
              }
            }}
            onTouchEnd={(e) => {
              const touch = e.changedTouches[0];
              const el = document.elementFromPoint(touch.clientX, touch.clientY);
              if (el?.dataset?.date) {
                handleMouseUp(new Date(el.dataset.date));
              }
            }}

            className="grid grid-cols-7 gap-y-3 gap-x-1 sm:gap-x-1.5 touch-none"
          >
            {gridDays.map((day) => {
              const formattedDate = format(day, 'd');
              const dateString = format(day, 'yyyy-MM-dd');

              const isStart = startDate && isSameDay(day, startDate);
              const isEnd = endDate && isSameDay(day, endDate);

              const isHovering =
                hoverDate &&
                startDate &&
                !endDate &&
                (isBefore(day, hoverDate) || isSameDay(day, hoverDate)) &&
                isAfter(day, startDate);

              const inRange =
                (startDate &&
                  endDate &&
                  isWithinInterval(day, { start: startDate, end: endDate })) ||
                isHovering;

              const isCurrentMonth = isSameMonth(day, monthStart);
              const isHoliday = !!holidays[dateString];
              const isToday = isSameDay(day, new Date());

              const dayEvents = events[dateString] || [];
              const hasNote = !!notes?.[dateString]?.trim();

              let textColor = 'text-[#1e2330]';
              if (!isCurrentMonth) textColor = 'text-gray-300 font-medium';
              else if (isStart || isEnd) textColor = 'text-white';
              else if (isHoliday) textColor = 'text-red-500';

              return (
                <div
                  key={day.toString()}
                  data-date={dateString}

                  onMouseDown={() => handleMouseDown(day)}
                  onMouseEnter={() => handleMouseEnterDrag(day)}
                  onMouseUp={() => handleMouseUp(day)}
                  onClick={() => setSelectedNoteDate(day)}

                  style={{
                    ...(isStart || isEnd
                      ? { backgroundColor: theme.color }
                      : {}),
                    ...(isToday && !isStart && !isEnd
                      ? { boxShadow: `0 0 0 2px ${theme.color}` }
                      : {}),
                    ...(inRange && !isStart && !isEnd
                      ? { backgroundColor: `${theme.color}20` }
                      : {})
                  }}

                  className={`
                    relative flex justify-center items-center 
                    h-11 w-11 sm:h-10 sm:w-10 md:h-9 md:w-9 
                    mx-auto cursor-pointer text-xs font-bold 
                    transition-all duration-150 active:scale-95 rounded-lg
                    ${textColor}
                    ${!isStart && !isEnd && isCurrentMonth ? 'hover:bg-gray-100' : ''}
                    ${isStart || isEnd ? 'shadow-[0_8px_20px_rgba(0,0,0,0.3)] scale-105' : ''}
                    ${isHoliday && !isStart && !isEnd ? 'bg-red-50/70 hover:bg-red-100' : ''}
                  `}
                >
                  {/* 🔥 IMPORTANT FIX */}
                  <span className={`pointer-events-none z-20 flex items-center justify-center w-7 h-7 rounded-full transition-colors ${hasNote && !isStart && !isEnd ? 'bg-blue-50 text-blue-600' : ''}`}>
                    {formattedDate}
                  </span>

                  {/* Holiday Glow */}
                  {isHoliday && !isStart && !isEnd && (
                    <div className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] z-30" />
                  )}

                  {/* Events */}
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-0.5 flex space-x-px z-30 text-[8px]">
                      {dayEvents.slice(0, 2).map((ev, i) => (
                        <span key={i}>{ev.emoji}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DateGrid;