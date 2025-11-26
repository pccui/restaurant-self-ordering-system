'use client'
import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface MenuSearchProps {
  value: string
  onChange: (value: string) => void
  resultCount?: number
  placeholder?: string
}

/**
 * Search input with debounce for menu filtering
 * Searches across dish names and descriptions in all languages
 */
function MenuSearch({
  value,
  onChange,
  resultCount,
  placeholder
}: MenuSearchProps) {
  const t = useTranslations()
  const [localValue, setLocalValue] = useState(value)

  // Debounce the search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [localValue, onChange])

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className="relative">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder || t('search.placeholder')}
          className="
            w-full pl-10 pr-10 py-3 sm:py-2.5
            border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            transition-colors
            text-base sm:text-sm
          "
          aria-label={t('search.placeholder')}
        />

        {/* Clear Button */}
        {localValue && (
          <button
            onClick={handleClear}
            className="
              absolute inset-y-0 right-0 pr-2 sm:pr-3
              flex items-center
              text-gray-400 hover:text-gray-600 active:text-gray-800
              transition-colors
              min-w-[44px] justify-center
            "
            aria-label="Clear search"
          >
            <svg
              className="h-5 w-5 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Result Count */}
      {resultCount !== undefined && localValue && (
        <div className="mt-2 text-sm text-gray-600">
          {resultCount === 0 ? (
            <span>{t('search.noResults')}</span>
          ) : (
            <span>
              {t('search.resultCount', { count: resultCount })}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default React.memo(MenuSearch)
