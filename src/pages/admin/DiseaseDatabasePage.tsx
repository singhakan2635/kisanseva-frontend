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
  Bug,
  Beaker,
  AlertTriangle,
  Wheat,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface DiseaseEntry {
  _id: string;
  name: string;
  nameHi: string;
  type: 'fungal' | 'bacterial' | 'viral' | 'pest';
  symptoms: string[];
  treatments: string[];
  imageCount: number;
}

interface PesticideEntry {
  _id: string;
  name: string;
  nameHi: string;
  type: 'chemical' | 'organic' | 'biological';
  targetDiseases: string[];
  dosage: string;
}

interface DeficiencyEntry {
  _id: string;
  name: string;
  nameHi: string;
  element: string;
  symptoms: string[];
  remedy: string;
}

interface CropEntry {
  _id: string;
  name: string;
  nameHi: string;
  season: string;
  commonDiseases: string[];
}

type TabKey = 'diseases' | 'pesticides' | 'deficiencies' | 'crops';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: LucideIcon;
  count: number;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const MOCK_DISEASES: DiseaseEntry[] = [
  { _id: 'd1', name: 'Late Blight', nameHi: 'अगेती झुलसा', type: 'fungal', symptoms: ['Dark spots on leaves', 'White mold on underside'], treatments: ['Copper fungicide', 'Remove infected plants'], imageCount: 24 },
  { _id: 'd2', name: 'Early Blight', nameHi: 'पछेती झुलसा', type: 'fungal', symptoms: ['Concentric rings on leaves', 'Yellowing'], treatments: ['Mancozeb spray', 'Crop rotation'], imageCount: 18 },
  { _id: 'd3', name: 'Bacterial Spot', nameHi: 'जीवाणु धब्बा', type: 'bacterial', symptoms: ['Water-soaked spots', 'Leaf drop'], treatments: ['Streptomycin', 'Resistant varieties'], imageCount: 12 },
  { _id: 'd4', name: 'Leaf Curl', nameHi: 'पत्ती मोड़', type: 'viral', symptoms: ['Curled leaves', 'Stunted growth'], treatments: ['Control whitefly', 'Neem oil'], imageCount: 15 },
  { _id: 'd5', name: 'Powdery Mildew', nameHi: 'चूर्णिल फफूंदी', type: 'fungal', symptoms: ['White powder on leaves'], treatments: ['Sulfur spray', 'Improve air flow'], imageCount: 20 },
  { _id: 'd6', name: 'Rice Blast', nameHi: 'धान का ब्लास्ट', type: 'fungal', symptoms: ['Diamond-shaped lesions'], treatments: ['Tricyclazole', 'Silicon application'], imageCount: 22 },
];

const MOCK_PESTICIDES: PesticideEntry[] = [
  { _id: 'p1', name: 'Mancozeb', nameHi: 'मैंकोज़ेब', type: 'chemical', targetDiseases: ['Early Blight', 'Late Blight'], dosage: '2.5g/L water' },
  { _id: 'p2', name: 'Neem Oil', nameHi: 'नीम तेल', type: 'organic', targetDiseases: ['Leaf Curl', 'Aphids'], dosage: '5ml/L water' },
  { _id: 'p3', name: 'Trichoderma', nameHi: 'ट्राइकोडर्मा', type: 'biological', targetDiseases: ['Root Rot', 'Wilt'], dosage: '4g/L water' },
  { _id: 'p4', name: 'Copper Oxychloride', nameHi: 'कॉपर ऑक्सीक्लोराइड', type: 'chemical', targetDiseases: ['Bacterial Spot', 'Late Blight'], dosage: '3g/L water' },
];

const MOCK_DEFICIENCIES: DeficiencyEntry[] = [
  { _id: 'def1', name: 'Nitrogen Deficiency', nameHi: 'नाइट्रोजन की कमी', element: 'N', symptoms: ['Yellowing of older leaves', 'Stunted growth'], remedy: 'Apply urea 50kg/acre' },
  { _id: 'def2', name: 'Phosphorus Deficiency', nameHi: 'फास्फोरस की कमी', element: 'P', symptoms: ['Purple leaves', 'Delayed maturity'], remedy: 'Apply DAP 25kg/acre' },
  { _id: 'def3', name: 'Potassium Deficiency', nameHi: 'पोटैशियम की कमी', element: 'K', symptoms: ['Leaf edge browning', 'Weak stems'], remedy: 'Apply MOP 30kg/acre' },
];

const MOCK_CROPS: CropEntry[] = [
  { _id: 'c1', name: 'Tomato', nameHi: 'टमाटर', season: 'Rabi/Kharif', commonDiseases: ['Late Blight', 'Early Blight', 'Leaf Curl'] },
  { _id: 'c2', name: 'Rice', nameHi: 'धान', season: 'Kharif', commonDiseases: ['Rice Blast', 'Brown Spot', 'Sheath Blight'] },
  { _id: 'c3', name: 'Wheat', nameHi: 'गेहूं', season: 'Rabi', commonDiseases: ['Rust', 'Powdery Mildew', 'Karnal Bunt'] },
  { _id: 'c4', name: 'Potato', nameHi: 'आलू', season: 'Rabi', commonDiseases: ['Late Blight', 'Early Blight', 'Black Scurf'] },
  { _id: 'c5', name: 'Cotton', nameHi: 'कपास', season: 'Kharif', commonDiseases: ['Bollworm', 'Leaf Curl', 'Grey Mildew'] },
];

const typeBadge: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  fungal: 'warning',
  bacterial: 'danger',
  viral: 'info',
  pest: 'neutral',
  chemical: 'danger',
  organic: 'success',
  biological: 'info',
};

export function DiseaseDatabasePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('diseases');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [_editItem, setEditItem] = useState<string | null>(null);

  // Form state for disease add
  const [diseaseForm, setDiseaseForm] = useState({
    name: '', nameHi: '', type: 'fungal', symptoms: '', treatments: '',
  });

  const tabs: TabConfig[] = [
    { key: 'diseases', label: 'Diseases', icon: Bug, count: MOCK_DISEASES.length },
    { key: 'pesticides', label: 'Pesticides', icon: Beaker, count: MOCK_PESTICIDES.length },
    { key: 'deficiencies', label: 'Deficiencies', icon: AlertTriangle, count: MOCK_DEFICIENCIES.length },
    { key: 'crops', label: 'Crops', icon: Wheat, count: MOCK_CROPS.length },
  ];

  const filterBySearch = <T extends { name: string; nameHi: string }>(items: T[]): T[] =>
    items.filter((item) =>
      !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.nameHi.includes(search)
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disease Database</h1>
          <p className="text-sm text-gray-500 mt-1">Manage diseases, pesticides, deficiencies and crops</p>
        </div>
        <Button icon={Plus} size="sm" onClick={() => setShowAddModal(true)}>
          Add Entry
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100/70 p-1 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Content */}
      {activeTab === 'diseases' && (
        <DiseaseTable items={filterBySearch(MOCK_DISEASES)} onEdit={setEditItem} />
      )}
      {activeTab === 'pesticides' && (
        <PesticideTable items={filterBySearch(MOCK_PESTICIDES)} onEdit={setEditItem} />
      )}
      {activeTab === 'deficiencies' && (
        <DeficiencyTable items={filterBySearch(MOCK_DEFICIENCIES)} onEdit={setEditItem} />
      )}
      {activeTab === 'crops' && (
        <CropTable items={filterBySearch(MOCK_CROPS)} onEdit={setEditItem} />
      )}

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`Add ${activeTab.slice(0, -1).replace(/^./, (c) => c.toUpperCase())}`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button size="sm" onClick={() => setShowAddModal(false)}>Save</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Name (English)" value={diseaseForm.name} onChange={(e) => setDiseaseForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Late Blight" />
          <Input label="Name (Hindi)" value={diseaseForm.nameHi} onChange={(e) => setDiseaseForm((f) => ({ ...f, nameHi: e.target.value }))} placeholder="e.g. अगेती झुलसा" />
          <div>
            <label className="block text-base font-semibold text-earth-800 mb-1.5">Type</label>
            <select
              value={diseaseForm.type}
              onChange={(e) => setDiseaseForm((f) => ({ ...f, type: e.target.value }))}
              className="w-full min-h-[56px] px-4 py-3 border-2 border-earth-300 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="fungal">Fungal</option>
              <option value="bacterial">Bacterial</option>
              <option value="viral">Viral</option>
              <option value="pest">Pest</option>
            </select>
          </div>
          <Input label="Symptoms (comma-separated)" value={diseaseForm.symptoms} onChange={(e) => setDiseaseForm((f) => ({ ...f, symptoms: e.target.value }))} placeholder="Spots on leaves, yellowing..." />
          <Input label="Treatments (comma-separated)" value={diseaseForm.treatments} onChange={(e) => setDiseaseForm((f) => ({ ...f, treatments: e.target.value }))} placeholder="Fungicide spray, crop rotation..." />
        </div>
      </Modal>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function DiseaseTable({ items, onEdit }: { items: DiseaseEntry[]; onEdit: (id: string) => void }) {
  if (items.length === 0) return <EmptyState icon={Bug} title="No diseases found" description="Try a different search term" />;
  return (
    <Card variant="default" noPadding>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Name</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Hindi</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Type</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600 hidden lg:table-cell">Symptoms</th>
              <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Images</th>
              <th className="w-20 px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((d, i) => (
              <tr key={d._id} className={`border-b border-gray-50 hover:bg-primary-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="px-4 py-2.5 font-medium text-gray-900">{d.name}</td>
                <td className="px-4 py-2.5 text-gray-600 hidden md:table-cell">{d.nameHi}</td>
                <td className="px-4 py-2.5"><Badge variant={typeBadge[d.type] || 'neutral'} size="sm">{d.type}</Badge></td>
                <td className="px-4 py-2.5 text-xs text-gray-500 hidden lg:table-cell max-w-[200px] truncate">{d.symptoms.join(', ')}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{d.imageCount}</td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => onEdit(d._id)} className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function PesticideTable({ items, onEdit }: { items: PesticideEntry[]; onEdit: (id: string) => void }) {
  if (items.length === 0) return <EmptyState icon={Beaker} title="No pesticides found" description="Try a different search term" />;
  return (
    <Card variant="default" noPadding>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Name</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Hindi</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Type</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600 hidden lg:table-cell">Target Diseases</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Dosage</th>
              <th className="w-20 px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p, i) => (
              <tr key={p._id} className={`border-b border-gray-50 hover:bg-primary-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="px-4 py-2.5 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-2.5 text-gray-600 hidden md:table-cell">{p.nameHi}</td>
                <td className="px-4 py-2.5"><Badge variant={typeBadge[p.type] || 'neutral'} size="sm">{p.type}</Badge></td>
                <td className="px-4 py-2.5 text-xs text-gray-500 hidden lg:table-cell">{p.targetDiseases.join(', ')}</td>
                <td className="px-4 py-2.5 text-xs text-gray-700 font-mono">{p.dosage}</td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => onEdit(p._id)} className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function DeficiencyTable({ items, onEdit }: { items: DeficiencyEntry[]; onEdit: (id: string) => void }) {
  if (items.length === 0) return <EmptyState icon={AlertTriangle} title="No deficiencies found" description="Try a different search term" />;
  return (
    <Card variant="default" noPadding>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Name</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Hindi</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Element</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600 hidden lg:table-cell">Symptoms</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Remedy</th>
              <th className="w-20 px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((d, i) => (
              <tr key={d._id} className={`border-b border-gray-50 hover:bg-primary-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="px-4 py-2.5 font-medium text-gray-900">{d.name}</td>
                <td className="px-4 py-2.5 text-gray-600 hidden md:table-cell">{d.nameHi}</td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">{d.element}</span>
                </td>
                <td className="px-4 py-2.5 text-xs text-gray-500 hidden lg:table-cell max-w-[200px] truncate">{d.symptoms.join(', ')}</td>
                <td className="px-4 py-2.5 text-xs text-gray-700">{d.remedy}</td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => onEdit(d._id)} className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function CropTable({ items, onEdit }: { items: CropEntry[]; onEdit: (id: string) => void }) {
  if (items.length === 0) return <EmptyState icon={Wheat} title="No crops found" description="Try a different search term" />;
  return (
    <Card variant="default" noPadding>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Name</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Hindi</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Season</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Common Diseases</th>
              <th className="w-20 px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((c, i) => (
              <tr key={c._id} className={`border-b border-gray-50 hover:bg-primary-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="px-4 py-2.5 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-2.5 text-gray-600 hidden md:table-cell">{c.nameHi}</td>
                <td className="px-4 py-2.5"><Badge variant="info" size="sm">{c.season}</Badge></td>
                <td className="px-4 py-2.5 text-xs text-gray-600">{c.commonDiseases.join(', ')}</td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => onEdit(c._id)} className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
