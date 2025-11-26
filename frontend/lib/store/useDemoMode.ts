import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type DemoMode = 'online' | 'offline'

interface DemoModeState {
  mode: DemoMode
  setMode: (mode: DemoMode) => void
}

export const useDemoMode = create<DemoModeState>()(
  persist(
    (set) => ({
      mode: 'online',
      setMode: (mode) => {
        set({ mode })
        // Store in localStorage for persistence across sessions
        if (typeof window !== 'undefined') {
          localStorage.setItem('demo-mode', mode)
        }
      }
    }),
    {
      name: 'demo-mode-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
