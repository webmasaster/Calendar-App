import React, { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';

const NotesPanel = ({ currentMonth, events, notes, selectedNoteDate, startDate, endDate, clearRange, handleNoteChange, handleAddEvent, handleDeleteEvent, holidays }) => {
  const [newEventText, setNewEventText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("📌");
  const [viewMode, setViewMode] = useState('day'); 
  
  useEffect(() => {
    if (selectedNoteDate) setViewMode('day');
  }, [selectedNoteDate]);

  const isRangeSelected = startDate && endDate && !isSameDay(startDate, endDate);

  const dateKey = selectedNoteDate ? format(selectedNoteDate, 'yyyy-MM-dd') : null;
  const monthKey = format(currentMonth, 'yyyy-MM');
  const rangeKey = isRangeSelected ? `${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}` : null;
  
  let activeKey = null;
  if (isRangeSelected) activeKey = rangeKey;
  else if (viewMode === 'month') activeKey = monthKey;
  else activeKey = dateKey;

  const currentEvents = (dateKey && !isRangeSelected) ? (events[dateKey] || []) : [];
  const currentNote = activeKey ? (notes[activeKey] || "") : "";
  
  const holidayName = (dateKey && viewMode === 'day' && !isRangeSelected) ? holidays[dateKey] : null;

  const emojis = ["📌", "🎉", "💼", "✈️", "🎂", "🔔", "❤️"];

  const submitEvent = (e) => {
    e.preventDefault();
    if (newEventText.trim() && dateKey && !isRangeSelected) {
      handleAddEvent(dateKey, newEventText, selectedEmoji);
      setNewEventText("");
    }
  };

  let notePlaceholder = "Select a date...";
  if (isRangeSelected) notePlaceholder = `Note for ${format(startDate, 'd MMM')} \u2013 ${format(endDate, 'd MMM')}...`;
  else if (viewMode === 'month') notePlaceholder = `Note for ${format(currentMonth, 'MMMM')}...`;
  else if (selectedNoteDate) notePlaceholder = `Note for ${format(selectedNoteDate, 'd MMM')}...`;

  return (
    <div className="h-full flex flex-col pt-1 min-h-0">
      {holidayName && viewMode === 'day' && !isRangeSelected && (
        <div className="mb-4 p-3 bg-[#fff0f3] rounded-md border border-[#ffd8e1]">
          <div className="text-[10px] text-[#ff3366] font-bold uppercase tracking-widest mb-1">Public Holiday</div>
          <div className="text-sm font-bold text-[#6a1a2e]">{holidayName}</div>
        </div>
      )}

      <h3 className="text-[13px] font-bold text-[#3b209e] uppercase tracking-[0.25em] mb-4">
        Notes
      </h3>
      
      {isRangeSelected ? (
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2 bg-[#f3eefc] text-[#3b209e] px-4 py-1.5 rounded-full font-bold text-[13px]">
            <span className="text-base">📅</span>
            <span>{format(startDate, 'd MMM')} &ndash; {format(endDate, 'd MMM')}</span>
          </div>
          <button 
            onClick={clearRange} 
            className="px-4 py-1.5 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      ) : (
        <div className="flex space-x-2 mb-4">
          <button 
            onClick={() => setViewMode('month')}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition-colors cursor-pointer ${
              viewMode === 'month' 
                ? 'bg-[#4323a6] text-white shadow-sm' 
                : 'border border-gray-200 text-[#495057] hover:bg-gray-50'
            }`}
          >
            Month
          </button>
          <button 
            onClick={() => selectedNoteDate && setViewMode('day')}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition-colors ${
              !selectedNoteDate ? 'opacity-50 cursor-not-allowed border border-gray-200 text-gray-400' 
              : viewMode === 'day' ? 'bg-[#4323a6] text-white shadow-sm' 
              : 'border border-gray-200 text-[#495057] hover:bg-gray-50 cursor-pointer'
            }`}
          >
            {selectedNoteDate ? format(selectedNoteDate, 'd MMM') : 'Date'}
          </button>
        </div>
      )}

      <div className="flex flex-col flex-1 mb-3 sm:mb-4 transition-all duration-200">
  <textarea 
    value={currentNote}
    onChange={(e) => handleNoteChange(activeKey, e.target.value)}
    placeholder={notePlaceholder}
    disabled={!activeKey}
    className={`w-full flex-1 min-h-[80px] ${
      holidayName ? 'max-h-[140px]' : 'max-h-[220px] overflow-y-auto'
    } 
    resize-none text-sm text-gray-700 
    bg-white/70 backdrop-blur-sm
    outline-none leading-relaxed 
    border border-gray-200 
    rounded-xl p-4 
    shadow-inner
    focus:ring-2 focus:ring-2 focus:ring-[#4323a6]/30 focus:border-[#4323a6]
    transition-all duration-200 
    disabled:opacity-50 disabled:bg-gray-100`}
  />
</div>

      <div className="mt-auto pt-2">
        <h3 className="text-[13px] font-bold text-[#3b209e] uppercase tracking-[0.25em] mb-4">
          Events
        </h3>
        
        {currentEvents.length > 0 && viewMode === 'day' && !isRangeSelected && (
          <ul className="space-y-1.5 mb-3 max-h-[100px] overflow-y-auto">
            {currentEvents.map((ev, idx) => (
              <li key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md border border-gray-100 group">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{ev.emoji}</span>
                  <span className="text-[12px] font-medium text-gray-700">{ev.text}</span>
                </div>
                <button onClick={() => handleDeleteEvent(dateKey, idx)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={submitEvent} className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <select 
              value={selectedEmoji}
              onChange={(e) => setSelectedEmoji(e.target.value)}
              disabled={viewMode === 'month' || !selectedNoteDate || isRangeSelected}
              className="bg-gray-50 border border-gray-200 rounded-md px-1 text-xs outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emojis.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <input 
              type="text" 
              value={newEventText}
              onChange={(e) => setNewEventText(e.target.value)}
              placeholder={isRangeSelected ? "Select single date" : (viewMode === 'month' ? "Select a date to add event" : "Event name...")}
              disabled={viewMode === 'month' || !selectedNoteDate || isRangeSelected}
              className="flex-grow bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4323a6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button 
            type="submit" 
            disabled={!newEventText.trim() || viewMode === 'month' || !selectedNoteDate || isRangeSelected}
            className={`w-full py-2.5 rounded-md text-[12px] font-bold transition-all ${
              !newEventText.trim() || viewMode === 'month' || !selectedNoteDate || isRangeSelected
                ? 'bg-[#d1d5db] text-white cursor-not-allowed' 
                : 'bg-[#ced4da] text-gray-800 cursor-pointer hover:bg-black hover:text-white'
            }`}
          >
            Save Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotesPanel;