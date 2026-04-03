import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="text-6xl mb-4">🌾</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-primary-800 mb-2">
          किसानसेवा
        </h1>
        <p className="text-lg text-primary-700 font-medium mb-1">KisanSeva</p>
        <p className="text-base sm:text-lg text-gray-700 mt-4 max-w-md leading-relaxed">
          अपनी फसल की बीमारी पहचानें, इलाज पाएं
        </p>
        <p className="text-sm text-gray-500 mt-1 max-w-md">
          Identify crop disease, get treatment
        </p>

        <button
          onClick={() => navigate('/register')}
          className="mt-8 w-full max-w-xs min-h-[56px] bg-primary-700 hover:bg-primary-800 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-primary-500/25 transition-all duration-200 active:scale-[0.98]"
        >
          शुरू करें / Get Started
        </button>

        <p className="mt-4 text-sm text-gray-600">
          पहले से खाता है?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-primary-700 font-semibold underline underline-offset-2"
          >
            लॉगिन करें
          </button>
        </p>
      </section>

      {/* Features */}
      <section className="px-4 pb-12 max-w-md mx-auto w-full">
        <div className="grid gap-4">
          <FeatureItem
            emoji="📸"
            titleHi="फोटो भेजें"
            subtitleHi="बीमारी पहचानें"
            titleEn="Send photo, identify disease"
          />
          <FeatureItem
            emoji="💊"
            titleHi="इलाज और दवाई जानें"
            subtitleHi="सही उपचार पाएं"
            titleEn="Get treatment & medicine info"
          />
          <FeatureItem
            emoji="🌐"
            titleHi="हिन्दी और 10+ भाषाओं में"
            subtitleHi="अपनी भाषा में"
            titleEn="Hindi & 10+ languages"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-earth-200 bg-white/50">
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} KisanSeva
        </p>
      </footer>
    </div>
  );
}

function FeatureItem({
  emoji,
  titleHi,
  subtitleHi,
  titleEn,
}: {
  emoji: string;
  titleHi: string;
  subtitleHi: string;
  titleEn: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-white/80 rounded-xl px-4 py-3 border border-earth-200">
      <span className="text-3xl flex-shrink-0">{emoji}</span>
      <div>
        <p className="text-sm font-semibold text-gray-900">
          {titleHi} — {subtitleHi}
        </p>
        <p className="text-xs text-gray-500">{titleEn}</p>
      </div>
    </div>
  );
}
