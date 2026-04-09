import { useState, useCallback } from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button as _Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import {
  Search,
  Download,
  Flag,
  ChevronLeft,
  ChevronRight,
  Microscope,
  Image,
  X as _X,
} from 'lucide-react';

interface Diagnosis {
  _id: string;
  imageUrl: string;
  disease: string;
  crop: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  userName: string;
  userPhone: string;
  flagged: boolean;
  treatments: string[];
  createdAt: string;
}

const CROPS = ['All Crops', 'Tomato', 'Potato', 'Rice', 'Wheat', 'Cotton', 'Mango', 'Sugarcane'];
const DISEASES = ['All Diseases', 'Late Blight', 'Early Blight', 'Bacterial Spot', 'Leaf Curl', 'Powdery Mildew', 'Rust', 'Mosaic Virus'];
const SEVERITIES = ['All Severity', 'low', 'moderate', 'high', 'critical'];

const MOCK_DIAGNOSES: Diagnosis[] = Array.from({ length: 40 }, (_, i) => ({
  _id: `diag-${i}`,
  imageUrl: '',
  disease: DISEASES[1 + (i % 7)],
  crop: CROPS[1 + (i % 7)],
  severity: (['low', 'moderate', 'high', 'critical'] as const)[i % 4],
  confidence: 65 + Math.floor(Math.random() * 35),
  userName: ['Ramesh Kumar', 'Sunil Singh', 'Priya Sharma', 'Amit Patel'][i % 4],
  userPhone: `+91${9000000000 + i * 100000}`,
  flagged: i % 11 === 0,
  treatments: ['Apply copper fungicide', 'Remove infected leaves', 'Improve drainage'],
  createdAt: new Date(Date.now() - i * 7200000).toISOString(),
}));

const severityBadge: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  low: 'success',
  moderate: 'warning',
  high: 'danger',
  critical: 'danger',
};

export function DiagnosesPage() {
  const [search, setSearch] = useState('');
  const [diseaseFilter, setDiseaseFilter] = useState('All Diseases');
  const [cropFilter, setCropFilter] = useState('All Crops');
  const [severityFilter, setSeverityFilter] = useState('All Severity');
  const [minConfidence, setMinConfidence] = useState(0);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Diagnosis | null>(null);
  const [diagnoses, setDiagnoses] = useState(MOCK_DIAGNOSES);

  const perPage = 15;

  const filtered = diagnoses.filter((d) => {
    const matchSearch = !search || d.disease.toLowerCase().includes(search.toLowerCase()) || d.userName.toLowerCase().includes(search.toLowerCase());
    const matchDisease = diseaseFilter === 'All Diseases' || d.disease === diseaseFilter;
    const matchCrop = cropFilter === 'All Crops' || d.crop === cropFilter;
    const matchSeverity = severityFilter === 'All Severity' || d.severity === severityFilter;
    const matchConfidence = d.confidence >= minConfidence;
    return matchSearch && matchDisease && matchCrop && matchSeverity && matchConfidence;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleFlag = useCallback((id: string) => {
    setDiagnoses((prev) => prev.map((d) => d._id === id ? { ...d, flagged: !d.flagged } : d));
  }, []);

  const exportCSV = useCallback(() => {
    const headers = ['Disease', 'Crop', 'Severity', 'Confidence', 'User', 'Phone', 'Flagged', 'Date'];
    const rows = filtered.map((d) => [
      d.disease, d.crop, d.severity, `${d.confidence}%`, d.userName, d.userPhone,
      d.flagged ? 'Yes' : 'No', new Date(d.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fasalrakshak-diagnoses.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diagnosis Reports</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} diagnoses total</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card variant="flat" noPadding>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search disease or user..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <select
              value={diseaseFilter}
              onChange={(e) => { setDiseaseFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {DISEASES.map((d) => <option key={d}>{d}</option>)}
            </select>
            <select
              value={cropFilter}
              onChange={(e) => { setCropFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {CROPS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <select
              value={severityFilter}
              onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {SEVERITIES.map((s) => <option key={s} value={s}>{s === 'All Severity' ? s : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-600">Min Confidence:</label>
              <input
                type="range"
                min={0}
                max={100}
                value={minConfidence}
                onChange={(e) => { setMinConfidence(Number(e.target.value)); setPage(1); }}
                className="w-24 accent-primary-600"
              />
              <span className="text-xs font-medium text-gray-700 w-8">{minConfidence}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      {paginated.length === 0 ? (
        <EmptyState icon={Microscope} title="No diagnoses found" description="Try adjusting your filters" />
      ) : (
        <Card variant="default" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="w-10 px-4 py-2.5"></th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Disease</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Crop</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Severity</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Confidence</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600 hidden md:table-cell">User</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600 hidden lg:table-cell">Date</th>
                  <th className="w-10 px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((d, i) => (
                  <tr
                    key={d._id}
                    onClick={() => setSelected(d)}
                    className={`border-b border-gray-50 cursor-pointer hover:bg-primary-50/40 transition-colors ${
                      d.flagged ? 'bg-red-50/30' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-4 py-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Image className="w-4 h-4 text-gray-400" />
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-900">{d.disease}</td>
                    <td className="px-4 py-2.5 text-gray-600">{d.crop}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={severityBadge[d.severity] || 'neutral'} size="sm">
                        {d.severity}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${d.confidence >= 90 ? 'bg-emerald-500' : d.confidence >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${d.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{d.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 hidden md:table-cell">{d.userName}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-500 hidden lg:table-cell">
                      {new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFlag(d._id); }}
                        className={`p-1 rounded-md transition-colors ${d.flagged ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-400 hover:bg-red-50'}`}
                        title={d.flagged ? 'Unflag' : 'Flag for review'}
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages} ({filtered.length} results)
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Diagnosis Detail">
        {selected && (
          <div className="space-y-4">
            <div className="w-full h-40 rounded-xl bg-gray-100 flex items-center justify-center">
              <Image className="w-10 h-10 text-gray-300" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Disease</p>
                <p className="font-semibold text-gray-900">{selected.disease}</p>
              </div>
              <div>
                <p className="text-gray-500">Crop</p>
                <p className="font-semibold text-gray-900">{selected.crop}</p>
              </div>
              <div>
                <p className="text-gray-500">Severity</p>
                <Badge variant={severityBadge[selected.severity] || 'neutral'}>{selected.severity}</Badge>
              </div>
              <div>
                <p className="text-gray-500">Confidence</p>
                <p className="font-semibold text-gray-900">{selected.confidence}%</p>
              </div>
              <div>
                <p className="text-gray-500">User</p>
                <p className="font-medium text-gray-900">{selected.userName}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-mono text-xs text-gray-700">{selected.userPhone}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Treatments</p>
              <ul className="space-y-1">
                {selected.treatments.map((t, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => toggleFlag(selected._id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selected.flagged
                    ? 'text-red-600 bg-red-50 border border-red-200'
                    : 'text-gray-600 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                {selected.flagged ? 'Unflag' : 'Flag for Review'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
