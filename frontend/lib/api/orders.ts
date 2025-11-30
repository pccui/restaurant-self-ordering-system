import { OrderStatus } from '../store/orderStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

/**
 * Get all orders (for dashboard)
 * Requires authentication
 */
export async function getOrders(params?: GetOrdersParams): Promise<DashboardOrder[]> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.set('status', params.status);
  if (params?.tableId) queryParams.set('tableId', params.tableId);

  const url = `${API_BASE}/api/orders${queryParams.toString() ? `?${queryParams}` : ''}`;

  const res = await fetch(url, {
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
    headers: {
      'Content-Type': 'application/json',
    },
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
