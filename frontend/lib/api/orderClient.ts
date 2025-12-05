import { queueOrderForSync, syncPendingOrdersToServer } from '@/lib/sync/localSync';

export async function submitOrder(order: unknown) {
  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (res.ok) {
      // Try to sync any pending orders
      try { await syncPendingOrdersToServer(); } catch(e) { /* ignore */ }
      return { ok: true, online: true };
    }
  } catch (err) {
    // Network error - queue for later
  }
  // Queue order for later sync
  await queueOrderForSync(order as Parameters<typeof queueOrderForSync>[0]);
  return { ok: true, online: false };
}
