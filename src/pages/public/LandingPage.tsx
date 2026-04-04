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

const trustBadges = [
  { emoji: '🔬', label: 'AI Powered' },
  { emoji: '🌾', label: '99.5% Accurate' },
  { emoji: '🌐', label: '10+ Languages' },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>('en');
  const s = t[lang];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero banner with vibrant gradient */}
      <div className="relative bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500">
        {/* Decorative circles */}
        <div className="absolute top-[-60px] right-[-40px] w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-[-30px] left-[-20px] w-32 h-32 bg-accent-400/20 rounded-full blur-xl" />

        <div className="relative z-10 px-4 pt-6 pb-12 text-center">
          {/* Language toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/20 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white/30 transition-colors"
            >
              🌐 {s.switchLang}
            </button>
          </div>

          {/* Brand & illustration */}
          <div className="mb-2">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mb-4 shadow-lg">
              <span className="text-5xl">🌾</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-1 drop-shadow-md">
            {s.brand}
          </h1>
          {lang === 'en' && (
            <p className="text-lg text-white/80 font-medium">किसानसेवा</p>
          )}
          {lang === 'hi' && (
            <p className="text-lg text-white/80 font-medium">KisanSeva</p>
          )}
          <p className="text-base sm:text-lg text-white/90 mt-4 max-w-md mx-auto leading-relaxed">
            {s.tagline}
          </p>
          <p className="text-sm text-white/70 mt-1 max-w-md mx-auto">
            {s.taglineSub}
          </p>
        </div>

        {/* Wave bottom */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none">
          <path d="M0 60V20C240 0 480 40 720 30C960 20 1200 0 1440 20V60H0Z" fill="white" />
        </svg>
      </div>

      {/* White content area */}
      <div className="flex-1 bg-white px-4 -mt-1">
        {/* CTA Button */}
        <div className="max-w-md mx-auto text-center -mt-2">
          <button
            onClick={() => navigate('/register')}
            className="w-full max-w-xs min-h-[56px] bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-primary-400/30 transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5"
          >
            {s.getStarted}
          </button>

          <p className="mt-4 text-sm text-earth-600">
            {s.login}{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary-600 font-bold underline underline-offset-2 hover:text-primary-700"
            >
              {s.loginLink}
            </button>
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex justify-center gap-3 mt-8 max-w-md mx-auto">
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-1.5 px-3 py-2 bg-earth-50 rounded-full border border-earth-200"
            >
              <span className="text-base">{badge.emoji}</span>
              <span className="text-xs font-semibold text-earth-700">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Features */}
        <section className="py-10 max-w-md mx-auto w-full">
          <div className="grid gap-4">
            <FeatureCard
              emoji="📸"
              title={s.f1Title}
              subtitle={s.f1Sub}
              gradientFrom="from-primary-50"
              gradientTo="to-primary-100"
              borderColor="border-primary-200"
              iconBg="bg-primary-500"
            />
            <FeatureCard
              emoji="💊"
              title={s.f2Title}
              subtitle={s.f2Sub}
              gradientFrom="from-secondary-50"
              gradientTo="to-secondary-100"
              borderColor="border-secondary-200"
              iconBg="bg-secondary-500"
            />
            <FeatureCard
              emoji="🌐"
              title={s.f3Title}
              subtitle={s.f3Sub}
              gradientFrom="from-accent-50"
              gradientTo="to-accent-100"
              borderColor="border-accent-200"
              iconBg="bg-accent-500"
            />
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-earth-200 bg-earth-50">
        <p className="text-xs text-earth-500">
          &copy; {new Date().getFullYear()} KisanSeva &mdash; Empowering Indian Farmers
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  subtitle,
  gradientFrom,
  gradientTo,
  borderColor,
  iconBg,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  iconBg: string;
}) {
  return (
    <div className={`flex items-center gap-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl px-5 py-4 border ${borderColor} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default`}>
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-md flex-shrink-0`}>
        <span className="text-2xl">{emoji}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-earth-900">{title}</p>
        <p className="text-xs text-earth-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
