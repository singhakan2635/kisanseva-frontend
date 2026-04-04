import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Camera, ChevronRight, Bug } from 'lucide-react';
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

const weatherEmojis: Record<string, string> = {
  clear: '\u2600\uFE0F',
  clouds: '\u2601\uFE0F',
  rain: '\uD83C\uDF27\uFE0F',
  drizzle: '\uD83C\uDF26\uFE0F',
  thunderstorm: '\u26C8\uFE0F',
  snow: '\u2744\uFE0F',
  mist: '\uD83C\uDF2B\uFE0F',
  haze: '\uD83C\uDF2B\uFE0F',
  fog: '\uD83C\uDF2B\uFE0F',
};

function getWeatherEmoji(description: string): string {
  const lower = description.toLowerCase();
  for (const [key, emoji] of Object.entries(weatherEmojis)) {
    if (lower.includes(key)) return emoji;
  }
  return '\u2600\uFE0F';
}

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
    { emoji: '\uD83C\uDF3E', label: t('farmer.dashboard.mandiPrices'), path: '/farmer/market' },
    { emoji: '\uD83E\uDDA0', label: t('farmer.dashboard.commonDiseases'), path: '/farmer/history' },
    { emoji: '\uD83C\uDFDB\uFE0F', label: t('farmer.dashboard.govtSchemes'), path: '/farmer/schemes' },
    { emoji: '\uD83D\uDCCB', label: t('farmer.dashboard.viewAll'), path: '/farmer/history' },
  ];

  const farmingTips = [
    t('farmer.dashboard.tip1', 'Rotate crops every season to prevent soil disease'),
    t('farmer.dashboard.tip2', 'Water your crops early morning to reduce evaporation'),
    t('farmer.dashboard.tip3', 'Use neem-based solutions for organic pest control'),
  ];
  const randomTip = farmingTips[Math.floor(Date.now() / 86400000) % farmingTips.length];

  return (
    <div className="space-y-6 pb-24">
      {/* A. Ambient Header — no card, no gradient, just text */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold text-earth-900">
            {t('farmer.dashboard.greeting', 'Hello')}, {user?.firstName || 'Farmer'}
          </p>
          <p className="text-base text-earth-500 mt-0.5">
            {t('farmer.dashboard.scanCrop', 'Scan your crop today')}
          </p>
        </div>
        {weather && (
          <div className="text-right">
            <p className="text-2xl font-bold text-earth-900">
              {weather.temp}° {getWeatherEmoji(weather.description)}
            </p>
            <p className="text-sm text-earth-500">{weather.city}</p>
          </div>
        )}
      </div>

      {/* B. Hero Illustration + Camera CTA */}
      <div className="relative bg-secondary-50 rounded-2xl p-6 flex flex-col items-center border border-secondary-200">
        <div className="text-6xl mb-3 select-none">
          {'\uD83C\uDF3E\uD83C\uDF31\u2600\uFE0F'}
        </div>
        <p className="text-base text-earth-700 text-center mb-5 max-w-xs">
          {t('farmer.dashboard.heroText', 'Identify diseases, get treatments, and protect your harvest')}
        </p>
        <div className="relative">
          <div className="absolute inset-[-8px] rounded-full border-[3px] border-primary-400 animate-[pulse-ring_1.5s_ease-out_infinite] opacity-60" />
          <button
            onClick={() => navigate('/farmer/scan')}
            className="relative w-[72px] h-[72px] rounded-full bg-primary-600 hover:bg-primary-700 active:scale-95 shadow-md flex items-center justify-center transition-all duration-200 z-10"
            aria-label={t('farmer.dashboard.scanCropSub')}
          >
            <Camera className="w-8 h-8 text-white" />
          </button>
        </div>
        <p className="text-sm text-earth-500 mt-4">
          {t('farmer.dashboard.scanCropSub', 'Point your camera at the crop')}
        </p>
      </div>

      {/* C. Quick Actions — Horizontal Pill Row */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-earth-200 hover:border-primary-300 hover:shadow-md active:scale-[0.97] transition-all duration-200"
          >
            <span className="text-lg">{action.emoji}</span>
            <span className="text-sm font-semibold text-earth-800 whitespace-nowrap">{action.label}</span>
          </button>
        ))}
      </div>

      {/* D. Recent Scans — Polaroid Cards */}
      {recentDiagnoses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-earth-900">{t('farmer.dashboard.recentDiagnoses')}</h2>
            <button
              onClick={() => navigate('/farmer/history')}
              className="text-primary-600 text-sm font-semibold flex items-center gap-1 hover:text-primary-700 transition-colors"
            >
              {t('farmer.dashboard.viewAll')} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            {recentDiagnoses.map((d) => (
              <button
                key={d._id}
                onClick={() => navigate(`/farmer/diagnosis/${d._id}`)}
                className="flex-shrink-0 w-36 bg-white rounded-2xl shadow-sm border border-earth-200 overflow-hidden snap-start text-left hover:shadow-md transition-shadow duration-200"
              >
                <div className="h-28 bg-earth-100 relative">
                  {d.imageUrl ? (
                    <img src={d.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Bug className="w-8 h-8 text-earth-300" />
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${severityColors[d.severity] || 'bg-gray-400'}`} />
                    <p className="text-sm font-bold text-earth-900 truncate">
                      {isHindi ? (d.diseaseNameHindi || d.diseaseName) : d.diseaseName}
                    </p>
                  </div>
                  <p className="text-xs text-earth-500 mt-1">
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
        <div className="bg-white rounded-2xl border border-earth-200 p-6 text-center shadow-sm">
          <Bug className="w-10 h-10 text-earth-300 mx-auto mb-3" />
          <p className="text-base font-bold text-earth-800">{t('farmer.dashboard.noDiagnoses')}</p>
          <button
            onClick={() => navigate('/farmer/scan')}
            className="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl text-base transition-colors duration-200 shadow-sm"
          >
            {t('farmer.dashboard.firstScan')}
          </button>
        </div>
      )}

      {/* E. Farming Tip Card */}
      <div className="bg-secondary-50 border border-secondary-200 rounded-2xl p-5">
        <p className="text-sm text-secondary-800 leading-relaxed">
          <span className="font-bold">{'\uD83D\uDCA1'} {t('farmer.dashboard.tipLabel', 'Tip')}:</span>{' '}
          {randomTip}
        </p>
      </div>
    </div>
  );
}
