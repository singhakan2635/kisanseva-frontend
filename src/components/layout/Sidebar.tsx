import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Sprout,
  TrendingUp,
  UserCircle,
  Settings,
  X,
  Tractor,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';
import type { LucideIcon } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  labelKey: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

const navByRole: Record<UserRole, NavItem[]> = {
  farmer: [
    { labelKey: 'sidebar.dashboard', to: '/farmer', icon: LayoutDashboard, end: true },
    { labelKey: 'sidebar.consultations', to: '/farmer/consultations', icon: Calendar },
    { labelKey: 'sidebar.cropAdvisory', to: '/farmer/advisory', icon: Sprout },
    { labelKey: 'sidebar.mandiPrices', to: '/farmer/mandi', icon: TrendingUp },
    { labelKey: 'sidebar.myFarm', to: '/farmer/farm', icon: Tractor },
    { labelKey: 'sidebar.community', to: '/farmer/community', icon: MessageSquare },
    { labelKey: 'sidebar.myProfile', to: '/farmer/profile', icon: UserCircle },
  ],
  expert: [
    { labelKey: 'sidebar.dashboard', to: '/expert', icon: LayoutDashboard, end: true },
    { labelKey: 'sidebar.expertConsultations', to: '/expert/consultations', icon: Calendar },
    { labelKey: 'sidebar.manageSchedule', to: '/expert/schedule', icon: Settings },
    { labelKey: 'sidebar.community', to: '/expert/community', icon: MessageSquare },
    { labelKey: 'sidebar.myProfile', to: '/expert/profile', icon: UserCircle },
  ],
  admin: [
    { labelKey: 'sidebar.dashboard', to: '/admin', icon: LayoutDashboard, end: true },
    { labelKey: 'sidebar.settings', to: '/admin/settings', icon: Settings },
  ],
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) return null;

  const items = navByRole[user.role] ?? [];

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary-200/70 text-primary-800 shadow-sm'
        : 'text-gray-700 hover:bg-primary-100/60 hover:text-primary-800'
    }`;

  const activeIndicator = (isActive: boolean) =>
    isActive ? (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-500 rounded-r-full" />
    ) : null;

  const sidebarContent = (
    <>
      {/* Logo section */}
      <div className="flex items-center gap-3 px-3 sm:px-6 py-5 border-b border-primary-200/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
          KS
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
            KisanSeva
          </span>
          <span className="text-[10px] text-primary-600 font-medium leading-none">
            {t('common.tagline')}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClasses}
            onClick={onClose}
          >
            {({ isActive }) => (
              <>
                {activeIndicator(isActive)}
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {t(item.labelKey)}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info at bottom */}
      <div className="px-3 py-4 border-t border-primary-200/50">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-primary-100">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate capitalize">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-primary-100 via-primary-50/90 to-accent-100/70 backdrop-blur-xl border-r border-primary-200/60 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-end px-4 py-2">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 z-20 w-64 bg-gradient-to-b from-primary-100 via-primary-50/90 to-accent-100/70 backdrop-blur-xl border-r border-primary-200/60">
        {sidebarContent}
      </aside>
    </>
  );
}
