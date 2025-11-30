'use client'
import { useEffect, useState, useCallback } from 'react'
import { useOrderStore } from '@/lib/store/orderStore'

interface OrderTimerState {
  timeRemaining: number // milliseconds
  minutes: number
  seconds: number
  isEditable: boolean // within 5-min edit window
  isExpired: boolean
}

/**
 * Hook to track order edit timer (5 minute window)
 * Auto-confirms order when timer expires
 */
export function useOrderTimer(): OrderTimerState {
  const activeOrder = useOrderStore((s) => s.activeOrder)
  const confirmOrder = useOrderStore((s) => s.confirmOrder)
  const getEditTimeRemaining = useOrderStore((s) => s.getEditTimeRemaining)
  const isWithinEditWindow = useOrderStore((s) => s.isWithinEditWindow)
  const isOrderPlaced = useOrderStore((s) => s.isOrderPlaced)

  const [timeRemaining, setTimeRemaining] = useState(() =>
    activeOrder?.placedAt ? getEditTimeRemaining() : 0
  )

  // Calculate minutes and seconds
  const totalSeconds = Math.floor(timeRemaining / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const isEditable = isOrderPlaced() && isWithinEditWindow()
  const isExpired = isOrderPlaced() && timeRemaining === 0

  // Auto-confirm when timer expires
  const handleExpire = useCallback(() => {
    if (activeOrder && activeOrder.placedAt > 0 && getEditTimeRemaining() <= 0) {
      confirmOrder()
    }
  }, [activeOrder, confirmOrder, getEditTimeRemaining])

  useEffect(() => {
    if (!activeOrder || activeOrder.placedAt === 0) {
      setTimeRemaining(0)
      return
    }

    // Update timer every second
    const interval = setInterval(() => {
      const remaining = getEditTimeRemaining()
      setTimeRemaining(remaining)

      // Auto-confirm when expired
      if (remaining <= 0) {
        handleExpire()
        clearInterval(interval)
      }
    }, 1000)

    // Initial check
    setTimeRemaining(getEditTimeRemaining())

    return () => clearInterval(interval)
  }, [activeOrder, getEditTimeRemaining, handleExpire])

  return {
    timeRemaining,
    minutes,
    seconds,
    isEditable,
    isExpired,
  }
}

/**
 * Format time remaining as MM:SS string
 */
export function formatTimeRemaining(minutes: number, seconds: number): string {
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
