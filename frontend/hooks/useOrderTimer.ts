'use client'
import { useEffect, useState, useCallback } from 'react'
import { useOrderStore } from '@/lib/store/orderStore'

interface OrderTimerState {
  timeRemaining: number // milliseconds
  minutes: number
  seconds: number
  isLocked: boolean
  isExpired: boolean
}

/**
 * Hook to track order lock timer (10 minute window)
 * Auto-confirms order when timer expires
 */
export function useOrderTimer(): OrderTimerState {
  const activeOrder = useOrderStore((s) => s.activeOrder)
  const confirmOrder = useOrderStore((s) => s.confirmOrder)
  const getOrderTimeRemaining = useOrderStore((s) => s.getOrderTimeRemaining)
  const isOrderLocked = useOrderStore((s) => s.isOrderLocked)

  const [timeRemaining, setTimeRemaining] = useState(() => getOrderTimeRemaining())

  // Calculate minutes and seconds
  const totalSeconds = Math.floor(timeRemaining / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const isLocked = timeRemaining > 0 && !!activeOrder
  const isExpired = timeRemaining === 0 && !!activeOrder

  // Auto-confirm when timer expires
  const handleExpire = useCallback(() => {
    if (activeOrder && getOrderTimeRemaining() <= 0) {
      confirmOrder()
    }
  }, [activeOrder, confirmOrder, getOrderTimeRemaining])

  useEffect(() => {
    if (!activeOrder) {
      setTimeRemaining(0)
      return
    }

    // Update timer every second
    const interval = setInterval(() => {
      const remaining = getOrderTimeRemaining()
      setTimeRemaining(remaining)

      // Auto-confirm when expired
      if (remaining <= 0) {
        handleExpire()
        clearInterval(interval)
      }
    }, 1000)

    // Initial check
    setTimeRemaining(getOrderTimeRemaining())

    return () => clearInterval(interval)
  }, [activeOrder, getOrderTimeRemaining, handleExpire])

  return {
    timeRemaining,
    minutes,
    seconds,
    isLocked,
    isExpired,
  }
}

/**
 * Format time remaining as MM:SS string
 */
export function formatTimeRemaining(minutes: number, seconds: number): string {
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
