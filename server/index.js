import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import AppData from './models/AppData.js';
import Feedback from './models/Feedback.js';
import Theme from './models/Theme.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Default Initial Seed Data
const DEFAULT_THEME = {
  key: 'main_theme',
  primaryColor: '#a855f7',
  secondaryColor: '#ec4899',
  bgColor: '#0b071e',
  cardRadius: '16px',
  enableGlow: true,
  enableAnimations: true,
  darkMode: true,
};

const DEFAULT_DATA = {
  key: 'main_content',
  hero: {
    name: 'Angla Stacy',
    subtitle: "Hello, I'm",
    description: 'A passionate individual exploring ideas, creating solutions & building the future.',
    avatar: '',
    heroBg: '',
  },
  about: {
    bio: 'I am a Senior Frontend Engineer with over 6 years of experience specializing in building beautiful, highly interactive web applications. I focus on pixel-perfect details, immersive animations, and clean architectures that deliver world-class user experiences.',
    skills: [
      { name: 'React / Next.js', level: 95, category: 'Frontend' },
      { name: 'TypeScript', level: 92, category: 'Frontend' },
      { name: 'Tailwind CSS', level: 98, category: 'Frontend' },
      { name: 'Framer Motion', level: 90, category: 'Frontend' },
      { name: 'Zustand & State Management', level: 88, category: 'Frontend' },
      { name: 'UI/UX & Figma', level: 85, category: 'Design' },
    ],
    experience: [
      {
        id: 'exp1',
        year: '2024 - Present',
        role: 'Senior UI/UX Engineer',
        company: 'Vortex Labs',
        description: 'Led development of highly animated React applications, designing state-of-the-art interactive dashboards and custom UI frameworks.',
      },
      {
        id: 'exp2',
        year: '2022 - 2024',
        role: 'Frontend Developer',
        company: 'PixelForge Studio',
        description: 'Created premium, glassmorphic customer landing pages with responsive animations and state management stores.',
      },
      {
        id: 'exp3',
        year: '2020 - 2022',
        role: 'UI Designer & Web Developer',
        company: 'Aether Tech',
        description: 'Designed and built clean, modular websites for client startups. Focused on SEO, accessibility, and high performance.',
      },
    ],
  },
  socials: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/anglastacy', username: '/anglastacy' },
    { id: '2', name: 'Telegram', url: 'https://t.me/anglastacy', username: '/anglastacy' },
    { id: '3', name: 'WhatsApp', url: 'https://wa.me/1234567890', username: '/anglastacy' },
    { id: '4', name: 'Facebook', url: 'https://facebook.com/anglastacy', username: '/anglastacy' },
    { id: '5', name: 'TikTok', url: 'https://tiktok.com/@anglastacy', username: '/anglastacy' },
    { id: '6', name: 'Snapchat', url: 'https://snapchat.com/add/anglastacy', username: '/anglastacy' },
  ],
  services: [
    { id: '1', title: 'Personal Services', description: 'Discreet, professional and tailored experiences to meet your individual needs.', iconName: 'UserHeart', iconColor: '#c084fc' },
    { id: '2', title: 'Casual Encounters', description: 'Enjoy relaxed and spontaneous meetups with like-minded people.', iconName: 'Heart', iconColor: '#ec4899' },
    { id: '3', title: 'Short Term Relationships', description: 'Build meaningful connections and enjoy companionship for the short term.', iconName: 'CalendarHeart', iconColor: '#60a5fa' },
    { id: '4', title: 'Dating', description: 'Find genuine connections and explore potential for long-term relationships.', iconName: 'DoubleHeart', iconColor: '#f97316' },
  ],
  projects: [
    { id: '1', title: 'Nova SaaS Dashboard', description: 'A modern, high-performance analytic dashboard featuring dynamic charts, glassmorphic layout, and live data telemetry streams.', image: '', liveLink: '#', githubLink: '#', tags: ['React', 'TypeScript', 'Tailwind', 'Recharts'] },
    { id: '2', title: 'Aether Crypto Terminal', description: 'Real-time cryptocurrency tracking platform featuring smooth dark luxury animations, customized theme selectors, and state management.', image: '', liveLink: '#', githubLink: '#', tags: ['Vite', 'Zustand', 'Tailwind', 'Framer Motion'] },
  ],
  testimonials: [
    { id: '1', name: 'Sarah Connor', avatar: '', rating: 5, comment: 'Angla is an absolute wizard! The landing page is incredibly premium, responsive, and was built ahead of schedule. Highly recommended!' },
    { id: '2', name: 'David Miller', avatar: '', rating: 5, comment: 'Working with Angla was an absolute pleasure. The design aesthetics and attention to detail are on another level.' },
  ],
  seo: {
    title: 'Angla Stacy | Portfolio',
    description: 'Welcome to the premium portfolio of Angla Stacy. Explore full-stack applications, interactive UI/UX designs, and clean frontend engineering projects.',
    keywords: 'React, TypeScript, Portfolio, UI/UX Designer, Tailwind CSS, Frontend Developer',
  },
};

