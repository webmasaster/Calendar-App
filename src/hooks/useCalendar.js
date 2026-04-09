import { useState, useEffect } from 'react';
import { addMonths, subMonths, isBefore, getYear, setYear, setMonth } from 'date-fns';
import { monthColors, monthThemes, getFallbackHolidays } from '../utils/dateUtils';

export const useCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2018, 0, 1)); 
  const [direction, setDirection] = useState(0); 
  const [showYearView, setShowYearView] = useState(false);
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [selectedNoteDate, setSelectedNoteDate] = useState(new Date(2018, 0, 5)); 
  const [notes, setNotes] = useState([]);
  const [holidays, setHolidays] = useState({});

  useEffect(() => {
    const year = getYear(currentMonth);
    setHolidays(getFallbackHolidays(year));
  }, [currentMonth]);

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('calendar_notes');
      if (savedNotes) {
        const parsed = JSON.parse(savedNotes);
        if (!Array.isArray(parsed) && typeof parsed === 'object') {
          const migrated = Object.entries(parsed).map(([dateKey, text]) => ({
            id: Math.random().toString(36).substr(2, 9),
            dateKey, text, isEvent: false, emoji: '📌'
          }));
          setNotes(migrated);
        } else {
          setNotes(parsed || []);
        }
      }
    } catch (e) {
      localStorage.removeItem('calendar_notes');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar_notes', JSON.stringify(notes));
  }, [notes]);

  const month = currentMonth.getMonth();
  const baseTheme = monthThemes.find(t => t.month === month) || monthThemes[0];
  const day = selectedNoteDate ? selectedNoteDate.getDate() : new Date().getDate();
  const imageIndex = day % baseTheme.images.length;
  const themeColor = monthColors[month];

  const theme = {
    ...baseTheme,
    image: baseTheme.images[imageIndex],
    variation: day % 3,
    color: themeColor
  };

  const nextMonth = () => { 
    setDirection(1); setCurrentMonth(addMonths(currentMonth, 1)); setSelectedNoteDate(null); 
  };
  const prevMonth = () => { 
    setDirection(-1); setCurrentMonth(subMonths(currentMonth, 1)); setSelectedNoteDate(null); 
  };
  const handleYearChange = (year) => {
    setCurrentMonth(setYear(currentMonth, year)); setSelectedNoteDate(null); 
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentMonth(setMonth(currentMonth, monthIndex));
    setShowYearView(false);
    setSelectedNoteDate(null);
  };

  const handleMouseDown = (day) => {
    setIsDragging(true); setStartDate(day); setEndDate(null); setSelectedNoteDate(day); 
  };
  const handleMouseEnterDrag = (day) => { if (isDragging) setHoverDate(day); };
  const handleMouseUp = (day) => {
    if (isDragging) {
      setIsDragging(false);
      if (startDate && isBefore(day, startDate)) {
        setEndDate(startDate); setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  const clearRange = () => { setStartDate(null); setEndDate(null); };

  const handleAddNote = (dateKey, text, isEvent = false, emoji = '📌') => {
    const newNote = { id: Date.now().toString(), dateKey, text, isEvent, emoji };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleUpdateNote = (id, text) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, text } : note));
  };

  const handleDeleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleMoveNote = (id, newDateKey) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, dateKey: newDateKey } : note));
  };

  return {
    currentMonth, direction, startDate, endDate, hoverDate, notes,
    selectedNoteDate, setSelectedNoteDate, handleAddNote, handleUpdateNote, handleDeleteNote, handleMoveNote,
    theme, nextMonth, prevMonth, handleYearChange, holidays,
    handleMouseDown, handleMouseEnterDrag, handleMouseUp, clearRange,
    showYearView, setShowYearView, handleMonthSelect
  };
};