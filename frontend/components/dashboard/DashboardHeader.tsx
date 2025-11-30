'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { User } from '@/lib/store/authStore';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';

interface DashboardHeaderProps {
  user: User | null;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const t = useTranslations('dashboard');
  const locale = useLocale();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍽️</span>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* View Menu Link */}
          <Link
            href={`/${locale}`}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {t('viewMenu')}
          </Link>

          {/* Language Toggle */}
          <LanguageToggle locale={locale} />

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
