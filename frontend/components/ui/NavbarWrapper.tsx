'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

// Routes where main Navbar should NOT be displayed (they have their own header)
const EXCLUDED_ROUTES = ['/dashboard']

function shouldHideNavbar(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
  return EXCLUDED_ROUTES.some(route => pathWithoutLocale.startsWith(route))
}

export default function NavbarWrapper() {
  const pathname = usePathname()

  if (shouldHideNavbar(pathname)) {
    return null
  }

  return <Navbar />
}
