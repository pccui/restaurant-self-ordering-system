'use client'
import { useOrderStore, type OrderItem } from '@/lib/store/orderStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { submitOrder } from '@/lib/api/orderClient';

export default function OrderPanel() {
  const items = useOrderStore((s) => s.items);
  const remove = useOrderStore((s) => s.removeItem);
  const updateQty = useOrderStore((s) => s.updateQty);
  const clear = useOrderStore((s) => s.clear);
  const totalCents = useOrderStore((s) => s.totalCents)();

  if (!items || items.length === 0) {
    return <div className="p-4">Your basket is empty.</div>
  }

  const onCheckout = async () => {
    const order = { tableId: 'demo-table', items: items.map((i: OrderItem)=>({menuItemId: i.id, qty: i.qty})), metadata: {} };
    const res = await submitOrder(order);
    alert('Order submitted: ' + JSON.stringify(res));
    if (res.online) clear();
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">Your Basket</h3>
      <ul className="space-y-3">
        {items.map((it: OrderItem) => (
          <li key={it.id} className="flex justify-between items-center">
            <div>
              <div className="font-medium">{it.name}</div>
              <div className="text-sm">¥{(it.priceCents/100).toFixed(2)} x {it.qty}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(it.id, Math.max(1, it.qty - 1))} className="px-2">-</button>
              <div>{it.qty}</div>
              <button onClick={() => updateQty(it.id, it.qty + 1)} className="px-2">+</button>
              <button onClick={() => remove(it.id)} className="px-2 text-sm">Remove</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 font-bold">Total: ¥{(totalCents/100).toFixed(2)}</div>
      <div className="mt-3 flex gap-2">
        <Button className="bg-emerald-500 text-white" onClick={onCheckout}>Checkout</Button>
        <Button onClick={() => clear()}>Clear</Button>
      </div>
    </Card>
  )
}
