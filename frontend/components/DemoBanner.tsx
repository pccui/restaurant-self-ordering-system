'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useDemoBanner, DEMO_MODE } from '@/lib/store/useDemoBanner'
import { Gamepad2, X } from 'lucide-react'

export default function DemoBanner() {
  const t = useTranslations('demo')
  const { dismissed, initialized, dismiss, initialize } = useDemoBanner()

  useEffect(() => {
    if (DEMO_MODE && !initialized) {
      initialize()
    }
  }, [initialized, initialize])

  // Only show in demo mode
  if (!DEMO_MODE) return null

  // Don't render if dismissed
  if (dismissed) return null

  return (
    <div className="bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          {/* Info Section */}
          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" aria-hidden="true" />
              {t('bannerTitle')}
            </h3>

            <div className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
              <p>
                <strong>{t('howToOrder')}:</strong>{' '}
                <code className="bg-amber-100 dark:bg-amber-800 px-1 py-0.5 rounded">/en/t001/menu</code>
                {' → '}{t('addItems')}
              </p>
              <p>
                <strong>{t('howToCheck')}:</strong>{' '}
                <code className="bg-amber-100 dark:bg-amber-800 px-1 py-0.5 rounded">/en/dashboard</code>
              </p>
              <p>
                <strong>{t('credentials')}:</strong>{' '}
                <code className="bg-amber-100 dark:bg-amber-800 px-1 py-0.5 rounded">admin@restaurant.local</code>
                {' / '}
                <code className="bg-amber-100 dark:bg-amber-800 px-1 py-0.5 rounded">admin123</code>
              </p>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={dismiss}
            className="self-start p-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-md transition-colors"
            aria-label={t('dismiss')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
