import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  ...props
}) => {
  const { settings } = useThemeStore();
  const enableAnim = settings.enableAnimations;

  // Sizing styles
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs font-semibold',
    md: 'px-6 py-3 text-sm font-semibold tracking-wide',
    lg: 'px-8 py-4 text-base font-bold tracking-wider',
  };

  // Base variants
  const baseClasses = 'relative inline-flex items-center justify-center overflow-hidden transition-all duration-300 outline-none select-none';
  
  const variantClasses = {
    primary: 'bg-gradient-primary text-white hover:brightness-110 shadow-lg shadow-primary/20',
    secondary: 'border border-primary text-white bg-transparent hover:bg-primary/10',
    glass: 'glass text-white border-white/10 hover:border-primary/40 hover:bg-primary/10 shadow-glass',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20',
  };

  const roundedStyle = {
    borderRadius: settings.cardRadius,
  };

  const content = (
    <>
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </>
  );

  if (!enableAnim) {
    return (
      <button
        style={roundedStyle}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {content}
      </button>
    );
  }

  const { onAnimationStart, onDragStart, onDragEnd, onDrag, ...cleanProps } = props as any;

  return (
    <motion.button
      style={roundedStyle}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...cleanProps}
    >
      {content}
    </motion.button>
  );
};
