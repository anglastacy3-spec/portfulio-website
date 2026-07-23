# 🚀 UsaBabes Portfolio Website - Angla Stacy

A premium, highly interactive, and responsive portfolio website featuring a glassmorphic design, dynamic dark luxury styling, 13+ languages (internationalization), and a fully-featured Admin Dashboard for real-time content management.

---

## 🌟 Features

- **Dynamic Theme Engine**: Real-time styling adjustments (colors, glow effects, animations, border radius) managed directly from the Admin Panel.
- **Admin Dashboard**: Full CRUD interface to update hero sections, work experiences, services, testimonials, social links, and projects.
- **Internationalization (i18n)**: Out-of-the-box support for 13 languages (English, Arabic, Bengali, German, Spanish, French, Hindi, Italian, Japanese, Korean, Portuguese, Russian, and Chinese) with automatic language detection.
- **Robust Backend**: Node.js Express backend backed by MongoDB Atlas with automatic initial seeding of default content and themes.
- **Cloudinary Integration**: Dynamic and optimized image uploads directly from the Admin Panel for avatars and backgrounds.
- **Modern UI Components**: Powered by Framer Motion for premium micro-interactions, Tailwind CSS, Lucide React, and React Hook Form + Zod.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Vanilla CSS (Glassmorphism & Glow effects)
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Internationalization**: i18next + i18next-browser-languagedetector
- **Forms & Validation**: React Hook Form + Zod

### Backend
- **Framework**: Node.js + Express
- **Database**: MongoDB Atlas + Mongoose
- **Image Hosting**: Cloudinary
- **Environment Management**: Dotenv

---

## 📁 Project Structure

```text
├── public/                  # Static assets & SVG icons
├── server/                  # Node.js + Express backend
│   ├── models/              # Mongoose schemas (AppData, Feedback, Theme)
│   └── index.js             # Main server setup, routes, and DB seeding
├── src/                     # React + TypeScript frontend
│   ├── assets/              # Default local images
│   ├── components/          # Reusable UI components (Modal, Navbar, Button, etc.)
│   ├── constants/           # Global app constants
│   ├── i18n/                # Language translations (locales)
│   ├── pages/               # Page views (Home, Login, Admin Dashboard)
│   ├── sections/            # Home page scroll sections
│   ├── services/            # API, Storage, and Cloudinary services
│   ├── store/               # Zustand global state management
│   ├── types/               # TypeScript type declarations
│   └── utils/               # Helper utilities (theme & language)
├── .env.example             # Template for required environment variables
├── tailwind.config.js       # Tailwind configuration
└── vite.config.ts           # Vite frontend configuration & proxy setup
```

---

## ⚙️ Setup and Installation

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 2. Install Dependencies
Clone the repository and install the project dependencies in the root directory:
```bash
npm install
```

### 3. Environment Variables Configuration
Create a `.env` file in the root directory based on the [.env.example](file:///.env.example) template:

```env
# Centralized Admin Authentication Credentials
VITE_ADMIN_EMAIL=your_admin_email@example.com
VITE_ADMIN_PASSWORD=your_admin_password

# Cloudinary Configuration (Optional - for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
VITE_CLOUDINARY_FOLDER=usababes

# MongoDB Atlas Configuration
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
```

---

## 🚀 Running the Project

To run this application locally, you need both the **backend server** and the **frontend dev server** running simultaneously.

### Option A: Running separately (Recommended)

1. **Start the Backend API Server**:
   Open a terminal window and run:
   ```bash
   npm run server
   ```
   *This starts the server on `http://localhost:5000` and automatically seeds the MongoDB database with default records if empty.*

2. **Start the Frontend Development Server**:
   Open a separate terminal window and run:
   ```bash
   npm run dev
   ```
   *This starts the Vite dev server on `http://localhost:5173`. All requests to `/api/*` are automatically proxied to the backend.*

---

## 🐳 Production Deployment

To build the project for production, run:
```bash
npm run build
```
This command compiles the React + TypeScript app into the production-ready `dist` folder.
