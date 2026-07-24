import React, { useEffect } from 'react';
import { PageTransition } from '@/components/PageTransition';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/sections/Hero';
import { Socials } from '@/sections/Socials';
import { Services } from '@/sections/Services';
import { Contact } from '@/sections/Contact';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useContentStore } from '@/store/contentStore';
import { useThemeStore } from '@/store/themeStore';

export const Home: React.FC = () => {
  const fetchFromDb = useContentStore((state) => state.fetchFromDb);
  const fetchThemeFromDb = useThemeStore((state) => state.fetchThemeFromDb);

  useEffect(() => {
    fetchFromDb();
    fetchThemeFromDb();
  }, [fetchFromDb, fetchThemeFromDb]);

  return (
    <PageTransition>
      <LoadingScreen />
      <Navbar />
      <div className="relative min-h-screen bg-[#070414] overflow-x-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.05),transparent_50%)] pointer-events-none" />
        
        <Hero />
        <Socials />
        <Services />
        <Contact />
      </div>
    </PageTransition>
  );
};
export default Home;
