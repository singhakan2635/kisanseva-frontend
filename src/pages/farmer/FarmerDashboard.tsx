import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Camera, Wheat, Bug, Cloud, FileText, ChevronRight, MapPin } from 'lucide-react';
import { apiClient } from '@/services/api';
import type { ApiResponse } from '@/types';

interface WeatherData {
  city: string;
  temp: number;
  description: string;
  icon: string;
}

interface DiagnosisHistoryItem {
  _id: string;
  diseaseName: string;
  diseaseNameHindi: string;
  severity: 'healthy' | 'mild' | 'moderate' | 'severe' | 'critical';
  confidence: number;
  imageUrl: string;
  createdAt: string;
}

const severityColors: Record<string, string> = {
  healthy: 'bg-severity-healthy',
  mild: 'bg-severity-mild',
  moderate: 'bg-severity-moderate',
  severe: 'bg-severity-severe',
  critical: 'bg-severity-critical',
};

export function FarmerDashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recentDiagnoses, setRecentDiagnoses] = useState<DiagnosisHistoryItem[]>([]);

  const isHindi = i18n.language?.startsWith('hi');

  useEffect(() => {
    apiClient<ApiResponse<WeatherData>>('/weather/current')
      .then((res) => setWeather(res.data))
      .catch(() => {/* weather is optional */});

    apiClient<ApiResponse<DiagnosisHistoryItem[]>>('/diagnoses?limit=3&sort=-createdAt')
      .then((res) => setRecentDiagnoses(res.data))
      .catch(() => {/* history is optional */});
  }, []);

  const quickActions = [
    {
      icon: Wheat,
      emoji: '🌾',
      label: t('farmer.dashboard.mandiPrices'),
      gradient: 'from-accent-400 to-accent-600',
      shadow: 'shadow-accent-400/30',
      path: '/farmer/market',
    },
    {
      icon: Bug,
      emoji: '🦠',
      label: t('farmer.dashboard.commonDiseases'),
      gradient: 'from-secondary-400 to-secondary-600',
      shadow: 'shadow-secondary-400/30',
      path: '/farmer/history',
    },
    {
      icon: Cloud,
      emoji: '🌤️',
      label: t('farmer.dashboard.weather'),
      gradient: 'from-blue-400 to-blue-600',
      shadow: 'shadow-blue-400/30',
      path: '#',
    },
    {
      icon: FileText,
      emoji: '🏛️',
      label: t('farmer.dashboard.govtSchemes'),
      gradient: 'from-primary-400 to-primary-600',
      shadow: 'shadow-primary-400/30',
      path: '/farmer/schemes',
    },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Greeting card with warm gradient */}
      <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-500 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-28 h-28 bg-white/10 rounded-full blur-xl" />
        <div className="relative z-10">
          <p className="text-white/80 text-sm">{t('farmer.dashboard.greeting')},</p>
          <p className="text-2xl font-bold mt-0.5 drop-shadow-sm">
            {user?.firstName || user?.lastName || 'Farmer'}
          </p>
          <p className="text-white/80 text-sm mt-1">{t('farmer.dashboard.scanCrop')}</p>
        </div>
      </div>

      {/* Weather widget */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg shadow-blue-500/20">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 opacity-80" />
          <div>
            <p className="text-lg font-bold">{weather?.city || t('farmer.dashboard.yourCity')}</p>
            <p className="text-sm opacity-90">{weather?.description || t('farmer.dashboard.weatherLoading')}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{weather ? `${weather.temp}°` : '--°'}</p>
        </div>
      </div>

      {/* Camera CTA - THE HERO */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative">
          {/* Pulse ring */}
          <div className="absolute inset-[-8px] rounded-full border-[3px] border-primary-400 animate-[pulse-ring_1.5s_ease-out_infinite] opacity-60" />
          <button
            onClick={() => navigate('/farmer/scan')}
            className="relative w-[76px] h-[76px] rounded-full bg-gradient-to-br from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-900 active:scale-95 shadow-xl shadow-primary-600/30 flex items-center justify-center transition-all duration-200 z-10"
            aria-label={t('farmer.dashboard.scanCropSub')}
          >
            <Camera className="w-9 h-9 text-white" />
          </button>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-earth-900">
            {t('farmer.dashboard.scanCrop')}
          </p>
          <p className="text-base text-earth-500 mt-1">{t('farmer.dashboard.scanCropSub')}</p>
        </div>
      </div>

      {/* Quick actions 2x2 grid */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className={`bg-gradient-to-br ${action.gradient} active:scale-[0.97] rounded-2xl p-5 text-white text-left transition-all duration-300 min-h-[110px] flex flex-col justify-between shadow-lg ${action.shadow} hover:shadow-xl hover:-translate-y-0.5`}
          >
            <div className="flex items-center gap-2">
              <action.icon className="w-7 h-7 opacity-90" />
              <span className="text-2xl">{action.emoji}</span>
            </div>
            <div className="mt-3">
              <p className="text-lg font-bold leading-tight">{action.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Recent diagnoses */}
      {recentDiagnoses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-earth-900">{t('farmer.dashboard.recentDiagnoses')}</h2>
            <button
              onClick={() => navigate('/farmer/history')}
              className="text-primary-500 text-base font-medium flex items-center gap-1 hover:text-primary-600 transition-colors"
            >
              {t('farmer.dashboard.viewAll')} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            {recentDiagnoses.map((d) => (
              <button
                key={d._id}
                onClick={() => navigate(`/farmer/diagnosis/${d._id}`)}
                className="flex-shrink-0 w-40 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-earth-200/50 border border-earth-200 overflow-hidden snap-start text-left hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="h-24 bg-earth-100 relative">
                  {d.imageUrl ? (
                    <img src={d.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Bug className="w-8 h-8 text-earth-300" />
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 w-3 h-3 rounded-full ${severityColors[d.severity] || 'bg-gray-400'} ring-2 ring-white`} />
                </div>
                <div className="p-2.5">
                  <p className="text-sm font-bold text-earth-900 truncate">
                    {isHindi ? (d.diseaseNameHindi || d.diseaseName) : d.diseaseName}
                  </p>
                  <p className="text-xs text-earth-500 mt-0.5">
                    {new Date(d.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state if no diagnoses */}
      {recentDiagnoses.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-earth-200 p-6 text-center shadow-lg shadow-earth-200/50">
          <Bug className="w-10 h-10 text-earth-300 mx-auto mb-3" />
          <p className="text-base font-bold text-earth-800">{t('farmer.dashboard.noDiagnoses')}</p>
          <button
            onClick={() => navigate('/farmer/scan')}
            className="mt-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold px-6 py-3 rounded-xl text-base transition-all duration-300 shadow-md shadow-primary-400/20 hover:-translate-y-0.5"
          >
            {t('farmer.dashboard.firstScan')}
          </button>
        </div>
      )}
    </div>
  );
}
