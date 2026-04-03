import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  History,
  TrendingUp,
  UserCircle,
  Calendar,
  Settings,
  MessageSquare,
  Tractor,
  Users,
  Microscope,
  Database,
  Landmark,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  labelKey: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

/* Mobile bottom nav: max 5 tabs for farmer, role-appropriate for others */
const mobileNavByRole: Record<UserRole, NavItem[]> = {
  farmer: [
    { labelKey: 'sidebar.dashboard', to: '/farmer', icon: LayoutDashboard, end: true },
    { labelKey: 'sidebar.scan', to: '/farmer/scan', icon: Camera },
    { labelKey: 'sidebar.history', to: '/farmer/history', icon: History },
    { labelKey: 'sidebar.mandiPrices', to: '/farmer/mandi', icon: TrendingUp },
    { labelKey: 'sidebar.myProfile', to: '/farmer/profile', icon: UserCircle },
  ],
  expert: [
    { labelKey: 'sidebar.dashboard', to: '/expert', icon: LayoutDashboard, end: true },
    { labelKey: 'sidebar.expertConsultations', to: '/expert/consultations', icon: Calendar },
    { labelKey: 'sidebar.community', to: '/expert/community', icon: MessageSquare },
    { labelKey: 'sidebar.myProfile', to: '/expert/profile', icon: UserCircle },
  ],
  admin: [
    { labelKey: 'sidebar.dashboard', to: '/admin', icon: LayoutDashboard, end: true },
    { labelKey: 'sidebar.users', to: '/admin/users', icon: Users },
    { labelKey: 'sidebar.diagnoses', to: '/admin/diagnoses', icon: Microscope },
    { labelKey: 'sidebar.settings', to: '/admin/settings', icon: Settings },
  ],
};

/* Desktop sidebar: full nav set */
const desktopNavByRole: Record<UserRole, NavItem[]> = {
  farmer: [
    { labelKey: 'sidebar.dashboard', to: '/farmer', icon: LayoutDashboard, end: true },
    { labelKey: 'sidebar.scan', to: '/farmer/scan', icon: Camera },
    { labelKey: 'sidebar.history', to: '/farmer/history', icon: History },
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
    { labelKey: 'sidebar.users', to: '/admin/users', icon: Users },
    { labelKey: 'sidebar.diagnoses', to: '/admin/diagnoses', icon: Microscope },
    { labelKey: 'sidebar.database', to: '/admin/database', icon: Database },
    { labelKey: 'sidebar.schemes', to: '/admin/schemes', icon: Landmark },
    { labelKey: 'sidebar.settings', to: '/admin/settings', icon: Settings },
  ],
};

/* ---- Mobile Bottom Navigation ---- */
export function BottomNav() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const items = mobileNavByRole[user.role] ?? [];

  const isActive = (to: string, end?: boolean) => {
    if (end) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t-2 border-earth-100 lg:hidden safe-area-bottom">
      <div className="flex items-stretch justify-around">
        {items.map((item) => {
          const active = isActive(item.to, item.end);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="flex flex-col items-center justify-center min-h-[64px] min-w-[48px] flex-1 py-1.5 transition-colors duration-150"
              aria-current={active ? 'page' : undefined}
            >
              <item.icon
                className={`w-7 h-7 mb-0.5 ${
                  active ? 'text-primary-500' : 'text-earth-400'
                }`}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className={`text-[11px] leading-tight font-medium ${
                  active ? 'text-primary-700' : 'text-earth-500'
                }`}
              >
                {t(item.labelKey)}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

/* ---- Desktop Sidebar ---- */
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen: _isOpen, onClose: _onClose }: SidebarProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) return null;

  const items = desktopNavByRole[user.role] ?? [];

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 min-h-[48px] ${
      isActive
        ? 'bg-sidebar-hover/20 text-white'
        : 'text-primary-200 hover:bg-sidebar-hover/10 hover:text-white'
    }`;

  const activeIndicator = (isActive: boolean) =>
    isActive ? (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-active rounded-r-full" />
    ) : null;

  return (
    <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 z-20 w-64 bg-gradient-to-b from-sidebar-bg to-sidebar-dark">
      {/* Logo section */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-base shadow-md">
          KS
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white tracking-tight leading-tight">
            KisanSeva
          </span>
          <span className="text-[11px] text-primary-300 font-medium leading-none">
            {t('common.tagline')}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClasses}
          >
            {({ isActive }) => (
              <>
                {activeIndicator(isActive)}
                <item.icon className="w-6 h-6 flex-shrink-0" />
                <span>{t(item.labelKey)}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info at bottom */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-primary-300/30">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-primary-300 truncate capitalize">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
