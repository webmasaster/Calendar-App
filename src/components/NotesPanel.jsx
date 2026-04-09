import React, { useState, useEffect } from 'react';
import { format, isSameDay, parseISO, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, X, Save, CalendarRange, ChevronLeft, Trash2, AlertCircle } from 'lucide-react';

const NotesPanel = ({ currentMonth, notes, selectedNoteDate, startDate, endDate, clearRange, handleAddNote, handleUpdateNote, handleDeleteNote, holidays }) => {
  const [draftNote, setDraftNote] = useState("");
  const [viewMode, setViewMode] = useState('day'); 
  
  const [isEvent, setIsEvent] = useState(false);
  const [eventEmoji, setEventEmoji] = useState("📌");

  const [modalNote, setModalNote] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  // State for Delete Confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  
  useEffect(() => {
    if (selectedNoteDate) setViewMode('day');
  }, [selectedNoteDate]);

  const isRangeSelected = startDate && endDate && !isSameDay(startDate, endDate);
  const dateKey = selectedNoteDate ? format(selectedNoteDate, 'yyyy-MM-dd') : null;
  const monthKey = format(currentMonth, 'yyyy-MM');
  const rangeKey = isRangeSelected ? `${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}` : null;
  
  let activeKey = isRangeSelected ? rangeKey : (viewMode === 'month' ? monthKey : dateKey);
  const holidayName = (dateKey && viewMode === 'day' && !isRangeSelected) ? holidays[dateKey] : null;

  let displayedNotes = [];
  let monthRangeNotes = [];

  if (isRangeSelected) {
    displayedNotes = notes.filter(n => n.dateKey === rangeKey);
  } else if (viewMode === 'day' && selectedNoteDate) {
    displayedNotes = notes.filter(n => {
      if (n.dateKey === dateKey) return true;
      if (n.dateKey.includes('_')) {
        const [s, e] = n.dateKey.split('_');
        try { return isWithinInterval(selectedNoteDate, { start: parseISO(s), end: parseISO(e) }); } 
        catch { return false; }
      }
      return false;
    });
  } else if (viewMode === 'month') {
    displayedNotes = notes.filter(n => n.dateKey === monthKey);
    const mStart = startOfMonth(currentMonth);
    const mEnd = endOfMonth(currentMonth);
    monthRangeNotes = notes.filter(n => {
      if (!n.dateKey.includes('_')) return false;
      const [s, e] = n.dateKey.split('_');
      try {
        const nStart = parseISO(s);
        const nEnd = parseISO(e);
        return nStart <= mEnd && nEnd >= mStart;
      } catch { return false; }
    });
  }

  const saveNewNote = () => {
    if (activeKey && draftNote.trim() !== "") {
      handleAddNote(activeKey, draftNote, isEvent, eventEmoji);
      setDraftNote(""); 
      setIsEvent(false); 
    }
  };

  const openModal = (note) => {
    setModalNote(note);
    setEditDraft(note.text);
    setIsEditing(false);
  };

  const saveModalEdit = () => {
    handleUpdateNote(modalNote.id, editDraft);
    setModalNote({ ...modalNote, text: editDraft });
    setIsEditing(false);
  };

  const requestDelete = (e, id) => {
    e?.stopPropagation();
    setConfirmDeleteId(id);
  };

  const executeDelete = () => {
    handleDeleteNote(confirmDeleteId);
    if (modalNote && modalNote.id === confirmDeleteId) setModalNote(null);
    setConfirmDeleteId(null);
  };

  const formatKeyTitle = (key) => {
    try {
      if (key.includes('_')) {
        const [s, e] = key.split('_');
        return `${format(parseISO(s), 'd MMM')} - ${format(parseISO(e), 'd MMM')}`;
      }
      if (key.length === 7) return format(parseISO(key + '-01'), 'MMMM yyyy');
      return format(parseISO(key), 'd MMM yyyy');
    } catch {
      return key;
    }
  };

  let notePlaceholder = isRangeSelected 
    ? `Note for ${format(startDate, 'd MMM')} \u2013 ${format(endDate, 'd MMM')}...` 
    : (viewMode === 'month' ? `Note for ${format(currentMonth, 'MMMM')}...` : `Note for ${selectedNoteDate ? format(selectedNoteDate, 'd MMM') : 'Date'}...`);

  return (
    <div className="h-full flex flex-col pt-1 min-h-0 relative">
      
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[12px] font-bold text-[#3b209e] uppercase tracking-[0.25em]">Notes</h3>
        {holidayName && (
          <span className="text-[10px] font-bold text-[#ff3366] bg-[#fff0f3] px-2.5 py-1 rounded-full border border-[#ffd8e1] shadow-sm">
            {holidayName}
          </span>
        )}
      </div>
      
      {isRangeSelected ? (
        <div className="flex items-center space-x-2 mb-3">
          <button onClick={clearRange} className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors cursor-pointer flex items-center justify-center">
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center space-x-2 bg-[#f3eefc] text-[#3b209e] px-3 py-1.5 rounded-full font-bold text-[12px] flex-1">
            <CalendarRange size={14} />
            <span>{format(startDate, 'd MMM')} &ndash; {format(endDate, 'd MMM')}</span>
          </div>
        </div>
      ) : (
        <div className="flex space-x-2 mb-3">
          <button 
            onClick={() => setViewMode('month')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${viewMode === 'month' ? 'bg-[#4323a6] text-white shadow-sm' : 'border border-gray-200 text-[#495057] hover:bg-gray-50'}`}
          >
            Month
          </button>
          <button 
            onClick={() => selectedNoteDate && setViewMode('day')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-colors ${!selectedNoteDate ? 'opacity-50 cursor-not-allowed border border-gray-200 text-gray-400' : viewMode === 'day' ? 'bg-[#4323a6] text-white shadow-sm' : 'border border-gray-200 text-[#495057] hover:bg-gray-50 cursor-pointer'}`}
          >
            {selectedNoteDate ? format(selectedNoteDate, 'd MMM') : 'Date'}
          </button>
        </div>
      )}

      <div className="flex flex-col flex-shrink-0 transition-all duration-200">
        <textarea 
          value={draftNote}
          onChange={(e) => setDraftNote(e.target.value)}
          placeholder={notePlaceholder}
          disabled={!activeKey}
          className="w-full h-[85px] resize-none text-sm text-gray-700 bg-white/70 backdrop-blur-sm outline-none leading-relaxed border border-gray-200 rounded-xl p-3 shadow-inner focus:ring-2 focus:ring-[#4323a6]/30 focus:border-[#4323a6] transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        />
        
        <div className="flex items-center gap-2 mt-2">
          {viewMode === 'day' && !isRangeSelected && (
            <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm h-8 flex-shrink-0">
              <select 
                value={eventEmoji} 
                onChange={(e) => setEventEmoji(e.target.value)}
                className="bg-gray-50 h-full px-1 text-xs outline-none cursor-pointer border-r border-gray-200"
              >
                <option>📌</option><option>🎉</option><option>🎂</option><option>✈️</option><option>💼</option><option>⭐</option>
              </select>
              <label className="flex items-center gap-1.5 px-2 text-[10px] font-bold text-gray-600 cursor-pointer hover:bg-gray-50 h-full transition-colors">
                <input type="checkbox" checked={isEvent} onChange={(e) => setIsEvent(e.target.checked)} className="w-3 h-3 accent-[#4323a6] cursor-pointer" />
                Event
              </label>
            </div>
          )}
          <button 
            onClick={saveNewNote}
            disabled={!draftNote.trim() || !activeKey}
            className="flex-1 h-8 rounded-lg text-[11px] font-bold transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed bg-[#4323a6] text-white hover:bg-[#321980] cursor-pointer shadow-md active:scale-[0.98]"
          >
            Save Note
          </button>
        </div>
      </div>

      <div className="mt-4 flex-1 flex flex-col min-h-0 overflow-hidden">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex-shrink-0">Saved Notes</h4>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {displayedNotes.length === 0 && monthRangeNotes.length === 0 ? (
            <div className="text-[11px] text-gray-400 italic">No notes found.</div>
          ) : (
            displayedNotes.map((note) => (
              <div 
                key={note.id} 
                draggable 
                onDragStart={(e) => e.dataTransfer.setData('noteId', note.id)} 
                onClick={() => openModal(note)} 
                className="relative p-3 bg-white border border-gray-100 rounded-xl cursor-pointer hover:border-[#4323a6]/30 hover:shadow-md transition-all group overflow-hidden"
              >
                 <div className="pr-6">
                   <span className="text-[10px] font-bold text-[#3b209e] block mb-1 flex items-center gap-1">
                     {note.isEvent && <span>{note.emoji}</span>} 
                     {formatKeyTitle(note.dateKey)}
                   </span>
                   <span className="text-[12px] text-gray-700 leading-snug line-clamp-2">{note.text}</span>
                 </div>
                 <button onClick={(e) => requestDelete(e, note.id)} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all cursor-pointer">
                   <Trash2 size={14} />
                 </button>
              </div>
            ))
          )}

          {viewMode === 'month' && monthRangeNotes.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <span className="text-[9px] font-bold text-[#8b5cf6] uppercase tracking-widest mb-2 flex items-center gap-1">
                <CalendarRange size={10} /> Events This Month
              </span>
              <div className="space-y-2">
                {monthRangeNotes.map((note) => (
                  <div 
                    key={note.id} 
                    draggable 
                    onDragStart={(e) => e.dataTransfer.setData('noteId', note.id)}
                    onClick={() => openModal(note)} 
                    className="relative p-3 bg-[#fdfcff] border border-[#ede9fe] rounded-xl cursor-pointer hover:border-[#8b5cf6]/40 hover:shadow-md transition-all group overflow-hidden"
                  >
                    <div className="pr-6">
                      <span className="text-[10px] font-bold text-[#7c3aed] block mb-1">{formatKeyTitle(note.dateKey)}</span>
                      <span className="text-[12px] text-gray-700 leading-snug line-clamp-2">{note.text}</span>
                    </div>
                    <button onClick={(e) => requestDelete(e, note.id)} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-[#8b5cf6] hover:text-red-500 hover:bg-red-50 rounded-md transition-all cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {modalNote && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setModalNote(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                <h4 className="font-bold text-[#3b209e] text-sm tracking-wide flex items-center gap-1.5">
                  {modalNote.isEvent && <span>{modalNote.emoji}</span>}
                  {formatKeyTitle(modalNote.dateKey)}
                </h4>
                <button onClick={() => setModalNote(null)} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500 cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-5 flex-1 overflow-y-auto min-h-[120px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {isEditing ? (
                  <textarea
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    autoFocus
                    className="w-full h-full min-h-[160px] outline-none text-gray-700 text-sm resize-none bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-[#4323a6] focus:ring-2 focus:ring-[#4323a6]/20 transition-all overflow-y-auto"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm break-words">{modalNote.text}</p>
                )}
              </div>

              <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 flex-shrink-0">
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">Cancel</button>
                    <button onClick={saveModalEdit} disabled={!editDraft.trim()} className="px-4 py-2 text-xs font-bold bg-[#4323a6] text-white rounded-lg shadow hover:bg-[#321980] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                      <Save size={14} /> Save
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 w-full">
                    <button onClick={(e) => requestDelete(e, modalNote.id)} className="w-12 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-gray-200 hover:border-red-200 cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                    <button onClick={() => setIsEditing(true)} className="flex-1 py-2.5 text-xs font-bold bg-gray-900 text-white rounded-lg shadow hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer">
                      <Edit3 size={14} /> Edit Note
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setConfirmDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xs bg-white rounded-2xl shadow-2xl p-6 text-center border border-gray-100"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Delete Note?</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                This action cannot be undone. Are you sure you want to permanently delete this note?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={executeDelete} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-md shadow-red-500/20 cursor-pointer">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default NotesPanel;