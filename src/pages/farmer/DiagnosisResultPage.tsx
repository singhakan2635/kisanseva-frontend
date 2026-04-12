import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Camera, Share2,
  Wrench, FlaskConical, Leaf, AlertTriangle,
  Shield, Bug, ChevronDown, ChevronUp, CheckCircle,
  MapPin, ShoppingBag,
} from 'lucide-react';
import type { DiagnosisResult } from '@/services/diagnosisService';

interface LocationState {
  diagnosis: DiagnosisResult;
  imageDataUrl?: string;
}

/* ─── Severity helpers ──────────────────────────────────────────────────────── */

const SEVERITY_CONFIG = {
  mild:     { color: 'bg-secondary-500', text: 'text-secondary-500', position: 15, simpleColor: 'bg-yellow-400' },
  moderate: { color: 'bg-accent-500',    text: 'text-accent-500',    position: 40, simpleColor: 'bg-yellow-500' },
  severe:   { color: 'bg-primary-500',   text: 'text-primary-500',   position: 65, simpleColor: 'bg-red-500' },
  critical: { color: 'bg-red-600',       text: 'text-red-600',       position: 90, simpleColor: 'bg-red-700' },
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

  const [showDetails, setShowDetails] = useState(false);
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

  // ── Uncertain result ────────────────────────────────────────────────────────
  if (diagnosis.isUncertain) {
    return (
      <div className="min-h-screen bg-earth-50 pb-24">
        {/* Hero with image */}
        <div className="relative w-full h-[35vh] max-h-[350px] min-h-[180px] bg-earth-200 overflow-hidden">
          {imageDataUrl ? (
            <img src={imageDataUrl} alt="Uploaded crop" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-16 h-16 text-earth-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 min-w-[48px] min-h-[48px]"
            aria-label={t('common.back', 'Back')}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-amber-500 mb-2">
              {t('farmer.diagnosis.uncertain.badge', 'Uncertain')}
            </span>
            <h1 className="text-2xl font-bold text-white leading-tight">
              {t('farmer.diagnosis.uncertain.title', "Couldn't identify disease")}
            </h1>
          </div>
        </div>

        {/* Amber uncertain banner */}
        <div className="mx-4 -mt-4 relative z-20">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border-2 border-amber-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <AlertTriangle className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-amber-700 mb-2">
              {t('farmer.diagnosis.uncertain.title', "Couldn't identify disease")}
            </h2>
            <p className="text-sm text-earth-600">
              {t('farmer.diagnosis.uncertain.message', "We couldn't identify a specific disease. Please try again with a clearer photo.")}
            </p>
          </div>
        </div>

        {/* Retake photo prominent button */}
        <div className="mx-4 mt-6">
          <button
            onClick={() => navigate('/farmer/scan')}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl text-base flex items-center justify-center gap-2 transition-colors min-h-[48px]"
          >
            <Camera className="w-5 h-5" />
            {t('farmer.diagnosis.uncertain.retake', 'Retake Photo')}
          </button>
        </div>

        {/* Disclaimer */}
        {diagnosis.disclaimer && (
          <p className="mx-4 mt-4 text-[11px] text-earth-400 text-center leading-relaxed px-2">
            {diagnosis.disclaimer}
          </p>
        )}
      </div>
    );
  }

  // ── Healthy plant result ────────────────────────────────────────────────────
  if (diagnosis.isHealthy) {
    const handleShareHealthy = () => {
      const text = `FasalRakshak - ${t('farmer.diagnosis.healthy.title', 'Your crop looks healthy!')}`;
      if (navigator.share) {
        navigator.share({ title: 'FasalRakshak Diagnosis', text }).catch(() => {});
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    };

    return (
      <div className="min-h-screen bg-earth-50 pb-24">
        {/* Hero with image */}
        <div className="relative w-full h-[35vh] max-h-[350px] min-h-[180px] bg-earth-200 overflow-hidden">
          {imageDataUrl ? (
            <img src={imageDataUrl} alt="Uploaded crop" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-16 h-16 text-earth-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 min-w-[48px] min-h-[48px]"
            aria-label={t('common.back', 'Back')}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-secondary-500 mb-2">
              {t('farmer.diagnosis.severity.healthy', 'Healthy')}
            </span>
            <h1 className="text-2xl font-bold text-white leading-tight">
              {t('farmer.diagnosis.healthy.title', 'Your crop looks healthy!')}
            </h1>
          </div>
        </div>

        {/* Green healthy banner */}
        <div className="mx-4 -mt-4 relative z-20">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-secondary-600" />
            </div>
            <h2 className="text-xl font-bold text-secondary-700 mb-1">
              {t('farmer.diagnosis.healthy.title', 'Your crop looks healthy!')}
            </h2>
            <p className="text-sm text-earth-500">
              {t('farmer.diagnosis.healthy.subtitle', 'No disease detected')}
            </p>
            {diagnosis.healthyMessage && (
              <p className="text-sm text-earth-600 mt-3">
                {diagnosis.healthyMessage}
              </p>
            )}
          </div>
        </div>

        {/* Tips card */}
        <div className="mx-4 mt-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-base font-bold text-earth-900 mb-3">
              {t('farmer.diagnosis.healthy.tips', 'Keep Your Crops Healthy')}
            </h2>
            <ul className="space-y-2.5">
              {(diagnosis.preventionTips.length > 0
                ? diagnosis.preventionTips
                : [t('farmer.diagnosis.healthy.defaultTip', 'Keep monitoring your crops regularly')]
              ).map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-secondary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-earth-700 leading-snug">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        {diagnosis.disclaimer && (
          <p className="mx-4 mt-4 text-[11px] text-earth-400 text-center leading-relaxed px-2">
            {diagnosis.disclaimer}
          </p>
        )}

        {/* Sticky bottom action bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-earth-200 z-40">
          <div className="flex items-center gap-3 max-w-lg mx-auto px-4 py-3">
            <button
              onClick={() => navigate('/farmer/scan')}
              className="flex-1 border-2 border-primary-600 text-primary-700 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors hover:bg-primary-50 min-h-[48px]"
            >
              <Camera className="w-5 h-5" />
              {t('farmer.diagnosis.scanAnother', 'Scan Another')}
            </button>
            <button
              onClick={handleShareHealthy}
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

  const severity = primaryDiagnosis.severity as Severity;
  const sevConfig = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.mild;
  const sevLabel = t(`farmer.diagnosis.severity.${severity}`);
  const simpleSevLabel = t(`farmer.diagnosis.simpleSeverity.${severity}`, sevLabel);
  const diseaseName = isHindi
    ? (primaryDiagnosis.nameHi || primaryDiagnosis.name)
    : primaryDiagnosis.name;
  const cropType = t(`farmer.diagnosis.type.${primaryDiagnosis.type}`);

  // Pick ONE recommended treatment for simple view
  // Prefer first chemical treatment, fallback to first mechanical
  const simpleChemical = diagnosis.treatments.chemical[0];
  const simpleMechanical = diagnosis.treatments.mechanical[0];
  const simpleTreatmentText = simpleChemical
    ? simpleChemical.name
    : simpleMechanical || null;

  // Get trade names for the simple view chemical treatment (from pesticides)
  const simplePesticideMatch = simpleChemical
    ? diagnosis.recommendedPesticides.find(
        (p) => p.name.toLowerCase().includes(simpleChemical.name.toLowerCase().split(' ')[0])
      ) || diagnosis.recommendedPesticides[0]
    : null;
  const simpleTradeNames = simplePesticideMatch?.tradeName ?? [];

  // Symptoms: show max 4, expand for rest
  const MAX_SYMPTOMS = 4;
  const allSymptoms = diagnosis.visibleSymptoms;
  const visibleSymptoms = symptomsExpanded ? allSymptoms : allSymptoms.slice(0, MAX_SYMPTOMS);
  const hasMoreSymptoms = allSymptoms.length > MAX_SYMPTOMS;

  // Build treatment data map for cards (used in detailed view)
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
    const text = `FasalRakshak - ${diseaseName}\n${sevLabel}\n${cropType}`;
    if (navigator.share) {
      navigator.share({ title: 'FasalRakshak Diagnosis', text }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 pb-24">

      {/* ══════════════════════════════════════════════════════════════════════════
         1. Hero Photo with Overlay
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full h-[35vh] max-h-[350px] min-h-[180px] bg-earth-200 overflow-hidden">
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

          {/* Crop type (no scientific name in hero — keep simple for farmers) */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-white/80 font-medium">{cropType}</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
         2. SIMPLE VIEW — Severity + Summary + One Treatment
         ══════════════════════════════════════════════════════════════════════════ */}

      {/* Simple Severity Indicator */}
      <div className="mx-4 -mt-4 relative z-20">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${sevConfig.simpleColor} flex items-center justify-center flex-shrink-0`}>
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-earth-900">{simpleSevLabel}</p>
              <p className="text-xs text-earth-500">{cropType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Farmer Summary */}
      {diagnosis.farmerSummary && (
        <div className="mx-4 mt-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-base text-earth-800 leading-relaxed">
              {diagnosis.farmerSummary}
            </p>
          </div>
        </div>
      )}

      {/* Simple Treatment — What to Do */}
      {simpleTreatmentText && (
        <div className="mx-4 mt-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-base font-bold text-earth-900 mb-3">
              {t('farmer.diagnosis.whatToDo')}
            </h2>

            {/* Treatment name */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <FlaskConical className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-earth-900">{simpleTreatmentText}</p>
                {simpleChemical && (
                  <p className="text-xs text-earth-500 mt-0.5">
                    {t('farmer.diagnosis.howToApply')}
                  </p>
                )}
              </div>
            </div>

            {/* Trade names — what to ask for at the shop */}
            {simpleTradeNames.length > 0 && (
              <div className="bg-earth-50 rounded-lg p-3 mb-3">
                <p className="text-xs font-semibold text-earth-500 mb-1">
                  <ShoppingBag className="w-3 h-3 inline mr-1" />
                  {t('farmer.diagnosis.askForAtShop')}
                </p>
                <p className="text-sm font-bold text-earth-900">
                  {simpleTradeNames.join(', ')}
                </p>
              </div>
            )}

            {/* Find shop near me button */}
            <a
              href="https://www.google.com/maps/search/agricultural+shop+near+me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl text-sm transition-colors min-h-[48px]"
            >
              <MapPin className="w-5 h-5" />
              {t('farmer.diagnosis.findShopNearMe')}
            </a>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
         3. "More Details" Toggle
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="mx-4 mt-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center gap-2 bg-white rounded-xl shadow-sm p-4 text-sm font-bold text-primary-600 transition-colors hover:bg-primary-50 min-h-[48px]"
        >
          {showDetails ? t('farmer.diagnosis.hideDetails') : t('farmer.diagnosis.moreDetails')}
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
         4. DETAILED VIEW (hidden by default)
         ══════════════════════════════════════════════════════════════════════════ */}
      {showDetails && (
        <>
          {/* Scientific name */}
          {primaryDiagnosis.scientificName && (
            <div className="mx-4 mt-4">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-xs text-earth-400 uppercase tracking-wide mb-1">Scientific Name</p>
                <p className="text-sm italic text-earth-700">{primaryDiagnosis.scientificName}</p>
              </div>
            </div>
          )}

          {/* Full Severity Bar */}
          <div className="mx-4 mt-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-xs font-semibold text-earth-500 uppercase tracking-wide mb-3">
                {t('farmer.diagnosis.severityLevel', 'Severity Level')}
              </p>

              {/* Gradient bar */}
              <div className="relative h-3 rounded-full overflow-visible">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(to right, #6F8A57, #D1A24E, #C47A3E, #C75B39, #9B2C2C)',
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-[3px] border-earth-800 shadow-md transition-all duration-500 z-10"
                  style={{ left: `calc(${sevConfig.position}% - 10px)` }}
                />
              </div>

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

          {/* Symptoms (collapsible) */}
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

          {/* Treatment Cards (horizontal scroll) */}
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
                      <div className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-earth-900 mb-1">
                        {t(card.labelKey)}
                      </p>
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

          {/* Chemical Treatment Detail (pesticides table) */}
          {diagnosis.recommendedPesticides.length > 0 && (
            <div className="mx-4 mt-4">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-base font-bold text-earth-900 mb-3">
                  {t('farmer.diagnosis.recommendedPesticides')}
                </h2>

                <div className="space-y-4">
                  {diagnosis.recommendedPesticides.map((p, i) => (
                    <div key={i} className={`${i > 0 ? 'border-t border-earth-100 pt-4' : ''}`}>
                      <p className="text-sm font-bold text-earth-900">{p.name}</p>

                      {p.tradeName.length > 0 && (
                        <p className="text-xs text-earth-400 mt-0.5">
                          {p.tradeName.join(', ')}
                        </p>
                      )}

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

          {/* Differential Diagnoses */}
          {diagnosis.differentialDiagnoses.length > 0 && (
            <div className="mx-4 mt-4">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-base font-bold text-earth-900 mb-3">
                  {t('farmer.diagnosis.otherPossibilities')}
                </h2>
                <ul className="space-y-2">
                  {diagnosis.differentialDiagnoses.map((d, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="text-earth-700">{d.name}</span>
                      <span className="text-earth-400 text-xs">{Math.min(d.confidence, 100)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Prevention Tips */}
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
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
         5. Disclaimer
         ══════════════════════════════════════════════════════════════════════════ */}
      {diagnosis.disclaimer && (
        <p className="mx-4 mt-4 text-[11px] text-earth-400 text-center leading-relaxed px-2">
          {diagnosis.disclaimer}
        </p>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
         6. Sticky Bottom Action Bar
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
