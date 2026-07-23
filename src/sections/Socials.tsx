import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaInstagram, 
  FaTelegramPlane, 
  FaWhatsapp, 
  FaFacebookF, 
  FaTiktok, 
  FaGithub, 
  FaLinkedinIn,
  FaTwitter,
  FaSnapchat
} from 'react-icons/fa';
import { useContentStore } from '@/store/contentStore';
import { useThemeStore } from '@/store/themeStore';
import { Card } from '@/components/Card';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Socials: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useContentStore();
  const { settings } = useThemeStore();
  const enableAnim = settings.enableAnimations;

  // Configuration for branding
  const branding = {
    Instagram: {
      color: 'text-[#e1306c]',
      bg: 'hover:bg-[#e1306c]/15',
      glow: 'rgba(225, 48, 108, 0.45)',
      icon: FaInstagram,
    },
    Telegram: {
      color: 'text-[#0088cc]',
      bg: 'hover:bg-[#0088cc]/15',
      glow: 'rgba(0, 136, 204, 0.45)',
      icon: FaTelegramPlane,
    },
    WhatsApp: {
      color: 'text-[#25d366]',
      bg: 'hover:bg-[#25d366]/15',
      glow: 'rgba(37, 211, 102, 0.45)',
      icon: FaWhatsapp,
    },
    Facebook: {
      color: 'text-[#1877f2]',
      bg: 'hover:bg-[#1877f2]/15',
      glow: 'rgba(24, 119, 242, 0.45)',
      icon: FaFacebookF,
    },
    TikTok: {
      color: 'text-[#fe2c55]',
      bg: 'hover:bg-[#fe2c55]/15',
      glow: 'rgba(254, 44, 85, 0.45)',
      icon: FaTiktok,
    },
    'Twitter/X': {
      color: 'text-[#1da1f2]',
      bg: 'hover:bg-[#1da1f2]/15',
      glow: 'rgba(29, 161, 242, 0.45)',
      icon: FaTwitter,
    },
    GitHub: {
      color: 'text-[#fafafa]',
      bg: 'hover:bg-white/10',
      glow: 'rgba(250, 250, 250, 0.35)',
      icon: FaGithub,
    },
    LinkedIn: {
      color: 'text-[#0077b5]',
      bg: 'hover:bg-[#0077b5]/15',
      glow: 'rgba(0, 119, 181, 0.45)',
      icon: FaLinkedinIn,
    },
    Snap: {
      color: 'text-[#fffc00]',
      bg: 'hover:bg-[#fffc00]/10',
      glow: 'rgba(255, 252, 0, 0.35)',
      icon: FaSnapchat,
    },
    Snapchat: {
      color: 'text-[#fffc00]',
      bg: 'hover:bg-[#fffc00]/10',
      glow: 'rgba(255, 252, 0, 0.35)',
      icon: FaSnapchat,
    },
    Twitter: {
      color: 'text-[#1da1f2]',
      bg: 'hover:bg-[#1da1f2]/15',
      glow: 'rgba(29, 161, 242, 0.45)',
      icon: FaTwitter,
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 12 } },
  };

  // Filter active social platforms and sort by sortOrder
  const activeSocials = (data.socials || [])
    .filter((s) => s.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const defaultBrand = {
    color: 'text-primary',
    bg: 'hover:bg-primary/15',
    glow: 'rgba(168, 85, 247, 0.45)',
    icon: Users,
  };

  const getBrand = (name?: string) => {
    if (!name) return defaultBrand;
    const key = Object.keys(branding).find(
      (k) => k.toLowerCase() === name.toLowerCase()
    );
    return key ? branding[key as keyof typeof branding] : defaultBrand;
  };

  return (
    <section id="socials" className="relative pt-8 pb-16 md:py-20 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Handcrafted Header matching screenshot */}
        <div className="flex flex-col items-center text-center mb-12 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-3 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
            {t('socials.title', 'Connect With Me')}
          </h2>
          <p className="text-xs md:text-sm text-white/40 mt-1 font-semibold">
            {t('socials.subtitle', 'Follow me on my social platforms')}
          </p>
        </div>

        {enableAnim ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {activeSocials.map((social) => {
              const brand = getBrand(social.icon || social.name);
              const Icon = brand.icon;
              const isCustomImg = social.icon?.startsWith('http') || social.icon?.startsWith('data:');

              return (
                <motion.div variants={cardVariants} key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                    title={`Visit ${social.name}`}
                  >
                    <Card
                      hoverable={true}
                      glow={false}
                      className={`flex flex-col items-center justify-center p-6 gap-3 text-center transition-all duration-300 ${brand.bg} border-white/5`}
                      style={{
                        '--glow-color': brand.glow,
                      } as React.CSSProperties}
                    >
                      <div className={`p-3 rounded-full bg-white/5 border border-white/10 ${brand.color} shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        {isCustomImg ? (
                          <img src={social.icon} alt={social.name} className="w-6 h-6 md:w-7 md:h-7 object-contain" />
                        ) : (
                          <Icon className="w-6 h-6 md:w-7 md:h-7" />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-white tracking-wide">{social.name}</span>
                      </div>
                    </Card>
                  </a>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {activeSocials.map((social) => {
              const brand = getBrand(social.icon || social.name);
              const Icon = brand.icon;
              const isCustomImg = social.icon?.startsWith('http') || social.icon?.startsWith('data:');

              return (
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={social.id}
                  className="block hover:-translate-y-1 transition-transform group"
                  title={`Visit ${social.name}`}
                >
                  <Card
                    hoverable={false}
                    glow={false}
                    className={`flex flex-col items-center justify-center p-6 gap-3 text-center ${brand.bg}`}
                  >
                    <div className={`p-3 rounded-full bg-white/5 border border-white/10 ${brand.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {isCustomImg ? (
                        <img src={social.icon} alt={social.name} className="w-6 h-6 object-contain" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-white tracking-wide">{social.name}</span>
                    </div>
                  </Card>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
export default Socials;
