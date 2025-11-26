'use client'
import { useDemoMode } from '@/lib/store/useDemoMode'
import { useMenuStore } from '@/lib/store/menuStore'
import { useState, useEffect } from 'react'

const MODES = [
  { value: 'offline', label: 'Offline', icon: '💾', description: 'Use local data (IndexedDB)' },
  { value: 'online', label: 'Online', icon: '🌐', description: 'Fetch from API server' },
] as const

export default function ModeToggle() {
  const { mode, setMode } = useDemoMode()
  const loadMenu = useMenuStore((s) => s.loadMenu)
  const [isChanging, setIsChanging] = useState(false)

  const handleModeChange = async (newMode: 'online' | 'offline') => {
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
