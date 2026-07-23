import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '@/store/contentStore';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/Button';

import { getLocalizedContent } from '@/utils/i18nHelper';
import { getOptimizedCloudinaryUrl } from '@/services/cloudinaryService';

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useContentStore();
  const { settings } = useThemeStore();
  const enableAnim = settings.enableAnimations;

  const defaultDesc = "A passionate individual exploring ideas, creating solutions & building the future.";
  const displayDesc = getLocalizedContent(data.hero.description, 'hero.default_description', defaultDesc);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <section
      id="home"
      className="relative flex items-center justify-center pt-24 pb-8 overflow-hidden z-10"
      style={{
        backgroundImage: data.hero.heroBg ? `url(${data.hero.heroBg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Glowing Blurs */}
      <div 
        className="glow-orb w-[250px] h-[250px] md:w-[450px] md:h-[450px] -top-12 -left-12 bg-primary/20"
      />
      <div 
        className="glow-orb w-[250px] h-[250px] md:w-[450px] md:h-[450px] bottom-0 right-0 bg-secondary/15"
      />

      {/* Decorative semi-transparent solid circle arc on top right matching screenshot */}
      <div className="absolute top-[-50px] right-[-100px] w-[250px] h-[250px] md:w-[450px] md:h-[450px] rounded-full bg-gradient-to-br from-[#d946ef] to-[#8b5cf6] opacity-[0.25] blur-3xl z-0 pointer-events-none" />

      {/* Dotted grid decoration on the right matching screenshot */}
      <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 opacity-[0.18] z-0 pointer-events-none hidden md:block text-primary">
        <svg width="60" height="96" fill="none" viewBox="0 0 60 96">
          <pattern id="dotted-grid" x="0" y="0" width="12" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill="currentColor" />
          </pattern>
          <rect width="60" height="96" fill="url(#dotted-grid)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center gap-6">
        {/* Profile Image with animated glow */}
        {enableAnim ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 90, delay: 0.1 }}
            className="relative w-32 h-32 md:w-36 md:h-36 rounded-full p-1 bg-gradient-primary shadow-[0_0_25px_var(--glow-color)] animate-border-glow flex items-center justify-center shrink-0 mb-4"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-darkBg border border-white/10 flex items-center justify-center">
              <img
                src={getOptimizedCloudinaryUrl(data.hero.avatar, 400)}
                alt={data.hero.name}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          </motion.div>
        ) : (
          <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full p-1 bg-gradient-primary shadow-[0_0_20px_var(--glow-color)] flex items-center justify-center shrink-0 mb-4">
            <div className="w-full h-full rounded-full overflow-hidden bg-darkBg border border-white/10 flex items-center justify-center">
              <img
                src={getOptimizedCloudinaryUrl(data.hero.avatar, 400)}
                alt={data.hero.name}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Text Details & Buttons */}
        {enableAnim ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-4"
          >
            <motion.span
              variants={itemVariants}
              className="text-sm md:text-base font-semibold text-primary"
            >
              {t('hero.subtitle', data.hero.subtitle)}
            </motion.span>
            
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2 leading-none text-white"
            >
              {(() => {
                const parts = data.hero.name.split(' ');
                if (parts.length <= 1) return data.hero.name;
                const lastWord = parts[parts.length - 1];
                const rest = parts.slice(0, -1).join(' ');
                return (
                  <>
                    {rest} <span className="text-gradient">{lastWord}</span>
                  </>
                );
              })()}
            </motion.h1>

            {/* Divider Line */}
            <motion.div
              variants={itemVariants}
              className="w-20 h-[3px] bg-gradient-to-r from-blue-500 to-pink-500 rounded-full my-1"
            />

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-white/75 max-w-xl font-medium leading-relaxed mt-2"
            >
              {displayDesc}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-6"
            >
              <Button
                variant="primary"
                onClick={() => scrollToSection('socials')}
                className="bg-gradient-to-r from-[#d946ef] via-[#a855f7] to-[#3b82f6] text-white hover:brightness-110 shadow-lg px-8 py-3 text-sm font-semibold tracking-wide"
              >
                {t('hero.get_to_know_me', 'Get to Know Me')}
              </Button>
            </motion.div>

            {/* Scroll Indicator Chevron right below the button */}
            <motion.div
              variants={itemVariants}
              className="mt-4 flex flex-col items-center pointer-events-none select-none text-white/40"
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <ChevronDown className="w-6 h-6 text-primary/80" />
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <span className="text-sm md:text-base font-semibold text-primary">
              {t('hero.subtitle', data.hero.subtitle)}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2 leading-none text-white">
              {(() => {
                const parts = data.hero.name.split(' ');
                if (parts.length <= 1) return data.hero.name;
                const lastWord = parts[parts.length - 1];
                const rest = parts.slice(0, -1).join(' ');
                return (
                  <>
                    {rest} <span className="text-gradient">{lastWord}</span>
                  </>
                );
              })()}
            </h1>
            {/* Divider Line */}
            <div className="w-20 h-[3px] bg-gradient-to-r from-blue-500 to-pink-500 rounded-full my-1" />

            <p className="text-base md:text-lg text-white/75 max-w-xl font-medium leading-relaxed mt-2">
              {displayDesc}
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={() => scrollToSection('socials')}
                className="bg-gradient-to-r from-[#d946ef] via-[#a855f7] to-[#3b82f6] text-white hover:brightness-110 shadow-lg px-8 py-3 text-sm font-semibold tracking-wide"
              >
                {t('hero.get_to_know_me', 'Get to Know Me')}
              </Button>
            </div>

            {/* Scroll Indicator Chevron right below the button */}
            <div className="mt-4 flex flex-col items-center pointer-events-none select-none text-white/40">
              <ChevronDown className="w-6 h-6 text-primary/80" />
            </div>
          </div>
        )}


      </div>
    </section>
  );
};
