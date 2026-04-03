import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Camera, ShoppingBag, Phone, Share2, Volume2,
  Wrench, FlaskConical, Leaf, AlertTriangle, ChevronDown, ChevronUp,
} from 'lucide-react';
import { apiClient } from '@/services/api';
import type { ApiResponse } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface Treatment {
  type: 'mechanical' | 'chemical' | 'biological';
  name: string;
  nameHindi: string;
  description: string;
  descriptionHindi: string;
  dosage?: string;
}

interface DiagnosisResult {
  _id: string;
  diseaseName: string;
  diseaseNameHindi: string;
  diseaseNameScientific: string;
  severity: 'healthy' | 'mild' | 'moderate' | 'severe' | 'critical';
  confidence: number;
  imageUrl: string;
  sampleImageUrl?: string;
  description: string;
  descriptionHindi: string;
  treatments: Treatment[];
  createdAt: string;
}

const severityConfig: Record<string, { bg: string; label: string; labelHi: string }> = {
  healthy: { bg: 'bg-severity-healthy', label: 'Healthy', labelHi: 'स्वस्थ' },
  mild: { bg: 'bg-severity-mild', label: 'Mild', labelHi: 'हल्का' },
  moderate: { bg: 'bg-severity-moderate', label: 'Moderate', labelHi: 'मध्यम' },
  severe: { bg: 'bg-severity-severe', label: 'Severe', labelHi: 'गंभीर' },
  critical: { bg: 'bg-severity-critical', label: 'Critical', labelHi: 'अति गंभीर' },
};

const treatmentIcons: Record<string, { icon: typeof Wrench; labelHi: string; labelEn: string; bg: string }> = {
  mechanical: { icon: Wrench, labelHi: 'यांत्रिक', labelEn: 'Mechanical', bg: 'bg-blue-50 border-blue-200' },
  chemical: { icon: FlaskConical, labelHi: 'रासायनिक', labelEn: 'Chemical', bg: 'bg-orange-50 border-orange-200' },
  biological: { icon: Leaf, labelHi: 'जैविक', labelEn: 'Biological', bg: 'bg-green-50 border-green-200' },
};

