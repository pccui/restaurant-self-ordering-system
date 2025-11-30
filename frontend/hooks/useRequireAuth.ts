'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuthStore, Role } from '../lib/store/authStore';
import { getMe } from '../lib/api/auth';

interface UseRequireAuthOptions {
  /** Required roles to access the page. If not provided, any authenticated user can access */
  requiredRoles?: Role[];
  /** Redirect path for unauthenticated users. Defaults to /login */
  loginPath?: string;
  /** Redirect path for unauthorized users (wrong role). Defaults to /dashboard */
  unauthorizedPath?: string;
}

/**
 * Hook to protect routes that require authentication
 * Checks auth status on mount and redirects if not authenticated or authorized
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const {
    requiredRoles,
    loginPath = '/login',
    unauthorizedPath = '/dashboard',
  } = options;

  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  const { user, isAuthenticated, isLoading, setUser, setLoading, hasRole } = useAuthStore();

  useEffect(() => {
    async function checkAuthentication() {
      // If already have user data, just check roles
      if (isAuthenticated && user) {
        // Check role requirement
        if (requiredRoles && !hasRole(requiredRoles)) {
          router.replace(`/${locale}${unauthorizedPath}`);
          return;
        }
        setLoading(false);
        return;
      }

      // Check with server
      setLoading(true);
      try {
        const serverUser = await getMe();

        if (!serverUser) {
          // Not authenticated, redirect to login
          router.replace(`/${locale}${loginPath}`);
          return;
        }

        // Set user in store
        setUser(serverUser);

        // Check role requirement
        if (requiredRoles && !requiredRoles.includes(serverUser.role)) {
          router.replace(`/${locale}${unauthorizedPath}`);
          return;
        }
      } catch {
        // Error checking auth, redirect to login
        router.replace(`/${locale}${loginPath}`);
      }
    }

    checkAuthentication();
  }, [pathname]); // Re-check when pathname changes

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === 'ADMIN',
    isWaiter: user?.role === 'WAITER',
    isKitchen: user?.role === 'KITCHEN',
  };
}
