import React from 'react';
import HeroSection from './HeroSection';
import MonthNavigation from './MonthNavigation';
import DateGrid from './DateGrid';
import NotesPanel from './NotesPanel';
import { useCalendar } from '../hooks/useCalendar';

const CalendarWidget = () => {
  const {
    currentMonth, direction, startDate, endDate, hoverDate,
    notes, selectedNoteDate, setSelectedNoteDate,
    handleAddNote, handleUpdateNote, handleDeleteNote, handleMoveNote,
    theme, nextMonth, prevMonth, handleYearChange, holidays,
    handleMouseDown, handleMouseEnterDrag, handleMouseUp, clearRange,
    showYearView, setShowYearView, handleMonthSelect
  } = useCalendar();

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[900px] bg-white shadow-[16px_16px_35px_rgba(0,0,0,0.45)] md:rounded-2xl rounded-xl relative font-sans flex flex-col select-none overflow-hidden">
        
        <HeroSection theme={theme} currentMonth={currentMonth} handleYearChange={handleYearChange} />

        <div className="flex flex-col md:flex-row px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 bg-white min-h-[460px] md:h-[460px]">
          <div className="w-full md:w-[35%] md:pr-8 md:border-r border-gray-100 mb-6 md:mb-0 order-2 md:order-1 mt-4 md:mt-0">
            <NotesPanel
              currentMonth={currentMonth} notes={notes} selectedNoteDate={selectedNoteDate}
              startDate={startDate} endDate={endDate} clearRange={clearRange}
              handleAddNote={handleAddNote} handleUpdateNote={handleUpdateNote} handleDeleteNote={handleDeleteNote}
              holidays={holidays}
            />
          </div>

          <div className="w-full md:w-[65%] md:pl-10 flex flex-col pt-1 order-1 md:order-2">
            <MonthNavigation 
              currentMonth={currentMonth} prevMonth={prevMonth} nextMonth={nextMonth} 
              showYearView={showYearView} setShowYearView={setShowYearView}
            />
            <DateGrid 
              currentMonth={currentMonth} direction={direction} startDate={startDate} endDate={endDate} hoverDate={hoverDate}
              notes={notes} handleMouseDown={handleMouseDown} handleMouseEnterDrag={handleMouseEnterDrag}
              handleMouseUp={handleMouseUp} setSelectedNoteDate={setSelectedNoteDate} holidays={holidays} theme={theme}
              showYearView={showYearView} handleMonthSelect={handleMonthSelect} handleMoveNote={handleMoveNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;