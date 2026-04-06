import { useState, useRef, useCallback, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { type ConfirmationResult } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { friendlyError } from '@/utils/firebaseErrors';
import { apiClient } from '@/services/api';

/* ───── Language data ───── */
const LANGUAGES = [
  { code: 'hi', native: 'हिन्दी', en: 'Hindi' },
  { code: 'en', native: 'English', en: 'English' },
  { code: 'bn', native: 'বাংলা', en: 'Bengali' },
  { code: 'ta', native: 'தமிழ்', en: 'Tamil' },
  { code: 'te', native: 'తెలుగు', en: 'Telugu' },
  { code: 'mr', native: 'मराठी', en: 'Marathi' },
  { code: 'gu', native: 'ગુજરાતી', en: 'Gujarati' },
  { code: 'kn', native: 'ಕನ್ನಡ', en: 'Kannada' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', en: 'Punjabi' },
  { code: 'or', native: 'ଓଡ଼ିଆ', en: 'Odia' },
] as const;

/* ───── Translated labels per step ───── */
const LABELS: Record<string, { step2Title: string; sendOtp: string; enterOtp: string; verify: string; welcome: string; accountCreated: string; takePhoto: string; later: string; namePrompt: string; skip: string; save: string }> = {
  hi: { step2Title: 'अपना फ़ोन नंबर डालें', sendOtp: 'OTP भेजें', enterOtp: 'OTP दर्ज करें', verify: 'सत्यापित करें', welcome: 'स्वागत है!', accountCreated: 'आपका खाता बन गया', takePhoto: 'अभी फोटो लें', later: 'बाद में', namePrompt: 'अपना नाम बताएं (वैकल्पिक)', skip: 'छोड़ें', save: 'सेव करें' },
  en: { step2Title: 'Enter your phone number', sendOtp: 'Send OTP', enterOtp: 'Enter OTP', verify: 'Verify', welcome: 'Welcome!', accountCreated: 'Your account is ready', takePhoto: 'Take photo now', later: 'Later', namePrompt: 'Your name (optional)', skip: 'Skip', save: 'Save' },
  bn: { step2Title: 'আপনার ফোন নম্বর দিন', sendOtp: 'OTP পাঠান', enterOtp: 'OTP দিন', verify: 'যাচাই করুন', welcome: 'স্বাগতম!', accountCreated: 'আপনার অ্যাকাউন্ট তৈরি', takePhoto: 'এখন ছবি তুলুন', later: 'পরে', namePrompt: 'আপনার নাম (ঐচ্ছিক)', skip: 'এড়িয়ে যান', save: 'সংরক্ষণ' },
  ta: { step2Title: 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்', sendOtp: 'OTP அனுப்பு', enterOtp: 'OTP உள்ளிடவும்', verify: 'சரிபார்', welcome: 'வரவேற்கிறோம்!', accountCreated: 'உங்கள் கணக்கு தயார்', takePhoto: 'இப்போது புகைப்படம் எடுங்கள்', later: 'பின்னர்', namePrompt: 'உங்கள் பெயர் (விருப்பம்)', skip: 'தவிர்', save: 'சேமி' },
  te: { step2Title: 'మీ ఫోన్ నంబర్ నమోదు చేయండి', sendOtp: 'OTP పంపు', enterOtp: 'OTP నమోదు', verify: 'ధృవీకరించు', welcome: 'స్వాగతం!', accountCreated: 'మీ ఖాతా సిద్ధం', takePhoto: 'ఇప్పుడు ఫోటో తీయండి', later: 'తర్వాత', namePrompt: 'మీ పేరు (ఐచ్ఛికం)', skip: 'దాటవేయి', save: 'సేవ్ చేయి' },
  mr: { step2Title: 'तुमचा फोन नंबर टाका', sendOtp: 'OTP पाठवा', enterOtp: 'OTP टाका', verify: 'सत्यापित करा', welcome: 'स्वागत!', accountCreated: 'तुमचे खाते तयार', takePhoto: 'आता फोटो काढा', later: 'नंतर', namePrompt: 'तुमचे नाव (पर्यायी)', skip: 'वगळा', save: 'जतन करा' },
  gu: { step2Title: 'તમારો ફોન નંબર દાખલ કરો', sendOtp: 'OTP મોકલો', enterOtp: 'OTP દાખલ કરો', verify: 'ચકાસો', welcome: 'સ્વાગત!', accountCreated: 'તમારું ખાતું તૈયાર', takePhoto: 'હમણાં ફોટો લો', later: 'પછી', namePrompt: 'તમારું નામ (વૈકલ્પિક)', skip: 'છોડો', save: 'સાચવો' },
  kn: { step2Title: 'ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ', sendOtp: 'OTP ಕಳುಹಿಸಿ', enterOtp: 'OTP ನಮೂದಿಸಿ', verify: 'ಪರಿಶೀಲಿಸಿ', welcome: 'ಸ್ವಾಗತ!', accountCreated: 'ನಿಮ್ಮ ಖಾತೆ ಸಿದ್ಧ', takePhoto: 'ಈಗ ಫೋಟೋ ತೆಗೆಯಿರಿ', later: 'ನಂತರ', namePrompt: 'ನಿಮ್ಮ ಹೆಸರು (ಐಚ್ಛಿಕ)', skip: 'ಬಿಡಿ', save: 'ಉಳಿಸಿ' },
  pa: { step2Title: 'ਆਪਣਾ ਫ਼ੋਨ ਨੰਬਰ ਦਾਖਲ ਕਰੋ', sendOtp: 'OTP ਭੇਜੋ', enterOtp: 'OTP ਦਾਖਲ ਕਰੋ', verify: 'ਪੁਸ਼ਟੀ ਕਰੋ', welcome: 'ਜੀ ਆਇਆਂ ਨੂੰ!', accountCreated: 'ਤੁਹਾਡਾ ਖਾਤਾ ਬਣ ਗਿਆ', takePhoto: 'ਹੁਣੇ ਫੋਟੋ ਖਿੱਚੋ', later: 'ਬਾਅਦ ਵਿੱਚ', namePrompt: 'ਤੁਹਾਡਾ ਨਾਮ (ਵਿਕਲਪਿਕ)', skip: 'ਛੱਡੋ', save: 'ਸੇਵ ਕਰੋ' },
  or: { step2Title: 'ଆପଣଙ୍କ ଫୋନ ନମ୍ବର ଦିଅନ୍ତୁ', sendOtp: 'OTP ପଠାନ୍ତୁ', enterOtp: 'OTP ଦିଅନ୍ତୁ', verify: 'ଯାଞ୍ଚ କରନ୍ତୁ', welcome: 'ସ୍ୱାଗତ!', accountCreated: 'ଆପଣଙ୍କ ଖାତା ପ୍ରସ୍ତୁତ', takePhoto: 'ବର୍ତ୍ତମାନ ଫଟୋ ନିଅନ୍ତୁ', later: 'ପରେ', namePrompt: 'ଆପଣଙ୍କ ନାମ (ବୈକଳ୍ପିକ)', skip: 'ଛାଡନ୍ତୁ', save: 'ସେଭ କରନ୍ତୁ' },
};

const OTP_LENGTH = 6;

export function RegisterPage() {
  const { loginWithPhone, verifyOtp, loginWithGoogle } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState('');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);
  const l = LABELS[language] || LABELS.hi;

  /* ─── Step 1: Language selection ─── */
  const handleLanguageSelect = (code: string) => {
    setLanguage(code);
    setStep(2);
  };

  /* ─── Step 2: Send OTP via Firebase ─── */
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setPhoneError('Please enter a valid 10-digit number');
      return;
    }
    setPhoneError('');
    setIsLoading(true);
    try {
      const result = await loginWithPhone(`+91${cleaned}`);
      setConfirmationResult(result);
      setOtpSent(true);
      setResendTimer(30);
      addToast({ type: 'success', title: 'OTP भेजा गया / OTP sent' });
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      addToast({ type: 'error', title: friendlyError(err) });
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── OTP input handling ─── */
  const handleOtpChange = (idx: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[idx] = value.slice(-1);
    setOtp(next);

    if (value && idx < OTP_LENGTH - 1) {
      otpRefs.current[idx + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (next.every((d) => d !== '') && next.join('').length === OTP_LENGTH) {
      handleVerifyOtp(next.join(''));
    }
  };

  const handleOtpKeyDown = (idx: number, key: string) => {
    if (key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
      if (!pasted) return;
      const next = [...otp];
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i];
      }
      setOtp(next);
      if (pasted.length === OTP_LENGTH) {
        handleVerifyOtp(pasted);
      } else {
        otpRefs.current[pasted.length]?.focus();
      }
    },
    [otp], // eslint-disable-line react-hooks/exhaustive-deps
  );

  /* ─── Step 2 → 3: Verify OTP via Firebase & authenticate with backend ─── */
  const handleVerifyOtp = async (code: string) => {
    if (!confirmationResult) {
      addToast({ type: 'error', title: 'Session expired. Please resend OTP.' });
      setOtpSent(false);
      return;
    }
    setIsLoading(true);
    try {
      await verifyOtp(confirmationResult, code, 'farmer');
      localStorage.setItem('kisanseva_lang', language);
      setStep(3);
    } catch (err) {
      addToast({ type: 'error', title: friendlyError(err) });
      setOtp(Array(OTP_LENGTH).fill(''));
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── Step 3: Save name & proceed ─── */
  const handleFinish = async (goToCamera: boolean) => {
    if (name.trim()) {
      try {
        await apiClient('/auth/profile', {
          method: 'PATCH',
          body: JSON.stringify({ firstName: name.trim() }),
        });
      } catch {
        // non-blocking — name save is optional
      }
    }
    navigate(goToCamera ? '/farmer?action=camera' : '/farmer');
  };

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-3 pt-6 pb-4">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              s === step
                ? 'bg-primary-500 scale-125'
                : s < step
                  ? 'bg-primary-300'
                  : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* ─────────────── Step 1: Language ─────────────── */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">🌾</div>
                <h1 className="text-2xl font-bold text-gray-900">भाषा चुनें</h1>
                <p className="text-sm text-gray-500 mt-1">Choose Language</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className="min-h-[56px] bg-white border-2 border-earth-200 rounded-xl px-4 py-3 text-center hover:border-primary-400 hover:bg-primary-50 active:bg-primary-100 transition-all duration-200"
                  >
                    <span className="block text-lg font-semibold text-gray-900">
                      {lang.native}
                    </span>
                    <span className="block text-xs text-gray-500">{lang.en}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────── Step 2: Phone + OTP ─────────────── */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">📱</div>
                <h1 className="text-2xl font-bold text-gray-900">{l.step2Title}</h1>
                <p className="text-sm text-gray-500 mt-1">Enter your phone number</p>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 bg-white border-2 border-earth-200 rounded-xl px-4 focus-within:border-primary-500 transition-colors">
                      <span className="text-lg text-gray-500 font-medium select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        autoFocus
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                          setPhoneError('');
                        }}
                        placeholder="98765 43210"
                        className="flex-1 min-h-[56px] text-xl font-medium text-gray-900 bg-transparent outline-none placeholder:text-gray-300"
                        maxLength={10}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-sm text-red-600 mt-1.5 px-1">{phoneError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || phone.replace(/\D/g, '').length < 10}
                    className="w-full min-h-[56px] bg-primary-700 hover:bg-primary-800 disabled:bg-primary-300 text-white text-lg font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : null}
                    {l.sendOtp}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
                  >
                    &larr; भाषा बदलें / Change language
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-sm text-gray-600">
                    {l.enterOtp} — +91 {phone}
                  </p>

                  <div className="flex items-center justify-center gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e.key)}
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-white border-2 border-earth-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      />
                    ))}
                  </div>

                  {isLoading && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <span className="w-4 h-4 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
                      Verifying...
                    </div>
                  )}

                  {/* Resend OTP */}
                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <p className="text-sm text-gray-400">
                        Resend OTP in <span className="font-semibold text-gray-600">{resendTimer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={async () => {
                          setOtp(Array(OTP_LENGTH).fill(''));
                          setIsLoading(true);
                          try {
                            const cleaned = phone.replace(/\D/g, '');
                            const result = await loginWithPhone(`+91${cleaned}`);
                            setConfirmationResult(result);
                            setResendTimer(30);
                            addToast({ type: 'success', title: 'OTP दोबारा भेजा / OTP resent' });
                            otpRefs.current[0]?.focus();
                          } catch (err) {
                            addToast({ type: 'error', title: friendlyError(err) });
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        disabled={isLoading}
                        className="text-sm text-primary-700 font-semibold hover:text-primary-800 underline underline-offset-2 py-2"
                      >
                        🔄 OTP दोबारा भेजें / Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp(Array(OTP_LENGTH).fill(''));
                      setResendTimer(0);
                    }}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
                  >
                    नंबर बदलें / Change number
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─────────────── Step 3: Welcome ─────────────── */}
          {step === 3 && (
            <div className="animate-fade-in-up text-center">
              <div className="text-5xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-gray-900">{l.welcome}</h1>
              <p className="text-base text-gray-600 mt-1">{l.accountCreated}</p>

              <div className="mt-8 space-y-3">
                {/* Optional name */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">{l.namePrompt}</p>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ravi Kumar"
                    className="w-full min-h-[48px] text-lg bg-white border-2 border-earth-200 rounded-xl px-4 text-center outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <button
                  onClick={() => handleFinish(true)}
                  className="w-full min-h-[56px] bg-primary-700 hover:bg-primary-800 text-white text-lg font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  📸 {l.takePhoto}
                </button>

                <button
                  onClick={() => handleFinish(false)}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 underline underline-offset-2"
                >
                  {l.later}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Google Sign-In + Bottom link */}
      {step < 3 && (
        <div className="pb-6 text-center space-y-4">
          <div className="flex items-center gap-3 max-w-md mx-auto px-4">
            <div className="flex-1 h-px bg-earth-200" />
            <span className="text-sm text-earth-400">or</span>
            <div className="flex-1 h-px bg-earth-200" />
          </div>
          <div className="max-w-md mx-auto px-4">
            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                try {
                  await loginWithGoogle();
                  navigate('/farmer');
                } catch (err) {
                  addToast({ type: 'error', title: friendlyError(err) });
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full min-h-[56px] bg-white hover:bg-earth-50 border-2 border-earth-200 text-earth-800 text-lg font-semibold rounded-2xl transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
          </div>
          <p className="text-sm text-gray-500">
            पहले से खाता है?{' '}
            <Link to="/login" className="text-primary-700 font-semibold underline underline-offset-2">
              लॉगिन करें
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
