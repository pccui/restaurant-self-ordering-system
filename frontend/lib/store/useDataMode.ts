import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type DataMode = 'local' | 'server'

interface DataModeState {
  mode: DataMode
  setMode: (mode: DataMode) => void
  // Banner dismissal state
  bannerDismissed: boolean
  dismissBanner: () => void
  showBanner: () => void
}

export const useDataMode = create<DataModeState>()(
  persist(
    (set) => ({
      mode: 'server', // Default to server mode so orders sync to database
      setMode: (mode) => set({ mode }),
      bannerDismissed: false,
      dismissBanner: () => set({ bannerDismissed: true }),
      showBanner: () => set({ bannerDismissed: false }),
    }),
    {
      name: 'data-mode-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
