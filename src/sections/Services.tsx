import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '@/store/contentStore';
import { useThemeStore } from '@/store/themeStore';
import { Card } from '@/components/Card';
import { getLocalizedText } from '@/utils/i18nHelper';

export const ServiceIcon = ({ name, color, className = "w-12 h-12" }: { name: string; color: string; className?: string }) => {
  if (name === 'UserHeart' || name === 'User') {
    return (
      <svg className={className} style={{ color }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        {/* User outline */}
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        {/* Heart outline bottom right */}
        <path d="M19 13.5c-1-1-2.5 0-2.5 1.5c0 1.5 1.5 2.5 2.5 3.5c1-1 2.5-2 2.5-3.5c0-1.5-1.5-2.5-2.5-1.5z" />
      </svg>
    );
  }
  
  if (name === 'CalendarHeart' || name === 'Calendar') {
    return (
      <svg className={className} style={{ color }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        {/* Calendar outline */}
        <path d="M21 11.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.5" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
        {/* Heart outline bottom right */}
        <path d="M19 15.5c-1-1-2.5 0-2.5 1.5c0 1.5 1.5 2.5 2.5 3.5c1-1 2.5-2 2.5-3.5c0-1.5-1.5-2.5-2.5-1.5z" />
      </svg>
    );
  }
  
  if (name === 'DoubleHeart' || (name === 'Heart' && (color === '#f97316' || color === '#ef4444'))) { // Dating icon
    return (
      <svg className={className} style={{ color }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        {/* Outer Heart */}
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        {/* Inner Heart */}
        <path d="M12 14.5c.7-.6 1.4-1.3 1.4-2.2a2.2 2.2 0 0 0-2.2-2.2c-.7 0-1.2.2-1.8.8-.6-.6-1.1-.8-1.8-.8a2.2 2.2 0 0 0-2.2 2.2c0 .9.7 1.6 1.4 2.2l2.8 2.8Z" />
      </svg>
    );
  }

  return (
    <svg className={className} style={{ color }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
};

export const Services: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useContentStore();
  const { settings } = useThemeStore();
  const enableAnim = settings.enableAnimations;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="services" className="relative pt-8 pb-16 md:py-20 overflow-hidden z-10 bg-[#070414]/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-12 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-3 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Icons.Briefcase className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
            {t('services.title', 'My Services')}
          </h2>
          <p className="text-xs md:text-sm text-white/40 mt-1 font-semibold">
            {t('services.subtitle', 'What I can do for you')}
          </p>
        </div>

        {enableAnim ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {data.services.map((service) => {
              const title = getLocalizedText(service.title);
              const description = getLocalizedText(service.description);
              return (
                <motion.div variants={cardVariants} key={service.id} className="w-full min-w-0">
                  <Card
                    hoverable={true}
                    glow={true}
                    className="p-6 md:p-8 flex items-start gap-5 text-left h-full border-white/5 w-full min-w-0"
                  >
                    <div className="shrink-0 pt-1">
                      <ServiceIcon name={service.iconName} color={service.iconColor || '#a855f7'} className="w-12 h-12 md:w-14 md:h-14" />
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white tracking-wide break-words [overflow-wrap:anywhere]">
                        {title}
                      </h3>
                      <p className="text-xs md:text-sm text-white/60 leading-relaxed font-medium break-words [overflow-wrap:anywhere]">
                        {description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {data.services.map((service) => {
              const title = getLocalizedText(service.title);
              const description = getLocalizedText(service.description);
              return (
                <Card
                  key={service.id}
                  hoverable={true}
                  glow={true}
                  className="p-6 md:p-8 flex items-start gap-5 text-left h-full w-full min-w-0"
                >
                  <div className="shrink-0 pt-1">
                    <ServiceIcon name={service.iconName} color={service.iconColor || '#a855f7'} className="w-12 h-12 md:w-14 md:h-14" />
                  </div>
                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-white tracking-wide break-words [overflow-wrap:anywhere]">{title}</h3>
                    <p className="text-xs md:text-sm text-white/60 leading-relaxed font-medium break-words [overflow-wrap:anywhere]">
                      {description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
