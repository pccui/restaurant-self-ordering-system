'use client'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import ModeToggle from '@/components/ModeToggle'
import LanguageToggle from '@/components/LanguageToggle'
import ThemeToggle from './ThemeToggle'
import { useState } from 'react'
import Drawer from './Drawer'
import OrderPanel from '@/components/order/OrderPanel'
import { useOrderStore } from '@/lib/store/orderStore'

export default function Navbar() {
  const locale = useLocale()
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)
  const items = useOrderStore((s) => s.items)
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}`} className="font-bold text-lg text-primary-600">Restaurant</Link>
          <nav className="hidden sm:flex gap-3">
            <Link href={`/${locale}/menu`} className="text-sm hover:text-primary-600 transition-colors">{t('menu')}</Link>
            <Link href={`/${locale}/demo-mode`} className="text-sm hover:text-primary-600 transition-colors">{t('demoMode')}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle locale={locale} />
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
            <ModeToggle />
          </div>
          {/* Basket button - only visible on mobile (cart is sidebar on md+) */}
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
        </div>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <OrderPanel />
      </Drawer>
    </header>
  )
}
