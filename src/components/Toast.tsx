import React from 'react';
import { create } from 'zustand';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type, duration }] }));
    
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();
  const { settings } = useThemeStore();
  const enableAnim = settings.enableAnimations;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  const glows = {
    success: 'shadow-[0_0_15px_rgba(74,222,128,0.25)] border-green-500/20',
    error: 'shadow-[0_0_15px_rgba(248,113,113,0.25)] border-red-500/20',
    info: 'shadow-[0_0_15px_rgba(96,165,250,0.25)] border-blue-500/20',
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex flex-col gap-2.5 sm:gap-3 max-w-sm sm:w-full pointer-events-none mx-auto sm:mx-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={enableAnim ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 1 }}
            animate={enableAnim ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1 }}
            exit={enableAnim ? { opacity: 0, scale: 0.9, y: -10 } : { opacity: 0 }}
            className={`glass pointer-events-auto p-3.5 sm:p-4 flex items-start sm:items-center gap-3 border shadow-glass ${glows[toast.type]}`}
            style={{ borderRadius: settings.cardRadius }}
          >
            <div className="mt-0.5 sm:mt-0">{icons[toast.type]}</div>
            <p className="text-xs sm:text-sm font-medium text-white/95 leading-snug break-words flex-grow">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white/80 transition-colors p-1 shrink-0 mt-0.5 sm:mt-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const showToast = {
  success: (msg: string, dur?: number) => useToastStore.getState().addToast(msg, 'success', dur),
  error: (msg: string, dur?: number) => useToastStore.getState().addToast(msg, 'error', dur),
  info: (msg: string, dur?: number) => useToastStore.getState().addToast(msg, 'info', dur),
};
