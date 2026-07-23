import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

import { useContentStore } from '@/store/contentStore';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useContentStore();
  const logo = data.logo || { logoText: 'AS', logoImage: '', brandName: 'AnglaStacy' };
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  const navLinks = [
    { label: t('nav.home', 'Home'), target: 'home' },
    { label: t('nav.socials', 'Socials'), target: 'socials' },
    { label: t('nav.services', 'Services'), target: 'services' },
    { label: t('nav.feedback', 'Feedback'), target: 'contact' },
  ];

  // Track scroll position to add glass effect and active section highlight
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (isHome) {
        const sections = navLinks.map(link => document.getElementById(link.target));
        const scrollPosition = window.scrollY + 200;

        for (const section of sections) {
          if (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section.id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleLinkClick = (target: string) => {
    setIsOpen(false);
    if (isHome) {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { replace: false });
      // Short delay to let page mount, then scroll
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onDoubleClick={() => navigate('/admin')}
          className="flex items-center gap-2 group cursor-pointer select-none"
          title="Double-click to access Admin Panel"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center border border-white/10 group-hover:shadow-[0_0_15px_var(--glow-color)] transition-all duration-300 overflow-hidden shrink-0">
            {logo.logoImage ? (
              <img src={logo.logoImage} alt={logo.brandName || 'Logo'} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-black text-white tracking-widest pl-0.5">
                {logo.logoText || 'AS'}
              </span>
            )}
          </div>
          <span className="text-base md:text-lg font-bold text-white tracking-wide group-hover:text-primary transition-colors">
            {(() => {
              const fullStr = logo.brandName || 'AnglaStacy';
              const parts = fullStr.split(/(?=[A-Z])|\s+/).filter(Boolean);
              if (parts.length > 1) {
                return (
                  <>
                    {parts[0]}<span className="text-primary font-light">{parts.slice(1).join('')}</span>
                  </>
                );
              }
              return fullStr;
            })()}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.target}>
                <button
                  onClick={() => handleLinkClick(link.target)}
                  className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-white/15 relative py-1 uppercase text-xs ${
                    activeSection === link.target && isHome
                      ? 'text-primary'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {link.label}
                  {activeSection === link.target && isHome && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-primary rounded-full" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Actions (Language Selector & Mobile Trigger) */}
        <div className="flex items-center gap-3">
          <LanguageSelector align="right" />
          
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg border border-white/5"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] bg-[#070414]/95 backdrop-blur-lg z-30 border-t border-white/5 flex flex-col p-6 gap-6">
          <ul className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <li key={link.target} className="w-full">
                <button
                  onClick={() => handleLinkClick(link.target)}
                  className={`text-lg font-semibold tracking-wide w-full text-left py-2 border-b border-white/5 transition-colors uppercase text-sm ${
                    activeSection === link.target && isHome
                      ? 'text-primary'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};
