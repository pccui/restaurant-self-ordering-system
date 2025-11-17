'use client'
import Link from 'next/link'
import ModeToggle from '@/components/ModeToggle'
import LanguageToggle from '@/components/LanguageToggle'
import ThemeToggle from './ThemeToggle'
import { useState } from 'react'
import Drawer from './Drawer'
import OrderPanel from '@/components/order/OrderPanel'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-lg">Restaurant</Link>
          <nav className="hidden sm:flex gap-3">
            <Link href="/en/menu" className="text-sm">Menu</Link>
            <Link href="/en/demo-mode" className="text-sm">Demo Mode</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle locale="en" />
          <ThemeToggle />
          <ModeToggle />
          <button onClick={() => setOpen(true)} className="px-3 py-1 bg-primary-500 text-white rounded-md">Basket</button>
        </div>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <OrderPanel />
      </Drawer>
    </header>
  )
}
