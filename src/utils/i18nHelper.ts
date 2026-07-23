import i18n from 'i18next';

/**
 * Generic, data-driven localization utility.
 * Resolves any dynamic field that is either:
 * 1. A localized dictionary object: { en: '...', ja: '...', zh: '...', fr: '...', ar: '...' }
 * 2. A string value or i18n resource key.
 */
export function getLocalizedText(
  value: string | Record<string, string> | undefined | null,
  fallbackValue?: string
): string {
  const currentLang = i18n.language || 'en';

  if (!value) return fallbackValue || '';

  // 1. If value is a localized dictionary object { en: '...', ja: '...', zh: '...' }
  if (typeof value === 'object' && value !== null) {
    return (
      value[currentLang] ||
      value['en'] ||
      Object.values(value)[0] ||
      fallbackValue ||
      ''
    );
  }

  // 2. If value is a string
  if (typeof value === 'string') {
    if (i18n.exists(value)) {
      const translated = i18n.t(value);
      if (translated && translated !== value) return translated;
    }
    return value;
  }

  return String(value);
}

// Alias for backwards compatibility
export const getLocalizedContent = (
  value: string | Record<string, string> | undefined | null,
  fallbackKey?: string,
  defaultFallback?: string
) => {
  if (fallbackKey && (!value || typeof value === 'string')) {
    if (i18n.exists(fallbackKey)) {
      const translated = i18n.t(fallbackKey);
      if (translated && translated !== fallbackKey) return translated;
    }
  }
  return getLocalizedText(value, defaultFallback);
};

/**
 * Safely updates a localized field for the target language without overwriting other translations.
 */
export function setLocalizedContent(
  existing: string | Record<string, string> | undefined | null,
  newValue: string,
  lang: string = i18n.language || 'en'
): Record<string, string> {
  let dict: Record<string, string> = {};

  if (typeof existing === 'object' && existing !== null) {
    dict = { ...existing };
  } else if (typeof existing === 'string' && existing.trim()) {
    dict = { en: existing };
  }

  dict[lang] = newValue;
  return dict;
}
