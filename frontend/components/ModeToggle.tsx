'use client'
import { useRouteMode, type DataMode } from '@/lib/hooks/useRouteMode'
import { switchMode } from '@/lib/store/useDataMode'
import { useMenuStore } from '@/lib/store/menuStore'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

const MODES: { value: DataMode; label: string; icon: string; description: string }[] = [
  { value: 'local', label: 'Local', icon: '💾', description: 'Use local data (IndexedDB)' },
  { value: 'server', label: 'Server', icon: '🌐', description: 'Fetch from API server' },
]

export default function ModeToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const { mode, showModeToggle } = useRouteMode()
  const loadMenu = useMenuStore((s) => s.loadMenu)
  const [isChanging, setIsChanging] = useState(false)

  // Don't render if local mode is disabled or not on appropriate route
  if (!showModeToggle) return null

  const handleModeChange = async (newMode: DataMode) => {
    if (newMode === mode || isChanging) return

    setIsChanging(true)

    // Navigate to new route (mode is in URL)
    switchMode(newMode, pathname, router)

    // Reload menu data from new source
    try {
      await loadMenu(newMode)
    } catch (error) {
      console.error('Failed to reload menu:', error)
    } finally {
      setTimeout(() => setIsChanging(false), 300)
    }
  }

  return (
    <div
      className="inline-flex items-center bg-gray-100 rounded-lg p-1 gap-1"
      role="group"
      aria-label="Data mode selection"
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
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
            aria-label={modeOption.description}
            aria-current={isActive ? 'true' : 'false'}
            title={modeOption.description}
          >
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="text-base leading-none">
                {modeOption.icon}
              </span>
              <span className="hidden sm:inline">{modeOption.label}</span>
              <span className="sm:hidden">{modeOption.icon}</span>
            </span>
            {isActive && (
              <span
                className="absolute inset-0 rounded-md ring-2 ring-primary-500 ring-offset-1 pointer-events-none"
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
