import React from 'react';
import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '@/store/contentStore';
import { useThemeStore } from '@/store/themeStore';
import { SectionTitle } from '@/components/SectionTitle';
import { Card } from '@/components/Card';
import { getLocalizedText } from '@/utils/i18nHelper';

export const Testimonials: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useContentStore();
  const { settings } = useThemeStore();
  const enableAnim = settings.enableAnimations;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 15 } },
  };

  return (
    <section id="testimonials" className="relative py-20 overflow-hidden z-10 bg-[#070414]/40">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle title={t('testimonials.title', 'Client Reviews')} subtitle={t('testimonials.subtitle', 'Testimonials')} />

        {enableAnim ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {data.testimonials.map((test) => (
              <motion.div variants={cardVariants} key={test.id}>
                <Card
                  hoverable={true}
                  glow={true}
                  className="p-6 md:p-8 flex flex-col gap-4 text-left h-full border-white/5 bg-[#120c26]/40"
                >
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < test.rating
                            ? 'text-yellow-400 fill-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]'
                            : 'text-white/10'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-sm md:text-base text-white/70 italic font-medium leading-relaxed flex-grow">
                    "{getLocalizedText(test.comment)}"
                  </p>

                  {/* User Profile */}
                  <div className="flex items-center gap-3.5 border-t border-white/5 pt-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {test.avatar ? (
                        <img
                          src={test.avatar}
                          alt={test.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white/40" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">{test.name}</h4>
                      <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                        {t('testimonials.verified_client', 'Verified Client')}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {data.testimonials.map((test) => (
              <Card
                key={test.id}
                hoverable={true}
                glow={true}
                className="p-6 md:p-8 flex flex-col gap-4 text-left h-full"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < test.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm md:text-base text-white/70 italic font-medium leading-relaxed flex-grow">
                  "{getLocalizedText(test.comment)}"
                </p>
                <div className="flex items-center gap-3.5 border-t border-white/5 pt-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-white/40" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">{test.name}</h4>
                    <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                      {t('testimonials.verified_client', 'Verified Client')}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
