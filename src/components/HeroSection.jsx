import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const HeroSection = ({ theme, currentMonth }) => {

  const getTransform = () => {
    switch (theme.variation) {
      case 0:
        return { scale: 1.03, x: 0, y: 0 };
      case 1:
        return { scale: 1.07, x: -10, y: -5 };
      case 2:
        return { scale: 1.1, x: 10, y: 5 };
      default:
        return { scale: 1.05, x: 0, y: 0 };
    }
  };

  return (
    <div className="relative h-[180px] sm:h-[200px] md:h-[240px] w-full overflow-hidden bg-slate-900">

      <AnimatePresence mode="wait">
        <motion.img 
          key={theme.image + theme.variation} // 🔥 triggers on day change
          src={theme.image}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ 
            opacity: 1,
            ...getTransform()
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          alt="Calendar Hero"
          className={`
            absolute inset-0 w-full h-full object-cover
            contrast-110 saturate-110
            ${theme.variation === 2 ? 'brightness-90' : 'brightness-95'}
          `}
        />
      </AnimatePresence>

      {/* 🌫️ overlay */}
      <div className="absolute inset-0 
        bg-gradient-to-t from-black/70 via-black/30 to-transparent" 
      />

      {/* ✨ light glow */}
      <div className="absolute inset-0 
        bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%)]" 
      />

      {/* 🧾 grain */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay 
        bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"
      />

      {/* 📅 Text */}
      <div className="absolute bottom-6 right-8 text-right text-white">
        <div className="text-sm font-semibold tracking-[0.25em] text-gray-300 mb-1">
          {format(currentMonth, 'yyyy')}
        </div>
        <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide uppercase leading-none">
          {format(currentMonth, 'MMMM')}
        </div>
      </div>

    </div>
  );
};

export default HeroSection;