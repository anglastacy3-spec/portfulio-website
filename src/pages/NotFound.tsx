import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#06030e] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Neon blur blobs */}
        <div className="glow-orb w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-primary/10 top-1/4 left-1/4" />
        <div className="glow-orb w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-secondary/10 bottom-1/4 right-1/4" />

        <div className="max-w-md w-full text-center relative z-10">
          <Card hoverable={false} className="p-8 md:p-12 border-white/5 bg-[#120c26]/20 flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center border border-white/10 shadow-[0_0_20px_var(--glow-color)] animate-bounce">
              <Compass className="w-8 h-8 text-white" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-6xl font-black text-gradient tracking-widest leading-none">
                {t('notfound.title', '404')}
              </span>
              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide mt-2">
                {t('notfound.subtitle', 'Page Not Found')}
              </h1>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed font-semibold">
                {t('notfound.desc', 'The page you are looking for does not exist or has been moved.')}
              </p>
            </div>

            <Link to="/" className="w-full mt-2">
              <Button variant="primary" className="w-full py-3.5 flex items-center justify-center gap-2">
                <Home className="w-4.5 h-4.5" />
                <span>{t('notfound.back_home', 'Back to Home')}</span>
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};
export default NotFound;
