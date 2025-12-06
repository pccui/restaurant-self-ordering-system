'use client'
import { useState, useEffect, useRef } from 'react'
import { useOrderStore } from '@/lib/store/orderStore'
import Drawer from '@/components/ui/Drawer'
import OrderPanel from '@/components/order/OrderPanel'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function FloatingCartButton() {
  const [open, setOpen] = useState(false)
  const activeOrder = useOrderStore((s) => s.activeOrder)
  const totalCents = useOrderStore((s) => s.totalCents)()

  const items = activeOrder?.items || []
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)

  // Visibility state for the floating button
  const [isVisible, setIsVisible] = useState(false)

  // Track previous item count to detect additions
  const prevItemCountRef = useRef(itemCount)
  // Timer reference to clear timeouts
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // If item count increased, show the button
    if (itemCount > prevItemCountRef.current) {
      setIsVisible(true)

      // Clear existing timer if any
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      // Set new timer to hide after 5 seconds
      timerRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 5000)
    }

    // Update previous count
    prevItemCountRef.current = itemCount

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [itemCount])

  // Also show button if drawer is open (optional, but good UX to key off interaction)
  // However, requirement says "hide after like 5 seconds", implies transient feedback.
  // We'll stick to the "item added" trigger as primarily requested.
  // But we need to ensure we don't return null for the Drawer if hidden,
  // so we separate the button rendering from the component return.

  return (
    <>
      {/* Floating Button - Only visible on mobile (< md breakpoint) AND when isVisible is true */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-4 right-4 md:hidden z-40 flex items-center gap-3 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white px-5 py-3 rounded-full shadow-lg transition-all transform duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
          }`}
        aria-label={`View cart with ${itemCount} items`}
        aria-hidden={!isVisible}
      >
        {/* Cart Icon */}
        <div className="relative">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {/* Item Count Badge */}
          <span className="absolute -top-2 -right-2 bg-white text-primary-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        </div>

        {/* Total Amount */}
        <span className="font-semibold">
          {formatPrice(totalCents)}
        </span>
      </button>

      {/* Cart Drawer */}
      <Drawer open={open} onClose={() => setOpen(false)}>
        <OrderPanel />
      </Drawer>
    </>
  )
}
