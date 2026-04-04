import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Bug, Calendar, Trash2 } from 'lucide-react';
import { getHistory, clearHistory } from '@/services/diagnosisService';
import type { DiagnosisHistoryItem } from '@/services/diagnosisService';

const severityBadge: Record<string, { bg: string; text: string; labelHi: string }> = {
  mild: { bg: 'bg-yellow-100', text: 'text-yellow-800', labelHi: 'हल्का' },
  moderate: { bg: 'bg-orange-100', text: 'text-orange-800', labelHi: 'मध्यम' },
  severe: { bg: 'bg-red-100', text: 'text-red-800', labelHi: 'गंभीर' },
  critical: { bg: 'bg-red-200', text: 'text-red-900', labelHi: 'अति गंभीर' },
};

export function HistoryPage() {
  const navigate = useNavigate();
  const [diagnoses, setDiagnoses] = useState<DiagnosisHistoryItem[]>([]);

  useEffect(() => {
    setDiagnoses(getHistory());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('क्या आप सारा इतिहास मिटाना चाहते हैं?\nClear all diagnosis history?')) {
      clearHistory();
      setDiagnoses([]);
    }
  };

  const handleViewResult = (item: DiagnosisHistoryItem) => {
    navigate('/farmer/diagnosis/result', {
      state: {
        diagnosis: item.result,
        imageDataUrl: item.imageThumbnail,
      },
    });
  };

  if (diagnoses.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 bg-earth-100 rounded-full flex items-center justify-center mb-5">
          <Bug className="w-10 h-10 text-earth-400" />
        </div>
        <h2 className="text-xl font-bold text-earth-900">अभी तक कोई जाँच नहीं</h2>
        <p className="text-base text-earth-500 mt-2">No diagnoses yet</p>
        <button
          onClick={() => navigate('/farmer/scan')}
          className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl text-lg flex items-center gap-3 transition-colors"
        >
          <Camera className="w-6 h-6" />
          पहली जाँच करें
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-earth-900">जाँच इतिहास</h1>
          <p className="text-base text-earth-500">Diagnosis History</p>
        </div>
        <button
          onClick={handleClearHistory}
          className="flex items-center gap-1.5 text-sm text-earth-400 hover:text-severity-severe transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          मिटाएँ
        </button>
      </div>

      <div className="space-y-3">
        {diagnoses.map((d) => {
          const badge = severityBadge[d.severity] || severityBadge.mild;
          return (
            <button
              key={d.id}
              onClick={() => handleViewResult(d)}
              className="w-full bg-white rounded-2xl border border-earth-200 overflow-hidden flex items-center gap-4 p-3 text-left hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-xl bg-earth-100 overflow-hidden flex-shrink-0">
                {d.imageThumbnail ? (
                  <img src={d.imageThumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Bug className="w-8 h-8 text-earth-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-earth-900 truncate">
                  {d.diseaseNameHi || d.diseaseName}
                </p>
                <p className="text-sm text-earth-500 truncate">{d.diseaseName}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`${badge.bg} ${badge.text} text-sm font-bold px-2.5 py-0.5 rounded-full`}>
                    {badge.labelHi}
                  </span>
                  <span className="text-sm font-medium text-primary-700">{d.confidence}%</span>
                  <span className="flex items-center gap-1 text-xs text-earth-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(d.createdAt).toLocaleDateString('hi-IN')}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
