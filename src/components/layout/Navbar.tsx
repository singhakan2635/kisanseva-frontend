import { useNavigate } from 'react-router-dom';
import { Bell, Globe, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

const roleDashboardPath: Record<UserRole, string> = {
  farmer: '/farmer',
  expert: '/expert',
  admin: '/admin',
};

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
];

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
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

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

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
    <header className="sticky top-0 z-30 h-14 sm:h-16 bg-white/90 backdrop-blur-md border-b border-earth-100 shadow-sm shadow-earth-100/30">
      <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
        {/* Left: Logo (always visible, especially on mobile where sidebar is gone) */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl p-1 min-h-[48px]"
        >
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
            KS
          </div>
          <div className="flex flex-col lg:hidden">
            <span className="text-base sm:text-lg font-bold text-earth-900 leading-tight">
              KisanSeva
            </span>
            <span className="text-[9px] sm:text-[10px] text-primary-600 font-medium leading-none -mt-0.5">
              {t('common.tagline')}
            </span>
          </div>
        </button>

        {/* Right section */}
        {user && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language selector */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center justify-center min-h-[48px] min-w-[48px] p-2 rounded-xl text-earth-600 hover:bg-earth-100 hover:text-earth-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label={t('nav.language')}
                aria-expanded={langOpen}
              >
                <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-earth-100 py-1 min-w-[140px] z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-4 py-3 text-base transition-colors min-h-[48px] ${
                        i18n.language === lang.code
                          ? 'bg-primary-50 text-primary-800 font-semibold'
                          : 'text-earth-700 hover:bg-earth-50'
                      }`}
                    >
                      {lang.label}
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
