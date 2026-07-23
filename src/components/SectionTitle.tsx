import React from 'react';
import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, center = true }) => {
  const { settings } = useThemeStore();
  const enableAnim = settings.enableAnimations;

  const content = (
    <div className={`flex flex-col gap-2 ${center ? 'items-center text-center' : 'items-start text-left'} mb-14`}>
      {subtitle && (
        <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-primary">
          {subtitle}
        </span>
      )}
      <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white relative">
        {title}
        <span 
          className="block w-12 h-[3px] bg-gradient-primary rounded-full mt-3" 
          style={!center ? { marginLeft: '0px' } : { marginLeft: 'auto', marginRight: 'auto' }} 
        />
      </h2>
    </div>
  );

  if (!enableAnim) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
    >
      {content}
    </motion.div>
  );
};
