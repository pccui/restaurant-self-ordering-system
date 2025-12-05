'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { ClipboardList, Users, ScrollText, UtensilsCrossed, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout: logoutStore, isAdmin, _hasHydrated } = useAuthStore();

  const navItems = [
    {
      href: `/${locale}/dashboard`,
      label: t('orders'),
      icon: <ClipboardList className="w-5 h-5" />,
      exact: true,
    },
    ...(isAdmin() ? [
      {
        href: `/${locale}/dashboard/users`,
        label: t('users'),
        icon: <Users className="w-5 h-5" />,
        exact: false,
      },
      {
        href: `/${locale}/dashboard/audit`,
        label: t('auditLogs'),
        icon: <ScrollText className="w-5 h-5" />,
        exact: false,
      },
    ] : []),
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  async function handleLogout() {
    await logout();
    logoutStore();
    router.replace(`/${locale}/login`);
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-gray-800
          border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-200 ease-in-out
          lg:transform-none lg:transition-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
          h-screen lg:h-auto lg:min-h-[calc(100vh-64px)]
        `}
      >
        {/* User Info + Logout */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold flex-shrink-0">
              {_hasHydrated && user?.name ? user.name.charAt(0).toUpperCase() : '·'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {_hasHydrated ? (user?.name || '...') : '...'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {_hasHydrated ? (user?.role?.toLowerCase() || '') : ''}
              </p>
            </div>
          </div>
          {/* Logout button below user info */}
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">{t('logout')}</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                ${isActive(item.href, item.exact)
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          {/* View Menu - Mobile only (hidden on desktop header) */}
          <Link
            href={`/${locale}/menu`}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors sm:hidden text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span className="font-medium">{t('viewMenu')}</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
