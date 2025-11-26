'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import clsx from 'clsx'

interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  'aria-label'?: string
}

export default function Select({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (isOpen && highlightedIndex >= 0) {
            onChange(options[highlightedIndex].value)
            setIsOpen(false)
          } else {
            setIsOpen(!isOpen)
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          } else {
            setHighlightedIndex((prev) =>
              prev < options.length - 1 ? prev + 1 : 0
            )
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          } else {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : options.length - 1
            )
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          break
        case 'Tab':
          setIsOpen(false)
          break
      }
    },
    [disabled, isOpen, highlightedIndex, options, onChange]
  )

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex, isOpen])

  // Reset highlighted index when opening
  useEffect(() => {
    if (isOpen) {
      const currentIndex = options.findIndex((opt) => opt.value === value)
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0)
    }
  }, [isOpen, options, value])

  return (
    <div ref={containerRef} className={clsx('relative inline-block', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={clsx(
          'flex items-center justify-between gap-2 px-3 py-2 min-w-[120px]',
          'bg-white border border-gray-200 rounded-lg text-sm font-medium',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-gray-300 hover:bg-gray-50 cursor-pointer',
          isOpen && 'border-primary-500 ring-2 ring-primary-500 ring-offset-1'
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span>{selectedOption?.label || placeholder}</span>
        </span>
        <svg
          className={clsx(
            'w-4 h-4 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-activedescendant={
            highlightedIndex >= 0 ? `select-option-${highlightedIndex}` : undefined
          }
          className={clsx(
            'absolute z-50 mt-1 w-full min-w-[160px]',
            'bg-white border border-gray-200 rounded-lg shadow-lg',
            'py-1 max-h-60 overflow-auto',
            'animate-in fade-in-0 zoom-in-95'
          )}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`select-option-${index}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={clsx(
                'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer',
                'transition-colors duration-100',
                option.value === value
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700',
                highlightedIndex === index && option.value !== value && 'bg-gray-100'
              )}
            >
              {option.icon}
              <span className="flex-1">{option.label}</span>
              {option.value === value && (
                <svg
                  className="w-4 h-4 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
