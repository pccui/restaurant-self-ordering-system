'use client'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import LanguageToggle from '@/components/LanguageToggle'
import ThemeToggle from './ThemeToggle'
import { useState } from 'react'
import Drawer from './Drawer'
import OrderPanel from '@/components/order/OrderPanel'
import { useOrderStore } from '@/lib/store/orderStore'
import { useDataMode } from '@/lib/store/useDataMode'
import { useRouteMode } from '@/lib/hooks/useRouteMode'

// Routes where basket should NOT be displayed
const EXCLUDED_ROUTES = ['/dashboard', '/login']

function shouldHideBasket(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
  return EXCLUDED_ROUTES.some(route => pathWithoutLocale.startsWith(route))
}

export default function Navbar() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)
  const activeOrder = useOrderStore((s) => s.activeOrder)
  const items = activeOrder?.items || []
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)
  const { bannerDismissed, showBanner } = useDataMode()
  const { showModeToggle } = useRouteMode()
  const hideBasket = shouldHideBasket(pathname)

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}`} className="font-bold text-lg text-primary-600">Restaurant</Link>
          <nav className="hidden sm:flex gap-3">
            <Link href={`/${locale}/menu`} className="text-sm hover:text-primary-600 transition-colors">{t('menu')}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle locale={locale} />
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
            {/* Settings button to re-show mode banner (only if local mode is enabled) */}
            {showModeToggle && bannerDismissed && (
              <button
                onClick={showBanner}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors"
                aria-label={t('showSettings')}
                title={t('showSettings')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>
          {/* Basket button - only visible on mobile (cart is sidebar on md+), hidden on dashboard/login */}
          {!hideBasket && (
            <button
              onClick={() => setOpen(true)}
              className="md:hidden relative px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium transition-colors"
              aria-label="Open shopping basket"
            >
              {t('basket')}
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <OrderPanel />
      </Drawer>
    </header>
  )
}
