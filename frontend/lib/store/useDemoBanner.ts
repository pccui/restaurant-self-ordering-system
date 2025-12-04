import { create } from 'zustand'
import { DEMO_MODE } from '@/lib/config'

export { DEMO_MODE }

const STORAGE_KEY = 'demo-banner-dismissed'

interface DemoBannerState {
  dismissed: boolean
  initialized: boolean
  dismiss: () => void
  show: () => void
  initialize: () => void
}

/**
 * Demo banner store - manages banner visibility state
 * Persists dismissal to localStorage
 */
export const useDemoBanner = create<DemoBannerState>()((set) => ({
  dismissed: true, // Start hidden to avoid flash
  initialized: false,
  dismiss: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'true')
    }
    set({ dismissed: true })
  },
  show: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    set({ dismissed: false })
  },
  initialize: () => {
    if (typeof window !== 'undefined') {
      const isDismissed = localStorage.getItem(STORAGE_KEY) === 'true'
      set({ dismissed: isDismissed, initialized: true })
    }
  },
}))
