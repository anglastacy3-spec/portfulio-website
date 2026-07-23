import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  User,
  Sparkles,
  MessageSquare,
  Palette,
  Globe,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Star,
  CheckCircle,
  Menu,
  X,
  History,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { showToast } from '@/components/Toast';
import { useContentStore } from '@/store/contentStore';
import { useThemeStore } from '@/store/themeStore';
import { compressImage } from '@/utils/imageCompressor';
import { uploadToCloudinary } from '@/services/cloudinaryService';
import type { Skill, Experience, ServiceItem, TestimonialItem, SocialLink } from '@/types';
import { getLocalizedText } from '@/utils/i18nHelper';

type Tab = 'hero' | 'about' | 'socials' | 'services' | 'testimonials' | 'feedbacks' | 'theme' | 'seo';

export const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data, feedbacks, updateHero, updateLogo, updateAboutBio, updateSkills, addExperience, updateExperience, deleteExperience, addSocialLink, updateSocialLink, deleteSocialLink, toggleSocialStatus, addService, updateService, deleteService, addTestimonial, updateTestimonial, deleteTestimonial, updateSeo, deleteFeedback, resetData } = useContentStore();
  const { settings, updateTheme, resetTheme } = useThemeStore();

  const handleLogout = () => {
    localStorage.removeItem('angla_admin_auth');
    showToast.info(t('admin.logout_success', 'Logged out successfully.'));
    onLogout();
  };

  // Image Upload helper using Cloudinary
  const triggerImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onUploaded: (url: string) => void,
    folderName?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    showToast.info('Uploading image to Cloudinary...');
    try {
      // Compress image to max 800x800 for optimal performance
      const compressedBase64 = await compressImage(file, 800, 800, 0.85);
      const cloudinaryUrl = await uploadToCloudinary(compressedBase64, folderName);
      onUploaded(cloudinaryUrl);
      showToast.success('Media uploaded to Cloudinary successfully!');
    } catch (err: any) {
      showToast.error(err?.message || 'Failed to upload image to Cloudinary.');
      console.error(err);
    }
  };

  // State for CRUD modals
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);



  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);

  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [deletingSocialId, setDeletingSocialId] = useState<string | null>(null);

  const sidebarLinks = [
    { label: t('admin.tabs.hero', 'Hero Profile'), value: 'hero' as Tab, icon: User },
    { label: t('admin.tabs.about', 'About & Skills'), value: 'about' as Tab, icon: History },
    { label: t('admin.tabs.socials', 'Social Profiles'), value: 'socials' as Tab, icon: Share2 },
    { label: t('admin.tabs.services', 'My Services'), value: 'services' as Tab, icon: Sparkles },
    { label: t('admin.tabs.testimonials', 'Testimonials'), value: 'testimonials' as Tab, icon: MessageSquare },
    { label: t('admin.tabs.feedbacks', 'Feedbacks Viewer'), value: 'feedbacks' as Tab, icon: ShieldCheck },
    { label: t('admin.tabs.theme', 'Theme Settings'), value: 'theme' as Tab, icon: Palette },
    { label: t('admin.tabs.seo', 'SEO Config'), value: 'seo' as Tab, icon: Globe },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#06030e] text-white flex">
        {/* Navigation Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#0a061b] border-r border-white/5 p-6 shrink-0 relative z-30">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center border border-white/10 shadow-[0_0_15px_var(--glow-color)]">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">{t('admin.console_title', 'Admin Console')}</h2>
              <span className="text-[10px] font-semibold text-primary uppercase">{t('admin.offline_mode', 'Offline mode')}</span>
            </div>
          </div>

          <nav className="flex-grow flex flex-col gap-1.5">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.value}
                  onClick={() => setActiveTab(link.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold tracking-wide transition-all duration-300 ${
                    activeTab === link.value
                      ? 'bg-gradient-primary text-white shadow-lg shadow-primary/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex flex-col gap-3 pt-6 border-t border-white/5 mt-6">
            <Link to="/" className="w-full">
              <Button variant="glass" size="sm" className="w-full text-xs py-2 px-3">
                {t('login.back_to_landing', 'Back to Landing')}
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              className="w-full text-xs py-2 px-3 flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('admin.logout_btn', 'Logout')}</span>
            </Button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a061b] border-b border-white/5 flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-xs font-bold text-white overflow-hidden">
              {data.logo?.logoImage ? (
                <img src={data.logo.logoImage} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                data.logo?.logoText || 'AS'
              )}
            </div>
            <span className="text-sm font-bold tracking-wide">{t('admin.console_title', 'Admin Console')}</span>
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white/80 p-1.5 hover:bg-white/5 rounded-lg border border-white/10"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-[#070414]/95 backdrop-blur-xl z-40 p-6 flex flex-col justify-between border-t border-white/5">
            <nav className="flex flex-col gap-2">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.value}
                    onClick={() => { setActiveTab(link.value); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-bold ${
                      activeTab === link.value ? 'bg-gradient-primary text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
              <Link to="/" onClick={() => setIsSidebarOpen(false)}>
                <Button variant="glass" className="w-full">{t('login.back_to_landing', 'Back to Landing')}</Button>
              </Link>
              <Button variant="danger" onClick={handleLogout} className="w-full">{t('admin.logout_btn', 'Logout')}</Button>
            </div>
          </div>
        )}

        <main className="flex-grow p-6 lg:p-10 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide capitalize">
                {t(`admin.tabs.${activeTab}`)}
              </h1>
              <p className="text-xs text-white/40 font-semibold">Manage your landing page configurations instantly</p>
            </div>
            <button
              onClick={() => {
                if (confirm(t('admin.reset_confirm', 'Reset all content & theme configurations to defaults?'))) {
                  resetData();
                  resetTheme();
                  showToast.success(t('admin.reset_success', 'Restored default state successfully.'));
                }
              }}
              className="text-xs text-red-400 hover:text-red-300 font-semibold bg-red-500/10 border border-red-500/15 py-2 px-4 rounded-xl transition-all"
            >
              {t('admin.reset_btn', 'Reset All Defaults')}
            </button>
          </div>

          <div className="relative">
            {activeTab === 'hero' && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <div className="xl:col-span-8 flex flex-col gap-6">
                  <Card hoverable={false} className="p-6 border-white/5 bg-[#120c26]/20 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">Header Brand Logo & Title</h3>
                      <span className="text-xs text-white/40 font-semibold">Cloudinary & MongoDB Synced</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Brand Name Title"
                        value={data.logo?.brandName ?? 'AnglaStacy'}
                        placeholder="e.g. AnglaStacy"
                        onChange={(e) => updateLogo({ brandName: e.target.value })}
                      />
                      <Input
                        label="Logo Initials / Text Code"
                        value={data.logo?.logoText ?? 'AS'}
                        placeholder="e.g. AS"
                        onChange={(e) => updateLogo({ logoText: e.target.value })}
                      />
                    </div>

                    <div className="flex flex-col gap-2 text-left">
                      <label className="text-xs md:text-sm font-semibold text-white/70 tracking-wider">
                        Upload Custom Logo Image from PC (Cloudinary)
                      </label>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl border border-white/10 bg-black/40 overflow-hidden shrink-0 flex items-center justify-center">
                          {data.logo?.logoImage ? (
                            <img src={data.logo.logoImage} alt="Logo preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-black text-white">{data.logo?.logoText || 'AS'}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-grow">
                          <input
                            type="file"
                            accept="image/*"
                            id="logo-image-upload"
                            className="hidden"
                            onChange={(e) =>
                              triggerImageUpload(
                                e,
                                (url) => updateLogo({ logoImage: url }),
                                'usababes/logos'
                              )
                            }
                          />
                          <label
                            htmlFor="logo-image-upload"
                            className="flex items-center gap-2 py-2.5 px-4 glass border border-white/10 hover:border-primary/45 rounded-xl cursor-pointer text-xs font-bold transition-all text-white/90"
                          >
                            <Upload className="w-4 h-4 text-primary" />
                            <span>Upload Logo from PC</span>
                          </label>

                          {data.logo?.logoImage && (
                            <button
                              type="button"
                              onClick={() => updateLogo({ logoImage: '' })}
                              className="py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-all"
                            >
                              Use Initials Text
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-2">
                      <Button
                        variant="primary"
                        onClick={() => showToast.success(t('admin.save_success', 'Changes saved successfully!'))}
                        className="px-6 py-2.5 text-xs font-bold"
                      >
                        {t('admin.save_btn', 'Save Logo Settings')}
                      </Button>
                    </div>
                  </Card>

                  <Card hoverable={false} className="p-6 border-white/5 bg-[#120c26]/20 flex flex-col gap-5">
                    <h3 className="text-base font-bold text-white">Hero Metadata</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Profile Name"
                        value={data.hero.name}
                        onChange={(e) => updateHero({ name: e.target.value })}
                      />
                      <Input
                        label="Greeting Subtitle"
                        value={data.hero.subtitle}
                        onChange={(e) => updateHero({ subtitle: e.target.value })}
                      />
                    </div>

                    <Textarea
                      label="Short Bio Summary"
                      value={getLocalizedText(data.hero.description)}
                      onChange={(e) => updateHero({ description: e.target.value })}
                    />
                    
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="primary"
                        onClick={() => showToast.success(t('admin.save_success', 'Changes saved successfully!'))}
                        className="px-6 py-2.5 text-xs font-bold"
                      >
                        {t('admin.save_btn', 'Save Settings')}
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="xl:col-span-4 flex flex-col gap-6">
                  {/* Media Upload (Avatar) */}
                  <Card hoverable={false} className="p-6 border-white/5 bg-[#120c26]/20 flex flex-col gap-4 text-center">
                    <h3 className="text-sm font-bold text-white/80">Profile Photo</h3>
                    
                    <div className="w-28 h-28 rounded-full overflow-hidden border border-white/10 mx-auto bg-black/40">
                      <img src={data.hero.avatar} alt="Profile preview" className="w-full h-full object-cover" />
                    </div>

                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id="avatar-upload"
                        className="hidden"
                        onChange={(e) => triggerImageUpload(e, (url) => updateHero({ avatar: url }), 'usababes/avatars')}
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 glass border border-white/10 hover:border-primary/45 rounded-xl cursor-pointer text-xs font-bold transition-all text-white/90"
                      >
                        <Upload className="w-4 h-4 text-primary" />
                        <span>Upload New Image</span>
                      </label>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* ABOUT & SKILLS PANEL */}
            {activeTab === 'about' && (
              <div className="flex flex-col gap-8">
                {/* Biography */}
                <Card hoverable={false} className="p-6 border-white/5 bg-[#120c26]/20 flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white">Profile Biography</h3>
                  <Textarea
                    label="Write a professional bio detailing your career"
                    value={getLocalizedText(data.about.bio)}
                    onChange={(e) => updateAboutBio(e.target.value)}
                  />
                  
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="primary"
                      onClick={() => showToast.success(t('admin.save_success', 'Changes saved successfully!'))}
                      className="px-6 py-2.5 text-xs font-bold"
                    >
                      {t('admin.save_btn', 'Save Settings')}
                    </Button>
                  </div>
                </Card>

                {/* Skills Management */}
                <Card hoverable={false} className="p-6 border-white/5 bg-[#120c26]/20 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">Skills Matrix</h3>
                    <button
                      onClick={() => {
                        const name = prompt('Skill Name?');
                        if (!name) return;
                        const levelStr = prompt('Skill Level (0-100)?', '80');
                        const level = parseInt(levelStr || '80') || 80;
                        const categoryInput = prompt('Category? (Frontend / Backend / Design / Other)', 'Frontend');
                        const category = ['Frontend', 'Backend', 'Design', 'Other'].includes(categoryInput || '')
                          ? (categoryInput as Skill['category'])
                          : 'Other';

                        const updated = [...data.about.skills, { name, level, category }];
                        updateSkills(updated);
                        showToast.success('Skill added!');
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-primary hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Skill</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-white/5 rounded-xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-xs text-white/40 uppercase tracking-widest font-extrabold">
                        <tr>
                          <th className="p-4">Name</th>
                          <th className="p-4">Level</th>
                          <th className="p-4">Category</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {data.about.skills.map((skill, idx) => (
                          <tr key={idx} className="hover:bg-white/5 font-semibold text-white/80">
                            <td className="p-4">{skill.name}</td>
                            <td className="p-4 text-primary">{skill.level}%</td>
                            <td className="p-4">
                              <span className="text-[10px] bg-white/5 py-0.5 px-2.5 border border-white/10 rounded-md uppercase font-bold text-white/50">
                                {skill.category}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => {
                                  const updated = data.about.skills.filter((_, i) => i !== idx);
                                  updateSkills(updated);
                                  showToast.info('Skill removed.');
                                }}
                                className="text-red-400 hover:text-red-300 p-1.5 bg-red-500/10 rounded-lg hover:scale-105 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Experience Timeline */}
                <Card hoverable={false} className="p-6 border-white/5 bg-[#120c26]/20 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">Experience Timeline</h3>
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => {
                        setEditingExp(null);
                        setIsExpModalOpen(true);
                      }}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Work Experience</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.about.experience.map((exp) => (
                      <Card key={exp.id} hoverable={false} className="p-4 border-white/5 bg-white/5 flex flex-col justify-between">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs font-bold text-primary">{exp.year}</span>
                          <h4 className="text-sm font-bold text-white">
                            {getLocalizedText(exp.role)} <span className="text-white/40">at {exp.company}</span>
                          </h4>
                          <p className="text-xs text-white/60 leading-relaxed font-medium mt-1">
                            {getLocalizedText(exp.description)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 border-t border-white/5 pt-3 justify-end">
                          <button
                            onClick={() => {
                              setEditingExp(exp);
                              setIsExpModalOpen(true);
                            }}
                            className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-500/10 rounded-lg transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete experience?')) {
                                deleteExperience(exp.id);
                                showToast.info('Experience deleted.');
                              }
                            }}
                            className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* SOCIALS PANEL */}
            {activeTab === 'socials' && (
              <div className="flex flex-col gap-6 max-w-4xl">
                <Card hoverable={false} className="p-6 border-white/5 bg-[#120c26]/20 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Social Profiles Control</h3>
                      <p className="text-xs text-white/40 font-semibold mt-0.5">
                        Manage platform connections, URLs, order, and toggle visibility on the public site
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setEditingSocial(null);
                        setIsSocialModalOpen(true);
                      }}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Social Link</span>
                    </Button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {[...(data.socials || [])]
                      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                      .map((social) => {
                        const isActive = social.isActive !== false;
                        return (
                          <div key={social.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 flex items-center justify-center">
                                {social.icon?.startsWith('http') || social.icon?.startsWith('data:') ? (
                                  <img src={social.icon} alt={social.name} className="w-5 h-5 object-contain" />
                                ) : (
                                  <span className="text-xs font-bold uppercase">{social.name.substring(0, 3)}</span>
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white truncate">{social.name}</span>
                                  {social.sortOrder !== undefined && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-white/10 rounded-full text-white/60">
                                      Order: {social.sortOrder}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-white/60 font-medium truncate">{social.url}</span>
                                {social.username && (
                                  <span className="text-[11px] text-white/40 font-semibold">{social.username}</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                              {/* Enable / Disable Toggle Switch */}
                              <button
                                onClick={() => toggleSocialStatus(social.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                  isActive
                                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                                    : 'bg-white/5 border-white/10 text-white/40'
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
                                <span>{isActive ? 'Active' : 'Disabled'}</span>
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => {
                                  setEditingSocial(social);
                                  setIsSocialModalOpen(true);
                                }}
                                className="p-2 text-blue-400 hover:text-blue-300 bg-blue-500/10 rounded-xl border border-blue-500/20 hover:scale-105 transition-all"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => setDeletingSocialId(social.id)}
                                className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 rounded-xl border border-red-500/20 hover:scale-105 transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </Card>
              </div>
            )}

            {/* SERVICES PANEL */}
            {activeTab === 'services' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/40 font-semibold">
                    Manage service highlights rendered in the details showcase
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setEditingService(null);
                      setIsServiceModalOpen(true);
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Service</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.services.map((service) => (
                    <Card key={service.id} hoverable={false} className="p-6 border-white/5 bg-[#120c26]/20 flex flex-col justify-between h-full">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 text-primary border border-primary/15 rounded-lg shrink-0">
                          <Palette className="w-5 h-5" /> {/* Representative icon */}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <h4 className="text-base font-bold text-white">{getLocalizedText(service.title)}</h4>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded border border-primary/10 w-max">
                            Icon: {service.iconName}
                          </span>
                          <p className="text-xs text-white/60 leading-relaxed font-medium mt-1">
                            {getLocalizedText(service.description)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 justify-end border-t border-white/5 pt-4 mt-4">
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setIsServiceModalOpen(true);
                          }}
                          className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-500/10 rounded-lg transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete service?')) {
                              deleteService(service.id);
                              showToast.info('Service deleted.');
                            }
                          }}
                          className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}



            {/* TESTIMONIALS PANEL */}
            {activeTab === 'testimonials' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/40 font-semibold">
                    Manage glowing testimonial feedback sliders
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setEditingTestimonial(null);
                      setIsTestimonialModalOpen(true);
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Testimonial</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.testimonials.map((test) => (
                    <Card key={test.id} hoverable={false} className="p-6 border-white/5 bg-[#120c26]/20 flex flex-col justify-between h-full">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < test.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs md:text-sm text-white/70 italic leading-relaxed font-semibold">
                          "{getLocalizedText(test.comment)}"
                        </p>
                        <span className="text-xs font-bold text-white">- {test.name}</span>
                      </div>

                      <div className="flex items-center gap-2 justify-end border-t border-white/5 pt-4 mt-4">
                        <button
                          onClick={() => {
                            setEditingTestimonial(test);
                            setIsTestimonialModalOpen(true);
                          }}
                          className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-500/10 rounded-lg transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete testimonial?')) {
                              deleteTestimonial(test.id);
                              showToast.info('Testimonial deleted.');
                            }
                          }}
                          className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* FEEDBACK SUBMISSIONS PANEL */}
            {activeTab === 'feedbacks' && (
              <Card hoverable={false} className="p-6 border-white/5 bg-[#120c26]/20 flex flex-col gap-4">
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-white">Client Submissions</h3>
                  <p className="text-xs text-white/40 font-semibold mt-0.5">
                    Messages and ratings submitted offline by visitors using the Contact panel
                  </p>
                </div>

                {feedbacks.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-white/10 rounded-xl text-white/40">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-white/20" />
                    <span className="text-xs font-bold">No feedback submissions found yet.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {feedbacks.map((fb) => (
                      <div key={fb.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-3 relative">
                        <button
                          onClick={() => {
                            if (confirm('Delete this submission?')) {
                              deleteFeedback(fb.id);
                              showToast.info('Submission deleted.');
                            }
                          }}
                          className="absolute top-4 right-4 text-red-400 hover:text-red-300 p-1.5 bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h4 className="text-sm font-bold text-white">{fb.name}</h4>
                          {fb.email && (
                            <span className="text-xs text-white/40 font-medium">({fb.email})</span>
                          )}
                          <span className="text-[10px] text-white/30 font-medium sm:ml-auto">
                            {new Date(fb.timestamp).toLocaleString()}
                          </span>
                        </div>

                        {/* Rating stars */}
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'
                              }`}
                            />
                          ))}
                        </div>

                        <p className="text-xs md:text-sm text-white/70 leading-relaxed font-semibold">
                          {fb.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* THEME PANEL */}
            {activeTab === 'theme' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <Card hoverable={false} className="p-6 border-white/5 bg-[#120c26]/20 flex flex-col gap-5">
                  <h3 className="text-base font-bold text-white">Color Customization</h3>
                  
                  {/* Colors inputs */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">Primary Color</span>
                        <span className="text-[10px] text-white/40">Glow elements & highlights</span>
                      </div>
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                        className="w-10 h-10 border-0 rounded cursor-pointer bg-transparent"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">Secondary Color</span>
                        <span className="text-[10px] text-white/40">Neon gradients accent</span>
                      </div>
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                        className="w-10 h-10 border-0 rounded cursor-pointer bg-transparent"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">Background Color</span>
                        <span className="text-[10px] text-white/40">Root body background</span>
                      </div>
                      <input
                        type="color"
                        value={settings.bgColor}
                        onChange={(e) => updateTheme({ bgColor: e.target.value })}
                        className="w-10 h-10 border-0 rounded cursor-pointer bg-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="primary"
                      onClick={() => showToast.success(t('admin.save_success', 'Changes saved successfully!'))}
                      className="px-6 py-2.5 text-xs font-bold w-full sm:w-auto"
                    >
                      {t('admin.save_btn', 'Save Settings')}
                    </Button>
                  </div>
                </Card>

                <Card hoverable={false} className="p-6 border-white/5 bg-[#120c26]/20 flex flex-col gap-5">
                  <h3 className="text-base font-bold text-white">Interface Settings</h3>

                  <div className="flex flex-col gap-4">
                    {/* Border Radius */}
                    <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex justify-between items-center text-xs font-bold text-white">
                        <span>Card Border Radius</span>
                        <span className="text-primary">{settings.cardRadius}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="32"
                        step="4"
                        value={parseInt(settings.cardRadius) || 0}
                        onChange={(e) => updateTheme({ cardRadius: `${e.target.value}px` })}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>

                    {/* Enable Glow */}
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">Enable Neon Glows</span>
                        <span className="text-[10px] text-white/40">Toggle box shadows & light rings</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.enableGlow}
                        onChange={(e) => updateTheme({ enableGlow: e.target.checked })}
                        className="w-5 h-5 rounded cursor-pointer accent-primary bg-transparent border-white/10"
                      />
                    </div>

                    {/* Enable Animations */}
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">Enable Animations</span>
                        <span className="text-[10px] text-white/40">Framer Motion slide triggers</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.enableAnimations}
                        onChange={(e) => updateTheme({ enableAnimations: e.target.checked })}
                        className="w-5 h-5 rounded cursor-pointer accent-primary bg-transparent border-white/10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="primary"
                      onClick={() => showToast.success(t('admin.save_success', 'Changes saved successfully!'))}
                      className="px-6 py-2.5 text-xs font-bold w-full sm:w-auto"
                    >
                      {t('admin.save_btn', 'Save Settings')}
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* SEO & FAVICON PANEL */}
            {activeTab === 'seo' && (
              <div className="flex flex-col gap-8 max-w-xl">
                {/* Meta Settings */}
                <Card hoverable={false} className="p-6 border-white/5 bg-[#120c26]/20 flex flex-col gap-5">
                  <h3 className="text-base font-bold text-white">Meta Header Tuning</h3>
                  
                  <div className="flex flex-col gap-4">
                    <Input
                      label="Browser Tab Title"
                      value={data.seo.title}
                      onChange={(e) => updateSeo({ title: e.target.value })}
                    />
                    <Textarea
                      label="Meta Search Description"
                      value={data.seo.description}
                      onChange={(e) => updateSeo({ description: e.target.value })}
                    />
                    <Input
                      label="Search Keywords (comma separated)"
                      value={data.seo.keywords}
                      onChange={(e) => updateSeo({ keywords: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="primary"
                      onClick={() => showToast.success(t('admin.save_success', 'Changes saved successfully!'))}
                      className="px-6 py-2.5 text-xs font-bold"
                    >
                      {t('admin.save_btn', 'Save Settings')}
                    </Button>
                  </div>
                </Card>

                {/* Favicon Changing Options */}
                <Card hoverable={false} className="p-6 border-white/5 bg-[#120c26]/20 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">Website Favicon Icon</h3>
                    <span className="text-xs text-white/40 font-semibold">Cloudinary & MongoDB Synced</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl border border-white/10 bg-black/40 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={data.seo.favicon || '/vite.svg'}
                          alt="Favicon preview"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-white">Active Tab Icon</span>
                        <span className="text-[11px] text-white/50">Upload a square image (.png, .ico, .svg, .jpg)</span>
                      </div>
                    </div>

                    <Input
                      label="Favicon Image URL (or upload below)"
                      value={data.seo.favicon || ''}
                      placeholder="https://res.cloudinary.com/..."
                      onChange={(e) => updateSeo({ favicon: e.target.value })}
                    />

                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <input
                        type="file"
                        accept="image/*,.ico"
                        id="favicon-file-upload"
                        className="hidden"
                        onChange={(e) =>
                          triggerImageUpload(
                            e,
                            (url) => updateSeo({ favicon: url }),
                            'usababes/favicons'
                          )
                        }
                      />
                      <label
                        htmlFor="favicon-file-upload"
                        className="flex items-center gap-2 py-2.5 px-4 glass border border-white/10 hover:border-primary/45 rounded-xl cursor-pointer text-xs font-bold transition-all text-white/90"
                      >
                        <Upload className="w-4 h-4 text-primary" />
                        <span>Upload Favicon from PC</span>
                      </label>

                      {data.seo.favicon && (
                        <button
                          type="button"
                          onClick={() => updateSeo({ favicon: '' })}
                          className="py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-all"
                        >
                          Reset Default Favicon
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-2">
                    <Button
                      variant="primary"
                      onClick={() => showToast.success(t('admin.save_success', 'Favicon saved successfully!'))}
                      className="px-6 py-2.5 text-xs font-bold"
                    >
                      {t('admin.save_btn', 'Save Favicon')}
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CRUD MODALS DECLARATIONS */}

      {/* 1. Experience Timeline Modal */}
      <Modal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        title={editingExp ? 'Edit Experience' : 'Add Experience'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const year = (form.elements.namedItem('year') as HTMLInputElement).value;
            const role = (form.elements.namedItem('role') as HTMLInputElement).value;
            const company = (form.elements.namedItem('company') as HTMLInputElement).value;
            const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;

            if (!year || !role || !company) return;

            if (editingExp) {
              updateExperience(editingExp.id, { year, role, company, description });
              showToast.success('Experience block updated!');
            } else {
              addExperience({ year, role, company, description });
              showToast.success('Experience block created!');
            }
            setIsExpModalOpen(false);
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Year Range" name="year" defaultValue={editingExp?.year || ''} placeholder="e.g. 2023 - Present" required />
          <Input label="Role Title" name="role" defaultValue={getLocalizedText(editingExp?.role) || ''} placeholder="e.g. Lead Designer" required />
          <Input label="Company Name" name="company" defaultValue={editingExp?.company || ''} placeholder="e.g. Acme Labs" required />
          <Textarea label="Role Details" name="description" defaultValue={getLocalizedText(editingExp?.description) || ''} placeholder="Describe your achievements..." />
          <Button type="submit" variant="primary" className="py-3 mt-2">
            Save Experience
          </Button>
        </form>
      </Modal>

      {/* 2. Service CRUD Modal */}
      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add Service'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const title = (form.elements.namedItem('title') as HTMLInputElement).value;
            const iconName = (form.elements.namedItem('iconName') as HTMLSelectElement).value;
            const iconColor = (form.elements.namedItem('iconColor') as HTMLInputElement).value;
            const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;

            if (!title) return;

            if (editingService) {
              updateService(editingService.id, { title, iconName, iconColor, description });
              showToast.success('Service updated!');
            } else {
              addService({ title, iconName, iconColor, description });
              showToast.success('Service added!');
            }
            setIsServiceModalOpen(false);
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Service Title" name="title" defaultValue={getLocalizedText(editingService?.title) || ''} placeholder="e.g. Personal Services" required />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full flex flex-col gap-1.5 text-left">
              <label className="text-xs md:text-sm font-semibold text-white/70 tracking-wider">
                Lucide Icon
              </label>
              <select
                name="iconName"
                defaultValue={editingService?.iconName || 'Code'}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/10 rounded-theme font-semibold"
              >
                {['Code', 'Paintbrush', 'Smartphone', 'Sparkles', 'Globe', 'Database', 'Shield', 'Megaphone', 'Terminal', 'Heart', 'Search', 'UserHeart', 'CalendarHeart', 'DoubleHeart'].map((name) => (
                  <option key={name} value={name} className="bg-[#0b071e] text-white">
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full flex flex-col gap-1.5 text-left">
              <label className="text-xs md:text-sm font-semibold text-white/70 tracking-wider">
                Icon Color
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  name="iconColor"
                  defaultValue={editingService?.iconColor || '#a855f7'}
                  className="w-10 h-10 border-0 rounded cursor-pointer bg-transparent"
                />
                <span className="text-xs text-white/40 font-medium">Select outline color</span>
              </div>
            </div>
          </div>

          <Textarea label="Service Details" name="description" defaultValue={getLocalizedText(editingService?.description) || ''} placeholder="Brief description of the service deliverables..." required />
          <Button type="submit" variant="primary" className="py-3 mt-2">
            Save Service
          </Button>
        </form>
      </Modal>



      {/* 4. Testimonial CRUD Modal */}
      <Modal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
        title={editingTestimonial ? 'Edit Testimonial' : 'Create Testimonial'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const name = (form.elements.namedItem('name') as HTMLInputElement).value;
            const rating = parseInt((form.elements.namedItem('rating') as HTMLInputElement).value) || 5;
            const comment = (form.elements.namedItem('comment') as HTMLTextAreaElement).value;

            if (!name || !comment) return;

            if (editingTestimonial) {
              updateTestimonial(editingTestimonial.id, { name, rating, comment });
              showToast.success('Testimonial updated!');
            } else {
              addTestimonial({ name, rating, comment, avatar: '' });
              showToast.success('Testimonial created!');
            }
            setIsTestimonialModalOpen(false);
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Client Name" name="name" defaultValue={editingTestimonial?.name || ''} placeholder="Sarah Jenkins" required />
          
          <div className="w-full flex flex-col gap-1.5 text-left">
            <label className="text-xs md:text-sm font-semibold text-white/70 tracking-wider">
              Rating Stars
            </label>
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              defaultValue={editingTestimonial?.rating || 5}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none rounded-theme"
              required
            />
          </div>

          <Textarea label="Client Comment" name="comment" defaultValue={getLocalizedText(editingTestimonial?.comment) || ''} placeholder="Describe their experience..." required />
          <Button type="submit" variant="primary" className="py-3 mt-2">
            Save Testimonial
          </Button>
        </form>
      </Modal>

      {/* 5. Social Media CRUD Modal */}
      <Modal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        title={editingSocial ? 'Edit Social Media Platform' : 'Add Social Media Platform'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const name = (form.elements.namedItem('name') as HTMLInputElement).value;
            const url = (form.elements.namedItem('url') as HTMLInputElement).value;
            const username = (form.elements.namedItem('username') as HTMLInputElement).value;
            const icon = (form.elements.namedItem('icon') as HTMLInputElement).value;
            const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
            const sortOrder = parseInt((form.elements.namedItem('sortOrder') as HTMLInputElement).value) || 1;
            const isActive = (form.elements.namedItem('isActive') as HTMLInputElement).checked;

            if (!name || !url) {
              showToast.error('Platform Name and Profile URL are required!');
              return;
            }

            if (editingSocial) {
              updateSocialLink(editingSocial.id, { name, url, username, icon, description, sortOrder, isActive });
              showToast.success('Social media platform updated!');
            } else {
              addSocialLink({ name, url, username, icon, description, sortOrder, isActive });
              showToast.success('Social media platform added!');
            }
            setIsSocialModalOpen(false);
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Platform Name *" name="name" defaultValue={editingSocial?.name || ''} placeholder="e.g. Instagram, GitHub, LinkedIn" required />
          <Input label="Profile URL *" name="url" defaultValue={editingSocial?.url || ''} placeholder="https://..." required />
          <Input label="Username Handle (Optional)" name="username" defaultValue={editingSocial?.username || ''} placeholder="@handle or /username" />
          
          {/* Custom Icon & File Upload from PC */}
          <div className="flex flex-col gap-2 text-left">
            <label className="text-xs md:text-sm font-semibold text-white/70 tracking-wider">
              Icon (Lucide/React-Icon Name OR Upload from PC)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                name="icon"
                id="social-icon-input"
                defaultValue={editingSocial?.icon || ''}
                placeholder="e.g. FaGithub, Instagram, or uploaded URL"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none rounded-theme transition-all focus:border-primary/50 font-medium"
              />

              <input
                type="file"
                accept="image/*"
                id="social-icon-file-upload"
                className="hidden"
                onChange={(e) =>
                  triggerImageUpload(e, (url) => {
                    const input = document.getElementById('social-icon-input') as HTMLInputElement;
                    if (input) {
                      input.value = url;
                    }
                  }, 'usababes/socials')
                }
              />

              <label
                htmlFor="social-icon-file-upload"
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 py-3 px-4 glass border border-white/10 hover:border-primary/45 rounded-xl cursor-pointer text-xs font-bold transition-all text-white/90"
              >
                <Upload className="w-4 h-4 text-primary" />
                <span className="whitespace-nowrap">Upload Icon from PC</span>
              </label>
            </div>
          </div>

          <Textarea label="Description (Optional)" name="description" defaultValue={editingSocial?.description || ''} placeholder="Short optional tagline or description" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Sort Order" name="sortOrder" type="number" defaultValue={editingSocial?.sortOrder ?? (data.socials?.length || 0) + 1} required />
            
            <div className="flex flex-col gap-2 justify-end">
              <label className="flex items-center gap-3 cursor-pointer py-2">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingSocial ? editingSocial.isActive !== false : true}
                  className="w-4 h-4 rounded accent-primary border-white/20"
                />
                <span className="text-xs md:text-sm font-bold text-white">Active Status (Visible on Website)</span>
              </label>
            </div>
          </div>

          <Button type="submit" variant="primary" className="py-3 mt-2">
            {editingSocial ? 'Save Changes' : 'Add Social Platform'}
          </Button>
        </form>
      </Modal>

      {/* Delete Social Link Confirmation Dialog */}
      <Modal
        isOpen={Boolean(deletingSocialId)}
        onClose={() => setDeletingSocialId(null)}
        title="Confirm Deletion"
      >
        <div className="flex flex-col gap-4 text-left">
          <p className="text-sm text-white/80 font-medium">
            Are you sure you want to delete this social media profile? This action will remove it permanently.
          </p>
          <div className="flex items-center justify-end gap-3 mt-4">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setDeletingSocialId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (deletingSocialId) {
                  deleteSocialLink(deletingSocialId);
                  showToast.info('Social media profile deleted.');
                  setDeletingSocialId(null);
                }
              }}
            >
              Delete Profile
            </Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
};
export default Dashboard;
