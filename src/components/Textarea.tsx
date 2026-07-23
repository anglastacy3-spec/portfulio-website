import React, { forwardRef } from 'react';
import { useThemeStore } from '@/store/themeStore';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    const { settings } = useThemeStore();
    
    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label className="text-xs md:text-sm font-semibold text-white/70 tracking-wider">
            {label}
          </label>
        )}
        <div className="relative w-full">
          {icon && (
            <div className="absolute left-3.5 top-3.5 text-white/30 pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <textarea
            ref={ref}
            style={{ borderRadius: settings.cardRadius }}
            className={`w-full bg-white/5 border border-white/10 ${icon ? 'pl-10 pr-4' : 'px-4'} py-3 text-sm text-white placeholder-white/30 outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] resize-y min-h-[100px] ${
              error ? 'border-red-500/50 focus:border-red-500' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-red-400 font-medium mt-0.5 pl-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
