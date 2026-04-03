import { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  Key,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
} from 'lucide-react';

interface WhatsAppConfig {
  phoneNumber: string;
  phoneNumberId: string;
  webhookUrl: string;
  tokenStatus: 'valid' | 'expiring' | 'expired';
  tokenExpiresAt: string;
}

interface ApiKeyConfig {
  name: string;
  key: string;
  status: 'active' | 'inactive';
  lastUsed: string;
}

interface SystemInfo {
  environment: string;
  version: string;
  nodeVersion: string;
  uptime: string;
  memoryUsage: string;
  lastDeploy: string;
}

const MOCK_WHATSAPP: WhatsAppConfig = {
  phoneNumber: '+91 6692369526',
  phoneNumberId: '573920...4821',
  webhookUrl: 'https://kisanseva-backend-d6034e449591.herokuapp.com/api/whatsapp/webhook',
  tokenStatus: 'valid',
  tokenExpiresAt: '2026-05-15T00:00:00Z',
};

const MOCK_API_KEYS: ApiKeyConfig[] = [
  { name: 'Anthropic (Claude)', key: 'sk-ant-api03-****...****Wg', status: 'active', lastUsed: '2026-04-02T10:30:00Z' },
  { name: 'Sarvam AI', key: 'sarvam_****...****xK', status: 'active', lastUsed: '2026-04-02T09:15:00Z' },
  { name: 'data.gov.in', key: 'dgov_****...****mN', status: 'active', lastUsed: '2026-04-01T18:00:00Z' },
];

const MOCK_SYSTEM: SystemInfo = {
  environment: 'production',
  version: '1.0.0',
  nodeVersion: 'v20.11.0',
  uptime: '14d 6h 32m',
  memoryUsage: '256 MB / 512 MB',
  lastDeploy: '2026-04-01T14:30:00Z',
};

export function SettingsPage() {
  const [whatsapp] = useState(MOCK_WHATSAPP);
  const [apiKeys] = useState(MOCK_API_KEYS);
  const [system] = useState(MOCK_SYSTEM);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  const toggleKeyVisibility = (name: string) => {
    setShowKeys((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleRefreshToken = async () => {
    setRefreshing(true);
    // Simulate token refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const tokenStatusIcon = (status: string) => {
    if (status === 'valid') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (status === 'expiring') return <Clock className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const tokenBadgeVariant = (status: string): 'success' | 'warning' | 'danger' => {
    if (status === 'valid') return 'success';
    if (status === 'expiring') return 'warning';
    return 'danger';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configuration and monitoring</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* WhatsApp Bot */}
        <Card title="WhatsApp Bot" subtitle="Cloud API configuration">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Token Status</span>
              <div className="flex items-center gap-2">
                {tokenStatusIcon(whatsapp.tokenStatus)}
                <Badge variant={tokenBadgeVariant(whatsapp.tokenStatus)} size="sm">
                  {whatsapp.tokenStatus}
                </Badge>
              </div>
            </div>

            <InfoRow label="Phone Number" value={whatsapp.phoneNumber} />
            <InfoRow label="Phone Number ID" value={whatsapp.phoneNumberId} />

            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Webhook URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-[11px] text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 truncate">
                  {whatsapp.webhookUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(whatsapp.webhookUrl)}
                  className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors flex-shrink-0"
                  title="Copy webhook URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <InfoRow
              label="Token Expires"
              value={new Date(whatsapp.tokenExpiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            />

            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              isLoading={refreshing}
              onClick={handleRefreshToken}
              className="w-full"
            >
              Refresh Token
            </Button>
          </div>
        </Card>

        {/* API Keys */}
        <Card title="API Keys" subtitle="External service credentials">
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.name} className="p-3 bg-gray-50/70 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{apiKey.name}</span>
                  </div>
                  <Badge variant={apiKey.status === 'active' ? 'success' : 'danger'} size="sm" showDot>
                    {apiKey.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-gray-600 bg-white px-2.5 py-1.5 rounded-lg border border-gray-100 font-mono">
                    {showKeys[apiKey.name] ? apiKey.key : apiKey.key.replace(/[^.*]/g, '*')}
                  </code>
                  <button
                    onClick={() => toggleKeyVisibility(apiKey.name)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
                    title={showKeys[apiKey.name] ? 'Hide' : 'Show'}
                  >
                    {showKeys[apiKey.name] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKey.key)}
                    className="p-1 rounded-md text-gray-400 hover:text-primary-600 transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  Last used: {new Date(apiKey.lastUsed).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* System Info */}
        <Card title="System Information" subtitle="Runtime and deployment details" className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Environment', value: system.environment, badge: true, variant: 'warning' as const },
              { label: 'App Version', value: `v${system.version}` },
              { label: 'Node Version', value: system.nodeVersion },
              { label: 'Uptime', value: system.uptime },
              { label: 'Memory Usage', value: system.memoryUsage },
              {
                label: 'Last Deploy',
                value: new Date(system.lastDeploy).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                }),
              },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-gray-50/70 rounded-xl border border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-1">{item.label}</p>
                {item.badge ? (
                  <Badge variant={item.variant} size="sm">{item.value}</Badge>
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