// In-memory response cache for fast <1ms reads
let cachedAppData = null;
let cachedTheme = null;

// Seed initial data if empty
async function seedDefaultData() {
  try {
    const existingData = await AppData.findOne({ key: 'main_content' }).lean();
    if (!existingData) {
      const created = await AppData.create(DEFAULT_DATA);
      cachedAppData = created.toObject();
      console.log('⚡ Initial AppData seeded into MongoDB.');
    } else {
      cachedAppData = existingData;
    }

    const existingTheme = await Theme.findOne({ key: 'main_theme' }).lean();
    if (!existingTheme) {
      const created = await Theme.create(DEFAULT_THEME);
      cachedTheme = created.toObject();
      console.log('⚡ Initial ThemeSettings seeded into MongoDB.');
    } else {
      cachedTheme = existingTheme;
    }
  } catch (err) {
    console.error('Error seeding default data:', err);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// App Data Routes
app.get('/api/data', async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=30, s-maxage=120, stale-while-revalidate=300');
    if (cachedAppData) {
      return res.json(cachedAppData);
    }
    let data = await AppData.findOne({ key: 'main_content' }).lean();
    if (!data) {
      const created = await AppData.create(DEFAULT_DATA);
      data = created.toObject();
    }
    cachedAppData = data;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/data', async (req, res) => {
  try {
    const updated = await AppData.findOneAndUpdate(
      { key: 'main_content' },
      { $set: req.body },
      { new: true, upsert: true, runValidators: false }
    ).lean();
    cachedAppData = updated;
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feedbacks Routes
app.get('/api/feedbacks', async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=10, stale-while-revalidate=60');
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/feedbacks', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json(feedback.toObject());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/feedbacks/:id', async (req, res) => {
  try {
    await Feedback.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Theme Routes
app.get('/api/theme', async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=60, s-maxage=300');
    if (cachedTheme) {
      return res.json(cachedTheme);
    }
    let theme = await Theme.findOne({ key: 'main_theme' }).lean();
    if (!theme) {
      const created = await Theme.create(DEFAULT_THEME);
      theme = created.toObject();
    }
    cachedTheme = theme;
    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/theme', async (req, res) => {
  try {
    const updated = await Theme.findOneAndUpdate(
      { key: 'main_theme' },
      { $set: req.body },
      { new: true, upsert: true }
    ).lean();
    cachedTheme = updated;
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset Route
app.post('/api/reset', async (req, res) => {
  try {
    cachedAppData = null;
    cachedTheme = null;
    await AppData.deleteOne({ key: 'main_content' });
    await Theme.deleteOne({ key: 'main_theme' });
    await Feedback.deleteMany({});
    
    const newAppData = await AppData.create(DEFAULT_DATA);
    const newTheme = await Theme.create(DEFAULT_THEME);
    
    cachedAppData = newAppData.toObject();
    cachedTheme = newTheme.toObject();
    
    res.json({ success: true, data: cachedAppData, theme: cachedTheme });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server & Connect Database
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is missing.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully.');
    seedDefaultData();
    app.listen(PORT, () => {
      console.log(`🚀 Express Backend Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Failure:', err);
  });
