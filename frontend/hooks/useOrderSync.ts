'use client'
import { useEffect, useCallback, useRef } from 'react'
import { useOrderStore, type OrderStatus } from '@/lib/store/orderStore'
import { useRouteMode } from '@/lib/hooks/useRouteMode'

const POLL_INTERVAL = 30000 // 30 seconds

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

  const fetchOrderStatus = useCallback(async () => {
    if (!activeOrder || activeOrder.placedAt === 0) return

    try {
      const response = await fetch(`/api/order/${activeOrder.id}`)
      if (!response.ok) {
        if (response.status === 404) {
          // Order not found on server, might need to re-sync
          console.warn('Order not found on server')
          return
        }
        throw new Error('Failed to fetch order status')
      }

      const serverOrder: ServerOrder = await response.json()

      // Update local state with server status
      if (serverOrder.status !== activeOrder.status) {
        updateOrderFromServer({ status: serverOrder.status })

        // Handle special status transitions
        if (serverOrder.status === 'confirmed' && activeOrder.status === 'pending') {
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
  }, [activeOrder, updateOrderFromServer, confirmOrder, resetOrder])

  useEffect(() => {
    // Only poll in server mode with a placed order
    if (mode !== 'server' || !activeOrder || activeOrder.placedAt === 0) {
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
  }, [mode, activeOrder?.id, activeOrder?.placedAt, fetchOrderStatus])

  return { refetch: fetchOrderStatus }
}
