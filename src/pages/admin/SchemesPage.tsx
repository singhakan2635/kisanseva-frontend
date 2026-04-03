import { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Landmark,
  ExternalLink,
} from 'lucide-react';

interface Scheme {
  _id: string;
  name: string;
  nameHi: string;
  description: string;
  category: 'subsidy' | 'loan' | 'insurance' | 'training' | 'market' | 'other';
  eligibility: string;
  benefits: string;
  applicationUrl: string;
  active: boolean;
  createdAt: string;
}

const CATEGORIES = ['All', 'subsidy', 'loan', 'insurance', 'training', 'market', 'other'];

const categoryBadge: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  subsidy: 'success',
  loan: 'info',
  insurance: 'warning',
  training: 'info',
  market: 'success',
  other: 'neutral',
};

const MOCK_SCHEMES: Scheme[] = [
  {
    _id: 's1', name: 'PM-KISAN', nameHi: 'पीएम-किसान',
    description: 'Direct income support of Rs 6000/year to small and marginal farmers',
    category: 'subsidy', eligibility: 'Small and marginal farmers with landholding up to 2 hectares',
    benefits: 'Rs 6000/year in 3 installments', applicationUrl: 'https://pmkisan.gov.in',
    active: true, createdAt: '2024-01-15T00:00:00Z',
  },
  {
    _id: 's2', name: 'Kisan Credit Card', nameHi: 'किसान क्रेडिट कार्ड',
    description: 'Provides farmers with timely access to credit',
    category: 'loan', eligibility: 'All farmers, sharecroppers, and tenant farmers',
    benefits: 'Credit up to Rs 3 lakh at 4% interest', applicationUrl: 'https://www.nabard.org',
    active: true, createdAt: '2024-02-10T00:00:00Z',
  },
  {
    _id: 's3', name: 'PMFBY', nameHi: 'पीएमएफबीवाई',
    description: 'Pradhan Mantri Fasal Bima Yojana - crop insurance scheme',
    category: 'insurance', eligibility: 'All farmers growing notified crops',
    benefits: 'Insurance coverage at 2% premium for Kharif, 1.5% for Rabi', applicationUrl: 'https://pmfby.gov.in',
    active: true, createdAt: '2024-03-01T00:00:00Z',
  },
  {
    _id: 's4', name: 'Soil Health Card', nameHi: 'मृदा स्वास्थ्य कार्ड',
    description: 'Provides soil nutrient status and fertilizer recommendations',
    category: 'training', eligibility: 'All farmers',
    benefits: 'Free soil testing and recommendations', applicationUrl: 'https://soilhealth.dac.gov.in',
    active: true, createdAt: '2024-04-01T00:00:00Z',
  },
  {
    _id: 's5', name: 'e-NAM', nameHi: 'ई-नाम',
    description: 'National Agriculture Market - online trading platform',
    category: 'market', eligibility: 'All farmers and traders',
    benefits: 'Direct market access, better prices', applicationUrl: 'https://enam.gov.in',
    active: false, createdAt: '2024-05-01T00:00:00Z',
  },
];

export function SchemesPage() {
  const [schemes, setSchemes] = useState(MOCK_SCHEMES);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editScheme, setEditScheme] = useState<Scheme | null>(null);
  const [form, setForm] = useState({
    name: '', nameHi: '', description: '', category: 'subsidy',
    eligibility: '', benefits: '', applicationUrl: '',
  });

  const filtered = schemes.filter((s) => {
    const matchSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nameHi.includes(search) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'All' || s.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const toggleActive = (id: string) => {
    setSchemes((prev) => prev.map((s) => s._id === id ? { ...s, active: !s.active } : s));
  };

  const openEdit = (scheme: Scheme) => {
    setEditScheme(scheme);
    setForm({
      name: scheme.name,
      nameHi: scheme.nameHi,
      description: scheme.description,
      category: scheme.category,
      eligibility: scheme.eligibility,
      benefits: scheme.benefits,
      applicationUrl: scheme.applicationUrl,
    });
  };

  const openAdd = () => {
    setEditScheme(null);
    setForm({ name: '', nameHi: '', description: '', category: 'subsidy', eligibility: '', benefits: '', applicationUrl: '' });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditScheme(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Government Schemes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} schemes ({schemes.filter((s) => s.active).length} active)
          </p>
        </div>
        <Button icon={Plus} size="sm" onClick={openAdd}>
          Add Scheme
        </Button>
      </div>

      {/* Filters */}
      <Card variant="flat" noPadding>
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search schemes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Schemes List */}
      {filtered.length === 0 ? (
        <EmptyState icon={Landmark} title="No schemes found" description="Try adjusting your search or add a new scheme" />
      ) : (
        <div className="space-y-3">
          {filtered.map((scheme) => (
            <Card key={scheme._id} variant="default" className={!scheme.active ? 'opacity-60' : ''}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{scheme.name}</h3>
                    <span className="text-sm text-gray-500">({scheme.nameHi})</span>
                    <Badge variant={categoryBadge[scheme.category] || 'neutral'} size="sm">
                      {scheme.category}
                    </Badge>
                    {!scheme.active && (
                      <Badge variant="neutral" size="sm">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{scheme.description}</p>
                  <div className="flex flex-col sm:flex-row gap-4 mt-3 text-xs">
                    <div>
                      <span className="font-semibold text-gray-500">Eligibility: </span>
                      <span className="text-gray-700">{scheme.eligibility}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500">Benefits: </span>
                      <span className="text-gray-700">{scheme.benefits}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {scheme.applicationUrl && (
                    <a
                      href={scheme.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      title="Open application URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => toggleActive(scheme._id)}
                    className={`p-1.5 rounded-md transition-colors ${
                      scheme.active ? 'text-emerald-500 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={scheme.active ? 'Deactivate' : 'Activate'}
                  >
                    {scheme.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => openEdit(scheme)}
                    className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal || !!editScheme}
        onClose={closeModal}
        title={editScheme ? 'Edit Scheme' : 'Add New Scheme'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={closeModal}>Cancel</Button>
            <Button size="sm" onClick={closeModal}>{editScheme ? 'Update' : 'Save'}</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Name (English)" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. PM-KISAN" />
          <Input label="Name (Hindi)" value={form.nameHi} onChange={(e) => setForm((f) => ({ ...f, nameHi: e.target.value }))} placeholder="e.g. पीएम-किसान" />
          <div>
            <label className="block text-base font-semibold text-earth-800 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the scheme..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-earth-300 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white resize-none"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-earth-800 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full min-h-[56px] px-4 py-3 border-2 border-earth-300 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <Input label="Eligibility" value={form.eligibility} onChange={(e) => setForm((f) => ({ ...f, eligibility: e.target.value }))} placeholder="Who can apply..." />
          <Input label="Benefits" value={form.benefits} onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))} placeholder="What the farmer gets..." />
          <Input label="Application URL" value={form.applicationUrl} onChange={(e) => setForm((f) => ({ ...f, applicationUrl: e.target.value }))} placeholder="https://..." />
        </div>
      </Modal>
    </div>
  );
}
