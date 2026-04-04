import { useNavigate } from 'react-router-dom';
import { Bell, Globe, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import type { SupportedLanguage } from '@/hooks/useLanguage';
import type { UserRole } from '@/types';

const roleDashboardPath: Record<UserRole, string> = {
  farmer: '/farmer',
  expert: '/expert',
  admin: '/admin',
};

const languages: { code: SupportedLanguage; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hi', label: '\u0939\u093F\u0928\u094D\u0926\u0940', short: '\u0939\u093F' },
];

export function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { currentLanguage, setLanguage, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (user) {
      navigate(roleDashboardPath[user.role]);
    }
  };

  const handleLanguageChange = (code: SupportedLanguage) => {
    setLanguage(code);
    setLangOpen(false);
  };

  const currentLangShort = languages.find((l) => l.code === currentLanguage)?.short || 'EN';

  /* Close language dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 bg-white border-b border-earth-200">
      <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
        {/* Left: Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl p-1 min-h-[48px]"
        >
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-sm">
            KS
          </div>
          <div className="flex flex-col lg:hidden">
            <span className="text-base sm:text-lg font-bold text-primary-700 leading-tight">
              KisanSeva
            </span>
            <span className="text-[9px] sm:text-[10px] text-earth-500 font-medium leading-none -mt-0.5">
              {t('common.tagline')}
            </span>
          </div>
        </button>

        {/* Right section */}
        {user && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language toggle + dropdown */}
            <div ref={langRef} className="relative flex items-center gap-1">
              {/* Quick toggle button */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 min-h-[48px] px-3 py-2 rounded-xl bg-primary-50 border border-primary-200 text-primary-700 hover:bg-primary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm sm:text-base"
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{currentLangShort}</span>
              </button>

              {/* Dropdown trigger for full list */}
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center justify-center min-h-[48px] min-w-[36px] p-1 rounded-xl text-earth-500 hover:bg-earth-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Select language"
                aria-expanded={langOpen}
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-md border border-earth-200 py-1 min-w-[160px] z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-4 py-3 text-base transition-colors min-h-[48px] flex items-center justify-between ${
                        currentLanguage === lang.code
                          ? 'bg-primary-50 text-primary-800 font-semibold'
                          : 'text-earth-700 hover:bg-earth-50'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {currentLanguage === lang.code && (
                        <svg className="w-5 h-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification bell */}
            <button
              className="relative flex items-center justify-center min-h-[48px] min-w-[48px] p-2 rounded-xl text-earth-600 hover:bg-earth-100 hover:text-earth-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={t('nav.notifications')}
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-severity-severe rounded-full ring-2 ring-white" />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center min-h-[48px] min-w-[48px] p-2 rounded-xl text-earth-500 hover:text-severity-severe hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={t('nav.logout')}
            >
              <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
