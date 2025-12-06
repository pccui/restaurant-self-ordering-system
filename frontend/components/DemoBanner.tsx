'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useDemoBanner, DEMO_MODE } from '@/lib/store/useDemoBanner'
import { Gamepad2, X } from 'lucide-react'

export default function DemoBanner() {
  const t = useTranslations('demo')
  const tDash = useTranslations('dashboard')
  const locale = useLocale()
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
        <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pr-8 sm:pr-0">
          {/* Info Section */}
          <div className="flex-1 space-y-3">
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" aria-hidden="true" />
              {t('bannerTitle')}
            </h3>

            <div className="text-xs text-amber-800 dark:text-amber-200 space-y-2">
              <p>
                <strong>{t('howToOrder')}:</strong>{' '}
                <Link
                  href={`/${locale}/menu`}
                  className="bg-amber-100 dark:bg-amber-800 px-1 py-0.5 rounded hover:bg-amber-200 dark:hover:bg-amber-700 underline decoration-amber-500/50"
                >
                  Home Page
                </Link>
                {' → '}{t('addItems')}
              </p>
              <p>
                <strong>{t('howToCheck')}:</strong>{' '}
                <Link
                  href={`/${locale}/dashboard`}
                  className="bg-amber-100 dark:bg-amber-800 px-1 py-0.5 rounded hover:bg-amber-200 dark:hover:bg-amber-700 underline decoration-amber-500/50"
                  target="_blank"
                >
                  {tDash('title')}
                </Link>
              </p>
              <p>
                <strong>{t('credentials')}:</strong>{' '}
                <code className="bg-amber-100 dark:bg-amber-800 px-1 py-0.5 rounded">admin@restaurant.local</code>
                {' / '}
                <code className="bg-amber-100 dark:bg-amber-800 px-1 py-0.5 rounded">admin123</code>
                <button
                  onClick={() => {
                    const emailInput = document.getElementById('email') as HTMLInputElement;
                    const passInput = document.getElementById('password') as HTMLInputElement;
                    if (emailInput && passInput) {
                      // We are on login page, fill directly
                      // Use setter from prototype to bypass React 15/16 value tracking if needed,
                      // though simple dispatch usually works for newer React versions if value setter is standard.
                      // For robustness with React 'onChange', we set value then dispatch 'input'.

                      const setNativeValue = (element: HTMLInputElement, value: string) => {
                        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
                        const prototype = Object.getPrototypeOf(element);
                        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

                        if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
                          prototypeValueSetter.call(element, value);
                        } else if (valueSetter) {
                          valueSetter.call(element, value);
                        } else {
                          element.value = value;
                        }
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                      };

                      setNativeValue(emailInput, 'admin@restaurant.local');
                      setNativeValue(passInput, 'admin123');
                    } else {
                      // Navigate to login with autofill param
                      window.location.href = `/${locale}/login?autofill=true`;
                    }
                  }}
                  className="ml-2 text-xs bg-amber-200 dark:bg-amber-700 hover:bg-amber-300 dark:hover:bg-amber-600 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-600 transition-colors"
                >
                  Fill Credentials
                </button>
              </p>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={dismiss}
            className="absolute top-0 right-0 sm:static self-start p-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-md transition-colors"
            aria-label={t('dismiss')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

  )
}
