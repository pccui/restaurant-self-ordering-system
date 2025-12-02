'use client';

import { usePathname } from 'next/navigation';
import { ENABLE_LOCAL_MODE } from '@/lib/config';

export type DataMode = 'local' | 'server';

interface RouteMode {
  /** Current mode based on URL */
  mode: DataMode;
  /** Whether local mode feature is enabled via env var */
  isLocalEnabled: boolean;
  /** Whether current route is a local mode route (contains /local/) */
  isLocalRoute: boolean;
  /** Whether mode toggle should be shown (only on table routes, not dashboard/browse) */
  showModeToggle: boolean;
  /** Whether user is in browse-only mode (viewing /menu without table ID) */
  isBrowseOnly: boolean;
  /** Whether user can add items to cart (has table ID assigned) */
  canOrder: boolean;
}

/**
 * Hook to determine data mode from URL path
 * URL is the single source of truth for mode:
 * - /en/local/T01/menu → local mode
 * - /en/T01/menu → server mode
 *
 * Mode toggle only shown on table-specific ordering routes
 */
export function useRouteMode(): RouteMode {
  const pathname = usePathname();

  // Check if this is a local mode route
  const isLocalRoute = pathname.includes('/local/');

  // Determine mode from URL
  const mode: DataMode = isLocalRoute ? 'local' : 'server';

  // Check if this is a route where mode toggle should be shown
  // Only show on table-specific routes: /en/[tableId]/menu or /en/local/[tableId]/menu
  // Don't show on: /dashboard, /login, /menu (browse-only)
  const isDashboard = pathname.includes('/dashboard');
  const isLogin = pathname.includes('/login');
  const isBrowseOnly = pathname.match(/^\/[a-z]{2}\/menu/) !== null; // /en/menu without tableId

  // Table route pattern: /locale/tableId/menu or /locale/local/tableId/menu
  const isTableRoute = !isDashboard && !isLogin && !isBrowseOnly && pathname.includes('/menu');

  const showModeToggle = ENABLE_LOCAL_MODE && isTableRoute;

  return {
    mode,
    isLocalEnabled: ENABLE_LOCAL_MODE,
    isLocalRoute,
    showModeToggle,
    isBrowseOnly,
    canOrder: !isBrowseOnly && !isDashboard && !isLogin,
  };
}

/**
 * Helper to convert a server route to local route
 * /en/T01/menu → /en/local/T01/menu
 */
export function toLocalRoute(pathname: string): string {
  // Match: /locale/tableId/... → /locale/local/tableId/...
  const match = pathname.match(/^(\/[a-z]{2})\/([^/]+)(\/.*)?$/);
  if (match) {
    const [, locale, tableId, rest = ''] = match;
    // Don't convert if it's a special route
    if (['dashboard', 'login', 'menu', 'local'].includes(tableId)) {
      return pathname;
    }
    return `${locale}/local/${tableId}${rest}`;
  }
  return pathname;
}

/**
 * Helper to convert a local route to server route
 * /en/local/T01/menu → /en/T01/menu
 */
export function toServerRoute(pathname: string): string {
  // Match: /locale/local/tableId/... → /locale/tableId/...
  return pathname.replace(/^(\/[a-z]{2})\/local\//, '$1/');
}
