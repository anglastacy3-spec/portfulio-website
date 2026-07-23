import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export interface Language {
  code: string;
  name: string;
  isRtl: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', isRtl: false },
  { code: 'bn', name: 'বাংলা', isRtl: false },
  { code: 'hi', name: 'हिन्दी', isRtl: false },
  { code: 'ja', name: '日本語', isRtl: false },
  { code: 'ko', name: '한국어', isRtl: false },
  { code: 'zh', name: '中文', isRtl: false },
  { code: 'fr', name: 'Français', isRtl: false },
  { code: 'de', name: 'Deutsch', isRtl: false },
  { code: 'es', name: 'Español', isRtl: false },
  { code: 'ar', name: 'العربية', isRtl: true },
  { code: 'pt', name: 'Português', isRtl: false },
  { code: 'ru', name: 'Русский', isRtl: false },
  { code: 'it', name: 'Italiano', isRtl: false },
];

const loadLocale = async (lng: string) => {
  switch (lng) {
    case 'bn': return import('./locales/bn/common.json');
    case 'hi': return import('./locales/hi/common.json');
    case 'ja': return import('./locales/ja/common.json');
    case 'ko': return import('./locales/ko/common.json');
    case 'zh': return import('./locales/zh/common.json');
    case 'fr': return import('./locales/fr/common.json');
    case 'de': return import('./locales/de/common.json');
    case 'es': return import('./locales/es/common.json');
    case 'ar': return import('./locales/ar/common.json');
    case 'pt': return import('./locales/pt/common.json');
    case 'ru': return import('./locales/ru/common.json');
    case 'it': return import('./locales/it/common.json');
    case 'en':
    default:
      return import('./locales/en/common.json');
  }
};

const detectorOptions = {
  order: ['localStorage', 'navigator'],
  lookupLocalStorage: 'i18nextLng',
  caches: ['localStorage'],
};

export const initI18n = async () => {
  let detectedLng = localStorage.getItem('i18nextLng');
  if (!detectedLng) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // Max 2 seconds timeout
      
      const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const data = await res.json();
        // ipapi.co returns languages as "en-US,es-US,ca". Extract first main code e.g. "en"
        const ipLang = data.languages?.split(',')[0]?.split('-')[0]?.toLowerCase();
        if (ipLang && SUPPORTED_LANGUAGES.some((l) => l.code === ipLang)) {
          detectedLng = ipLang;
        }
      }
    } catch (e) {
      console.warn('IP-based language detection failed/timed out, falling back to browser settings.', e);
    }

    if (!detectedLng) {
      const navLanguages = navigator.languages || [navigator.language || 'en'];
      for (const langStr of navLanguages) {
        const code = langStr.split('-')[0].toLowerCase();
        if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
          detectedLng = code;
          break;
        }
      }
    }
    if (!detectedLng) detectedLng = 'en';
  } else {
    const isSupported = SUPPORTED_LANGUAGES.some((l) => l.code === detectedLng);
    if (!isSupported) {
      detectedLng = 'en';
    }
  }

  let resource;
  try {
    resource = await loadLocale(detectedLng);
  } catch (error) {
    console.error(`Failed to load locale: ${detectedLng}, falling back to English`, error);
    detectedLng = 'en';
    resource = await loadLocale('en');
  }

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        [detectedLng]: {
          common: resource.default || resource,
        },
      },
      lng: detectedLng,
      fallbackLng: 'en',
      ns: ['common'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      detection: detectorOptions,
    });

  updateHtmlAttributes(detectedLng);
};

export const changeLanguage = async (lng: string) => {
  const isSupported = SUPPORTED_LANGUAGES.some((l) => l.code === lng);
  const targetLng = isSupported ? lng : 'en';

  if (!i18n.hasResourceBundle(targetLng, 'common')) {
    try {
      const resource = await loadLocale(targetLng);
      i18n.addResourceBundle(targetLng, 'common', resource.default || resource, true, true);
    } catch (error) {
      console.error(`Error loading locale bundles for ${targetLng}`, error);
    }
  }

  await i18n.changeLanguage(targetLng);
  localStorage.setItem('i18nextLng', targetLng);
  updateHtmlAttributes(targetLng);
};

export const updateHtmlAttributes = (lng: string) => {
  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === lng) || SUPPORTED_LANGUAGES[0];
  document.documentElement.lang = lng;
  document.documentElement.dir = langConfig.isRtl ? 'rtl' : 'ltr';

  let metaOgLocale = document.querySelector('meta[property="og:locale"]');
  if (!metaOgLocale) {
    metaOgLocale = document.createElement('meta');
    metaOgLocale.setAttribute('property', 'og:locale');
    document.head.appendChild(metaOgLocale);
  }
  metaOgLocale.setAttribute('content', lng);
};

export default i18n;
