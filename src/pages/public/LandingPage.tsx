import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, CloudSun, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50/40">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xs">
              KS
            </div>
            <span className="text-lg font-bold text-gray-900">KisanSeva</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              {t('nav.login')}
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
              {t('nav.register')}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <Sprout className="w-4 h-4" />
            {t('common.tagline')}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('landing.heroTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
            {t('landing.heroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto"
            >
              {t('landing.getStarted')}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto"
            >
              {t('landing.learnMore')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('landing.features')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('landing.heroSubtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={Sprout}
            title={t('landing.feature1Title')}
            description={t('landing.feature1Desc')}
            color="bg-gradient-to-br from-primary-500 to-primary-600"
          />
          <FeatureCard
            icon={CloudSun}
            title={t('landing.feature2Title')}
            description={t('landing.feature2Desc')}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <FeatureCard
            icon={TrendingUp}
            title={t('landing.feature3Title')}
            description={t('landing.feature3Desc')}
            color="bg-gradient-to-br from-accent-500 to-accent-600"
          />
          <FeatureCard
            icon={Users}
            title={t('landing.feature4Title')}
            description={t('landing.feature4Desc')}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} KisanSeva. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
