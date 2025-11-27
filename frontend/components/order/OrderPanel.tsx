'use client'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { useOrderStore, type OrderItem, type PlacedOrder } from '@/lib/store/orderStore'
import { useMenuStore } from '@/lib/store/menuStore'
import { useOrderTimer, formatTimeRemaining } from '@/hooks/useOrderTimer'
import { submitOrder } from '@/lib/api/orderClient'
import { useDataMode } from '@/lib/store/useDataMode'
import { syncOrderToServer } from '@/lib/sync/localSync'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function OrderPanel() {
  const locale = useLocale()
  const t = useTranslations()
  const tBasket = useTranslations('basket')
  const tCart = useTranslations('cart')
  const tOrder = useTranslations('order')

  const items = useOrderStore((s) => s.items)
  const activeOrder = useOrderStore((s) => s.activeOrder)
  const orderHistory = useOrderStore((s) => s.orderHistory)
  const remove = useOrderStore((s) => s.removeItem)
  const updateQty = useOrderStore((s) => s.updateQty)
  const clearCart = useOrderStore((s) => s.clearCart)
  const placeOrder = useOrderStore((s) => s.placeOrder)
  const addToOrder = useOrderStore((s) => s.addToOrder)
  const totalCents = useOrderStore((s) => s.totalCents)()
  const menu = useMenuStore((s) => s.menu || [])
  const { mode } = useDataMode()

  const { minutes, seconds, isLocked } = useOrderTimer()
  const [historyExpanded, setHistoryExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get thumbnail for an item
  const getThumbnail = (itemId: string) => {
    const menuItem = menu.find((m) => m.id === itemId)
    return menuItem?.thumbnailUrl || null
  }

  // Handle place order or add to order
  const handlePlaceOrder = async () => {
    if (items.length === 0) return
    setIsSubmitting(true)

    try {
      let order: PlacedOrder | null = null

      if (activeOrder) {
        // Add to existing order
        addToOrder()
        order = useOrderStore.getState().activeOrder
      } else {
        // Place new order
        order = placeOrder()
      }

      // Sync to server if in server mode
      if (order && mode === 'server') {
        const orderPayload = {
          id: order.id,
          tableId: 'table-1',
          items: order.items.map((i) => ({ menuItemId: i.id, qty: i.qty })),
          status: order.status,
          total: order.total,
          placedAt: order.placedAt,
        }
        await syncOrderToServer(orderPayload as unknown as Parameters<typeof syncOrderToServer>[0])
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)
  const hasCartItems = items.length > 0
  const hasActiveOrder = !!activeOrder
  const hasHistory = orderHistory.length > 0

  // Completely empty state
  if (!hasCartItems && !hasActiveOrder && !hasHistory) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <div className="text-gray-300 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{tBasket('empty')}</h3>
        <p className="text-sm text-gray-500 mb-4">{tBasket('emptyDescription')}</p>
        <Link
          href={`/${locale}/menu`}
          className="inline-block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-sm font-medium transition-colors"
        >
          {tBasket('browseMenu')}
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm flex flex-col h-full max-h-[calc(100vh-120px)]">
      {/* Active Order Section */}
      {hasActiveOrder && activeOrder && (
        <div className="border-b border-gray-200">
          <div className="p-4 bg-primary-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-primary-900 flex items-center gap-2">
                <span>📋</span> {tOrder('activeOrder')}
              </h3>
              {isLocked && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                    <span>🔒</span> {tOrder('locked')}
                  </span>
                  <span className="font-mono text-primary-600">
                    {formatTimeRemaining(minutes, seconds)}
                  </span>
                </div>
              )}
              {!isLocked && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                  ✓ {tOrder('confirmed')}
                </span>
              )}
            </div>

            {/* Active Order Items (read-only) */}
            <ul className="space-y-2 max-h-32 overflow-y-auto">
              {activeOrder.items.map((it) => (
                <li key={it.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 truncate flex-1">
                    {it.qty}× {it.name}
                  </span>
                  <span className="text-gray-900 font-medium ml-2">
                    {formatPrice(it.priceCents * it.qty)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-primary-200">
              <span className="text-sm font-medium text-primary-900">{tBasket('total')}</span>
              <span className="font-bold text-primary-900">{formatPrice(activeOrder.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Cart Section Header */}
      {hasCartItems && (
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {hasActiveOrder ? tCart('addToOrder') : tBasket('title')}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({tBasket('items', { count: itemCount })})
            </span>
          </h3>
        </div>
      )}

      {/* Cart Items List - Scrollable */}
      {hasCartItems && (
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
                      {formatPrice(it.priceCents * it.qty)}
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* Order History Section */}
      {hasHistory && (
        <div className="border-t border-gray-200">
          <button
            onClick={() => setHistoryExpanded(!historyExpanded)}
            className="w-full p-3 flex justify-between items-center text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium">{tOrder('history')} ({orderHistory.length})</span>
            <svg
              className={`w-4 h-4 transition-transform ${historyExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {historyExpanded && (
            <div className="px-3 pb-3 space-y-2 max-h-40 overflow-y-auto">
              {orderHistory.map((order) => (
                <div key={order.id} className="p-2 bg-gray-50 rounded-lg text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">
                      {new Date(order.placedAt).toLocaleString(locale)}
                    </span>
                    <span className="font-medium text-gray-900">{formatPrice(order.total)}</span>
                  </div>
                  <div className="text-gray-600 mt-1">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer - Sticky */}
      {hasCartItems && (
        <div className="p-4 border-t border-gray-100 space-y-3">
          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{tBasket('total')}</span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(totalCents)}</span>
          </div>

          {/* Place Order / Add to Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || items.length === 0}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '...' : hasActiveOrder ? tCart('addToOrder') : tCart('placeOrder')}
          </button>

          {/* Clear Cart Button */}
          <button
            onClick={() => clearCart()}
            className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            {tBasket('clear')}
          </button>
        </div>
      )}
    </div>
  )
}
