'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { getTasteBadgeClasses, getTasteIcon } from '@/lib/utils/tasteColors'

interface MenuFilterProps {
  category: string
  onCategoryChange: (category: string) => void
  selectedTastes: string[]
  onTastesChange: (tastes: string[]) => void
  availableTastes: string[]
  locale: string
}

const CATEGORIES = [
  { value: 'all', key: 'filter.all', emoji: '🍽️' },
  { value: 'sichuan', key: 'filter.sichuan', emoji: '🌶️' },
  { value: 'xian', key: 'filter.xian', emoji: '🍜' },
] as const

/**
 * Filter controls for menu (category and taste filters)
 */
function MenuFilter({
  category,
  onCategoryChange,
  selectedTastes,
  onTastesChange,
  availableTastes,
  locale,
}: MenuFilterProps) {
  const t = useTranslations()
  const toggleTaste = (taste: string) => {
    if (selectedTastes.includes(taste)) {
      onTastesChange(selectedTastes.filter((t) => t !== taste))
    } else {
      onTastesChange([...selectedTastes, taste])
    }
  }

  const clearAllFilters = () => {
    onCategoryChange('all')
    onTastesChange([])
  }

  const hasActiveFilters = category !== 'all' || selectedTastes.length > 0
  const activeFilterCount = (category !== 'all' ? 1 : 0) + selectedTastes.length

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">{t('filter.category')}</h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              {t('filter.clearAll')}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`
                  inline-flex items-center gap-1.5 sm:gap-2
                  px-4 sm:px-5 py-2.5 sm:py-2
                  rounded-lg text-sm sm:text-base font-medium
                  transition-all duration-200
                  min-h-[44px] sm:min-h-0
                  active:scale-95
                  ${isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                  }
                `}
                aria-label={`${t('filter.category')}: ${t(cat.key)}`}
                aria-pressed={isActive}
              >
                <span aria-hidden="true">{cat.emoji}</span>
                <span>{t(cat.key)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Taste Filter */}
      {availableTastes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              {t('filter.tasteCharacteristics')}
            </h3>
            {selectedTastes.length > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                {selectedTastes.length} {t('filter.selected')}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {availableTastes.map((taste) => {
              const isSelected = selectedTastes.includes(taste)
              const icon = getTasteIcon(taste)

              return (
                <button
                  key={taste}
                  onClick={() => toggleTaste(taste)}
                  className={`
                    ${getTasteBadgeClasses(taste)}
                    cursor-pointer transition-all duration-200
                    min-h-[44px] sm:min-h-0
                    px-3 sm:px-2.5 py-2 sm:py-1.5
                    text-sm sm:text-xs
                    active:scale-95
                    ${isSelected
                      ? 'ring-2 ring-primary-500 ring-offset-1 scale-105'
                      : 'opacity-70 hover:opacity-100 active:opacity-90'
                    }
                  `}
                  aria-label={`${isSelected ? 'Remove' : 'Add'} ${taste} filter`}
                  aria-pressed={isSelected}
                  role="checkbox"
                  aria-checked={isSelected}
                >
                  <span aria-hidden="true">{icon}</span>
                  <span>{taste}</span>
                  {isSelected && (
                    <span aria-hidden="true" className="ml-1">✓</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Active Filter Summary */}
      {hasActiveFilters && (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {t('filter.active', { count: activeFilterCount })}
            </span>
            <button
              onClick={clearAllFilters}
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              {t('filter.reset')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(MenuFilter)
