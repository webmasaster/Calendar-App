import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, getYear } from 'date-fns';
import { ChevronDown } from 'lucide-react';

const HeroSection = ({ theme, currentMonth, handleYearChange }) => {
  const years = Array.from({ length: 21 }, (_, i) => 2010 + i);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsYearDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTransform = () => {
    switch (theme.variation) {
      case 0: return { scale: 1.03, x: 0, y: 0 };
      case 1: return { scale: 1.07, x: -10, y: -5 };
      case 2: return { scale: 1.1, x: 10, y: 5 };
      default: return { scale: 1.05, x: 0, y: 0 };
    }
  };

  return (
    <div className="relative h-[180px] sm:h-[200px] md:h-[240px] w-full overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.img 
          key={theme.image + theme.variation}
          src={theme.image}
          initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: 1, ...getTransform() }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }} alt="Calendar Hero"
          className={`absolute inset-0 w-full h-full object-cover contrast-110 saturate-110 ${theme.variation === 2 ? 'brightness-90' : 'brightness-95'}`}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%)]" />
      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

      {/* 📅 Text & Modern Year Dropdown */}
      <div className="absolute bottom-6 right-8 text-right flex flex-col items-end">
        
        <div className="relative z-50" ref={dropdownRef}>
          <button
            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
            className="flex items-center gap-1.5 text-sm font-semibold tracking-[0.25em] text-gray-300 hover:text-white transition-colors mb-1 uppercase"
          >
            {getYear(currentMonth)} 
            <ChevronDown size={14} className={`transition-transform duration-300 ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isYearDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                /* Opens UPWARDS (bottom-full mb-2) and HIDES scrollbars */
                className="absolute bottom-full right-0 mb-2 bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[140px] overflow-y-auto w-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {years.map(y => (
                  <button
                    key={y}
                    onClick={() => { handleYearChange(y); setIsYearDropdownOpen(false); }}
                    className={`py-2 px-4 text-xs font-bold text-center transition-colors hover:bg-white/20 ${getYear(currentMonth) === y ? 'text-white bg-white/20' : 'text-gray-400'}`}
                  >
                    {y}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide uppercase leading-none text-white pointer-events-none">
          {format(currentMonth, 'MMMM')}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;