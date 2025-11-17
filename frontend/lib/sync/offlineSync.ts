import localforage from 'localforage';

localforage.config({ name: 'restaurant-demo', storeName: 'offline-db' });

interface Order {
  [key: string]: unknown;
}

export async function queueOrder(order: Order) {
  const pending = (await localforage.getItem('pendingOrders')) as Order[] || [];
  pending.push(order);
  await localforage.setItem('pendingOrders', pending);
}

export async function syncPendingOrders() {
  const pending = (await localforage.getItem('pendingOrders')) as Order[] || [];
  if (!pending.length) return { synced: 0 };
  try {
    const res = await fetch('/api/online/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pending)
    });
    if (!res.ok) throw new Error('sync failed');
    await localforage.removeItem('pendingOrders');
    return { synced: pending.length };
  } catch (err) {
    console.error('syncPendingOrders error', err);
    return { error: String(err) };
  }
}
