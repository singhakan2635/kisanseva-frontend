import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/common/Card';
import { Calendar, Users, MessageSquare } from 'lucide-react';

export function ExpertDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-800 rounded-2xl p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {t('expert.dashboard.welcome')}, {user?.firstName}!
        </h1>
        <p className="text-primary-200 text-sm sm:text-base">
          {t('expert.dashboard.subtitle')}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="default" className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">{t('expert.dashboard.todayConsultations')}</p>
          </div>
        </Card>
        <Card variant="default" className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">{t('expert.dashboard.pendingQueries')}</p>
          </div>
        </Card>
        <Card variant="default" className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">{t('expert.dashboard.totalFarmers')}</p>
          </div>
        </Card>
      </div>

      {/* Content */}
      <Card title={t('expert.dashboard.todayConsultations')}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No consultations scheduled for today</p>
          <p className="text-xs text-gray-400 mt-1">Your upcoming consultations will appear here</p>
        </div>
      </Card>
    </div>
  );
}
