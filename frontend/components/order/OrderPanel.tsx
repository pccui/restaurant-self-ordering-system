'use client'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Pencil, Check, ChefHat, CreditCard, Clock, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useOrderStore, type OrderItem, type PlacedOrder } from '@/lib/store/orderStore'
import { useMenuStore } from '@/lib/store/menuStore'
import { useOrderTimer, formatTimeRemaining } from '@/hooks/useOrderTimer'
import { useOrderSync } from '@/hooks/useOrderSync'
import { useRouteMode } from '@/lib/hooks/useRouteMode'
import { syncOrderToServer } from '@/lib/sync/localSync'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function OrderPanel() {
  const locale = useLocale()
  const params = useParams()
  const tableId = (params?.tableId as string) || ''

  const t = useTranslations()
  const tBasket = useTranslations('basket')
  const tCart = useTranslations('cart')
  const tOrder = useTranslations('order')

  const activeOrder = useOrderStore((s) => s.activeOrder)
  const setTableId = useOrderStore((s) => s.setTableId)
  const fetchOrderFromServer = useOrderStore((s) => s.fetchOrderFromServer)
  const remove = useOrderStore((s) => s.removeItem)
  const updateQty = useOrderStore((s) => s.updateQty)
  const clearCart = useOrderStore((s) => s.clearCart)
  const placeOrder = useOrderStore((s) => s.placeOrder)
  const isSyncing = useOrderStore((s) => s.isSyncing)
  const syncOrderChanges = useOrderStore((s) => s.syncOrderChanges)
  const hasUnsavedChanges = useOrderStore((s) => s.hasUnsavedChanges) // Subscribe to state directly
  const menu = useMenuStore((s) => s.menu || [])
  const { mode, canOrder } = useRouteMode()

  const { minutes, seconds, isEditable, isExpired } = useOrderTimer()
  const { refetch: syncOrderStatus } = useOrderSync()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Compute derived values directly from activeOrder for proper reactivity
  const orderPlaced = activeOrder !== null && activeOrder.placedAt > 0
  const totalCents = activeOrder?.total || 0

  // Compute canRemove based on edit window and status
  const canRemove = (() => {
    if (!activeOrder) return true
    if (activeOrder.placedAt === 0) return true // Not placed yet
    if (activeOrder.status !== 'pending') return false
    // Check if within 5-minute edit window
    const EDIT_WINDOW = 5 * 60 * 1000
    return Date.now() - activeOrder.placedAt < EDIT_WINDOW
  })()

  // Set tableId from URL on mount and fetch order from server
  useEffect(() => {
    // Only set tableId and fetch if we have a valid tableId (not browse-only mode)
    if (!tableId || !canOrder) return

    setTableId(tableId)

    // In server mode, also try to fetch existing order from server
    if (mode === 'server') {
      fetchOrderFromServer(tableId)
    }
  }, [tableId, setTableId, fetchOrderFromServer, mode, canOrder])

  // Get thumbnail for an item
  const getThumbnail = (itemId: string) => {
    const menuItem = menu.find((m) => m.id === itemId)
    return menuItem?.thumbnailUrl || null
  }

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!activeOrder || activeOrder.items.length === 0) return
    setIsSubmitting(true)

    try {
      const order = placeOrder()

      // Sync to server if in server mode
      if (order && mode === 'server') {
        // Send complete item data to ensure prices are preserved even if menu isn't seeded
        const orderPayload = {
          id: order.id,
          tableId: order.tableId,
          items: order.items.map((i) => ({
            menuItemId: i.id,
            qty: i.qty,
            name: i.name,
            priceCents: i.priceCents,
          })),
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

  // Handle update order (sync changes to server)
  const handleUpdateOrder = async () => {
    if (!hasUnsavedChanges || isSyncing) return
    const success = await syncOrderChanges()
    if (!success) {
      // Could show an error toast here
      console.error('Failed to update order')
    }
  }

  const items = activeOrder?.items || []
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)
  const hasItems = items.length > 0

  // Get status display info
  const getStatusInfo = () => {
    if (!activeOrder) return null
    if (!orderPlaced) return null

    if (isEditable) {
      return {
        badge: 'editable',
        badgeColor: 'bg-amber-100 text-amber-700',
        icon: <Pencil className="w-3 h-3" />,
        label: tOrder('editable'),
      }
    }

    switch (activeOrder.status) {
      case 'confirmed':
        return {
          badge: 'confirmed',
          badgeColor: 'bg-green-100 text-green-700',
          icon: <Check className="w-3 h-3" />,
          label: tOrder('confirmed'),
        }
      case 'preparing':
        return {
          badge: 'preparing',
          badgeColor: 'bg-blue-100 text-blue-700',
          icon: <ChefHat className="w-3 h-3" />,
          label: tOrder('preparing'),
        }
      case 'completed':
        return {
          badge: 'completed',
          badgeColor: 'bg-purple-100 text-purple-700',
          icon: <CheckCircle className="w-3 h-3" />,
          label: tOrder('completed'),
        }
      case 'paid':
        return {
          badge: 'paid',
          badgeColor: 'bg-gray-100 text-gray-700',
          icon: <CreditCard className="w-3 h-3" />,
          label: tOrder('paid'),
        }
      default:
        return {
          badge: 'pending',
          badgeColor: 'bg-yellow-100 text-yellow-700',
          icon: <Clock className="w-3 h-3" />,
          label: tOrder('pending'),
        }
    }
  }

  const statusInfo = getStatusInfo()

  // Empty state
  if (!hasItems) {
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
          href={tableId ? `/${locale}/${tableId}/menu` : `/${locale}/menu`}
          className="inline-block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-sm font-medium transition-colors"
        >
          {tBasket('browseMenu')}
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm flex flex-col h-full max-h-[calc(100vh-120px)]">
      {/* Header with status */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          {orderPlaced ? tOrder('yourOrder') : tBasket('title')}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({tBasket('items', { count: itemCount })})
          </span>
        </h3>

        {/* Status badge and timer - separate line */}
        {statusInfo && (
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusInfo.badgeColor}`}>
              <span>{statusInfo.icon}</span> {statusInfo.label}
            </span>
            {isEditable && (
              <span className="font-mono text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeRemaining(minutes, seconds)}
              </span>
            )}
          </div>
        )}

        {/* Edit window notification */}
        {orderPlaced && isEditable && (
          <p className="mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            {tOrder('editWindowHint')}
          </p>
        )}
      </div>

      {/* Order Items List */}
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
                  {canRemove && (
                    <button
                      onClick={() => remove(it.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      aria-label={`Remove ${it.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-center mt-2">
                  {/* Quantity Controls - always show + button, - button only when canRemove */}
                  <div className="flex items-center border border-gray-200 rounded-full">
                    {canRemove ? (
                      <button
                        onClick={() => updateQty(it.id, it.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-l-full transition-colors text-gray-600"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                    ) : (
                      <span className="w-8 h-8 flex items-center justify-center text-gray-300 rounded-l-full">−</span>
                    )}
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{tBasket('total')}</span>
          <span className="text-xl font-bold text-gray-900">{formatPrice(totalCents)}</span>
        </div>

        {/* Action Buttons */}
        {!orderPlaced && (
          <>
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting || items.length === 0}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '...' : tCart('placeOrder')}
            </button>

            <button
              onClick={() => clearCart()}
              className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              {tBasket('clear')}
            </button>
          </>
        )}

        {/* Update Order Button - shown when there are unsaved changes to a placed order */}
        {orderPlaced && hasUnsavedChanges && (
          <button
            onClick={handleUpdateOrder}
            disabled={isSyncing}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSyncing ? '...' : tOrder('updateOrder')}
          </button>
        )}

        {/* Status message for confirmed orders */}
        {orderPlaced && !canRemove && activeOrder?.status === 'confirmed' && (
          <div className="text-center py-2 text-sm text-gray-500">
            {tOrder('confirmedMessage')}
          </div>
        )}
      </div>
    </div>
  )
}