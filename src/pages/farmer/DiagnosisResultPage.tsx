import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Camera, Share2,
  Wrench, FlaskConical, Leaf, AlertTriangle,
  Shield, Bug, ChevronDown, ChevronUp,
} from 'lucide-react';
import type { DiagnosisResult } from '@/services/diagnosisService';

interface LocationState {
  diagnosis: DiagnosisResult;
  imageDataUrl?: string;
}

/* ─── Severity helpers ──────────────────────────────────────────────────────── */

const SEVERITY_CONFIG = {
  mild:     { color: 'bg-secondary-500', text: 'text-secondary-500', position: 15 },
  moderate: { color: 'bg-accent-500',    text: 'text-accent-500',    position: 40 },
  severe:   { color: 'bg-primary-500',   text: 'text-primary-500',   position: 65 },
  critical: { color: 'bg-red-600',       text: 'text-red-600',       position: 90 },
} as const;

type Severity = keyof typeof SEVERITY_CONFIG;

/* ─── Treatment card config ─────────────────────────────────────────────────── */

interface TreatmentCardDef {
  key: string;
  icon: typeof Wrench;
  iconBg: string;
  labelKey: string;
}

const TREATMENT_CARDS: TreatmentCardDef[] = [
  { key: 'mechanical', icon: Wrench,       iconBg: 'bg-blue-100 text-blue-600',   labelKey: 'farmer.diagnosis.mechanical' },
  { key: 'chemical',   icon: FlaskConical,  iconBg: 'bg-orange-100 text-orange-600', labelKey: 'farmer.diagnosis.chemical' },
  { key: 'biological', icon: Leaf,          iconBg: 'bg-green-100 text-green-600',  labelKey: 'farmer.diagnosis.biological' },
  { key: 'prevention', icon: Shield,        iconBg: 'bg-primary-100 text-primary-600', labelKey: 'farmer.diagnosis.preventionTips' },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   DiagnosisResultPage
   ═══════════════════════════════════════════════════════════════════════════════ */

export function DiagnosisResultPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const isHindi = i18n.language?.startsWith('hi');

  const [symptomsExpanded, setSymptomsExpanded] = useState(false);
  const [expandedTreatment, setExpandedTreatment] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (!state?.diagnosis) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-severity-severe mx-auto mb-4" />
          <p className="text-lg font-bold text-earth-900">{t('farmer.diagnosis.noResult')}</p>
          <button
            onClick={() => navigate('/farmer/scan')}
            className="mt-4 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl text-base min-h-[48px]"
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

  const severity = primaryDiagnosis.severity as Severity;
  const sevConfig = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.mild;
  const sevLabel = t(`farmer.diagnosis.severity.${severity}`);
  const diseaseName = isHindi
    ? (primaryDiagnosis.nameHi || primaryDiagnosis.name)
    : primaryDiagnosis.name;
  const cropType = t(`farmer.diagnosis.type.${primaryDiagnosis.type}`);

  // Symptoms: show max 4, expand for rest
  const MAX_SYMPTOMS = 4;
  const allSymptoms = diagnosis.visibleSymptoms;
  const visibleSymptoms = symptomsExpanded ? allSymptoms : allSymptoms.slice(0, MAX_SYMPTOMS);
  const hasMoreSymptoms = allSymptoms.length > MAX_SYMPTOMS;

  // Build treatment data map for cards
  const treatmentData: Record<string, { summary: string; items: React.ReactNode }> = {};

  if (diagnosis.treatments.mechanical.length > 0) {
    treatmentData['mechanical'] = {
      summary: diagnosis.treatments.mechanical[0].slice(0, 60) + (diagnosis.treatments.mechanical[0].length > 60 ? '...' : ''),
      items: (
        <ul className="space-y-2">
          {diagnosis.treatments.mechanical.map((item, i) => (
            <li key={i} className="text-sm text-earth-700 flex items-start gap-2">
              <span className="text-earth-400 mt-0.5">--</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ),
    };
  }

  if (diagnosis.treatments.chemical.length > 0) {
    treatmentData['chemical'] = {
      summary: diagnosis.treatments.chemical[0].name + (diagnosis.treatments.chemical[0].dosage ? ` - ${diagnosis.treatments.chemical[0].dosage}` : ''),
      items: (
        <div className="space-y-3">
          {diagnosis.treatments.chemical.map((item, i) => (
            <div key={i} className="border-b border-earth-100 pb-3 last:border-0 last:pb-0">
              <p className="text-sm font-semibold text-earth-900">{item.name}</p>
              <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-earth-600">
                <span className="text-earth-400">{t('farmer.diagnosis.dosage')}</span>
                <span className="font-medium">{item.dosage}</span>
                <span className="text-earth-400">{t('farmer.diagnosis.method')}</span>
                <span className="font-medium">{item.applicationMethod}</span>
                <span className="text-earth-400">{t('farmer.diagnosis.frequency')}</span>
                <span className="font-medium">{item.frequency}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    };
  }

  if (diagnosis.treatments.biological.length > 0) {
    treatmentData['biological'] = {
      summary: diagnosis.treatments.biological[0].slice(0, 60) + (diagnosis.treatments.biological[0].length > 60 ? '...' : ''),
      items: (
        <ul className="space-y-2">
          {diagnosis.treatments.biological.map((item, i) => (
            <li key={i} className="text-sm text-earth-700 flex items-start gap-2">
              <span className="text-earth-400 mt-0.5">--</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ),
    };
  }

  if (diagnosis.preventionTips.length > 0) {
    treatmentData['prevention'] = {
      summary: diagnosis.preventionTips[0].slice(0, 60) + (diagnosis.preventionTips[0].length > 60 ? '...' : ''),
      items: (
        <ul className="space-y-2">
          {diagnosis.preventionTips.map((tip, i) => (
            <li key={i} className="text-sm text-earth-700 flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      ),
    };
  }

  const availableCards = TREATMENT_CARDS.filter(c => treatmentData[c.key]);

  const handleShare = () => {
    const text = `KisanSeva - ${diseaseName}\n${sevLabel}\n${cropType}`;
    if (navigator.share) {
      navigator.share({ title: 'KisanSeva Diagnosis', text }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 pb-24">

      {/* ══════════════════════════════════════════════════════════════════════════
         1. Hero Photo with Overlay
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full h-[220px] sm:h-[260px] bg-earth-200 overflow-hidden">
        {imageDataUrl ? (
          <img
            src={imageDataUrl}
            alt="Uploaded crop"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="w-16 h-16 text-earth-400" />
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 min-w-[48px] min-h-[48px]"
          aria-label={t('common.back', 'Back')}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Overlaid text on gradient */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          {/* Severity badge pill */}
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${sevConfig.color} mb-2`}>
            {sevLabel}
          </span>

          {/* Disease name */}
          <h1 className="text-2xl font-bold text-white leading-tight">
            {diseaseName}
          </h1>

          {/* Crop type + scientific name */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-white/80 font-medium">{cropType}</span>
            {primaryDiagnosis.scientificName && (
              <>
                <span className="text-white/40">|</span>
                <span className="text-xs text-white/50 italic">{primaryDiagnosis.scientificName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
         2. Severity Indicator Bar
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="mx-4 -mt-4 relative z-20">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs font-semibold text-earth-500 uppercase tracking-wide mb-3">
            {t('farmer.diagnosis.severityLevel', 'Severity Level')}
          </p>

          {/* Gradient bar */}
          <div className="relative h-3 rounded-full overflow-visible">
            {/* Background gradient */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(to right, #6F8A57, #D1A24E, #C47A3E, #C75B39, #9B2C2C)',
              }}
            />

            {/* White dot marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-[3px] border-earth-800 shadow-md transition-all duration-500 z-10"
              style={{ left: `calc(${sevConfig.position}% - 10px)` }}
            />
          </div>

          {/* Active severity label centered under dot */}
          <div className="relative mt-2 h-5">
            <span
              className={`absolute text-xs font-bold ${sevConfig.text} transition-all duration-500`}
              style={{ left: `${sevConfig.position}%`, transform: 'translateX(-50%)' }}
            >
              {sevLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
         3. Symptoms (collapsible)
         ══════════════════════════════════════════════════════════════════════════ */}
      {allSymptoms.length > 0 && (
        <div className="mx-4 mt-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-base font-bold text-earth-900 mb-3">
              {t('farmer.diagnosis.symptoms')}
            </h2>
            <ul className="space-y-2.5">
              {visibleSymptoms.map((symptom, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Bug className="w-4 h-4 text-severity-severe flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-earth-700 leading-snug">{symptom}</span>
                </li>
              ))}
            </ul>
            {hasMoreSymptoms && (
              <button
                onClick={() => setSymptomsExpanded(!symptomsExpanded)}
                className="mt-3 text-sm font-semibold text-primary-600 flex items-center gap-1 min-h-[48px]"
              >
                {symptomsExpanded
                  ? t('common.showLess', 'Show less')
                  : t('common.showMore', `Show ${allSymptoms.length - MAX_SYMPTOMS} more`)}
                {symptomsExpanded
                  ? <ChevronUp className="w-4 h-4" />
                  : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
         4. Treatment Cards (horizontal scroll)
         ══════════════════════════════════════════════════════════════════════════ */}
      {availableCards.length > 0 && (
        <div className="mt-4">
          <h2 className="text-base font-bold text-earth-900 px-4 mb-3">
            {t('farmer.diagnosis.treatment')}
          </h2>

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {availableCards.map((card) => {
              const Icon = card.icon;
              const data = treatmentData[card.key];
              const isExpanded = expandedTreatment === card.key;

              return (
                <button
                  key={card.key}
                  onClick={() => setExpandedTreatment(isExpanded ? null : card.key)}
                  className={`flex-shrink-0 w-36 snap-start bg-white rounded-xl shadow-sm p-4 text-left transition-all min-h-[48px] ${
                    isExpanded ? 'ring-2 ring-primary-400' : ''
                  }`}
                >
                  {/* Icon circle */}
                  <div className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Label */}
                  <p className="text-xs font-bold text-earth-900 mb-1">
                    {t(card.labelKey)}
                  </p>

                  {/* Summary */}
                  <p className="text-[11px] text-earth-500 leading-snug line-clamp-2">
                    {data.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Expanded treatment detail */}
          {expandedTreatment && treatmentData[expandedTreatment] && (
            <div className="mx-4 mt-3 bg-white rounded-xl shadow-sm p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-earth-900">
                  {t(TREATMENT_CARDS.find(c => c.key === expandedTreatment)!.labelKey)}
                </h3>
                <button
                  onClick={() => setExpandedTreatment(null)}
                  className="text-earth-400 min-w-[48px] min-h-[48px] flex items-center justify-center"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
              {treatmentData[expandedTreatment].items}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
         5. Chemical Treatment Detail (pesticides table)
         ══════════════════════════════════════════════════════════════════════════ */}
      {diagnosis.recommendedPesticides.length > 0 && (
        <div className="mx-4 mt-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-base font-bold text-earth-900 mb-3">
              {t('farmer.diagnosis.recommendedPesticides')}
            </h2>

            <div className="space-y-4">
              {diagnosis.recommendedPesticides.map((p, i) => (
                <div key={i} className={`${i > 0 ? 'border-t border-earth-100 pt-4' : ''}`}>
                  {/* Pesticide name */}
                  <p className="text-sm font-bold text-earth-900">{p.name}</p>

                  {/* Trade names */}
                  {p.tradeName.length > 0 && (
                    <p className="text-xs text-earth-400 mt-0.5">
                      {p.tradeName.join(', ')}
                    </p>
                  )}

                  {/* Dosage grid */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-earth-50 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-earth-400 uppercase tracking-wide">{t('farmer.diagnosis.perLiter')}</p>
                      <p className="text-sm font-semibold text-earth-800 mt-0.5">{p.dosage.perLiter}</p>
                    </div>
                    <div className="bg-earth-50 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-earth-400 uppercase tracking-wide">{t('farmer.diagnosis.perAcre')}</p>
                      <p className="text-sm font-semibold text-earth-800 mt-0.5">{p.dosage.perAcre}</p>
                    </div>
                  </div>

                  {/* Safety precautions */}
                  {p.safetyPrecautions.length > 0 && (
                    <div className="mt-2">
                      {p.safetyPrecautions.map((s, j) => (
                        <p key={j} className="text-xs text-earth-500 flex items-start gap-1.5 mt-1">
                          <Shield className="w-3 h-3 text-severity-severe flex-shrink-0 mt-0.5" />
                          {s}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
         6. Prevention Tips
         ══════════════════════════════════════════════════════════════════════════ */}
      {diagnosis.preventionTips.length > 0 && (
        <div className="mx-4 mt-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-base font-bold text-earth-900 mb-3">
              {t('farmer.diagnosis.preventionTips')}
            </h2>
            <ul className="space-y-2.5">
              {diagnosis.preventionTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-earth-700 leading-snug">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
         7. Disclaimer
         ══════════════════════════════════════════════════════════════════════════ */}
      {diagnosis.disclaimer && (
        <p className="mx-4 mt-4 text-[11px] text-earth-400 text-center leading-relaxed px-2">
          {diagnosis.disclaimer}
        </p>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
         8. Sticky Bottom Action Bar
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-earth-200 z-40">
        <div className="flex items-center gap-3 max-w-lg mx-auto px-4 py-3">
          <button
            onClick={() => navigate('/farmer/scan')}
            className="flex-1 border-2 border-primary-600 text-primary-700 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors hover:bg-primary-50 min-h-[48px]"
          >
            <Camera className="w-5 h-5" />
            {t('farmer.diagnosis.newPhoto')}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors min-h-[48px]"
          >
            <Share2 className="w-5 h-5" />
            {t('farmer.diagnosis.share', 'Share')}
          </button>
        </div>
      </div>
    </div>
  );
}
