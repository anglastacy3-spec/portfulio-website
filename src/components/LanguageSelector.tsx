import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, changeLanguage } from '@/i18n/i18n';

interface LanguageSelectorProps {
  className?: string;
  align?: 'left' | 'right';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '', 
  align = 'right' 
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (code: string) => {
    await changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative z-50 ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 select-none text-xs font-semibold tracking-wide"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline">{currentLang.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute mt-2 w-48 rounded-xl bg-[#120c26]/95 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl p-1.5 flex flex-col gap-1 transition-all duration-300 ${
            align === 'left' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
          }`}
        >
          <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isActive = lang.code === currentLang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-primary text-white font-bold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex-grow text-left">{lang.name}</span>
                  {isActive && <Check className="w-3.5 h-3.5 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
