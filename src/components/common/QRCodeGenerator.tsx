import { useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  label?: string;
  showDownload?: boolean;
}

export function QRCodeGenerator({
  value,
  size = 200,
  fgColor = '#1B5E20',
  bgColor = '#FFFFFF',
  label,
  showDownload = true,
}: QRCodeGeneratorProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `fasalrakshak-qr${label ? `-${label.replace(/\s+/g, '-').toLowerCase()}` : ''}.png`;
    link.href = url;
    link.click();
  }, [label]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={canvasRef}
        className="bg-white p-4 rounded-xl border border-earth-200 shadow-sm"
      >
        <QRCodeCanvas
          value={value}
          size={size}
          fgColor={fgColor}
          bgColor={bgColor}
          level="M"
          marginSize={2}
        />
      </div>

      {label && (
        <p className="text-sm font-medium text-gray-700 text-center">{label}</p>
      )}

      {showDownload && (
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 bg-white border-2 border-earth-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-earth-50 hover:border-primary-400 transition-all duration-200"
        >
          <Download className="w-4 h-4" />
          {t('qr.downloadPng')}
        </button>
      )}
    </div>
  );
}
