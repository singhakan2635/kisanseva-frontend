import { useState, useRef, useCallback, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { friendlyError } from '@/utils/firebaseErrors';

const OTP_LENGTH = 6;

export function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  /* ─── Send OTP ─── */
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setPhoneError('कृपया 10 अंकों का नंबर डालें / Enter valid 10-digit number');
      return;
    }
    setPhoneError('');
    setIsLoading(true);
    try {
      // TODO: call backend /auth/send-otp with +91<phone>
      await new Promise((r) => setTimeout(r, 800));
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

  /* ─── Verify OTP ─── */
  const handleVerifyOtp = async (code: string) => {
    setIsLoading(true);
    try {
      // Login with phone + OTP
      await login(`${phone}@kisanseva.phone`, code);
      addToast({ type: 'success', title: 'स्वागत है! / Welcome back!' });
      navigate('/farmer');
    } catch (err) {
      addToast({ type: 'error', title: friendlyError(err) });
      setOtp(Array(OTP_LENGTH).fill(''));
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🌾</div>
            <h1 className="text-2xl font-bold text-gray-900">लॉगिन करें</h1>
            <p className="text-sm text-gray-500 mt-1">Login</p>
          </div>

          {!otpSent ? (
            /* ─── Phone input ─── */
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
                OTP भेजें / Send OTP
              </button>
            </form>
          ) : (
            /* ─── OTP input ─── */
            <div className="space-y-4">
              <p className="text-center text-sm text-gray-600">
                OTP दर्ज करें — +91 {phone}
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
                        await new Promise((r) => setTimeout(r, 800));
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
      </div>

      {/* Bottom link */}
      <div className="pb-6 text-center">
        <p className="text-sm text-gray-500">
          नया खाता बनाएं?{' '}
          <Link to="/register" className="text-primary-700 font-semibold underline underline-offset-2">
            रजिस्टर करें / Register
          </Link>
        </p>
      </div>
    </div>
  );
}
