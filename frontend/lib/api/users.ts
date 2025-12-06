import { User, Role, useAuthStore } from '../store/authStore';
import { API_BASE } from '../config';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  name?: string;
  role?: Role;
}

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = useAuthStore.getState().accessToken;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Get all users (admin only)
 */
export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  return res.json();
}

/**
 * Get a single user by ID (admin only)
 */
export async function getUser(id: string): Promise<User> {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }

  return res.json();
}

/**
 * Create a new user (admin only)
 */
export async function createUser(data: CreateUserData): Promise<User> {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to create user' }));
    throw new Error(error.message);
  }

  return res.json();
}

/**
 * Update a user (admin only)
 */
export async function updateUser(id: string, data: UpdateUserData): Promise<User> {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to update user' }));
    throw new Error(error.message);
  }

  return res.json();
}

/**
 * Delete a user (admin only)
 */
export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to delete user' }));
    throw new Error(error.message);
  }
}
