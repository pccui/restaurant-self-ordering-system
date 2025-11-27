'use client'
import { useDataMode, type DataMode } from '@/lib/store/useDataMode'
import { useMenuStore } from '@/lib/store/menuStore'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

const MODES: { value: DataMode; icon: string }[] = [
  { value: 'local', icon: '💾' },
  { value: 'server', icon: '🌐' },
]

export default function ModeBanner() {
  const t = useTranslations()
  const { mode, setMode, bannerDismissed, dismissBanner } = useDataMode()
  const loadMenu = useMenuStore((s) => s.loadMenu)
  const [isChanging, setIsChanging] = useState(false)

  const handleModeChange = async (newMode: DataMode) => {
    if (newMode === mode || isChanging) return

    setIsChanging(true)
    setMode(newMode)

    // Reload menu data from new source
    try {
      await loadMenu()
    } catch (error) {
      console.error('Failed to reload menu:', error)
    } finally {
      setTimeout(() => setIsChanging(false), 300)
    }
  }

  // Don't render if banner is dismissed
  if (bannerDismissed) return null

  return (
    <div className="bg-primary-50 border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Info Section */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-primary-900 flex items-center gap-2">
              <span aria-hidden="true">ℹ️</span>
              {t('mode.bannerTitle')}
            </h3>
            <p className="text-xs text-primary-700 mt-1 max-w-xl">
              {t('mode.bannerDesc')}
            </p>
          </div>

          {/* Mode Selection */}
          <div className="flex items-center gap-3">
            <div
              className="inline-flex items-center bg-white rounded-lg p-1 gap-1 shadow-sm border border-primary-200"
              role="group"
              aria-label={t('mode.selectionLabel')}
            >
              {MODES.map((modeOption) => {
                const isActive = mode === modeOption.value
                return (
                  <button
                    key={modeOption.value}
                    onClick={() => handleModeChange(modeOption.value)}
                    disabled={isChanging}
                    className={`
                      relative px-3 py-1.5 rounded-md text-sm font-medium
                      transition-all duration-200 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${isActive
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                    aria-current={isActive ? 'true' : 'false'}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className="text-base leading-none">
                        {modeOption.icon}
                      </span>
                      <span>{t(`mode.${modeOption.value}`)}</span>
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Dismiss Button */}
            <button
              onClick={dismissBanner}
              className="p-1.5 text-primary-600 hover:text-primary-800 hover:bg-primary-100 rounded-md transition-colors"
              aria-label={t('common.dismiss')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
