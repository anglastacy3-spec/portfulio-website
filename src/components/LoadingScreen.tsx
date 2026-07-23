import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 1200); // Visual padding
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-[#05030f] flex flex-col items-center justify-center gap-6"
        >
          {/* Logo badge with pulsing glowing rings */}
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring 1 */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute w-24 h-24 rounded-full border border-primary/40 bg-primary/5 filter blur-sm"
            />
            {/* Pulsing ring 2 */}
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.15, 0, 0.15] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute w-24 h-24 rounded-full border border-secondary/30 bg-secondary/5 filter blur-md"
            />

            {/* Inner Brand Initials */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center border border-white/25 shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)]">
              <span className="text-xl font-black text-white tracking-widest pl-0.5 select-none">
                AS
              </span>
            </div>
          </div>

          {/* Loader bar */}
          <div className="w-40 h-[3px] bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ left: '-100%' }}
              animate={{ left: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-primary rounded-full"
            />
          </div>

          <p className="text-xs uppercase font-semibold text-white/40 tracking-[0.25em] animate-pulse">
            Designing Premium Experience...
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
