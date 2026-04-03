import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recentDiagnoses, setRecentDiagnoses] = useState<DiagnosisHistoryItem[]>([]);

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
      labelHi: 'मंडी भाव',
      labelEn: 'Mandi Prices',
      bg: 'bg-accent-600',
      hoverBg: 'hover:bg-accent-700',
      path: '/farmer/market',
    },
    {
      icon: Bug,
      labelHi: 'आम बीमारियाँ',
      labelEn: 'Common Diseases',
      bg: 'bg-primary-600',
      hoverBg: 'hover:bg-primary-700',
      path: '/farmer/history',
    },
    {
      icon: Cloud,
      labelHi: 'मौसम',
      labelEn: 'Weather',
      bg: 'bg-blue-500',
      hoverBg: 'hover:bg-blue-600',
      path: '#',
    },
    {
      icon: FileText,
      labelHi: 'सरकारी योजनाएँ',
      labelEn: 'Govt Schemes',
      bg: 'bg-earth-600',
      hoverBg: 'hover:bg-earth-700',
      path: '/farmer/schemes',
    },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Weather widget */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 opacity-80" />
          <div>
            <p className="text-lg font-bold">{weather?.city || 'आपका शहर'}</p>
            <p className="text-sm opacity-90">{weather?.description || 'मौसम लोड हो रहा...'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{weather ? `${weather.temp}°` : '--°'}</p>
        </div>
      </div>

      {/* Welcome */}
      <div className="text-center">
        <p className="text-base text-earth-600">
          नमस्ते, <span className="font-bold text-earth-800">{user?.firstName || 'किसान'}</span>
        </p>
      </div>

      {/* Camera CTA - THE HERO */}
      <div className="flex flex-col items-center gap-4 py-4">
        <button
          onClick={() => navigate('/farmer/scan')}
          className="w-[72px] h-[72px] rounded-full bg-primary-700 hover:bg-primary-800 active:scale-95 shadow-lg shadow-primary-700/40 flex items-center justify-center transition-all duration-200"
          aria-label="Scan your crop"
        >
          <Camera className="w-9 h-9 text-white" />
        </button>
        <div className="text-center">
          <p className="text-xl font-bold text-earth-900">
            📸 अपने पौधे की फोटो भेजें
          </p>
          <p className="text-base text-earth-500 mt-1">Scan Your Crop</p>
        </div>
      </div>

      {/* Quick actions 2x2 grid */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.labelEn}
            onClick={() => navigate(action.path)}
            className={`${action.bg} ${action.hoverBg} active:scale-[0.97] rounded-2xl p-5 text-white text-left transition-all duration-200 min-h-[100px] flex flex-col justify-between shadow-sm`}
          >
            <action.icon className="w-8 h-8 mb-3 opacity-90" />
            <div>
              <p className="text-lg font-bold leading-tight">{action.labelHi}</p>
              <p className="text-sm opacity-80 mt-0.5">{action.labelEn}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Recent diagnoses */}
      {recentDiagnoses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-earth-900">हाल की जाँच</h2>
            <button
              onClick={() => navigate('/farmer/history')}
              className="text-primary-600 text-base font-medium flex items-center gap-1"
            >
              सभी देखें <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            {recentDiagnoses.map((d) => (
              <button
                key={d._id}
                onClick={() => navigate(`/farmer/diagnosis/${d._id}`)}
                className="flex-shrink-0 w-40 bg-white rounded-xl shadow-sm border border-earth-200 overflow-hidden snap-start text-left"
              >
                <div className="h-24 bg-earth-100 relative">
                  {d.imageUrl ? (
                    <img src={d.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Bug className="w-8 h-8 text-earth-300" />
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 w-3 h-3 rounded-full ${severityColors[d.severity] || 'bg-gray-400'}`} />
                </div>
                <div className="p-2.5">
                  <p className="text-sm font-bold text-earth-900 truncate">{d.diseaseNameHindi || d.diseaseName}</p>
                  <p className="text-xs text-earth-500 mt-0.5">
                    {new Date(d.createdAt).toLocaleDateString('hi-IN')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state if no diagnoses */}
      {recentDiagnoses.length === 0 && (
        <div className="bg-white/80 rounded-2xl border border-earth-200 p-6 text-center">
          <Bug className="w-10 h-10 text-earth-300 mx-auto mb-3" />
          <p className="text-base font-bold text-earth-800">अभी तक कोई जाँच नहीं</p>
          <p className="text-sm text-earth-500 mt-1">No diagnoses yet</p>
          <button
            onClick={() => navigate('/farmer/scan')}
            className="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl text-base transition-colors"
          >
            📸 पहली जाँच करें
          </button>
        </div>
      )}
    </div>
  );
}
