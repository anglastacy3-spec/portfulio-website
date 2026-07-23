import { create } from 'zustand';
import type { AppData, HeroData, BrandLogo, SocialLink, ServiceItem, ProjectItem, TestimonialItem, SeoSettings, FeedbackSubmission } from '@/types';
import { storageService } from '@/services/storageService';
import { apiService } from '@/services/apiService';
import { DEFAULT_DATA } from '@/constants';

interface ContentState {
  data: AppData;
  feedbacks: FeedbackSubmission[];
  
  fetchFromDb: () => Promise<void>;
  
  // Actions
  updateHero: (hero: Partial<HeroData>) => void;
  updateLogo: (logo: Partial<BrandLogo>) => void;
  updateAboutBio: (bio: string) => void;
  
  // Skills CRUD
  updateSkills: (skills: AppData['about']['skills']) => void;
  
  // Experience CRUD
  addExperience: (exp: Omit<AppData['about']['experience'][number], 'id'>) => void;
  updateExperience: (id: string, exp: Partial<AppData['about']['experience'][number]>) => void;
  deleteExperience: (id: string) => void;
  
  // Social Links CRUD
  updateSocials: (socials: SocialLink[]) => void;
  addSocialLink: (social: Omit<SocialLink, 'id'>) => void;
  updateSocialLink: (id: string, social: Partial<SocialLink>) => void;
  deleteSocialLink: (id: string) => void;
  toggleSocialStatus: (id: string) => void;
  
  // Services CRUD
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  
  // Projects CRUD
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, project: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  
  // Testimonials CRUD
  addTestimonial: (testimonial: Omit<TestimonialItem, 'id'>) => void;
  updateTestimonial: (id: string, testimonial: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string) => void;
  
  // SEO Actions
  updateSeo: (seo: Partial<SeoSettings>) => void;
  
  // Feedback Actions
  addFeedback: (fb: Omit<FeedbackSubmission, 'id' | 'timestamp'>) => void;
  deleteFeedback: (id: string) => void;
  
  // Reset
  resetData: () => void;
}

export function updateFavicon(url: string) {
  if (!url) return;
  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'shortcut icon';
    document.head.appendChild(link);
  }
  link.href = url;
}

