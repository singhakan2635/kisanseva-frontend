import { useTranslation } from 'react-i18next';
import { Card } from '@/components/common/Card';
import { Users, Sprout, GraduationCap, Calendar } from 'lucide-react';

export function AdminDashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {t('admin.dashboard.welcome')}
        </h1>
        <p className="text-gray-300 text-sm sm:text-base">
          {t('admin.dashboard.subtitle')}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default" className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">{t('admin.dashboard.totalUsers')}</p>
          </div>
        </Card>
        <Card variant="default" className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-accent-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">{t('admin.dashboard.totalFarmers')}</p>
          </div>
        </Card>
        <Card variant="default" className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">{t('admin.dashboard.totalExperts')}</p>
          </div>
        </Card>
        <Card variant="default" className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">{t('admin.dashboard.activeConsultations')}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
