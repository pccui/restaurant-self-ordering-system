import { API_BASE } from '../config';
import { useAuthStore } from '../store/authStore';

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string | null;
  userEmail: string | null;
  changes: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  } | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

interface GetAuditLogsParams {
  entityType?: string;
  action?: string;
  limit?: number;
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
 * Get audit logs (admin only)
 * Requires Bearer token
 */
export async function getAuditLogs(params?: GetAuditLogsParams): Promise<AuditLog[]> {
  const queryParams = new URLSearchParams();
  if (params?.entityType) queryParams.set('entityType', params.entityType);
  if (params?.action) queryParams.set('action', params.action);
  if (params?.limit) queryParams.set('limit', params.limit.toString());

  const url = `${API_BASE}/api/admin/audit${queryParams.toString() ? `?${queryParams}` : ''}`;

  const res = await fetch(url, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch audit logs');
  }

  return res.json();
}

/**
 * Get audit logs for a specific entity
 */
export async function getAuditLogsForEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
  const url = `${API_BASE}/api/admin/audit/entity?entityType=${entityType}&entityId=${entityId}`;

  const res = await fetch(url, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch audit logs');
  }

  return res.json();
}