export const useContentStore = create<ContentState>((set, get) => {
  const initialData = storageService.getAppData();
  if (initialData.seo?.favicon) {
    updateFavicon(initialData.seo.favicon);
  }
  
  // Migration: replace Twitter with Snapchat if present in existing localStorage state
  const hasTwitter = initialData.socials.some(s => (s.name as string) === 'Twitter/X' || (s.name as string) === 'Twitter');
  if (hasTwitter) {
    initialData.socials = initialData.socials.map(s => 
      ((s.name as string) === 'Twitter/X' || (s.name as string) === 'Twitter')
        ? { ...s, name: 'Snapchat' as const, url: 'https://snapchat.com/add/anglastacy', username: '/anglastacy' }
        : s
    );
    storageService.saveAppData(initialData);
  }

  const initialFeedbacks = storageService.getFeedbacks();

  // Async sync with MongoDB & LocalStorage
  const sync = (updatedData: AppData) => {
    set({ data: updatedData });
    storageService.saveAppData(updatedData);
    apiService.updateAppData(updatedData);
  };

  // Auto-fetch from MongoDB on init
  apiService.getAppData().then((dbData) => {
    if (dbData) {
      set({ data: dbData });
      storageService.saveAppData(dbData);
      if (dbData.seo?.favicon) updateFavicon(dbData.seo.favicon);
    }
  });

  apiService.getFeedbacks().then((dbFeedbacks) => {
    if (dbFeedbacks) {
      set({ feedbacks: dbFeedbacks });
    }
  });

  return {
    data: initialData,
    feedbacks: initialFeedbacks,

    fetchFromDb: async () => {
      const dbData = await apiService.getAppData();
      const dbFeedbacks = await apiService.getFeedbacks();
      if (dbData) {
        set({ data: dbData });
        storageService.saveAppData(dbData);
      }
      if (dbFeedbacks) {
        set({ feedbacks: dbFeedbacks });
      }
    },

    updateHero: (hero) => {
      const updated = { ...get().data, hero: { ...get().data.hero, ...hero } };
      sync(updated);
    },

    updateLogo: (logo) => {
      const updated = {
        ...get().data,
        logo: {
          logoText: 'AS',
          brandName: 'AnglaStacy',
          ...(get().data.logo || {}),
          ...logo,
        },
      };
      sync(updated);
    },

    updateAboutBio: (bio) => {
      const updated = { ...get().data, about: { ...get().data.about, bio } };
      sync(updated);
    },

    updateSkills: (skills) => {
      const updated = { ...get().data, about: { ...get().data.about, skills } };
      sync(updated);
    },

    addExperience: (exp) => {
      const newExp = { ...exp, id: Math.random().toString(36).substr(2, 9) };
      const updated = {
        ...get().data,
        about: {
          ...get().data.about,
          experience: [...get().data.about.experience, newExp],
        },
      };
      sync(updated);
    },

    updateExperience: (id, exp) => {
      const updatedList = get().data.about.experience.map((item) =>
        item.id === id ? { ...item, ...exp } : item
      );
      const updated = {
        ...get().data,
        about: { ...get().data.about, experience: updatedList },
      };
      sync(updated);
    },

    deleteExperience: (id) => {
      const updatedList = get().data.about.experience.filter((item) => item.id !== id);
      const updated = {
        ...get().data,
        about: { ...get().data.about, experience: updatedList },
      };
      sync(updated);
    },

    updateSocials: (socials) => {
      const updated = { ...get().data, socials };
      sync(updated);
    },

    addSocialLink: (social) => {
      const newSocial: SocialLink = {
        ...social,
        id: Math.random().toString(36).substr(2, 9),
        sortOrder: social.sortOrder ?? (get().data.socials.length + 1),
        isActive: social.isActive ?? true,
      };
      const updated = {
        ...get().data,
        socials: [...get().data.socials, newSocial],
      };
      sync(updated);
    },

    updateSocialLink: (id, social) => {
      const updatedList = get().data.socials.map((item) =>
        item.id === id ? { ...item, ...social } : item
      );
      const updated = { ...get().data, socials: updatedList };
      sync(updated);
    },

    deleteSocialLink: (id) => {
      const updatedList = get().data.socials.filter((item) => item.id !== id);
      const updated = { ...get().data, socials: updatedList };
      sync(updated);
    },

    toggleSocialStatus: (id) => {
      const updatedList = get().data.socials.map((item) =>
        item.id === id ? { ...item, isActive: !(item.isActive ?? true) } : item
      );
      const updated = { ...get().data, socials: updatedList };
      sync(updated);
    },

    addService: (service) => {
      const newService = { ...service, id: Math.random().toString(36).substr(2, 9) };
      const updated = {
        ...get().data,
        services: [...get().data.services, newService],
      };
      sync(updated);
    },

    updateService: (id, service) => {
      const updatedList = get().data.services.map((item) =>
        item.id === id ? { ...item, ...service } : item
      );
      const updated = { ...get().data, services: updatedList };
      sync(updated);
    },

    deleteService: (id) => {
      const updatedList = get().data.services.filter((item) => item.id !== id);
      const updated = { ...get().data, services: updatedList };
      sync(updated);
    },

    addProject: (project) => {
      const newProject = { ...project, id: Math.random().toString(36).substr(2, 9) };
      const updated = {
        ...get().data,
        projects: [...get().data.projects, newProject],
      };
      sync(updated);
    },

    updateProject: (id, project) => {
      const updatedList = get().data.projects.map((item) =>
        item.id === id ? { ...item, ...project } : item
      );
      const updated = { ...get().data, projects: updatedList };
      sync(updated);
    },

    deleteProject: (id) => {
      const updatedList = get().data.projects.filter((item) => item.id !== id);
      const updated = { ...get().data, projects: updatedList };
      sync(updated);
    },

    addTestimonial: (testimonial) => {
      const newTestimonial = { ...testimonial, id: Math.random().toString(36).substr(2, 9) };
      const updated = {
        ...get().data,
        testimonials: [...get().data.testimonials, newTestimonial],
      };
      sync(updated);
    },

    updateTestimonial: (id, testimonial) => {
      const updatedList = get().data.testimonials.map((item) =>
        item.id === id ? { ...item, ...testimonial } : item
      );
      const updated = { ...get().data, testimonials: updatedList };
      sync(updated);
    },

    deleteTestimonial: (id) => {
      const updatedList = get().data.testimonials.filter((item) => item.id !== id);
      const updated = { ...get().data, testimonials: updatedList };
      sync(updated);
    },

    updateSeo: (seo) => {
      const updated = { ...get().data, seo: { ...get().data.seo, ...seo } };
      sync(updated);
      
      // Update SEO settings instantly in document head
      document.title = updated.seo.title;
      let descMeta = document.querySelector('meta[name="description"]');
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', updated.seo.description);

      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta');
        keywordsMeta.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.setAttribute('content', updated.seo.keywords);

      if (updated.seo.favicon) {
        updateFavicon(updated.seo.favicon);
      }
    },

    addFeedback: async (fb) => {
      const savedFb = await apiService.addFeedback(fb);
      const fallbackFb = savedFb || storageService.addFeedback(fb);
      set({ feedbacks: [fallbackFb, ...get().feedbacks.filter(f => f.id !== fallbackFb.id)] });
    },

    deleteFeedback: async (id) => {
      await apiService.deleteFeedback(id);
      storageService.deleteFeedback(id);
      set({ feedbacks: get().feedbacks.filter((f) => f.id !== id) });
    },

    resetData: async () => {
      await apiService.resetAll();
      storageService.resetAll();
      const defaultData = DEFAULT_DATA;
      set({ data: defaultData, feedbacks: [] });
      storageService.saveAppData(defaultData);
      
      document.title = defaultData.seo.title;
    }
  };
});
