'use client'
import { useEffect, useCallback, useRef } from 'react'
import { useOrderStore, type OrderStatus } from '@/lib/store/orderStore'
import { useRouteMode } from '@/lib/hooks/useRouteMode'

const POLL_INTERVAL = 180000 // 3 minutes

interface ServerOrder {
  id: string
  tableId: string
  items: any[]
  total: number
  status: OrderStatus
  lockedAt: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Hook to poll server for order status updates
 * Only active in 'server' mode when there's a placed order
 */
export function useOrderSync() {
  const { mode } = useRouteMode()
  const activeOrder = useOrderStore((s) => s.activeOrder)
  const updateOrderFromServer = useOrderStore((s) => s.updateOrderFromServer)
  const confirmOrder = useOrderStore((s) => s.confirmOrder)
  const resetOrder = useOrderStore((s) => s.resetOrder)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Use refs for values needed inside the callback to avoid recreation
  const orderIdRef = useRef(activeOrder?.id)
  const orderStatusRef = useRef(activeOrder?.status)

  // Update refs when values change
  orderIdRef.current = activeOrder?.id
  orderStatusRef.current = activeOrder?.status

  // Stable primitive values for effect dependencies only
  const orderId = activeOrder?.id
  const orderPlacedAt = activeOrder?.placedAt ?? 0

  // Stable callback - uses refs instead of state dependencies
  const fetchOrderStatus = useCallback(async () => {
    const currentOrderId = orderIdRef.current
    if (!currentOrderId) return

    try {
      const response = await fetch(`/api/order/${currentOrderId}`)
      if (!response.ok) {
        if (response.status === 404) {
          // Order not found on server - this is expected if sync hasn't completed yet
          return
        }
        throw new Error('Failed to fetch order status')
      }

      const serverOrder: ServerOrder = await response.json()
      const currentStatus = orderStatusRef.current

      // Update local state with server status (only if different)
      if (serverOrder.status !== currentStatus) {
        updateOrderFromServer({ status: serverOrder.status })

        // Handle special status transitions
        if (serverOrder.status === 'confirmed' && currentStatus === 'pending') {
          confirmOrder()
        }

        if (serverOrder.status === 'paid') {
          // Reset order after payment (with small delay for UI feedback)
          setTimeout(() => resetOrder(), 3000)
        }
      }
    } catch (error) {
      console.error('Error fetching order status:', error)
    }
  }, [updateOrderFromServer, confirmOrder, resetOrder]) // Only stable store functions

  useEffect(() => {
    // Only poll in server mode with a placed order
    if (mode !== 'server' || !orderId || orderPlacedAt === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Initial fetch
    fetchOrderStatus()

    // Set up polling
    intervalRef.current = setInterval(fetchOrderStatus, POLL_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [mode, orderId, orderPlacedAt, fetchOrderStatus])

  return { refetch: fetchOrderStatus }
}
