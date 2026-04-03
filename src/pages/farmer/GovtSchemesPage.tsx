import { useState, useEffect } from 'react';
import { ExternalLink, Filter } from 'lucide-react';
import { apiClient } from '@/services/api';
import type { ApiResponse } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface GovtScheme {
  _id: string;
  name: string;
  nameHindi: string;
  description: string;
  descriptionHindi: string;
  category: string;
  eligibility?: string;
  eligibilityHindi?: string;
  applicationUrl?: string;
  department: string;
}

const categories = [
  { key: '', labelHi: 'सभी', labelEn: 'All' },
  { key: 'subsidy', labelHi: 'सब्सिडी', labelEn: 'Subsidy' },
  { key: 'insurance', labelHi: 'बीमा', labelEn: 'Insurance' },
  { key: 'loan', labelHi: 'ऋण', labelEn: 'Loan' },
  { key: 'training', labelHi: 'प्रशिक्षण', labelEn: 'Training' },
  { key: 'equipment', labelHi: 'उपकरण', labelEn: 'Equipment' },
];

export function GovtSchemesPage() {
  const [schemes, setSchemes] = useState<GovtScheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const params = selectedCategory ? `?category=${selectedCategory}` : '';
    apiClient<ApiResponse<GovtScheme[]>>(`/schemes${params}`)
      .then((res) => setSchemes(res.data))
      .catch(() => {/* fail silently */})
      .finally(() => setIsLoading(false));
  }, [selectedCategory]);

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-earth-900">📋 सरकारी योजनाएँ</h1>
        <p className="text-base text-earth-500">Government Schemes</p>
      </div>

      {/* Category filter tabs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-earth-400" />
          <p className="text-base font-bold text-earth-700">श्रेणी</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-full text-base font-bold transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-earth-700 text-white'
                  : 'bg-white border border-earth-200 text-earth-700'
              }`}
            >
              {cat.labelHi}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && schemes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-bold text-earth-700">कोई योजना नहीं मिली</p>
          <p className="text-base text-earth-500 mt-1">No schemes found</p>
        </div>
      )}

      {/* Scheme cards */}
      {!isLoading && (
        <div className="space-y-4">
          {schemes.map((scheme) => (
            <div
              key={scheme._id}
              className="bg-white rounded-2xl border border-earth-200 overflow-hidden"
            >
              {/* Category badge */}
              <div className="bg-earth-50 px-4 py-2 border-b border-earth-100 flex items-center justify-between">
                <span className="text-sm font-bold text-earth-500 uppercase">{scheme.department}</span>
                <span className="text-xs bg-primary-100 text-primary-800 font-bold px-2 py-0.5 rounded-full">
                  {scheme.category}
                </span>
              </div>

              <div className="p-4 space-y-3">
                {/* Scheme name */}
                <div>
                  <h3 className="text-lg font-bold text-earth-900">{scheme.nameHindi}</h3>
                  <p className="text-sm text-earth-500 mt-0.5">{scheme.name}</p>
                </div>

                {/* Description */}
                <p className="text-base text-earth-700 leading-relaxed">
                  {scheme.descriptionHindi}
                </p>
                <p className="text-sm text-earth-500 leading-relaxed">
                  {scheme.description}
                </p>

                {/* Eligibility */}
                {scheme.eligibilityHindi && (
                  <div className="bg-accent-50 border border-accent-200 rounded-xl p-3">
                    <p className="text-sm font-bold text-earth-800">पात्रता / Eligibility:</p>
                    <p className="text-base text-earth-700 mt-1">{scheme.eligibilityHindi}</p>
                  </div>
                )}

                {/* Apply button */}
                {scheme.applicationUrl && (
                  <a
                    href={scheme.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl text-lg transition-colors"
                  >
                    आवेदन करें / Apply
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
