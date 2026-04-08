import { useState, useEffect } from 'react';
import { addMonths, subMonths, isBefore, getYear, setYear } from 'date-fns';
import { monthColors, monthThemes, getFallbackHolidays } from '../utils/dateUtils';

export const useCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2018, 0, 1)); 
  const [direction, setDirection] = useState(0); 
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [selectedNoteDate, setSelectedNoteDate] = useState(new Date(2018, 0, 5)); 
  const [events, setEvents] = useState({});
  const [notes, setNotes] = useState({});
  const [holidays, setHolidays] = useState({});

  // ✅ ONLY fallback holidays (no API)
  useEffect(() => {
    const year = getYear(currentMonth);
    setHolidays(getFallbackHolidays(year));
  }, [currentMonth]);

  // 💾 Load from localStorage
  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem('calendar_events');
      if (savedEvents) setEvents(JSON.parse(savedEvents));

      const savedNotes = localStorage.getItem('calendar_notes');
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    } catch (e) {
      localStorage.removeItem('calendar_events');
      localStorage.removeItem('calendar_notes');
    }
  }, []);

  // 💾 Save to localStorage
  useEffect(() => {
    localStorage.setItem('calendar_events', JSON.stringify(events));
    localStorage.setItem('calendar_notes', JSON.stringify(notes));
  }, [events, notes]);

  // 🎨 THEME LOGIC
  const month = currentMonth.getMonth();

  const baseTheme = monthThemes.find(t => t.month === month) || monthThemes[0];

  const day = selectedNoteDate 
    ? selectedNoteDate.getDate() 
    : new Date().getDate();

  const imageIndex = day % baseTheme.images.length;
  const themeColor = monthColors[month];

  const theme = {
    ...baseTheme,
    image: baseTheme.images[imageIndex],
    variation: day % 3,
    color: themeColor
  };

  // 📅 Navigation
  const nextMonth = () => { 
    setDirection(1); 
    setCurrentMonth(addMonths(currentMonth, 1)); 
    setSelectedNoteDate(null); 
  };
  
  const prevMonth = () => { 
    setDirection(-1); 
    setCurrentMonth(subMonths(currentMonth, 1)); 
    setSelectedNoteDate(null); 
  };
  
  const handleYearChange = (year) => {
    setCurrentMonth(setYear(currentMonth, year));
    setSelectedNoteDate(null); 
  };

  // 🖱️ Drag selection
  const handleMouseDown = (day) => {
    setIsDragging(true);
    setStartDate(day);
    setEndDate(null);
    setSelectedNoteDate(day); 
  };

  const handleMouseEnterDrag = (day) => { 
    if (isDragging) setHoverDate(day); 
  };

  const handleMouseUp = (day) => {
    if (isDragging) {
      setIsDragging(false);
      if (startDate && isBefore(day, startDate)) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  // 🧹 Clear range
  const clearRange = () => {
    setStartDate(null);
    setEndDate(null);
  };

  // 📝 Notes & Events
  const handleNoteChange = (dateKey, text) => 
    setNotes(prev => ({ ...prev, [dateKey]: text }));

  const handleAddEvent = (dateKey, text, emoji) => {
    if (!text.trim()) return;
    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), { text, emoji }]
    }));
  };

  const handleDeleteEvent = (dateKey, index) => {
    setEvents(prev => {
      const newEvents = [...(prev[dateKey] || [])];
      newEvents.splice(index, 1);
      return { ...prev, [dateKey]: newEvents };
    });
  };

  return {
    currentMonth,
    direction,
    startDate,
    endDate,
    hoverDate,
    events,
    notes,
    selectedNoteDate,
    setSelectedNoteDate,
    handleNoteChange,
    handleAddEvent,
    handleDeleteEvent,
    theme,
    nextMonth,
    prevMonth,
    handleYearChange,
    holidays,
    handleMouseDown,
    handleMouseEnterDrag,
    handleMouseUp,
    clearRange
  };
};