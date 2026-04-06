import { useState, useRef, useCallback, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { type ConfirmationResult } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { friendlyError } from '@/utils/firebaseErrors';

const OTP_LENGTH = 6;

type LoginMethod = 'choose' | 'phone' | 'google';

export function LoginPage() {
  const { loginWithPhone, verifyOtp, loginWithGoogle } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [method, setMethod] = useState<LoginMethod>('choose');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

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
      addToast({ type: 'success', title: 'OTP sent!' });
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      addToast({ type: 'error', title: friendlyError(err) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (idx: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[idx] = value.slice(-1);
    setOtp(next);
    if (value && idx < OTP_LENGTH - 1) otpRefs.current[idx + 1]?.focus();
    if (next.every((d) => d !== '') && next.join('').length === OTP_LENGTH) {
      handleVerifyOtp(next.join(''));
    }
  };

  const handleOtpKeyDown = (idx: number, key: string) => {
    if (key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleOtpPaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
      if (!pasted) return;
      const next = [...otp];
      for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
      setOtp(next);
      if (pasted.length === OTP_LENGTH) handleVerifyOtp(pasted);
      else otpRefs.current[pasted.length]?.focus();
    },
    [otp],
  );

  const handleVerifyOtp = async (code: string) => {
    if (!confirmationResult) {
      addToast({ type: 'error', title: 'Session expired. Please resend OTP.' });
      setOtpSent(false);
      return;
    }
    setIsLoading(true);
    try {
      await verifyOtp(confirmationResult, code, 'farmer');
      addToast({ type: 'success', title: 'Welcome back!' });
      navigate('/farmer');
    } catch (err) {
      addToast({ type: 'error', title: friendlyError(err) });
      setOtp(Array(OTP_LENGTH).fill(''));
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/farmer');
    } catch (err) {
      addToast({ type: 'error', title: friendlyError(err) });
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
            <h1 className="text-2xl font-bold text-earth-900">Login / लॉगिन</h1>
          </div>

          {/* ─── Method Selection ─── */}
          {method === 'choose' && (
            <div className="space-y-4 animate-fade-in-up">
              <button
                onClick={() => setMethod('phone')}
                className="w-full min-h-[60px] bg-primary-600 hover:bg-primary-700 text-white text-lg font-semibold rounded-2xl transition-colors duration-200 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Login with Phone OTP
              </button>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full min-h-[60px] bg-white hover:bg-earth-50 border-2 border-earth-200 text-earth-800 text-lg font-semibold rounded-2xl transition-colors duration-200 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-earth-300 border-t-primary-600 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                )}
                Login with Google
              </button>
            </div>
          )}

          {/* ─── Phone OTP Flow ─── */}
          {method === 'phone' && !otpSent && (
            <div className="animate-fade-in-up">
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 bg-white border-2 border-earth-200 rounded-xl px-4 focus-within:border-primary-500 transition-colors">
                    <span className="text-lg text-earth-500 font-medium select-none">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoFocus
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setPhoneError(''); }}
                      placeholder="98765 43210"
                      className="flex-1 min-h-[56px] text-xl font-medium text-earth-900 bg-transparent outline-none placeholder:text-earth-300"
                      maxLength={10}
                    />
                  </div>
                  {phoneError && <p className="text-sm text-red-600 mt-1.5 px-1">{phoneError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phone.replace(/\D/g, '').length < 10}
                  className="w-full min-h-[56px] bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white text-lg font-semibold rounded-2xl transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Send OTP
                </button>

                <button type="button" onClick={() => setMethod('choose')} className="w-full text-sm text-earth-500 hover:text-earth-700 py-2">
                  ← Back to login options
                </button>
              </form>
            </div>
          )}

          {/* ─── OTP Input ─── */}
          {method === 'phone' && otpSent && (
            <div className="space-y-4 animate-fade-in-up">
              <p className="text-center text-sm text-earth-600">Enter OTP sent to +91 {phone}</p>

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
                <div className="flex items-center justify-center gap-2 text-sm text-earth-500">
                  <span className="w-4 h-4 border-2 border-earth-300 border-t-primary-500 rounded-full animate-spin" />
                  Verifying...
                </div>
              )}

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-earth-400">Resend OTP in <span className="font-semibold text-earth-600">{resendTimer}s</span></p>
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
                        addToast({ type: 'success', title: 'OTP resent!' });
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
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(Array(OTP_LENGTH).fill('')); setResendTimer(0); }}
                className="w-full text-sm text-earth-500 hover:text-earth-700 py-2"
              >
                ← Change number
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom link */}
      <div className="pb-6 text-center">
        <p className="text-sm text-earth-500">
          New here?{' '}
          <Link to="/register" className="text-primary-700 font-semibold underline underline-offset-2">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
