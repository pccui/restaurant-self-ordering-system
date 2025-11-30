'use client'

import { usePathname } from 'next/navigation'
import OrderPanel from './OrderPanel'
import FloatingCartButton from './FloatingCartButton'

// Routes where cart should NOT be displayed
const EXCLUDED_ROUTES = ['/dashboard', '/login']

function shouldHideCart(pathname: string): boolean {
  // Check if current path starts with any excluded route
  // Account for locale prefix: /en/dashboard, /zh/login, etc.
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
  return EXCLUDED_ROUTES.some(route => pathWithoutLocale.startsWith(route))
}

export function CartSidebar() {
  const pathname = usePathname()

  if (shouldHideCart(pathname)) {
    return null
  }

  return (
    <aside className="hidden md:block w-80 flex-shrink-0 py-4">
      <div className="sticky top-20">
        <OrderPanel />
      </div>
    </aside>
  )
}

export function CartFloatingButton() {
  const pathname = usePathname()

  if (shouldHideCart(pathname)) {
    return null
  }

  return <FloatingCartButton />
}
