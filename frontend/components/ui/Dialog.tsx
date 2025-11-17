'use client'
import React from 'react'

export default function Dialog({ open, onClose, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-4">
        <div className="flex justify-end"><button onClick={onClose} className="text-sm">Close</button></div>
        {children}
      </div>
    </div>
  )
}
