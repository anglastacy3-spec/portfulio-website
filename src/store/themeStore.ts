import { create } from 'zustand';
import type { ThemeSettings } from '@/types';
import { storageService } from '@/services/storageService';
import { apiService } from '@/services/apiService';
import { hexToRgb, adjustColorBrightness } from '@/utils/themeHelpers';
import { DEFAULT_THEME } from '@/constants';

interface ThemeState {
  settings: ThemeSettings;
  updateTheme: (newSettings: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
  applyCurrentTheme: () => void;
  fetchThemeFromDb: () => Promise<void>;
}

export const applyThemeToDom = (settings: ThemeSettings) => {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', settings.primaryColor);
  root.style.setProperty('--primary-hover', adjustColorBrightness(settings.primaryColor, -15));
  
  const primaryRgb = hexToRgb(settings.primaryColor);
  if (primaryRgb) {
    root.style.setProperty('--primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
  }
  
  root.style.setProperty('--secondary-color', settings.secondaryColor);
  const secondaryRgb = hexToRgb(settings.secondaryColor);
  if (secondaryRgb) {
    root.style.setProperty('--secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
  }
  
  root.style.setProperty('--bg-color', settings.bgColor);
  root.style.setProperty('--card-radius', settings.cardRadius);
  
  if (settings.enableGlow && primaryRgb) {
    root.style.setProperty('--glow-color', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.45)`);
  } else {
    root.style.setProperty('--glow-color', 'transparent');
  }
  
  const bgRgb = hexToRgb(settings.bgColor);
  if (bgRgb) {
    root.style.setProperty('--card-bg', `rgba(${bgRgb.r + 10}, ${bgRgb.g + 8}, ${bgRgb.b + 22}, 0.6)`);
    root.style.setProperty('--card-hover', `rgba(${bgRgb.r + 20}, ${bgRgb.g + 16}, ${bgRgb.b + 40}, 0.85)`);
  }

  if (settings.darkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>((set, get) => {
  const initialSettings = storageService.getThemeSettings();
  
  // Apply initially on load
  applyThemeToDom(initialSettings);

  // Auto-fetch from MongoDB on init
  apiService.getThemeSettings().then((dbTheme) => {
    if (dbTheme) {
      set({ settings: dbTheme });
      storageService.saveThemeSettings(dbTheme);
      applyThemeToDom(dbTheme);
    }
  });

  return {
    settings: initialSettings,
    fetchThemeFromDb: async () => {
      const dbTheme = await apiService.getThemeSettings();
      if (dbTheme) {
        set({ settings: dbTheme });
        storageService.saveThemeSettings(dbTheme);
        applyThemeToDom(dbTheme);
      }
    },
    updateTheme: async (newSettings) => {
      const updated = { ...get().settings, ...newSettings };
      set({ settings: updated });
      applyThemeToDom(updated);
      const success = await apiService.updateThemeSettings(updated);
      if (success) {
        storageService.saveThemeSettings(updated);
      } else {
        console.warn('MongoDB theme sync failed. LocalStorage persistence skipped.');
      }
    },
    resetTheme: async () => {
      set({ settings: DEFAULT_THEME });
      applyThemeToDom(DEFAULT_THEME);
      const success = await apiService.updateThemeSettings(DEFAULT_THEME);
      if (success) {
        storageService.saveThemeSettings(DEFAULT_THEME);
      }
    },
    applyCurrentTheme: () => {
      applyThemeToDom(get().settings);
    }
  };
});

