import { User, useAuthStore } from '../store/authStore';
import { API_BASE } from '../config';

interface LoginResponse {
  user: User;
  accessToken: string;
}

interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * Login with email and password
 * Returns user data on success, throws on failure
 */
export async function login(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // credentials: 'include', // No longer relying on cookies alone
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      message: 'Login failed',
      statusCode: res.status
    }));
    throw new Error(error.message || 'Invalid credentials');
  }

  const data: LoginResponse = await res.json();

  // Update store with user and token
  useAuthStore.getState().setUser(data.user, data.accessToken);

  return data.user;
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  // Clear local state
  useAuthStore.getState().logout();

  // Optionally notify backend (though stateless JWT doesn't strictly require it unless blacklisting)
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    // credentials: 'include',
  }).catch(() => { });
}

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 */
export async function getMe(): Promise<User | null> {
  const token = useAuthStore.getState().accessToken;
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
      // credentials: 'include',
    });

    if (!res.ok) {
      if (res.status === 401) {
        useAuthStore.getState().logout();
      }
      return null;
    }

    const data = await res.json();
    // Refresh user data in store
    useAuthStore.getState().setUser(data.user); // Maintain existing token
    return data.user;
  } catch {
    return null;
  }
}

/**
 * Check if the current user is authenticated
 */
export async function checkAuth(): Promise<boolean> {
  const user = await getMe();
  return !!user;
}
