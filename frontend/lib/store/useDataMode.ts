import { create } from 'zustand'
import { toLocalRoute, toServerRoute, type DataMode } from '@/lib/hooks/useRouteMode'

export type { DataMode }

interface DataModeState {
  // Banner dismissal state (session-only, not persisted)
  bannerDismissed: boolean
  dismissBanner: () => void
  showBanner: () => void
}

/**
 * Data mode store - manages banner dismissal state only
 *
 * Mode is now determined by URL, not stored state:
 * - /en/local/T01/menu → local mode
 * - /en/T01/menu → server mode
 *
 * Use `useRouteMode()` hook to get current mode from URL
 * Use `switchMode()` helper below to navigate between modes
 */
export const useDataMode = create<DataModeState>()((set) => ({
  bannerDismissed: false,
  dismissBanner: () => set({ bannerDismissed: true }),
  showBanner: () => set({ bannerDismissed: false }),
}))

/**
 * Switch between local and server mode by navigating to the appropriate route
 * @param targetMode - The mode to switch to
 * @param currentPath - Current pathname
 * @param router - Next.js router instance
 */
export function switchMode(
  targetMode: DataMode,
  currentPath: string,
  router: { push: (path: string) => void }
): void {
  const newPath = targetMode === 'local'
    ? toLocalRoute(currentPath)
    : toServerRoute(currentPath)

  if (newPath !== currentPath) {
    router.push(newPath)
  }
}
