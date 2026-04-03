import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Image, RotateCcw, CheckCircle, X, Lightbulb } from 'lucide-react';
import { apiClient } from '@/services/api';
import type { ApiResponse } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface DiagnosisResponse {
  _id: string;
}

export function ScanPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const formData = new FormData();
      formData.append('image', imageFile);

      const res = await apiClient<ApiResponse<DiagnosisResponse>>('/diagnoses', {
        method: 'POST',
        body: formData,
      });

      navigate(`/farmer/diagnosis/${res.data._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'जाँच में त्रुटि हुई। कृपया दोबारा कोशिश करें।');
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageFile, navigate]);

  // Preview mode after capture
  if (capturedImage) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Image preview */}
        <div className="flex-1 relative">
          <img
            src={capturedImage}
            alt="Captured crop"
            className="w-full h-full object-contain"
          />

          {/* Close button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center"
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
            <span className="text-sm font-bold">🔄 दोबारा</span>
            <span className="text-xs opacity-70">Retake</span>
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
            <span className="text-sm font-bold">✅ जाँच करें</span>
            <span className="text-xs opacity-70">Analyze</span>
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

        {/* Close button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center z-20"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Guide text */}
        <div className="absolute top-8 left-0 right-0 text-center z-10">
          <p className="text-white text-lg font-bold">पत्ती को यहाँ रखें</p>
          <p className="text-white/70 text-sm mt-1">Place the leaf here</p>
        </div>

        {/* Tip overlay */}
        {showTip && (
          <div className="absolute bottom-24 left-4 right-4 z-20 bg-black/80 rounded-2xl p-4 flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-accent-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-white text-base font-bold">💡 पत्ती की करीबी फोटो लें</p>
              <p className="text-white/70 text-sm mt-1">
                Take a close-up photo of the affected leaf in good lighting
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
          <span className="text-xs font-medium">गैलरी</span>
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
