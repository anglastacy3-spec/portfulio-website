import type { ThemeSettings, AppData, FeedbackSubmission } from '@/types';
import { DEFAULT_THEME, DEFAULT_DATA } from '@/constants';

const THEME_KEY = 'angla_theme_settings';
const DATA_KEY = 'angla_page_content';
const FEEDBACK_KEY = 'angla_feedback_submissions';

export const CURRENT_CACHE_VERSION = 1;
const MAX_CACHE_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface CacheEnvelope<T> {
  version: number;
  updatedAt: number;
  data: T;
}

export const storageService = {
  // Theme Settings
  getThemeSettings(): ThemeSettings {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (!stored) {
        this.saveThemeSettings(DEFAULT_THEME);
        return DEFAULT_THEME;
      }
      const parsed = JSON.parse(stored);
      // Handle legacy un-wrapped cache or version mismatch
      const envelope: CacheEnvelope<ThemeSettings> = (parsed && typeof parsed === 'object' && 'version' in parsed)
        ? parsed
        : { version: 0, updatedAt: 0, data: parsed };

      if (envelope.version !== CURRENT_CACHE_VERSION || !envelope.data) {
        console.warn('[Cache Invalidation] Theme settings version mismatch. Clearing cache.');
        localStorage.removeItem(THEME_KEY);
        this.saveThemeSettings(DEFAULT_THEME);
        return DEFAULT_THEME;
      }

      const age = Date.now() - (envelope.updatedAt || 0);
      if (age > MAX_CACHE_AGE_MS) {
        console.warn(`[Cache Invalidation] Theme settings cache expired (age: ${Math.round(age / 1000 / 3600)}h). Clearing cache.`);
        localStorage.removeItem(THEME_KEY);
        return DEFAULT_THEME;
      }

      return envelope.data;
    } catch (e) {
      console.error('[Cache Invalidation] Error parsing stored theme settings, clearing cache:', e);
      localStorage.removeItem(THEME_KEY);
      return DEFAULT_THEME;
    }
  },

  saveThemeSettings(settings: ThemeSettings): void {
    try {
      const envelope: CacheEnvelope<ThemeSettings> = {
        version: CURRENT_CACHE_VERSION,
        updatedAt: Date.now(),
        data: settings,
      };
      localStorage.setItem(THEME_KEY, JSON.stringify(envelope));
    } catch (e) {
      console.error('Error saving theme settings', e);
    }
  },

  // Portfolio Content Data
  getAppData(): AppData {
    try {
      const stored = localStorage.getItem(DATA_KEY);
      if (!stored) {
        this.saveAppData(DEFAULT_DATA as AppData);
        return DEFAULT_DATA as AppData;
      }
      const parsed = JSON.parse(stored);
      // Handle legacy un-wrapped cache or version mismatch
      const envelope: CacheEnvelope<AppData> = (parsed && typeof parsed === 'object' && 'version' in parsed)
        ? parsed
        : { version: 0, updatedAt: 0, data: parsed };

      // Requirement 3: If version mismatches, clear cache
      if (envelope.version !== CURRENT_CACHE_VERSION || !envelope.data || !envelope.data.hero) {
        console.warn('[Cache Invalidation] AppData schema version mismatch or invalid format. Clearing cache.');
        localStorage.removeItem(DATA_KEY);
        this.saveAppData(DEFAULT_DATA as AppData);
        return DEFAULT_DATA as AppData;
      }

      // Requirement 4: If cache older than 24 hours, clear cache
      const age = Date.now() - (envelope.updatedAt || 0);
      if (age > MAX_CACHE_AGE_MS) {
        console.warn(`[Cache Invalidation] AppData cache expired (age: ${Math.round(age / 1000 / 3600)}h). Clearing cache.`);
        localStorage.removeItem(DATA_KEY);
        return DEFAULT_DATA as AppData;
      }

      return envelope.data;
    } catch (e) {
      // Requirement 5: If JSON parsing fails, clear cache
      console.error('[Cache Invalidation] Error parsing stored AppData JSON, clearing cache:', e);
      localStorage.removeItem(DATA_KEY);
      return DEFAULT_DATA as AppData;
    }
  },

  saveAppData(data: AppData): void {
    try {
      // Requirement 6: Always overwrite cache with version & timestamp
      const envelope: CacheEnvelope<AppData> = {
        version: CURRENT_CACHE_VERSION,
        updatedAt: Date.now(),
        data,
      };
      localStorage.setItem(DATA_KEY, JSON.stringify(envelope));
    } catch (e) {
      console.error('Error saving page content to cache', e);
    }
  },

  // Feedback submissions
  getFeedbacks(): FeedbackSubmission[] {
    try {
      const stored = localStorage.getItem(FEEDBACK_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      const envelope: CacheEnvelope<FeedbackSubmission[]> = (parsed && typeof parsed === 'object' && 'version' in parsed)
        ? parsed
        : { version: 0, updatedAt: 0, data: parsed };

      if (envelope.version !== CURRENT_CACHE_VERSION || !Array.isArray(envelope.data)) {
        localStorage.removeItem(FEEDBACK_KEY);
        return [];
      }
      return envelope.data;
    } catch (e) {
      localStorage.removeItem(FEEDBACK_KEY);
      return [];
    }
  },

  saveFeedbacks(submissions: FeedbackSubmission[]): void {
    try {
      const envelope: CacheEnvelope<FeedbackSubmission[]> = {
        version: CURRENT_CACHE_VERSION,
        updatedAt: Date.now(),
        data: submissions,
      };
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(envelope));
    } catch (e) {
      console.error('Error saving feedback submissions', e);
    }
  },

  addFeedback(submission: Omit<FeedbackSubmission, 'id' | 'timestamp'>): FeedbackSubmission {
    const feedbacks = this.getFeedbacks();
    const newSubmission: FeedbackSubmission = {
      ...submission,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    feedbacks.unshift(newSubmission);
    this.saveFeedbacks(feedbacks);
    return newSubmission;
  },

  deleteFeedback(id: string): void {
    const feedbacks = this.getFeedbacks();
    const filtered = feedbacks.filter((f) => f.id !== id);
    this.saveFeedbacks(filtered);
  },

  // Clear data
  resetAll(): void {
    localStorage.removeItem(THEME_KEY);
    localStorage.removeItem(DATA_KEY);
    localStorage.removeItem(FEEDBACK_KEY);
  },
};
