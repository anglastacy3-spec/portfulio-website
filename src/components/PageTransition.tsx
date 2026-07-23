import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const { settings } = useThemeStore();
  const enableAnim = settings.enableAnimations;

  if (!enableAnim) {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
};
