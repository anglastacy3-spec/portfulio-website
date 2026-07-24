import type { AppData, FeedbackSubmission, ThemeSettings } from '@/types';

const API_BASE = '/api';

export const apiService = {
  // App Data
  async getAppData(): Promise<AppData | null> {
    try {
      const res = await fetch(`${API_BASE}/data?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Backend API unavailable, falling back to localStorage/defaults', err);
      return null;
    }
  },

  async updateAppData(data: AppData): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to sync app data with MongoDB', err);
      return false;
    }
  },

  // Feedbacks
  async getFeedbacks(): Promise<FeedbackSubmission[] | null> {
    try {
      const res = await fetch(`${API_BASE}/feedbacks?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('Backend API unavailable for feedbacks', err);
      return null;
    }
  },

  async addFeedback(submission: Omit<FeedbackSubmission, 'id' | 'timestamp'>): Promise<FeedbackSubmission | null> {
    try {
      const newFb: FeedbackSubmission = {
        ...submission,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      };
      const res = await fetch(`${API_BASE}/feedbacks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFb),
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (err) {
      console.error('Failed to save feedback to MongoDB', err);
      return null;
    }
  },

  async deleteFeedback(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/feedbacks/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to delete feedback from MongoDB', err);
      return false;
    }
  },

  // Theme
  async getThemeSettings(): Promise<ThemeSettings | null> {
    try {
      const res = await fetch(`${API_BASE}/theme?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('Backend API unavailable for theme', err);
      return null;
    }
  },

  async updateThemeSettings(settings: ThemeSettings): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/theme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to sync theme with MongoDB', err);
      return false;
    }
  },

  // Reset
  async resetAll(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
      return res.ok;
    } catch (err) {
      console.error('Failed to reset MongoDB data', err);
      return false;
    }
  },
};
