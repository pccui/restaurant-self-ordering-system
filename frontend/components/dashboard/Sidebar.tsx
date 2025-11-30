'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout: logoutStore, isAdmin } = useAuthStore();

  const navItems = [
    {
      href: `/${locale}/dashboard`,
      label: t('orders'),
      icon: '📋',
      exact: true,
    },
    ...(isAdmin() ? [{
      href: `/${locale}/dashboard/users`,
      label: t('users'),
      icon: '👥',
      exact: false,
    }] : []),
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
    <aside className="w-64 min-h-[calc(100vh-64px)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* User Info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
              ${isActive(item.href, item.exact)
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
