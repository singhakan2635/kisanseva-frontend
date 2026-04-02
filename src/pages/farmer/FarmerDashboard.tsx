import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/common/Card';
import { Calendar, Sprout, CloudSun, Zap } from 'lucide-react';

export function FarmerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {t('farmer.dashboard.welcome')}, {user?.firstName}!
        </h1>
        <p className="text-primary-100 text-sm sm:text-base">
          {t('farmer.dashboard.subtitle')}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default" className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">{t('farmer.dashboard.upcomingConsultations')}</p>
          </div>
        </Card>
        <Card variant="default" className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <CloudSun className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">--</p>
            <p className="text-xs text-gray-500">{t('farmer.dashboard.weatherToday')}</p>
          </div>
        </Card>
        <Card variant="default" className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-accent-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">{t('farmer.dashboard.recentAdvisories')}</p>
          </div>
        </Card>
        <Card variant="default" className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">--</p>
            <p className="text-xs text-gray-500">{t('farmer.dashboard.quickActions')}</p>
          </div>
        </Card>
      </div>

      {/* Content cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={t('farmer.dashboard.upcomingConsultations')}>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No upcoming consultations</p>
            <p className="text-xs text-gray-400 mt-1">Book a consultation with an expert to get started</p>
          </div>
        </Card>
        <Card title={t('farmer.dashboard.recentAdvisories')}>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Sprout className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No advisories yet</p>
            <p className="text-xs text-gray-400 mt-1">Crop advisories will appear here once available</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
