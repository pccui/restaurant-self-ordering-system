import { queueOrder, syncPendingOrders } from '@/lib/sync/offlineSync';

export async function submitOrder(order: any) {
  try {
    const res = await fetch('/api/online/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (res.ok) {
      try { await syncPendingOrders(); } catch(e) {}
      return { ok: true, online: true };
    }
  } catch (err) {}
  await queueOrder(order);
  return { ok: true, online: false };
}
