'use client'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useOrderStore, type OrderItem } from '@/lib/store/orderStore'
import { useMenuStore } from '@/lib/store/menuStore'
import { submitOrder } from '@/lib/api/orderClient'

export default function OrderPanel() {
  const locale = useLocale()
  const t = useTranslations('basket')
  const items = useOrderStore((s) => s.items)
  const remove = useOrderStore((s) => s.removeItem)
  const updateQty = useOrderStore((s) => s.updateQty)
  const clear = useOrderStore((s) => s.clear)
  const totalCents = useOrderStore((s) => s.totalCents)()
  const menu = useMenuStore((s) => s.menu || [])

  // Get thumbnail for an item
  const getThumbnail = (itemId: string) => {
    const menuItem = menu.find((m) => m.id === itemId)
    return menuItem?.thumbnailUrl || null
  }

  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <div className="text-gray-300 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('empty')}</h3>
        <p className="text-sm text-gray-500 mb-4">{t('emptyDescription')}</p>
        <Link
          href={`/${locale}/menu`}
          className="inline-block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-sm font-medium transition-colors"
        >
          {t('browseMenu')}
        </Link>
      </div>
    )
  }

  const onCheckout = async () => {
    const order = {
      tableId: 'demo-table',
      items: items.map((i: OrderItem) => ({ menuItemId: i.id, qty: i.qty })),
      metadata: {}
    }
    const res = await submitOrder(order)
    alert('Order submitted: ' + JSON.stringify(res))
    if (res.online) clear()
  }

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div className="bg-white rounded-xl shadow-sm flex flex-col h-full max-h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('title')}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({t('items', { count: itemCount })})
          </span>
        </h3>
      </div>

      {/* Items List - Scrollable */}
      <ul className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.map((it: OrderItem) => {
          const thumbnail = getThumbnail(it.id)
          return (
            <li key={it.id} className="flex gap-3">
              {/* Thumbnail */}
              {thumbnail && (
                <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={thumbnail}
                    alt={it.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{it.name}</h4>
                  <button
                    onClick={() => remove(it.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label={`Remove ${it.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex justify-between items-center mt-2">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-200 rounded-full">
                    <button
                      onClick={() => updateQty(it.id, Math.max(1, it.qty - 1))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-l-full transition-colors text-gray-600"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{it.qty}</span>
                    <button
                      onClick={() => updateQty(it.id, it.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-r-full transition-colors text-gray-600"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <span className="font-semibold text-gray-900 text-sm">
                    ¥{((it.priceCents * it.qty) / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Footer - Sticky */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{t('total')}</span>
          <span className="text-xl font-bold text-gray-900">¥{(totalCents / 100).toFixed(2)}</span>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          className="w-full py-3 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-full font-semibold transition-colors"
        >
          {t('checkout')}
        </button>

        {/* Clear Button */}
        <button
          onClick={() => clear()}
          className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
        >
          {t('clear')}
        </button>
      </div>
    </div>
  )
}
