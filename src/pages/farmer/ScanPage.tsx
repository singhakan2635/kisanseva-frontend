import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Camera, Image, RotateCcw, CheckCircle, X, Lightbulb, ArrowLeft } from 'lucide-react';
import { analyzePlantImage, saveDiagnosis, createThumbnail } from '@/services/diagnosisService';
import { useToast } from '@/hooks/useToast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const CROPS = [
  { key: 'rice', emoji: '🌾' },
  { key: 'wheat', emoji: '🌾' },
  { key: 'cotton', emoji: '🌿' },
  { key: 'tomato', emoji: '🍅' },
  { key: 'potato', emoji: '🥔' },
  { key: 'grape', emoji: '🍇' },
  { key: 'maize', emoji: '🌽' },
  { key: 'mustard', emoji: '🌻' },
  { key: 'chili', emoji: '🌶️' },
  { key: 'sugarcane', emoji: '🎋' },
  { key: 'onion', emoji: '🧅' },
  { key: 'soybean', emoji: '🫘' },
] as const;

export function ScanPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [selectedCrop, setSelectedCrop] = useState<string | undefined>();
  const [cropSelected, setCropSelected] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCropSelect = useCallback((cropKey: string) => {
    setSelectedCrop(cropKey);
    setCropSelected(true);
  }, []);

  const handleSkipCrop = useCallback(() => {
    setSelectedCrop(undefined);
    setCropSelected(true);
  }, []);

  const handleCapture = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleGallery = useCallback(() => {
    galleryInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setCapturedImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setImageFile(null);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const [result, thumbnail] = await Promise.all([
        analyzePlantImage(imageFile, selectedCrop),
        createThumbnail(imageFile),
      ]);

      // Handle non-plant image
      if (result.isPlantImage === false) {
        const msg = t(
          'farmer.scan.notPlantImage',
          "This doesn't look like a plant photo. Please take a clear photo of your crop."
        );
        setError(msg);
        addToast({ type: 'error', title: t('farmer.scan.analysisFailed'), message: msg });
        return;
      }

      // Save to local history
      saveDiagnosis(result, thumbnail);

      // Navigate to result page with diagnosis data + full image
      navigate('/farmer/diagnosis/result', {
        state: {
          diagnosis: result,
          imageDataUrl: capturedImage,
        },
      });
    } catch (err) {
      // Handle rate limit (429) response
      const isRateLimit =
        err instanceof Error && err.message.includes('Daily scan limit');
      if (isRateLimit) {
        const msg = t(
          'farmer.scan.rateLimitReached',
          "You've reached your daily limit (10 scans). Try again tomorrow."
        );
        setError(msg);
        addToast({ type: 'error', title: t('farmer.scan.analysisFailed'), message: msg });
        return;
      }

      const message = err instanceof Error
        ? err.message
        : t('farmer.scan.analysisError');
      setError(message);
      addToast({ type: 'error', title: t('farmer.scan.analysisFailed'), message });
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageFile, selectedCrop, capturedImage, navigate, addToast, t]);

  // Preview mode after capture
  if (capturedImage) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Image preview — constrained height */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <img
            src={capturedImage}
            alt="Captured crop"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />

          {/* Back button */}
          <button
            onClick={() => navigate('/farmer')}
            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/50 min-h-[48px] min-w-[48px] z-20"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-medium">{t('common.back')}</span>
          </button>

          {/* Close button */}
          <button
            onClick={() => navigate('/farmer')}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center z-20"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500 text-white text-center py-3 px-4 text-base font-medium">
            {error}
          </div>
        )}

        {/* Analyzing overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
            <LoadingSpinner size="lg" />
            <p className="text-white text-lg font-bold mt-4">{t('farmer.scan.analyzing')}</p>
            <p className="text-white/70 text-sm mt-1">{t('farmer.scan.analyzingSub')}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="bg-black/90 px-6 py-6 flex items-center justify-center gap-6">
          <button
            onClick={handleRetake}
            disabled={isAnalyzing}
            className="flex flex-col items-center gap-2 text-white disabled:opacity-50 min-w-[80px]"
          >
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <RotateCcw className="w-7 h-7" />
            </div>
            <span className="text-sm font-bold">{t('farmer.scan.retake')}</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex flex-col items-center gap-2 text-white disabled:opacity-50 min-w-[80px]"
          >
            <div className="w-[72px] h-[72px] rounded-full bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/50">
              {isAnalyzing ? (
                <LoadingSpinner size="md" />
              ) : (
                <CheckCircle className="w-9 h-9" />
              )}
            </div>
            <span className="text-sm font-bold">{t('farmer.scan.analyze')}</span>
          </button>
        </div>
      </div>
    );
  }

  // Crop selection step (shown before camera)
  if (!cropSelected) {
    return (
      <div className="fixed inset-0 bg-earth-50 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 bg-white border-b border-earth-200">
          <button
            onClick={() => navigate('/farmer')}
            className="w-10 h-10 rounded-full flex items-center justify-center min-w-[48px] min-h-[48px]"
            aria-label={t('common.back')}
          >
            <ArrowLeft className="w-5 h-5 text-earth-700" />
          </button>
          <h1 className="text-lg font-bold text-earth-900">
            {t('farmer.scan.selectCrop')}
          </h1>
        </div>

        {/* Crop grid */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            {CROPS.map((crop) => (
              <button
                key={crop.key}
                onClick={() => handleCropSelect(crop.key)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 min-h-[80px] transition-all duration-150 ${
                  selectedCrop === crop.key
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-earth-200 bg-white hover:border-primary-300'
                }`}
              >
                <span className="text-2xl">{crop.emoji}</span>
                <span className="text-sm font-semibold text-earth-800 text-center leading-tight">
                  {t(`farmer.scan.crops.${crop.key}`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Skip button at bottom */}
        <div className="px-4 py-4 bg-white border-t border-earth-200">
          <button
            onClick={handleSkipCrop}
            className="w-full py-3 rounded-xl border-2 border-earth-300 text-earth-600 font-bold text-base min-h-[48px] transition-colors hover:bg-earth-50"
          >
            {t('farmer.scan.skipCrop')}
          </button>
        </div>
      </div>
    );
  }

  // Camera/capture mode
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Viewfinder area */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Background placeholder */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />

        {/* Leaf outline guide SVG */}
        <svg
          viewBox="0 0 300 300"
          className="w-72 h-72 relative z-10 opacity-60"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="8 4"
        >
          <path d="M150 30 C80 80 40 150 50 220 C60 260 100 280 150 270 C200 280 240 260 250 220 C260 150 220 80 150 30Z" />
          <line x1="150" y1="50" x2="150" y2="250" opacity="0.3" />
          <line x1="150" y1="100" x2="90" y2="180" opacity="0.3" />
          <line x1="150" y1="100" x2="210" y2="180" opacity="0.3" />
        </svg>

        {/* Back button */}
        <button
          onClick={() => navigate('/farmer')}
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/50 min-h-[48px] min-w-[48px] z-20"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
          <span className="text-white text-sm font-medium">{t('common.back')}</span>
        </button>

        {/* Close button */}
        <button
          onClick={() => navigate('/farmer')}
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center z-20"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Guide text */}
        <div className="absolute top-8 left-0 right-0 text-center z-10">
          <p className="text-white text-lg font-bold">{t('farmer.scan.placeLeaf')}</p>
          <p className="text-white/70 text-sm mt-1">{t('farmer.scan.placeLeafSub')}</p>
        </div>

        {/* Tip overlay */}
        {showTip && (
          <div className="absolute bottom-24 left-4 right-4 z-20 bg-black/80 rounded-2xl p-4 flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-accent-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-white text-base font-bold">{t('farmer.scan.tipTitle')}</p>
              <p className="text-white/70 text-sm mt-1">
                {t('farmer.scan.tipDesc')}
              </p>
            </div>
            <button
              onClick={() => setShowTip(false)}
              className="text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Capture controls */}
      <div className="bg-black/90 px-6 py-6 flex items-center justify-center gap-8">
        {/* Gallery button */}
        <button
          onClick={handleGallery}
          className="flex flex-col items-center gap-2 text-white min-w-[70px]"
        >
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <Image className="w-7 h-7" />
          </div>
          <span className="text-xs font-medium">{t('farmer.scan.gallery')}</span>
        </button>

        {/* Capture button */}
        <button
          onClick={handleCapture}
          className="w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="Take photo"
        >
          <div className="w-[62px] h-[62px] rounded-full border-4 border-black/10 bg-white flex items-center justify-center">
            <Camera className="w-8 h-8 text-primary-700" />
          </div>
        </button>

        {/* Spacer for centering */}
        <div className="w-[70px]" />
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
