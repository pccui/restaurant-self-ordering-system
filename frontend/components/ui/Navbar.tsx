'use client'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Info, Settings, ShoppingCart } from 'lucide-react'
import LanguageToggle from '@/components/LanguageToggle'
import ThemeToggle from './ThemeToggle'
import { useState, useEffect } from 'react'
import Drawer from './Drawer'
import OrderPanel from '@/components/order/OrderPanel'
import { useOrderStore } from '@/lib/store/orderStore'
import { useDataMode } from '@/lib/store/useDataMode'
import { useRouteMode } from '@/lib/hooks/useRouteMode'
import { useDemoBanner, DEMO_MODE } from '@/lib/store/useDemoBanner'

// Routes where basket should NOT be displayed
const EXCLUDED_ROUTES = ['/dashboard', '/login']

function shouldHideBasket(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
  // Hide on dashboard, login, and browse-only menu (/en/menu without tableId)
  if (EXCLUDED_ROUTES.some(route => pathWithoutLocale.startsWith(route))) return true
  // Hide on browse-only route: /menu or /menu/... without tableId
  if (pathWithoutLocale === '/menu' || pathWithoutLocale.startsWith('/menu/')) return true
  return false
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
  const { dismissed: demoBannerDismissed, initialized: demoInitialized, show: showDemoBanner, initialize: initDemoBanner } = useDemoBanner()
  const hideBasket = shouldHideBasket(pathname)

  // Initialize demo banner state from localStorage
  useEffect(() => {
    if (DEMO_MODE && !demoInitialized) {
      initDemoBanner()
    }
  }, [demoInitialized, initDemoBanner])

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
      <div className="container flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}`} className="font-bold text-lg text-primary-600">Restaurant</Link>
          <nav className="hidden sm:flex gap-3">
            <Link href={`/${locale}/menu`} className="text-sm hover:text-primary-600 transition-colors">{t('menu')}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Demo info button - visible on all viewports when dismissed */}
          {DEMO_MODE && demoInitialized && demoBannerDismissed && (
            <button
              onClick={showDemoBanner}
              className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-md transition-colors"
              aria-label={t('showDemoInfo')}
              title={t('showDemoInfo')}
            >
              <Info className="h-5 w-5" />
            </button>
          )}
          <LanguageToggle locale={locale} />
          {/* Theme toggle - visible on all viewports */}
          <ThemeToggle />
          {/* Settings button - hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Settings button to re-show mode banner (only if local mode is enabled) */}
            {showModeToggle && bannerDismissed && (
              <button
                onClick={showBanner}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors"
                aria-label={t('showSettings')}
                title={t('showSettings')}
              >
                <Settings className="h-5 w-5" />
              </button>
            )}
          </div>
          {/* Basket button - only visible on mobile (cart is sidebar on md+), hidden on dashboard/login/browse-only */}
          {!hideBasket && (
            <button
              onClick={() => setOpen(true)}
              className="md:hidden relative p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
              aria-label={t('basket')}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
