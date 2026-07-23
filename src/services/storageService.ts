import type { ThemeSettings, AppData, FeedbackSubmission } from '@/types';
import { DEFAULT_THEME, DEFAULT_DATA } from '@/constants';

const THEME_KEY = 'angla_theme_settings';
const DATA_KEY = 'angla_page_content';
const FEEDBACK_KEY = 'angla_feedback_submissions';

export const storageService = {
  // Theme Settings
  getThemeSettings(): ThemeSettings {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (!stored) {
        // Save defaults if not present
        this.saveThemeSettings(DEFAULT_THEME);
        return DEFAULT_THEME;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading theme settings, using defaults', e);
      return DEFAULT_THEME;
    }
  },

  saveThemeSettings(settings: ThemeSettings): void {
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(settings));
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
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading page content, using defaults', e);
      return DEFAULT_DATA as AppData;
    }
  },

  saveAppData(data: AppData): void {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving page content', e);
    }
  },

  // Feedback submissions
  getFeedbacks(): FeedbackSubmission[] {
    try {
      const stored = localStorage.getItem(FEEDBACK_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error loading feedback submissions', e);
      return [];
    }
  },

  saveFeedbacks(submissions: FeedbackSubmission[]): void {
    try {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(submissions));
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
