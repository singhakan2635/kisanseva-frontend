import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Lang = 'en' | 'hi';

const t = {
  en: {
    brand: 'KisanSeva',
    tagline: 'Identify crop diseases, get instant treatment advice',
    taglineSub: 'अपनी फसल की बीमारी पहचानें, इलाज पाएं',
    getStarted: 'Get Started',
    login: 'Already have an account?',
    loginLink: 'Login',
    f1Title: 'Send a photo, identify disease',
    f1Sub: 'AI-powered instant diagnosis',
    f2Title: 'Get treatment & medicine info',
    f2Sub: 'ICAR-recommended pesticides & dosage',
    f3Title: 'Available in 10+ Indian languages',
    f3Sub: 'Hindi, Tamil, Bengali, Telugu & more',
    switchLang: 'हिन्दी में देखें',
  },
  hi: {
    brand: 'किसानसेवा',
    tagline: 'अपनी फसल की बीमारी पहचानें, इलाज पाएं',
    taglineSub: 'Identify crop diseases, get instant treatment advice',
    getStarted: 'शुरू करें / Get Started',
    login: 'पहले से खाता है?',
    loginLink: 'लॉगिन करें',
    f1Title: 'फोटो भेजें — बीमारी पहचानें',
    f1Sub: 'AI से तुरंत जाँच',
    f2Title: 'इलाज और दवाई जानें',
    f2Sub: 'ICAR अनुशंसित दवाई और मात्रा',
    f3Title: 'हिन्दी और 10+ भाषाओं में',
    f3Sub: 'तमिल, बंगाली, तेलुगु और अन्य',
    switchLang: 'View in English',
  },
};

export function LandingPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>('en');
  const s = t[lang];

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      {/* Language toggle */}
      <div className="flex justify-end px-4 pt-4">
        <button
          onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-200 rounded-full hover:bg-primary-50 transition-colors"
        >
          🌐 {s.switchLang}
        </button>
      </div>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
        <div className="text-6xl mb-4">🌾</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-primary-800 mb-1">
          {s.brand}
        </h1>
        {lang === 'en' && (
          <p className="text-lg text-primary-600 font-medium">किसानसेवा</p>
        )}
        {lang === 'hi' && (
          <p className="text-lg text-primary-600 font-medium">KisanSeva</p>
        )}
        <p className="text-base sm:text-lg text-gray-700 mt-4 max-w-md leading-relaxed">
          {s.tagline}
        </p>
        <p className="text-sm text-gray-500 mt-1 max-w-md">
          {s.taglineSub}
        </p>

        <button
          onClick={() => navigate('/register')}
          className="mt-8 w-full max-w-xs min-h-[56px] bg-primary-700 hover:bg-primary-800 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-primary-500/25 transition-all duration-200 active:scale-[0.98]"
        >
          {s.getStarted}
        </button>

        <p className="mt-4 text-sm text-gray-600">
          {s.login}{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-primary-700 font-semibold underline underline-offset-2"
          >
            {s.loginLink}
          </button>
        </p>
      </section>

      {/* Features */}
      <section className="px-4 pb-12 max-w-md mx-auto w-full">
        <div className="grid gap-4">
          <FeatureItem emoji="📸" title={s.f1Title} subtitle={s.f1Sub} />
          <FeatureItem emoji="💊" title={s.f2Title} subtitle={s.f2Sub} />
          <FeatureItem emoji="🌐" title={s.f3Title} subtitle={s.f3Sub} />
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
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-white/80 rounded-xl px-4 py-3 border border-earth-200">
      <span className="text-3xl flex-shrink-0">{emoji}</span>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
