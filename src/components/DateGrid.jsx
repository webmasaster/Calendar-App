import React from 'react';
import { format, startOfWeek, addDays, isSameMonth, isSameDay, isBefore, isAfter, isWithinInterval, startOfMonth, parseISO, setMonth } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { getDaysInMonthGrid } from '../utils/dateUtils';

const DateGrid = ({
  currentMonth, direction, startDate, endDate, hoverDate, notes,
  handleMouseDown, handleMouseEnterDrag, handleMouseUp, setSelectedNoteDate, holidays, theme,
  showYearView, handleMonthSelect, handleMoveNote
}) => {
  const weekStart = startOfWeek(currentMonth, { weekStartsOn: 1 });
  const gridDays = getDaysInMonthGrid(currentMonth);
  const monthStart = startOfMonth(currentMonth);

  const flipVariants = {
    enter: (dir) => ({ rotateY: dir > 0 ? 90 : -90, opacity: 0 }),
    center: { rotateY: 0, opacity: 1 },
    exit: (dir) => ({ rotateY: dir < 0 ? 90 : -90, opacity: 0 })
  };

  const handleDrop = (e, dateString) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData('noteId');
    if (noteId) {
      handleMoveNote(noteId, dateString);
      setSelectedNoteDate(new Date(dateString)); // Auto select the new date
    }
  };

  // 🗓️ 12-Month Overview View
  if (showYearView) {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return (
      <div className="relative min-h-[250px]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-3 gap-3 h-full content-start">
          {months.map((m) => {
            const tempDate = setMonth(currentMonth, m);
            const isCurrent = m === currentMonth.getMonth();
            return (
              <button
                key={m} onClick={() => handleMonthSelect(m)}
                className={`py-4 rounded-xl text-sm font-bold transition-all hover:scale-105 cursor-pointer
                  ${isCurrent ? 'bg-[#4323a6] text-white shadow-lg' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                {format(tempDate, 'MMM')}
              </button>
            );
          })}
        </motion.div>
      </div>
    );
  }

  // 📅 Standard Daily Grid
  return (
    <div className="overflow-hidden">
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
            key={currentMonth.toString()} custom={direction} variants={flipVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }} style={{ transformStyle: "preserve-3d" }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const el = document.elementFromPoint(touch.clientX, touch.clientY);
              if (el?.dataset?.date) handleMouseDown(new Date(el.dataset.date));
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              const el = document.elementFromPoint(touch.clientX, touch.clientY);
              if (el?.dataset?.date) handleMouseEnterDrag(new Date(el.dataset.date));
            }}
            onTouchEnd={(e) => {
              const touch = e.changedTouches[0];
              const el = document.elementFromPoint(touch.clientX, touch.clientY);
              if (el?.dataset?.date) handleMouseUp(new Date(el.dataset.date));
            }}
            className="grid grid-cols-7 gap-y-3 gap-x-1 sm:gap-x-1.5 touch-none"
          >
            {gridDays.map((day) => {
              const formattedDate = format(day, 'd');
              const dateString = format(day, 'yyyy-MM-dd');

              const isStart = startDate && isSameDay(day, startDate);
              const isEnd = endDate && isSameDay(day, endDate);
              const isHovering = hoverDate && startDate && !endDate && (isBefore(day, hoverDate) || isSameDay(day, hoverDate)) && isAfter(day, startDate);
              const inRange = (startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate })) || isHovering;
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isHoliday = !!holidays[dateString];
              const isToday = isSameDay(day, new Date());
              
              const hasSingleNote = notes.some(note => note.dateKey === dateString && note.text.trim() !== "");
              const hasRangeNote = notes.some(note => {
                if (note.text.trim() === "" || !note.dateKey.includes('_')) return false;
                const [s, e] = note.dateKey.split('_');
                try { return isWithinInterval(day, { start: parseISO(s), end: parseISO(e) }); } 
                catch { return false; }
              });

              const dayEvents = notes.filter(n => n.dateKey === dateString && n.isEvent);

              let textColor = 'text-[#1e2330]';
              if (!isCurrentMonth) textColor = 'text-gray-300 font-medium';
              else if (isStart || isEnd) textColor = 'text-white';
              else if (isHoliday) textColor = 'text-red-500';

              return (
                <div
                  key={day.toString()} data-date={dateString}
                  onMouseDown={() => handleMouseDown(day)} onMouseEnter={() => handleMouseEnterDrag(day)} onMouseUp={() => handleMouseUp(day)} onClick={() => setSelectedNoteDate(day)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, dateString)}
                  style={{
                    ...(isStart || isEnd ? { backgroundColor: theme.color } : {}),
                    ...(isToday && !isStart && !isEnd ? { boxShadow: `0 0 0 2px ${theme.color}` } : {}),
                    ...(inRange && !isStart && !isEnd ? { backgroundColor: `${theme.color}20` } : {})
                  }}
                  className={`
                    relative flex justify-center items-center h-11 w-11 sm:h-10 sm:w-10 md:h-9 md:w-9 mx-auto cursor-pointer text-xs font-bold transition-all duration-150 active:scale-95 rounded-lg
                    ${textColor}
                    ${!isStart && !isEnd && isCurrentMonth ? 'hover:bg-gray-100' : ''}
                    ${isStart || isEnd ? 'shadow-[0_8px_20px_rgba(0,0,0,0.3)] scale-105' : ''}
                    ${isHoliday && !isStart && !isEnd ? 'bg-red-50/70 hover:bg-red-100' : ''}
                  `}
                >
                  <span className={`pointer-events-none z-20 flex items-center justify-center w-7 h-7 rounded-full transition-colors ${hasSingleNote && !isStart && !isEnd ? 'bg-blue-50 text-blue-600' : ''}`}>
                    {formattedDate}
                  </span>

                  {dayEvents.length > 0 && !isStart && !isEnd && (
                    <div className="absolute bottom-1 flex space-x-px z-30 text-[9px] opacity-100">
                      {dayEvents.slice(0, 2).map((ev, i) => (
                        <span key={i} className="drop-shadow-sm">{ev.emoji}</span>
                      ))}
                    </div>
                  )}

                  {hasRangeNote && !isStart && !isEnd && (
                    <div className="absolute bottom-[2px] w-3.5 h-1 bg-[#8b5cf6] rounded-full z-30 opacity-80" />
                  )}

                  {isHoliday && !isStart && !isEnd && (
                    <div className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] z-30" />
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