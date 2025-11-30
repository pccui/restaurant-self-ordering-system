import { User } from '../store/authStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface LoginResponse {
  user: User;
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
    credentials: 'include', // Important: include cookies
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
  return data.user;
}

/**
 * Logout the current user
 * Clears the auth cookie on the server
 */
export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 */
export async function getMe(): Promise<User | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      credentials: 'include',
    });

    if (!res.ok) {
      return null;
    }

    const user: User = await res.json();
    return user;
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
