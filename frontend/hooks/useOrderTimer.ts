'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useOrderStore } from '@/lib/store/orderStore'

// 5 minutes in milliseconds
const ORDER_EDIT_WINDOW = 5 * 60 * 1000

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

  const [timeRemaining, setTimeRemaining] = useState(0)

  // Calculate if order is placed and editable from activeOrder directly
  const orderPlaced = activeOrder !== null && activeOrder.placedAt > 0
  const placedAt = activeOrder?.placedAt ?? 0

  // Calculate isEditable based on current time and placedAt
  const isEditable = useMemo(() => {
    if (!orderPlaced) return false
    return Date.now() - placedAt < ORDER_EDIT_WINDOW
  }, [orderPlaced, placedAt, timeRemaining]) // timeRemaining triggers recalc

  // Calculate minutes and seconds
  const totalSeconds = Math.floor(timeRemaining / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const isExpired = orderPlaced && timeRemaining === 0

  // Calculate time remaining
  const getTimeRemaining = useCallback(() => {
    if (!placedAt || placedAt === 0) return ORDER_EDIT_WINDOW
    const elapsed = Date.now() - placedAt
    return Math.max(0, ORDER_EDIT_WINDOW - elapsed)
  }, [placedAt])

  // Auto-confirm when timer expires
  const handleExpire = useCallback(() => {
    if (activeOrder && activeOrder.placedAt > 0 && activeOrder.status === 'pending') {
      confirmOrder()
    }
  }, [activeOrder, confirmOrder])

  useEffect(() => {
    if (!activeOrder || activeOrder.placedAt === 0) {
      setTimeRemaining(0)
      return
    }

    // Initial check - confirm immediately if already expired
    const initialRemaining = getTimeRemaining()
    setTimeRemaining(initialRemaining)
    if (initialRemaining <= 0) {
      handleExpire()
      return // No need to start interval
    }

    // Update timer every second
    const interval = setInterval(() => {
      const remaining = getTimeRemaining()
      setTimeRemaining(remaining)

      // Auto-confirm when expired
      if (remaining <= 0) {
        handleExpire()
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [activeOrder, getTimeRemaining, handleExpire])

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