export function DiagnosisResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTreatment, setExpandedTreatment] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    apiClient<ApiResponse<DiagnosisResult>>(`/diagnoses/${id}`)
      .then((res) => setDiagnosis(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleShare = () => {
    if (!diagnosis) return;
    const text = `🌾 KisanSeva जाँच परिणाम\n\n🦠 ${diagnosis.diseaseNameHindi} (${diagnosis.diseaseName})\n📊 गंभीरता: ${severityConfig[diagnosis.severity]?.labelHi}\n✅ सटीकता: ${diagnosis.confidence}%\n\nKisanSeva ऐप से जाँच करें!`;

    if (navigator.share) {
      navigator.share({ title: 'KisanSeva Diagnosis', text }).catch(() => {/* user cancelled */});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleListen = () => {
    if (!diagnosis) return;
    // TTS placeholder - will integrate with Sarvam AI
    const utterance = new SpeechSynthesisUtterance(
      `${diagnosis.diseaseNameHindi}. गंभीरता ${severityConfig[diagnosis.severity]?.labelHi}. ${diagnosis.descriptionHindi}`
    );
    utterance.lang = 'hi-IN';
    speechSynthesis.speak(utterance);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-base text-earth-600 mt-4 font-medium">जाँच हो रही है...</p>
          <p className="text-sm text-earth-400 mt-1">Analyzing your crop...</p>
        </div>
      </div>
    );
  }

  if (error || !diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-severity-severe mx-auto mb-4" />
          <p className="text-lg font-bold text-earth-900">त्रुटि हुई</p>
          <p className="text-base text-earth-500 mt-1">{error || 'Result not found'}</p>
          <button
            onClick={() => navigate('/farmer/scan')}
            className="mt-4 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl text-base"
          >
            📸 नई फोटो लें
          </button>
        </div>
      </div>
    );
  }

  const sev = severityConfig[diagnosis.severity] || severityConfig.mild;

  // Group treatments by type
  const treatmentsByType = diagnosis.treatments.reduce<Record<string, Treatment[]>>((acc, t) => {
    if (!acc[t.type]) acc[t.type] = [];
    acc[t.type].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-5 pb-28">
      {/* Severity banner */}
      <div className={`${sev.bg} rounded-2xl p-5 text-white text-center`}>
        <p className="text-2xl font-bold">{sev.labelHi}</p>
        <p className="text-base opacity-90 mt-1">{sev.label}</p>
      </div>

      {/* Disease name */}
      <div className="text-center px-4">
        <h1 className="text-2xl font-bold text-earth-900">{diagnosis.diseaseNameHindi}</h1>
        <p className="text-lg text-earth-700 mt-1">{diagnosis.diseaseName}</p>
        <p className="text-sm text-earth-400 italic mt-0.5">{diagnosis.diseaseNameScientific}</p>
      </div>

      {/* Confidence meter */}
      <div className="bg-white rounded-2xl border border-earth-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-base font-bold text-earth-800">सटीकता / Confidence</p>
          <p className="text-xl font-bold text-primary-700">{diagnosis.confidence}%</p>
        </div>
        <div className="w-full h-4 bg-earth-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-700"
            style={{ width: `${diagnosis.confidence}%` }}
          />
        </div>
      </div>

      {/* Photo comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl overflow-hidden border border-earth-200">
          <img src={diagnosis.imageUrl} alt="Your crop" className="w-full h-36 object-cover" />
          <p className="text-center text-sm font-bold text-earth-700 py-2">आपकी फोटो</p>
        </div>
        {diagnosis.sampleImageUrl && (
          <div className="rounded-xl overflow-hidden border border-earth-200">
            <img src={diagnosis.sampleImageUrl} alt="Sample disease" className="w-full h-36 object-cover" />
            <p className="text-center text-sm font-bold text-earth-700 py-2">नमूना फोटो</p>
          </div>
        )}
      </div>

      {/* Listen button */}
      <button
        onClick={handleListen}
        className="w-full bg-accent-100 hover:bg-accent-200 border border-accent-300 text-earth-800 font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-3 transition-colors"
      >
        <Volume2 className="w-6 h-6 text-accent-700" />
        🔊 सुनें / Listen
      </button>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-earth-200 p-4">
        <p className="text-base text-earth-800 leading-relaxed">{diagnosis.descriptionHindi}</p>
        <p className="text-sm text-earth-500 mt-2 leading-relaxed">{diagnosis.description}</p>
      </div>

      {/* Treatment sections */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-earth-900">उपचार / Treatment</h2>

        {Object.entries(treatmentsByType).map(([type, treatments]) => {
          const config = treatmentIcons[type] || treatmentIcons.mechanical;
          const Icon = config.icon;
          const isExpanded = expandedTreatment === type;

          return (
            <div key={type} className={`rounded-2xl border ${config.bg} overflow-hidden`}>
              <button
                onClick={() => setExpandedTreatment(isExpanded ? null : type)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-earth-700" />
                  <div className="text-left">
                    <p className="text-lg font-bold text-earth-900">{config.labelHi}</p>
                    <p className="text-sm text-earth-500">{config.labelEn}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-6 h-6 text-earth-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-earth-500" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {treatments.map((t, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-3 border border-earth-100">
                      <p className="text-base font-bold text-earth-900">{t.nameHindi}</p>
                      <p className="text-sm text-earth-600 mt-0.5">{t.name}</p>
                      <p className="text-base text-earth-700 mt-2">{t.descriptionHindi}</p>
                      {t.dosage && (
                        <div className="mt-2 bg-accent-50 rounded-lg px-3 py-2">
                          <p className="text-sm font-bold text-earth-800">💊 मात्रा: {t.dosage}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-earth-400 text-center px-4 leading-relaxed">
        यह AI आधारित सलाह है। गंभीर मामलों में कृषि विशेषज्ञ से संपर्क करें।
        <br />
        This is AI-based advice. Consult an agriculture expert for serious cases.
      </p>

      {/* Action buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-earth-200 px-4 py-3 z-40">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button
            onClick={() => navigate('/farmer/scan')}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl text-base flex items-center justify-center gap-2 transition-colors"
          >
            <Camera className="w-5 h-5" />
            📸 नई फोटो
          </button>
          <button
            onClick={() => {/* placeholder for shop finder */}}
            className="w-14 h-14 bg-accent-100 border border-accent-300 rounded-xl flex items-center justify-center"
            aria-label="Find pesticide shop"
          >
            <ShoppingBag className="w-6 h-6 text-accent-700" />
          </button>
          <button
            onClick={() => {/* placeholder for expert call */}}
            className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center"
            aria-label="Call expert"
          >
            <Phone className="w-6 h-6 text-blue-600" />
          </button>
          <button
            onClick={handleShare}
            className="w-14 h-14 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center"
            aria-label="Share on WhatsApp"
          >
            <Share2 className="w-6 h-6 text-green-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
