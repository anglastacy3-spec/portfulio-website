import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '@/components/PageTransition';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { showToast } from '@/components/Toast';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { t } = useTranslation();

  // Define schema inside component to leverage react-i18next translations dynamically on render
  const loginSchema = z.object({
    email: z.string().email(t('login.email_required', 'Please enter a valid email address')),
    password: z.string().min(1, t('login.password_required', 'Password is required')),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Offline authentication simulation
    await new Promise((resolve) => setTimeout(resolve, 800));

    const sanitizeEnv = (val: any, fallback: string): string => {
      if (!val || typeof val !== 'string') return fallback;
      return val.replace(/^["']|["']$/g, '').trim();
    };

    let envEmail = sanitizeEnv(import.meta.env.VITE_ADMIN_EMAIL, 'anglastacy32@gmail.com');
    let envPassword = sanitizeEnv(import.meta.env.VITE_ADMIN_PASSWORD, 'anglastacy32');

    // Auto-migrate outdated defaults from cached dev-servers
    if (envEmail === 'admin@example.com') envEmail = 'anglastacy32@gmail.com';
    if (envPassword === 'admin123') envPassword = 'anglastacy32';

    const submittedEmail = data.email.trim();
    const submittedPassword = data.password.trim();

    console.log('[Admin Auth Debug]');
    console.log('Submitted Email:', submittedEmail, ' | Expected:', envEmail);
    console.log('Email Match:', submittedEmail === envEmail);
    console.log('Submitted Password Length:', submittedPassword.length, ' | Expected Length:', envPassword.length);
    console.log('Password Match:', submittedPassword === envPassword);

    if (submittedEmail === envEmail && submittedPassword === envPassword) {
      // Store simple token in localStorage to persist auth
      localStorage.setItem('angla_admin_auth', 'true');
      showToast.success(t('login.login_success', 'Admin login successful!'));
      onLoginSuccess();
    } else {
      showToast.error(t('login.login_error', 'Invalid email or password.'));
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#06030e] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="glow-orb w-[300px] h-[300px] bg-primary/10 -top-12 -left-12" />
        <div className="glow-orb w-[300px] h-[300px] bg-secondary/10 bottom-0 right-0" />

        {/* Back Link */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('login.back_to_landing', 'Back to Landing')}</span>
        </Link>

        <div className="w-full max-w-md relative z-10">
          <Card hoverable={false} className="p-8 md:p-10 border-white/5 bg-[#120c26]/20">
            {/* Header */}
            <div className="flex flex-col items-center gap-3 text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center border border-white/10 shadow-[0_0_15px_var(--glow-color)]">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
                  {t('login.title', 'Admin Access')}
                </h2>
                <p className="text-xs text-white/40 font-medium">
                  {t('login.subtitle', 'Enter offline credentials to access settings')}
                </p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="relative">
                <Input
                  label={t('login.email_label', 'Email Address')}
                  placeholder={t('login.email_placeholder', 'admin@example.com')}
                  error={errors.email?.message}
                  className="pl-10"
                  {...register('email')}
                />
                <Mail className="absolute left-3.5 top-[39px] w-4.5 h-4.5 text-white/30" />
              </div>

              <div className="relative">
                <Input
                  label={t('login.password_label', 'Password')}
                  type="password"
                  placeholder={t('login.password_placeholder', '••••••••')}
                  error={errors.password?.message}
                  className="pl-10"
                  {...register('password')}
                />
                <Lock className="absolute left-3.5 top-[39px] w-4.5 h-4.5 text-white/30" />
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                variant="primary"
                className="w-full py-3.5 mt-2 flex items-center justify-center"
              >
                <span>{isSubmitting ? t('login.authorize_btn_loading', 'Authorizing...') : t('login.authorize_btn', 'Authorize Session')}</span>
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};
export default Login;
