'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

// Routes where the main content wrapper (container) should NOT be applied
const FULL_WIDTH_ROUTES = ['/dashboard']

function isFullWidthRoute(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
  return FULL_WIDTH_ROUTES.some(route => pathWithoutLocale.startsWith(route))
}

interface MainContentWrapperProps {
  children: ReactNode
  cartSidebar: ReactNode
}

export default function MainContentWrapper({ children, cartSidebar }: MainContentWrapperProps) {
  const pathname = usePathname()

  // Dashboard has its own layout, render children directly
  if (isFullWidthRoute(pathname)) {
    return <>{children}</>
  }

  // Standard layout with container and cart sidebar
  return (
    <div className="container flex gap-6">
      <main className="flex-1 min-w-0 py-4">{children}</main>
      {cartSidebar}
    </div>
  )
}
