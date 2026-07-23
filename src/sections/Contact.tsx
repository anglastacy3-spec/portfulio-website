import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, User, Pencil, Send, Star, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '@/store/contentStore';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';
import { showToast } from '@/components/Toast';

export const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { data, addFeedback } = useContentStore();
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Form validation schema inside component to leverage react-i18next t() updates dynamically
  const feedbackSchema = z.object({
    name: z.string().min(2, t('feedback.name_required', 'Name must be at least 2 characters')),
    email: z.string().email(t('feedback.email_invalid', 'Please enter a valid email')).optional().or(z.literal('')),
    rating: z.number().min(1, t('feedback.rating_required', 'Please select a rating')).max(5),
    message: z.string().min(5, t('feedback.feedback_required', 'Message must be at least 5 characters')),
  });

  type FeedbackFormValues = z.infer<typeof feedbackSchema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: '',
      email: '',
      rating: 0,
      message: '',
    },
  });

  const onSubmit = (formData: FeedbackFormValues) => {
    try {
      addFeedback(formData);
      showToast.success(t('feedback.success_msg', 'Thank you! Your feedback has been stored offline.'));
      reset({ name: '', email: '', rating: 0, message: '' });
    } catch (err) {
      showToast.error(t('feedback.error_msg', 'An error occurred while saving your feedback.'));
      console.error(err);
    }
  };

  return (
    <section id="contact" className="relative pt-8 pb-10 md:pt-20 overflow-hidden z-10 bg-[#070414]/10">
      {/* Background decoration */}
      <div className="glow-orb w-[350px] h-[350px] bottom-24 right-10 bg-primary/5" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header matching screenshot */}
        <div className="flex flex-col items-center text-center mb-12 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-3 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex items-center gap-3">
            {/* 4.5 Star Badge on the left */}
            <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-lg text-yellow-500 text-xs font-bold shadow-[0_0_10px_rgba(234,179,8,0.1)]">
              <span>4.5</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                ))}
                {/* Custom Half Star */}
                <div className="relative w-3 h-3">
                  <Star className="w-3 h-3 absolute top-0 left-0 text-yellow-500" />
                  <div className="absolute top-0 left-0 w-[50%] overflow-hidden h-full">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
              {t('feedback.title', 'Feedback')}
            </h2>
          </div>
          
          <p className="text-xs md:text-sm text-white/40 mt-1.5 font-semibold">
            {t('feedback.subtitle', 'Your thoughts and suggestions matter!')}
          </p>
        </div>

        {/* Centered Form card matching screenshot */}
        <div className="max-w-3xl mx-auto relative z-10">
          <Card hoverable={false} className="p-6 md:p-8 border-white/5 text-left bg-[#120c26]/20">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <Input
                  label={t('feedback.name_label', 'Your Name')}
                  placeholder={t('feedback.name_placeholder', 'Your Name')}
                  error={errors.name?.message}
                  icon={<User className="w-4 h-4" />}
                  className="font-semibold"
                  {...register('name')}
                />
                {/* Email */}
                <Input
                  label={t('feedback.email_label', 'Your Email (Optional)')}
                  placeholder={t('feedback.email_placeholder', 'Your Email (Optional)')}
                  error={errors.email?.message}
                  icon={<Mail className="w-4 h-4" />}
                  className="font-semibold"
                  {...register('email')}
                />
              </div>

              {/* Rating selection */}
              <div className="flex items-center gap-4 py-1.5 font-semibold">
                <label className="text-xs md:text-sm font-semibold text-white/70 tracking-wider">
                  {t('feedback.rating_label', 'Rating')}
                </label>
                
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            type="button"
                            key={val}
                            onClick={() => field.onChange(val)}
                            onMouseEnter={() => setHoverRating(val)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="focus:outline-none transition-transform hover:scale-110 p-0.5"
                          >
                            <Star
                              className={`w-5 h-5 transition-all duration-200 ${
                                val <= (hoverRating ?? field.value)
                                  ? 'text-primary fill-primary filter drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]'
                                  : 'text-primary/40 stroke-primary/40'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {errors.rating && (
                        <span className="text-xs text-red-400 font-medium pl-1 mt-0.5">
                          {errors.rating.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Message */}
              <Textarea
                label={t('feedback.feedback_label', 'Your Feedback')}
                placeholder={t('feedback.feedback_placeholder', 'Your Feedback')}
                error={errors.message?.message}
                icon={<Pencil className="w-4 h-4" />}
                className="font-semibold min-h-[80px]"
                {...register('message')}
              />

              <Button
                type="submit"
                isLoading={isSubmitting}
                variant="primary"
                className="w-full py-3.5 flex items-center justify-center gap-2 mt-2 bg-gradient-to-r from-[#d946ef] to-[#3b82f6] border-0 text-white font-bold tracking-wide rounded-xl shadow-lg"
              >
                <span>{isSubmitting ? t('feedback.submit_btn_loading', 'Sending...') : t('feedback.submit_btn', 'Send Feedback')}</span>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        </div>

        {/* Footer matching screenshot */}
        <footer className="mt-20 border-t border-white/5 pt-8 pb-4 text-center relative z-10 w-full font-semibold">
          <p className="text-xs text-white/40 tracking-wide">
            {t('footer.copyright', { year: new Date().getFullYear(), name: data.hero.name })}
          </p>
          <p className="text-[11px] text-white/30 tracking-wide mt-2 flex items-center justify-center gap-1">
            {t('footer.made_with', { name: data.hero.name })}
          </p>
        </footer>
      </div>
    </section>
  );
};
