import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '@/store/contentStore';
import { useThemeStore } from '@/store/themeStore';
import { SectionTitle } from '@/components/SectionTitle';
import { getLocalizedContent, getLocalizedText } from '@/utils/i18nHelper';

export const About: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useContentStore();
  const { settings } = useThemeStore();
  const enableAnim = settings.enableAnimations;

  const defaultBio = "I am a Senior Frontend Engineer with over 6 years of experience specializing in building beautiful, highly interactive web applications. I focus on pixel-perfect details, immersive animations, and clean architectures that deliver world-class user experiences.";

  const bioText = getLocalizedContent(
    data.about.bio,
    'about.bio',
    defaultBio
  );

  // Group skills by category
  const skillsByCategory = data.about.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof data.about.skills>);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="about" className="relative py-20 overflow-hidden z-10 bg-[#070414]/40">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle title={t('about.title', 'About Me')} subtitle={t('about.subtitle', 'Biography & Expertise')} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Bio & Timeline Left Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {enableAnim ? (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-4 text-left"
              >
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                  {t('about.bio_header', 'Designing Experiences, Writing Code.')}
                </h3>
                <p className="text-sm md:text-base text-white/70 leading-relaxed font-medium">
                  {bioText}
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-4 text-left">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                  {t('about.bio_header', 'Designing Experiences, Writing Code.')}
                </h3>
                <p className="text-sm md:text-base text-white/70 leading-relaxed font-medium">
                  {bioText}
                </p>
              </div>
            )}

            {/* Experience Timeline */}
            <div className="flex flex-col gap-6 text-left">
              <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-2 tracking-wide uppercase text-xs text-primary">
                <Briefcase className="w-4 h-4 text-primary" />
                {t('about.work_history', 'Work History')}
              </h4>

              <div className="border-l border-white/10 pl-6 ml-2 space-y-8 relative">
                {data.about.experience.map((exp, idx) => {
                  const roleText = getLocalizedText(exp.role);
                  const descText = getLocalizedText(exp.description);

                  const experienceBlock = (
                    <div key={exp.id} className="relative">
                      {/* Circle Dot */}
                      <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-gradient-primary border border-white/30 shadow-[0_0_10px_var(--glow-color)]" />
                      
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-semibold text-white/50">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{exp.year}</span>
                        </div>
                        <h5 className="text-base font-bold text-white tracking-wide">
                          {roleText} <span className="text-primary font-normal">@ {exp.company}</span>
                        </h5>
                        <p className="text-xs md:text-sm text-white/60 leading-relaxed mt-1 font-medium">
                          {descText}
                        </p>
                      </div>
                    </div>
                  );

                  if (!enableAnim) return experienceBlock;

                  return (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                    >
                      {experienceBlock}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Skills Bars Right Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8 text-left">
            <h4 className="text-lg font-bold text-white flex items-center gap-2 tracking-wide uppercase text-xs text-primary">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              {t('about.technical_proficiency', 'Technical Proficiency')}
            </h4>

            {enableAnim ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                className="flex flex-col gap-6"
              >
                {Object.entries(skillsByCategory).map(([category, items]) => (
                  <motion.div variants={itemVariants} key={category} className="flex flex-col gap-4">
                    <span className="text-xs font-extrabold tracking-widest text-white/40 uppercase bg-white/5 py-1 px-3 rounded-full w-max border border-white/5">
                      {category}
                    </span>
                    <div className="flex flex-col gap-4.5 pl-1">
                      {items.map((skill) => (
                        <div key={skill.name} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-xs md:text-sm font-semibold">
                            <span className="text-white/80">{skill.name}</span>
                            <span className="text-primary">{skill.level}%</span>
                          </div>
                          {/* Progress track */}
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, ease: 'easeOut' }}
                              className="absolute top-0 bottom-0 left-0 bg-gradient-primary rounded-full"
                              style={{
                                boxShadow: settings.enableGlow
                                  ? '0 0 10px var(--glow-color)'
                                  : 'none',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col gap-6">
                {Object.entries(skillsByCategory).map(([category, items]) => (
                  <div key={category} className="flex flex-col gap-4">
                    <span className="text-xs font-extrabold tracking-widest text-white/40 uppercase bg-white/5 py-1 px-3 rounded-full w-max border border-white/5">
                      {category}
                    </span>
                    <div className="flex flex-col gap-4 pl-1">
                      {items.map((skill) => (
                        <div key={skill.name} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-xs md:text-sm font-semibold">
                            <span className="text-white/85">{skill.name}</span>
                            <span className="text-primary">{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                            <div
                              className="absolute top-0 bottom-0 left-0 bg-gradient-primary rounded-full"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
