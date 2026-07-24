import type { AppData, FeedbackSubmission, ThemeSettings } from '@/types';

const API_BASE = '/api';

async function safeJsonFetch<T>(url: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    if (!res.ok) {
      const textPreview = (await res.text()).slice(0, 200);
      console.error(`[API Error ${res.status}] HTTP fetch failed for ${url}`, {
        status: res.status,
        statusText: res.statusText,
        contentType,
        preview: textPreview,
      });
      return null;
    }

    if (!contentType.includes('application/json')) {
      const textPreview = (await res.text()).slice(0, 200);
      console.error(`[API Header Mismatch] Expected application/json but received '${contentType}' for ${url}`, {
        status: res.status,
        contentType,
        preview: textPreview,
      });
      if (textPreview.includes('<!DOCTYPE html>') || textPreview.includes('Log in to Vercel') || textPreview.includes('vercel-login')) {
        console.error('🚨 CRITICAL VERCEL CONFIGURATION ERROR: Vercel Deployment Protection or Authentication gate is intercepting API requests and serving HTML login pages to visitors. Disable Vercel Authentication in Project Settings.');
      }
      return null;
    }

    const data = await res.json();
    return data as T;
  } catch (err: any) {
    console.error(`[API Fetch Exception] Failed to execute API call for ${url}:`, err);
    return null;
  }
}

export const apiService = {
  // App Data
  async getAppData(): Promise<AppData | null> {
    return safeJsonFetch<AppData>(`${API_BASE}/data?t=${Date.now()}`, { cache: 'no-store' });
  },

  async updateAppData(data: AppData): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const text = (await res.text()).slice(0, 200);
        console.error(`[API PUT Failure ${res.status}] ${text}`);
      }
      return res.ok;
    } catch (err) {
      console.error('Failed to sync app data with MongoDB', err);
      return false;
    }
  },

  // Feedbacks
  async getFeedbacks(): Promise<FeedbackSubmission[] | null> {
    return safeJsonFetch<FeedbackSubmission[]>(`${API_BASE}/feedbacks?t=${Date.now()}`, { cache: 'no-store' });
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
    return safeJsonFetch<ThemeSettings>(`${API_BASE}/theme?t=${Date.now()}`, { cache: 'no-store' });
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
