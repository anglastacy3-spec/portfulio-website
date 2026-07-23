import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const { settings } = useThemeStore();
  const enableAnim = settings.enableAnimations;

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={enableAnim ? { opacity: 0, scale: 0.95, y: 15 } : { opacity: 1 }}
            animate={enableAnim ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1 }}
            exit={enableAnim ? { opacity: 0, scale: 0.95, y: 15 } : { opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
            style={{ borderRadius: settings.cardRadius }}
            className="relative w-full max-w-lg glass-premium p-6 shadow-2xl border border-white/10 z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4 shrink-0">
              <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white/80 transition-colors p-1.5 hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto pr-1 flex-grow scrollbar-thin">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
