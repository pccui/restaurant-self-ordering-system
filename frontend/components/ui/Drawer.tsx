'use client'
import React from 'react'

export default function Drawer({ open, onClose, children }: any) {
  return (
    <div className={open ? 'fixed inset-0 z-40' : 'hidden'}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <aside className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg p-4 overflow-auto">
        {children}
      </aside>
    </div>
  )
}
