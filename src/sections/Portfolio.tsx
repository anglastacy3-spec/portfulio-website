import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useContentStore } from '@/store/contentStore';
import { useThemeStore } from '@/store/themeStore';
import { SectionTitle } from '@/components/SectionTitle';
import { Card } from '@/components/Card';
import { getLocalizedText } from '@/utils/i18nHelper';

export const Portfolio: React.FC = () => {
  const { data } = useContentStore();
  const { settings } = useThemeStore();
  const [selectedTag, setSelectedTag] = useState('All');
  const enableAnim = settings.enableAnimations;

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    data.projects.forEach((proj) => {
      proj.tags.forEach((t) => tags.add(t));
    });
    return ['All', ...Array.from(tags)];
  }, [data.projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (selectedTag === 'All') return data.projects;
    return data.projects.filter((proj) => proj.tags.includes(selectedTag));
  }, [data.projects, selectedTag]);

  return (
    <section id="portfolio" className="relative py-20 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle title="Featured Portfolio" subtitle="My Work & Projects" />

        {/* Filter tags list */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 text-xs md:text-sm font-semibold tracking-wide uppercase transition-all duration-300 relative rounded-full ${
                selectedTag === tag
                  ? 'text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {selectedTag === tag && enableAnim && (
                <motion.span
                  layoutId="activeTagIndicator"
                  className="absolute inset-0 bg-gradient-primary rounded-full z-0"
                  transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
                />
              )}
              {selectedTag === tag && !enableAnim && (
                <span className="absolute inset-0 bg-gradient-primary rounded-full z-0" />
              )}
              <span className="relative z-10">{tag}</span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout={enableAnim} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-left"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj) => {
              const projectCard = (
                <Card
                  hoverable={true}
                  glow={true}
                  className="flex flex-col h-full overflow-hidden border-white/5"
                >
                  {/* Project Image */}
                  <div className="relative aspect-video w-full overflow-hidden border-b border-white/5 bg-black/40">
                    <img
                      src={proj.image}
                      alt={getLocalizedText(proj.title)}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    
                    {/* Hover links overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20">
                      {proj.liveLink && proj.liveLink !== '#' && (
                        <a
                          href={proj.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gradient-primary rounded-full text-white hover:scale-110 hover:shadow-lg hover:shadow-primary/20 transition-all"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      {proj.githubLink && proj.githubLink !== '#' && (
                        <a
                          href={proj.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/10 rounded-full text-white border border-white/10 hover:bg-white/20 hover:scale-110 transition-all"
                        >
                          <FaGithub className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6 flex flex-col gap-4 flex-grow justify-between">
                    <div className="flex flex-col gap-2">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {proj.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/5 px-2 py-0.5 border border-primary/10 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">
                        {getLocalizedText(proj.title)}
                      </h3>
                      
                      <p className="text-xs md:text-sm text-white/60 leading-relaxed font-medium">
                        {getLocalizedText(proj.description)}
                      </p>
                    </div>

                    {/* Bottom Links (visible on mobile / non-hover) */}
                    <div className="flex items-center gap-4 border-t border-white/5 pt-4 mt-2">
                      {proj.liveLink && proj.liveLink !== '#' && (
                        <a
                          href={proj.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4.5 h-4.5" />
                          <span>Live Site</span>
                        </a>
                      )}
                      {proj.githubLink && proj.githubLink !== '#' && (
                        <a
                          href={proj.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-white/50 hover:text-white transition-colors"
                        >
                          <FaGithub className="w-4.5 h-4.5" />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              );

              if (!enableAnim) {
                return (
                  <div key={proj.id} className="h-full">
                    {projectCard}
                  </div>
                );
              }

              return (
                <motion.div
                  key={proj.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {projectCard}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
