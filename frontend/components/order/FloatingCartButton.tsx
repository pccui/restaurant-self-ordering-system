'use client'
import { useState } from 'react'
import { useOrderStore } from '@/lib/store/orderStore'
import Drawer from '@/components/ui/Drawer'
import OrderPanel from '@/components/order/OrderPanel'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function FloatingCartButton() {
  const [open, setOpen] = useState(false)
  const items = useOrderStore((s) => s.items)
  const totalCents = useOrderStore((s) => s.totalCents)()

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)

  // Don't show if cart is empty
  if (itemCount === 0) return null

  return (
    <>
      {/* Floating Button - Only visible on mobile (< md breakpoint) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 md:hidden z-40 flex items-center gap-3 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white px-5 py-3 rounded-full shadow-lg transition-all"
        aria-label={`View cart with ${itemCount} items`}
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
