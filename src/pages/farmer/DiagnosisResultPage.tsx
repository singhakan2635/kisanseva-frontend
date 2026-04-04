import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Camera, ShoppingBag, Phone, Share2, Volume2,
  Wrench, FlaskConical, Leaf, AlertTriangle, ChevronDown, ChevronUp,
  Shield, Droplets, Bug,
} from 'lucide-react';
import type { DiagnosisResult } from '@/services/diagnosisService';

interface LocationState {
  diagnosis: DiagnosisResult;
  imageDataUrl?: string;
}

export function DiagnosisResultPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const isHindi = i18n.language?.startsWith('hi');

  const [expandedSection, setExpandedSection] = useState<string | null>('chemical');

  // No diagnosis data -- prompt user to scan
  if (!state?.diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-severity-severe mx-auto mb-4" />
          <p className="text-lg font-bold text-earth-900">{t('farmer.diagnosis.noResult')}</p>
          <button
            onClick={() => navigate('/farmer/scan')}
            className="mt-4 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl text-base"
          >
            {t('farmer.diagnosis.takePhoto')}
          </button>
        </div>
      </div>
    );
  }

  const diagnosis = state.diagnosis;
  const imageDataUrl = state.imageDataUrl;
  const { primaryDiagnosis } = diagnosis;

  const sevLabel = t(`farmer.diagnosis.severity.${primaryDiagnosis.severity}`);
  const typeLabel = t(`farmer.diagnosis.type.${primaryDiagnosis.type}`);

  const severityBgMap: Record<string, string> = {
    mild: 'bg-severity-mild',
    moderate: 'bg-severity-moderate',
    severe: 'bg-severity-severe',
    critical: 'bg-severity-critical',
  };
  const sevBg = severityBgMap[primaryDiagnosis.severity] || severityBgMap.mild;

  const handleShare = () => {
    const text = `KisanSeva - ${primaryDiagnosis.nameHi || primaryDiagnosis.name}\n${sevLabel}\n${primaryDiagnosis.confidence}%`;

    if (navigator.share) {
      navigator.share({ title: 'KisanSeva Diagnosis', text }).catch(() => {/* user cancelled */});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleListen = () => {
    const utterance = new SpeechSynthesisUtterance(
      `${primaryDiagnosis.nameHi}. ${sevLabel}. ${diagnosis.visibleSymptoms.join(', ')}`
    );
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    speechSynthesis.speak(utterance);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-5 pb-28">
      {/* Severity banner */}
      <div className={`${sevBg} rounded-2xl p-5 text-white text-center`}>
        <p className="text-2xl font-bold">{sevLabel}</p>
      </div>

      {/* Disease name */}
      <div className="text-center px-4">
        <h1 className="text-2xl font-bold text-earth-900">
          {isHindi ? primaryDiagnosis.nameHi : primaryDiagnosis.name}
        </h1>
        <p className="text-lg text-earth-700 mt-1">
          {isHindi ? primaryDiagnosis.name : primaryDiagnosis.nameHi}
        </p>
        <p className="text-sm text-earth-400 italic mt-0.5">{primaryDiagnosis.scientificName}</p>
        <span className="inline-block mt-2 px-3 py-1 bg-earth-100 rounded-full text-sm font-medium text-earth-700">
          {typeLabel}
        </span>
      </div>

      {/* Confidence meter */}
      <div className="bg-white rounded-2xl border border-earth-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-base font-bold text-earth-800">{t('farmer.diagnosis.confidence')}</p>
          <p className="text-xl font-bold text-primary-700">{primaryDiagnosis.confidence}%</p>
        </div>
        <div className="w-full h-4 bg-earth-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-700"
            style={{ width: `${primaryDiagnosis.confidence}%` }}
          />
        </div>
      </div>

      {/* Photo comparison */}
      <div className="grid grid-cols-2 gap-3">
        {imageDataUrl && (
          <div className="rounded-xl overflow-hidden border border-earth-200">
            <img src={imageDataUrl} alt="Your crop" className="w-full h-36 object-cover" />
            <p className="text-center text-sm font-bold text-earth-700 py-2">{t('farmer.diagnosis.yourPhoto')}</p>
          </div>
        )}
        {diagnosis.sampleImages.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-earth-200">
            <img
              src={diagnosis.sampleImages[0].url}
              alt={diagnosis.sampleImages[0].caption}
              className="w-full h-36 object-cover"
            />
            <p className="text-center text-sm font-bold text-earth-700 py-2">{t('farmer.diagnosis.samplePhoto')}</p>
          </div>
        )}
      </div>

      {/* Listen button */}
      <button
        onClick={handleListen}
        className="w-full bg-accent-100 hover:bg-accent-200 border border-accent-300 text-earth-800 font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-3 transition-colors"
      >
        <Volume2 className="w-6 h-6 text-accent-700" />
        {t('farmer.diagnosis.listen')}
      </button>

      {/* Visible symptoms */}
      {diagnosis.visibleSymptoms.length > 0 && (
        <div className="bg-white rounded-2xl border border-earth-200 p-4">
          <h2 className="text-lg font-bold text-earth-900 mb-3">{t('farmer.diagnosis.symptoms')}</h2>
          <ul className="space-y-2">
            {diagnosis.visibleSymptoms.map((symptom, i) => (
              <li key={i} className="flex items-start gap-2">
                <Bug className="w-4 h-4 text-severity-severe flex-shrink-0 mt-1" />
                <span className="text-base text-earth-700">{symptom}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-earth-500 mt-2">
            {t('farmer.diagnosis.affectedPart')}: <span className="font-medium">{diagnosis.affectedPart}</span>
          </p>
        </div>
      )}

      {/* Differential diagnoses */}
      {diagnosis.differentialDiagnoses.length > 0 && (
        <div className="bg-white rounded-2xl border border-earth-200 p-4">
          <h2 className="text-lg font-bold text-earth-900 mb-3">{t('farmer.diagnosis.otherPossibilities')}</h2>
          <div className="space-y-2">
            {diagnosis.differentialDiagnoses.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-base text-earth-700">{d.name}</span>
                <span className="text-sm font-bold text-earth-500">{d.confidence}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Treatment sections */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-earth-900">{t('farmer.diagnosis.treatment')}</h2>

        {/* Mechanical treatments */}
        {diagnosis.treatments.mechanical.length > 0 && (
          <TreatmentSection
            type="mechanical"
            icon={Wrench}
            label={t('farmer.diagnosis.mechanical')}
            bg="bg-blue-50 border-blue-200"
            isExpanded={expandedSection === 'mechanical'}
            onToggle={() => toggleSection('mechanical')}
          >
            <ul className="space-y-2">
              {diagnosis.treatments.mechanical.map((item, i) => (
                <li key={i} className="bg-white rounded-xl p-3 border border-earth-100 text-base text-earth-700">
                  {item}
                </li>
              ))}
            </ul>
          </TreatmentSection>
        )}

        {/* Physical treatments */}
        {diagnosis.treatments.physical.length > 0 && (
          <TreatmentSection
            type="physical"
            icon={Droplets}
            label={t('farmer.diagnosis.physical')}
            bg="bg-purple-50 border-purple-200"
            isExpanded={expandedSection === 'physical'}
            onToggle={() => toggleSection('physical')}
          >
            <ul className="space-y-2">
              {diagnosis.treatments.physical.map((item, i) => (
                <li key={i} className="bg-white rounded-xl p-3 border border-earth-100 text-base text-earth-700">
                  {item}
                </li>
              ))}
            </ul>
          </TreatmentSection>
        )}

        {/* Chemical treatments */}
        {diagnosis.treatments.chemical.length > 0 && (
          <TreatmentSection
            type="chemical"
            icon={FlaskConical}
            label={t('farmer.diagnosis.chemical')}
            bg="bg-orange-50 border-orange-200"
            isExpanded={expandedSection === 'chemical'}
            onToggle={() => toggleSection('chemical')}
          >
            <div className="space-y-3">
              {diagnosis.treatments.chemical.map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-3 border border-earth-100">
                  <p className="text-base font-bold text-earth-900">{item.name}</p>
                  <div className="mt-2 space-y-1 text-sm text-earth-600">
                    <p>{t('farmer.diagnosis.dosage')}: <span className="font-medium">{item.dosage}</span></p>
                    <p>{t('farmer.diagnosis.method')}: <span className="font-medium">{item.applicationMethod}</span></p>
                    <p>{t('farmer.diagnosis.frequency')}: <span className="font-medium">{item.frequency}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </TreatmentSection>
        )}

        {/* Biological treatments */}
        {diagnosis.treatments.biological.length > 0 && (
          <TreatmentSection
            type="biological"
            icon={Leaf}
            label={t('farmer.diagnosis.biological')}
            bg="bg-green-50 border-green-200"
            isExpanded={expandedSection === 'biological'}
            onToggle={() => toggleSection('biological')}
          >
            <ul className="space-y-2">
              {diagnosis.treatments.biological.map((item, i) => (
                <li key={i} className="bg-white rounded-xl p-3 border border-earth-100 text-base text-earth-700">
                  {item}
                </li>
              ))}
            </ul>
          </TreatmentSection>
        )}
      </div>

      {/* Recommended pesticides */}
      {diagnosis.recommendedPesticides.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-earth-900">{t('farmer.diagnosis.recommendedPesticides')}</h2>
          {diagnosis.recommendedPesticides.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl border border-earth-200 p-4">
              <p className="text-lg font-bold text-earth-900">{p.name}</p>
              {p.tradeName.length > 0 && (
                <p className="text-sm text-earth-500 mt-0.5">
                  {t('farmer.diagnosis.brand')}: {p.tradeName.join(', ')}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-accent-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-earth-500">{t('farmer.diagnosis.perLiter')}</p>
                  <p className="text-sm font-bold text-earth-800">{p.dosage.perLiter}</p>
                </div>
                <div className="bg-accent-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-earth-500">{t('farmer.diagnosis.perAcre')}</p>
                  <p className="text-sm font-bold text-earth-800">{p.dosage.perAcre}</p>
                </div>
              </div>
              {p.safetyPrecautions.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-bold text-severity-severe flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {t('farmer.diagnosis.precautions')}
                  </p>
                  <ul className="mt-1 space-y-1">
                    {p.safetyPrecautions.map((s, j) => (
                      <li key={j} className="text-sm text-earth-600 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-earth-400">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Prevention tips */}
      {diagnosis.preventionTips.length > 0 && (
        <div className="bg-primary-50 rounded-2xl border border-primary-200 p-4">
          <h2 className="text-lg font-bold text-earth-900 mb-3">{t('farmer.diagnosis.preventionTips')}</h2>
          <ul className="space-y-2">
            {diagnosis.preventionTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary-600 flex-shrink-0 mt-1" />
                <span className="text-base text-earth-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-earth-400 text-center px-4 leading-relaxed">
        {diagnosis.disclaimer}
      </p>

      {/* Action buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-earth-200 px-4 py-3 z-40">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button
            onClick={() => navigate('/farmer/scan')}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl text-base flex items-center justify-center gap-2 transition-colors"
          >
            <Camera className="w-5 h-5" />
            {t('farmer.diagnosis.newPhoto')}
          </button>
          <button
            onClick={() => {/* placeholder for shop finder */}}
            className="w-14 h-14 bg-accent-100 border border-accent-300 rounded-xl flex items-center justify-center"
            aria-label={t('farmer.diagnosis.findShop')}
          >
            <ShoppingBag className="w-6 h-6 text-accent-700" />
          </button>
          <button
            onClick={() => {/* placeholder for expert call */}}
            className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center"
            aria-label={t('farmer.diagnosis.callExpert')}
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

// --- Reusable collapsible treatment section ---

interface TreatmentSectionProps {
  type: string;
  icon: typeof Wrench;
  label: string;
  bg: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function TreatmentSection({
  icon: Icon,
  label,
  bg,
  isExpanded,
  onToggle,
  children,
}: TreatmentSectionProps) {
  return (
    <div className={`rounded-2xl border ${bg} overflow-hidden`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-earth-700" />
          <p className="text-lg font-bold text-earth-900">{label}</p>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-earth-500" />
        ) : (
          <ChevronDown className="w-6 h-6 text-earth-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}
