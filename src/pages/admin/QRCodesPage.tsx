import { useState, useRef } from 'react';
import { QRCodeGenerator } from '@/components/common/QRCodeGenerator';
import { MapPin, Plus, Printer, Trash2 } from 'lucide-react';

const APP_BASE_URL =
  (typeof window !== 'undefined' && window.location.origin) ||
  'https://fasalrakshak.in';

interface QRLocation {
  id: string;
  name: string;
  createdAt: string;
}

export function QRCodesPage() {
  const [locations, setLocations] = useState<QRLocation[]>([]);
  const [newLocation, setNewLocation] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const addLocation = () => {
    const name = newLocation.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (locations.some((l) => l.id === id)) return;
    setLocations((prev) => [
      ...prev,
      { id, name, createdAt: new Date().toISOString() },
    ]);
    setNewLocation('');
    setSelectedId(id);
  };

  const removeLocation = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const getQRUrl = (locationId: string) =>
    `${APP_BASE_URL}/start?ref=${locationId}`;

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const canvas = printRef.current.querySelector('canvas');
    const dataUrl = canvas?.toDataURL('image/png') || '';
    const loc = locations.find((l) => l.id === selectedId);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>FasalRakshak QR - ${loc?.name || ''}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: system-ui, sans-serif; text-align: center; padding: 40px 20px; }
          .title { font-size: 48px; margin-bottom: 8px; }
          .subtitle { font-size: 20px; color: #1B5E20; font-weight: 700; margin-bottom: 4px; }
          .tagline { font-size: 16px; color: #666; margin-bottom: 32px; }
          .qr { margin: 24px auto; }
          .qr img { width: 280px; height: 280px; }
          .instructions { font-size: 18px; color: #333; margin-top: 32px; line-height: 1.8; }
          .location { font-size: 14px; color: #888; margin-top: 24px; }
          .step { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 8px 0; }
          .step-num { width: 32px; height: 32px; background: #2E7D32; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="title">🌾</div>
        <div class="subtitle">फसलरक्षक — FasalRakshak</div>
        <div class="tagline">आपकी फसल का रक्षक — बीमारी पहचानें, इलाज पाएं</div>
        <div class="qr"><img src="${dataUrl}" alt="QR Code" /></div>
        <div class="instructions">
          <div class="step"><div class="step-num">1</div> <span>कैमरे से QR कोड स्कैन करें</span></div>
          <div class="step"><div class="step-num">2</div> <span>फ़ोन नंबर से रजिस्टर करें</span></div>
          <div class="step"><div class="step-num">3</div> <span>फसल की फोटो लें, इलाज पाएं!</span></div>
        </div>
        <div class="location">${loc?.name || ''}</div>
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const selected = locations.find((l) => l.id === selectedId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          QR Codes — Distribution
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Generate QR codes for different locations to track farmer signups
        </p>
      </div>

      {/* Add location */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white border-2 border-earth-200 rounded-xl px-4 focus-within:border-primary-500 transition-colors">
          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addLocation()}
            placeholder="Location name (e.g., Varanasi Mandi)"
            className="flex-1 min-h-[48px] text-base text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          onClick={addLocation}
          disabled={!newLocation.trim()}
          className="min-h-[48px] min-w-[48px] bg-primary-700 hover:bg-primary-800 disabled:bg-primary-300 text-white rounded-xl transition-all duration-200 flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location list */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Locations ({locations.length})
          </h2>
          {locations.length === 0 ? (
            <div className="bg-white/80 rounded-xl border border-earth-200 p-8 text-center">
              <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Add a location to generate a QR code
              </p>
            </div>
          ) : (
            locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedId(loc.id)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedId === loc.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-earth-200 bg-white hover:border-primary-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {loc.name}
                    </p>
                    <p className="text-xs text-gray-400">ref: {loc.id}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLocation(loc.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete location"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </button>
            ))
          )}
        </div>

        {/* QR preview */}
        <div>
          {selected ? (
            <div className="bg-white/80 rounded-xl border border-earth-200 p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                QR Preview — {selected.name}
              </h2>

              <div ref={printRef}>
                <QRCodeGenerator
                  value={getQRUrl(selected.id)}
                  size={240}
                  label={selected.name}
                  showDownload
                />
              </div>

              <p className="text-xs text-gray-400 text-center mt-3 break-all">
                {getQRUrl(selected.id)}
              </p>

              <button
                onClick={handlePrint}
                className="mt-4 w-full min-h-[48px] bg-white border-2 border-primary-400 text-primary-700 rounded-xl font-medium text-sm hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Poster
              </button>
            </div>
          ) : (
            <div className="bg-white/80 rounded-xl border border-earth-200 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="text-4xl mb-3 opacity-30">📱</div>
              <p className="text-sm text-gray-400">
                Select a location to preview QR code
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
