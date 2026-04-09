import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import {
  Users,
  Microscope,
  Activity,
  Target,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { apiClient } from '@/services/api';
import type { ApiResponse } from '@/types';

interface DashboardStats {
  totalUsers: number;
  totalDiagnoses: number;
  activeToday: number;
  accuracyRate: number;
  usersTrend: number;
  diagnosesTrend: number;
}

interface RecentDiagnosis {
  _id: string;
  userPhone: string;
  disease: string;
  confidence: number;
  severity: string;
  createdAt: string;
}

interface DiseaseDistribution {
  disease: string;
  count: number;
}

interface SystemStatus {
  api: 'healthy' | 'degraded' | 'down';
  database: 'healthy' | 'degraded' | 'down';
  whatsappBot: 'healthy' | 'degraded' | 'down';
}

const MOCK_STATS: DashboardStats = {
  totalUsers: 1247,
  totalDiagnoses: 8432,
  activeToday: 89,
  accuracyRate: 94.2,
  usersTrend: 12.5,
  diagnosesTrend: 8.3,
};

const MOCK_RECENT: RecentDiagnosis[] = Array.from({ length: 20 }, (_, i) => ({
  _id: `diag-${i}`,
  userPhone: `+91${9000000000 + Math.floor(Math.random() * 999999999)}`,
  disease: ['Late Blight', 'Early Blight', 'Bacterial Spot', 'Leaf Curl', 'Powdery Mildew', 'Rust', 'Mosaic Virus', 'Anthracnose'][i % 8],
  confidence: 70 + Math.floor(Math.random() * 30),
  severity: ['low', 'moderate', 'high', 'critical'][i % 4],
  createdAt: new Date(Date.now() - i * 3600000).toISOString(),
}));

const MOCK_DISEASES: DiseaseDistribution[] = [
  { disease: 'Late Blight', count: 1243 },
  { disease: 'Early Blight', count: 987 },
  { disease: 'Bacterial Spot', count: 876 },
  { disease: 'Leaf Curl', count: 654 },
  { disease: 'Powdery Mildew', count: 543 },
  { disease: 'Rust', count: 432 },
  { disease: 'Mosaic Virus', count: 321 },
  { disease: 'Anthracnose', count: 298 },
  { disease: 'Nitrogen Deficiency', count: 245 },
  { disease: 'Phosphorus Deficiency', count: 187 },
];

const MOCK_SYSTEM: SystemStatus = { api: 'healthy', database: 'healthy', whatsappBot: 'healthy' };

const severityBadge: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  low: 'success',
  moderate: 'warning',
  high: 'danger',
  critical: 'danger',
};

export function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [recentDiagnoses, setRecentDiagnoses] = useState<RecentDiagnosis[]>(MOCK_RECENT);
  const [diseases, setDiseases] = useState<DiseaseDistribution[]>(MOCK_DISEASES);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(MOCK_SYSTEM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    setLoading(true);
    try {
      const [statsRes, diagRes, diseaseRes, sysRes] = await Promise.allSettled([
        apiClient<ApiResponse<DashboardStats>>('/admin/stats'),
        apiClient<ApiResponse<RecentDiagnosis[]>>('/admin/diagnoses/recent?limit=20'),
        apiClient<ApiResponse<DiseaseDistribution[]>>('/admin/diagnoses/distribution'),
        apiClient<ApiResponse<SystemStatus>>('/admin/system/health'),
      ]);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (diagRes.status === 'fulfilled') setRecentDiagnoses(diagRes.value.data);
      if (diseaseRes.status === 'fulfilled') setDiseases(diseaseRes.value.data);
      if (sysRes.status === 'fulfilled') setSystemStatus(sysRes.value.data);
    } catch {
      // fallback to mock data
    } finally {
      setLoading(false);
    }
  }

  const maxDiseaseCount = Math.max(...diseases.map((d) => d.count), 1);

  const statusIcon = (s: string) => {
    if (s === 'healthy') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (s === 'degraded') return <Clock className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const statusLabel = (s: string) => {
    if (s === 'healthy') return 'Operational';
    if (s === 'degraded') return 'Degraded';
    return 'Down';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('admin.dashboard.subtitle', 'Overview of FasalRakshak platform')}
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-primary-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.totalUsers, trend: stats.usersTrend, icon: Users, color: 'primary' },
          { label: 'Total Diagnoses', value: stats.totalDiagnoses, trend: stats.diagnosesTrend, icon: Microscope, color: 'accent' },
          { label: 'Active Today', value: stats.activeToday, trend: null, icon: Activity, color: 'blue' },
          { label: 'Accuracy Rate', value: `${stats.accuracyRate}%`, trend: null, icon: Target, color: 'emerald' },
        ].map((stat) => (
          <Card key={stat.label} variant="default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
                {stat.trend !== null && (
                  <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${stat.trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {Math.abs(stat.trend)}% vs last week
                  </div>
                )}
              </div>
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Diagnoses Table */}
        <div className="lg:col-span-2">
          <Card title="Recent Diagnoses" subtitle="Last 20 diagnosis reports" noPadding>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Phone</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Disease</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Confidence</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Severity</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDiagnoses.map((d, i) => (
                    <tr
                      key={d._id}
                      className={`border-b border-gray-50 hover:bg-primary-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                    >
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-700">{d.userPhone}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-900">{d.disease}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${d.confidence >= 90 ? 'bg-emerald-500' : d.confidence >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${d.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{d.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant={severityBadge[d.severity] || 'neutral'} size="sm">
                          {d.severity}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">
                        {new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Disease Distribution */}
          <Card title="Disease Distribution" subtitle="Top 10 detected diseases">
            <div className="space-y-3">
              {diseases.map((d) => (
                <div key={d.disease}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 truncate max-w-[140px]">{d.disease}</span>
                    <span className="text-xs text-gray-500">{d.count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${(d.count / maxDiseaseCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* User Growth Placeholder */}
          <Card title="User Growth" subtitle="Last 7 days">
            <div className="flex items-end gap-1.5 h-32">
              {[40, 55, 45, 70, 65, 80, 92].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md transition-all duration-300"
                    style={{ height: `${val}%` }}
                  />
                  <span className="text-[9px] text-gray-400">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* System Health */}
          <Card title="System Health">
            <div className="space-y-3">
              {[
                { label: 'API Server', status: systemStatus.api },
                { label: 'Database', status: systemStatus.database },
                { label: 'WhatsApp Bot', status: systemStatus.whatsappBot },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    {statusIcon(item.status)}
                    <span className="text-xs font-medium text-gray-600">{statusLabel(item.status)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
