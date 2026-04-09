import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const WHATSAPP_NUMBER = '919XXXXXXXXX'; // TODO: replace with actual WhatsApp business number

export function QRLandingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();

  const ref = searchParams.get('ref') || '';

  // Save referral for tracking
  useEffect(() => {
    if (ref) {
      localStorage.setItem('fasalrakshak_ref', ref);
      // TODO: POST /analytics/qr-scan { ref, timestamp, userAgent }
    }
  }, [ref]);

  // If already logged in, redirect to farmer dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/farmer', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('START')}`;

  const handleGetStarted = () => {
    navigate(`/register${ref ? `?ref=${ref}` : ''}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center">
        <span className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="text-6xl mb-4">\uD83C\uDF3E</div>
        <h1 className="text-3xl font-bold text-primary-800 mb-1">{'\u092B\u0938\u0932\u0930\u0915\u094D\u0937\u0915'}</h1>
        <p className="text-base text-gray-600 mb-2">FasalRakshak</p>
        <p className="text-sm text-gray-500 mb-8">
          {'\u0906\u092A\u0915\u0940 \u092B\u0938\u0932 \u0915\u093E \u0930\u0915\u094D\u0937\u0915 \u2014 \u092C\u0940\u092E\u093E\u0930\u0940 \u092A\u0939\u091A\u093E\u0928\u0947\u0902, \u0907\u0932\u093E\u091C \u092A\u093E\u090F\u0902'}
        </p>

        {/* Actions */}
        <div className="space-y-3">
          {/* Primary CTA: App / Register */}
          <button
            onClick={handleGetStarted}
            className="w-full min-h-[56px] bg-primary-700 hover:bg-primary-800 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isMobile ? '\uD83D\uDCF1 \u0910\u092A \u092E\u0947\u0902 \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902 / Open App' : '\uD83C\uDF10 \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902 / Get Started'}
          </button>

          {/* WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[56px] bg-[#25D366] hover:bg-[#1DA851] text-white text-lg font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <WhatsAppIcon />
            WhatsApp {'\u0938\u0947 \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902'}
          </a>

          {/* Already have account */}
          <button
            onClick={() => navigate('/login')}
            className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 underline underline-offset-2"
          >
            {'\u092A\u0939\u0932\u0947 \u0938\u0947 \u0916\u093E\u0924\u093E \u0939\u0948? \u0932\u0949\u0917\u093F\u0928 \u0915\u0930\u0947\u0902'}
          </button>
        </div>

        {/* Ref badge */}
        {ref && (
          <div className="mt-8 inline-flex items-center gap-1.5 bg-earth-100 text-earth-600 text-xs px-3 py-1.5 rounded-full">
            \uD83D\uDCCD {ref}
          </div>
        )}
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
