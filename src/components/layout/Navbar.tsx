import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const roleDashboardPath: Record<UserRole, string> = {
  farmer: '/farmer',
  expert: '/expert',
  admin: '/admin',
};

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (user) {
      navigate(roleDashboardPath[user.role]);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-12 sm:h-16 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between h-full px-2 sm:px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={handleLogoClick}
            className="lg:hidden flex items-center gap-1.5 sm:gap-2 focus:outline-none"
          >
            <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs">
              KS
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                KisanSeva
              </span>
              <span className="text-[8px] sm:text-[9px] text-primary-600 font-medium leading-none -mt-0.5">
                {t('common.tagline')}
              </span>
            </div>
          </button>
        </div>

        {/* Right section */}
        {user && (
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="relative p-1.5 sm:p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none"
              aria-label={t('nav.notifications')}
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="hidden sm:flex items-center gap-3 ml-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-semibold text-xs">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 sm:p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none ml-0.5 sm:ml-1"
              aria-label={t('nav.logout')}
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
