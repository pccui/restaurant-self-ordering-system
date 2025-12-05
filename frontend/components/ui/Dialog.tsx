'use client'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  title?: string
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-3xl',
  full: 'max-w-[95vw] md:max-w-4xl',
}

export default function Dialog({ open, onClose, children, size = 'xl', title }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<Element | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  // Focus trap and keyboard handling
  useEffect(() => {
    if (open) {
      // Store currently focused element
      previousActiveElement.current = document.activeElement

      // Add escape listener
      document.addEventListener('keydown', handleKeyDown)

      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      // Focus the dialog
      setTimeout(() => {
        dialogRef.current?.focus()
      }, 0)

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''

        // Restore focus
        if (previousActiveElement.current instanceof HTMLElement) {
          previousActiveElement.current.focus()
        }
      }
    }
  }, [open, handleKeyDown])

  if (!open || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Overlay with fade animation */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-200 ease-out"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog content with scale animation */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        tabIndex={-1}
        className={clsx(
          'relative w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl',
          'transform transition-all duration-200 ease-out',
          'animate-in fade-in-0 zoom-in-95',
          'max-h-[90vh] overflow-hidden flex flex-col',
          sizeClasses[size]
        )}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          {title && (
            <h2 id="dialog-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
