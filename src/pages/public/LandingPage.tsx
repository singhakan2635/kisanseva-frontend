import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Lang = 'en' | 'hi';

const t = {
  en: {
    brand: 'FasalRakshak',
    tagline: "Your Crop's Guardian \u2014 Identify diseases, get treatment instantly",
    taglineSub: '\u0906\u092A\u0915\u0940 \u092B\u0938\u0932 \u0915\u093E \u0930\u0915\u094D\u0937\u0915 \u2014 \u092C\u0940\u092E\u093E\u0930\u0940 \u092A\u0939\u091A\u093E\u0928\u0947\u0902, \u0907\u0932\u093E\u091C \u092A\u093E\u090F\u0902',
    getStarted: 'Get Started',
    login: 'Already have an account?',
    loginLink: 'Login',
    f1Title: 'Send a photo, identify disease',
    f1Sub: 'AI-powered instant diagnosis',
    f2Title: 'Get treatment & medicine info',
    f2Sub: 'ICAR-recommended pesticides & dosage',
    f3Title: 'Available in 10+ Indian languages',
    f3Sub: 'Hindi, Tamil, Bengali, Telugu & more',
    switchLang: '\u0939\u093F\u0928\u094D\u0926\u0940 \u092E\u0947\u0902 \u0926\u0947\u0916\u0947\u0902',
  },
  hi: {
    brand: '\u092B\u0938\u0932\u0930\u0915\u094D\u0937\u0915',
    tagline: '\u0906\u092A\u0915\u0940 \u092B\u0938\u0932 \u0915\u093E \u0930\u0915\u094D\u0937\u0915 \u2014 \u092C\u0940\u092E\u093E\u0930\u0940 \u092A\u0939\u091A\u093E\u0928\u0947\u0902, \u0907\u0932\u093E\u091C \u092A\u093E\u090F\u0902',
    taglineSub: "Your Crop's Guardian \u2014 Identify diseases, get treatment instantly",
    getStarted: '\u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902 / Get Started',
    login: '\u092A\u0939\u0932\u0947 \u0938\u0947 \u0916\u093E\u0924\u093E \u0939\u0948?',
    loginLink: '\u0932\u0949\u0917\u093F\u0928 \u0915\u0930\u0947\u0902',
    f1Title: '\u092B\u094B\u091F\u094B \u092D\u0947\u091C\u0947\u0902 \u2014 \u092C\u0940\u092E\u093E\u0930\u0940 \u092A\u0939\u091A\u093E\u0928\u0947\u0902',
    f1Sub: 'AI \u0938\u0947 \u0924\u0941\u0930\u0902\u0924 \u091C\u093E\u0901\u091A',
    f2Title: '\u0907\u0932\u093E\u091C \u0914\u0930 \u0926\u0935\u093E\u0908 \u091C\u093E\u0928\u0947\u0902',
    f2Sub: 'ICAR \u0905\u0928\u0941\u0936\u0902\u0938\u093F\u0924 \u0926\u0935\u093E\u0908 \u0914\u0930 \u092E\u093E\u0924\u094D\u0930\u093E',
    f3Title: '\u0939\u093F\u0928\u094D\u0926\u0940 \u0914\u0930 10+ \u092D\u093E\u0937\u093E\u0913\u0902 \u092E\u0947\u0902',
    f3Sub: '\u0924\u092E\u093F\u0932, \u092C\u0902\u0917\u093E\u0932\u0940, \u0924\u0947\u0932\u0941\u0917\u0941 \u0914\u0930 \u0905\u0928\u094D\u092F',
    switchLang: 'View in English',
  },
};

const trustBadges = [
  { emoji: '\uD83D\uDD2C', label: 'AI Powered' },
  { emoji: '\uD83C\uDF3E', label: '99.5% Accurate' },
  { emoji: '\uD83C\uDF10', label: '10+ Languages' },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>('en');
  const s = t[lang];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero banner — warm brown-to-sage gradient */}
      <div className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-secondary-700">
        {/* Decorative circles */}
        <div className="absolute top-[-60px] right-[-40px] w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-[-30px] left-[-20px] w-32 h-32 bg-accent-400/10 rounded-full blur-xl" />

        <div className="relative z-10 px-4 pt-6 pb-12 text-center">
          {/* Language toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/90 border border-white/20 rounded-full hover:bg-white/10 transition-colors"
            >
              {'\uD83C\uDF10'} {s.switchLang}
            </button>
          </div>

          {/* Brand & illustration */}
          <div className="mb-2">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 border border-white/10 mb-4 shadow-sm">
              <span className="text-5xl">{'\uD83C\uDF3E'}</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-1">
            {s.brand}
          </h1>
          {lang === 'en' && (
            <p className="text-lg text-white/70 font-medium">फसलरक्षक</p>
          )}
          {lang === 'hi' && (
            <p className="text-lg text-white/70 font-medium">FasalRakshak</p>
          )}
          <p className="text-sm text-white/50 mt-1 font-medium tracking-wide">by IndiaAI</p>
          <p className="text-base sm:text-lg text-white/90 mt-4 max-w-md mx-auto leading-relaxed">
            {s.tagline}
          </p>
          <p className="text-sm text-white/60 mt-1 max-w-md mx-auto">
            {s.taglineSub}
          </p>
        </div>

        {/* Wave bottom */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none">
          <path d="M0 60V20C240 0 480 40 720 30C960 20 1200 0 1440 20V60H0Z" fill="#FAFAF8" />
        </svg>
      </div>

      {/* Content area */}
      <div className="flex-1 bg-earth-50 px-4 -mt-1 overflow-visible">
        {/* CTA Button — solid, no gradient */}
        <div className="max-w-md mx-auto text-center pt-4 overflow-visible">
          <button
            onClick={() => navigate('/register')}
            className="w-full max-w-xs min-h-[56px] bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold rounded-2xl shadow-sm transition-colors duration-200 active:scale-[0.97]"
          >
            {s.getStarted}
          </button>

          <p className="mt-4 text-sm text-earth-600">
            {s.login}{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary-700 font-bold underline underline-offset-2 hover:text-primary-800"
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
              className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-full border border-earth-200"
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
              emoji={'\uD83D\uDCF8'}
              title={s.f1Title}
              subtitle={s.f1Sub}
              bgColor="bg-primary-50"
              borderColor="border-primary-200"
              iconBg="bg-primary-600"
            />
            <FeatureCard
              emoji={'\uD83C\uDF3F'}
              title={s.f2Title}
              subtitle={s.f2Sub}
              bgColor="bg-secondary-50"
              borderColor="border-secondary-200"
              iconBg="bg-secondary-600"
            />
            <FeatureCard
              emoji={'\uD83C\uDF10'}
              title={s.f3Title}
              subtitle={s.f3Sub}
              bgColor="bg-accent-50"
              borderColor="border-accent-200"
              iconBg="bg-accent-600"
            />
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-earth-200 bg-earth-100">
        <p className="text-xs text-earth-500">
          &copy; {new Date().getFullYear()} FasalRakshak by IndiaAI &mdash; Your Crop's Guardian
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  subtitle,
  bgColor,
  borderColor,
  iconBg,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${bgColor} rounded-2xl px-5 py-4 border ${borderColor} hover:shadow-md transition-shadow duration-200 cursor-default`}>
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-sm flex-shrink-0`}>
        <span className="text-2xl">{emoji}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-earth-900">{title}</p>
        <p className="text-xs text-earth-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
