import { OrderStatus } from '../store/orderStore';
import { API_BASE } from '../config';
import { useAuthStore } from '../store/authStore';

export interface DashboardOrder {
  id: string;
  tableId: string;
  items: Array<{
    id: string;
    name: string;
    priceCents: number;
    qty: number;
    imageUrl?: string;
  }>;
  total: number;
  status: OrderStatus;
  placedAt: string;
  updatedAt: string;
}

interface GetOrdersParams {
  status?: OrderStatus;
  tableId?: string;
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
 * Get all orders (for dashboard)
 * Requires authentication
 */
export async function getOrders(params?: GetOrdersParams): Promise<DashboardOrder[]> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.set('status', params.status);
  if (params?.tableId) queryParams.set('tableId', params.tableId);

  const url = `${API_BASE}/api/order${queryParams.toString() ? `?${queryParams}` : ''}`;

  const res = await fetch(url, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch orders');
  }

  return res.json();
}

/**
 * Get a single order by ID
 */
export async function getOrder(id: string): Promise<DashboardOrder> {
  const res = await fetch(`${API_BASE}/api/order/${id}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch order');
  }

  return res.json();
}

/**
 * Update order status
 * Only available to KITCHEN and ADMIN roles
 */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<DashboardOrder> {
  const res = await fetch(`${API_BASE}/api/order/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(), // includes Content-Type
    credentials: 'include',
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to update status' }));
    throw new Error(error.message);
  }

  return res.json();
}

/**
 * Mark order as paid
 * Only available to WAITER and ADMIN roles
 */
export async function markOrderAsPaid(id: string): Promise<DashboardOrder> {
  return updateOrderStatus(id, 'paid');
}

/**
 * Delete order (soft delete)
 * Only available to ADMIN role
 */
export async function deleteOrder(id: string): Promise<DashboardOrder> {
  const res = await fetch(`${API_BASE}/api/order/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to delete order' }));
    throw new Error(error.message);
  }

  return res.json();
}

/**
 * Full order update
 * Only available to ADMIN role
 */
export async function updateOrder(
  id: string,
  data: { items?: DashboardOrder['items']; total?: number; tableId?: string; status?: OrderStatus }
): Promise<DashboardOrder> {
  const res = await fetch(`${API_BASE}/api/order/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to update order' }));
    throw new Error(error.message);
  }

  return res.json();
}
