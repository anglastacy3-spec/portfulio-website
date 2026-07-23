import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glow?: boolean;
  glass?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  hoverable = true,
  glow = true,
  glass = true,
  children,
  className = '',
  style,
  ...props
}) => {
  const { settings } = useThemeStore();
  const enableAnim = settings.enableAnimations;
  const enableGlow = settings.enableGlow && glow;

  const cardStyle = {
    borderRadius: settings.cardRadius,
    ...style,
  };

  // Base style classes
  const baseClasses = `relative overflow-hidden transition-all duration-300 ${
    glass ? 'glass' : 'bg-darkBg-card border border-white/5'
  } ${
    enableGlow ? 'hover:shadow-[0_0_20px_var(--glow-color)] hover:border-primary/30' : ''
  } ${className}`;

  if (!enableAnim || !hoverable) {
    return (
      <div
        style={cardStyle}
        className={`${baseClasses} ${hoverable ? 'hover:-translate-y-1' : ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }

  const { onAnimationStart, onDragStart, onDragEnd, onDrag, ...cleanProps } = props as any;

  return (
    <motion.div
      style={cardStyle}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
      className={baseClasses}
      {...cleanProps}
    >
      {children}
    </motion.div>
  );
};
