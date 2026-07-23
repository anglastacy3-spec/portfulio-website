import mongoose from 'mongoose';

const ThemeSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main_theme', unique: true },
    primaryColor: { type: String, default: '#8b5cf6' },
    secondaryColor: { type: String, default: '#ec4899' },
    bgColor: { type: String, default: '#06030e' },
    cardRadius: { type: String, default: '16px' },
    enableGlow: { type: Boolean, default: true },
    enableAnimations: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Theme', ThemeSchema);
