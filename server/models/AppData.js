import mongoose from 'mongoose';

const AppDataSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main_content', unique: true },
    hero: {
      name: mongoose.Schema.Types.Mixed, // LocalizedString
      subtitle: String,
      description: mongoose.Schema.Types.Mixed, // LocalizedString
      avatar: String,
      heroBg: String,
    },
    logo: {
      logoText: mongoose.Schema.Types.Mixed, // LocalizedString
      logoImage: String,
      brandName: mongoose.Schema.Types.Mixed, // LocalizedString
    },
    about: {
      bio: mongoose.Schema.Types.Mixed, // LocalizedString
      skills: [
        {
          name: String,
          level: Number,
          category: String,
        },
      ],
      experience: [
        {
          id: String,
          year: String,
          role: mongoose.Schema.Types.Mixed, // LocalizedString
          company: String,
          description: mongoose.Schema.Types.Mixed, // LocalizedString
        },
      ],
    },
    socials: [
      {
        id: String,
        name: String,
        url: String,
        username: String,
        icon: String,
        description: String,
        sortOrder: Number,
        isActive: { type: Boolean, default: true },
      },
    ],
    services: [
      {
        id: String,
        title: mongoose.Schema.Types.Mixed, // LocalizedString
        description: mongoose.Schema.Types.Mixed, // LocalizedString
        iconName: String,
        iconColor: String,
      },
    ],
    projects: [
      {
        id: String,
        title: mongoose.Schema.Types.Mixed, // LocalizedString
        description: mongoose.Schema.Types.Mixed, // LocalizedString
        image: String,
        liveLink: String,
        githubLink: String,
        tags: [String],
      },
    ],
    testimonials: [
      {
        id: String,
        name: String,
        avatar: String,
        rating: Number,
        comment: mongoose.Schema.Types.Mixed, // LocalizedString
      },
    ],
    seo: {
      title: String,
      description: String,
      keywords: String,
      favicon: String,
    },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('AppData', AppDataSchema);
