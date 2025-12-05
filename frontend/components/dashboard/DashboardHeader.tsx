'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { User } from '@/lib/store/authStore';
import { UtensilsCrossed, Menu } from 'lucide-react';

interface DashboardHeaderProps {
  user: User | null;
  onMenuToggle?: () => void;
}

export default function DashboardHeader({ user, onMenuToggle }: DashboardHeaderProps) {
  const t = useTranslations('dashboard');
  const locale = useLocale();

  return (
    <header className="h-14 sm:h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between">
        {/* Left side - Menu button (mobile) + Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <UtensilsCrossed className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600 dark:text-primary-400" />
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={`/${locale}/menu`}
            className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {t('viewMenu')}
          </Link>
          <LanguageToggle locale={locale} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
