import localforage from 'localforage';
import { useAuthStore } from '../store/authStore';

// Configure localforage for the restaurant app
localforage.config({ name: 'restaurant-app', storeName: 'local-db' });

interface Order {
  id: string;
  items: unknown[];
  placedAt: number;
  status: string;
  total: number;
  [key: string]: unknown;
}

interface SyncResult {
  synced?: number;
  error?: string;
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
 * Queue an order for later sync to server
 * Used when in local mode or when server is unavailable
 */
export async function queueOrderForSync(order: Order): Promise<void> {
  const pending = (await localforage.getItem('pendingOrders')) as Order[] || [];
  pending.push(order);
  await localforage.setItem('pendingOrders', pending);
}

/**
 * Get all pending orders waiting to be synced
 */
export async function getPendingOrders(): Promise<Order[]> {
  return (await localforage.getItem('pendingOrders')) as Order[] || [];
}

/**
 * Clear a specific order from pending queue after successful sync
 */
export async function clearSyncedOrder(orderId: string): Promise<void> {
  const pending = (await localforage.getItem('pendingOrders')) as Order[] || [];
  const filtered = pending.filter(o => o.id !== orderId);
  await localforage.setItem('pendingOrders', filtered);
}

/**
 * Sync all pending orders to server with retry logic
 * Uses exponential backoff: 1s, 2s, 4s (max 3 attempts)
 */
export async function syncPendingOrdersToServer(maxRetries = 3): Promise<SyncResult> {
  const pending = await getPendingOrders();
  if (!pending.length) return { synced: 0 };

  let lastError: string | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(pending)
      });

      if (!res.ok) {
        throw new Error(`Sync failed with status ${res.status}`);
      }

      // Clear all synced orders
      await localforage.removeItem('pendingOrders');
      return { synced: pending.length };
    } catch (err) {
      lastError = String(err);
      console.warn(`Sync attempt ${attempt + 1} failed:`, err);

      // Exponential backoff: 1s, 2s, 4s
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  console.error('All sync attempts failed:', lastError);
  return { error: lastError || 'Unknown sync error' };
}

/**
 * Sync a single order to server immediately
 * Returns true if successful, false if failed (order remains in queue)
 */
export async function syncOrderToServer(order: Order): Promise<boolean> {
  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(order)
    });

    if (!res.ok) {
      throw new Error(`Order sync failed with status ${res.status}`);
    }

    return true;
  } catch (err) {
    console.warn('Immediate sync failed, queuing for later:', err);
    await queueOrderForSync(order);
    return false;
  }
}

/**
 * Update order items on the server (for adding items to existing orders)
 * Uses PATCH /api/order/:id/items endpoint
 */
export async function updateOrderItemsOnServer(
  orderId: string,
  items: { menuItemId: string; qty: number }[],
  total: number
): Promise<boolean> {
  try {
    const res = await fetch(`/api/order/${orderId}/items`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items, total })
    });

    if (!res.ok) {
      throw new Error(`Order update failed with status ${res.status}`);
    }

    return true;
  } catch (err) {
    console.warn('Failed to update order items on server:', err);
    return false;
  }
}

// Legacy aliases for backward compatibility
export const queueOrder = queueOrderForSync;
export const syncPendingOrders = syncPendingOrdersToServer;
