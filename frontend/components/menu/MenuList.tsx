'use client'
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import MenuItemCard from './MenuItemCard'
import MenuSearch from './MenuSearch'
import MenuFilter from './MenuFilter'
import CategoryNav from './CategoryNav'
import MenuDetailModal from './MenuDetailModal'
import { MenuCardSkeletonGrid } from './MenuCardSkeleton'
import { useMenuStore } from '@/lib/store/menuStore'
import { useRouteMode } from '@/lib/hooks/useRouteMode'
import { localizeMenu } from '@/lib/api/menu'
import type { MenuItem } from '@restaurant/shared/src/schemas/menu'

interface LocalizedMenuItem extends MenuItem {
  localizedName: string
  localizedShort: string
  localizedDetailed: string
  tastesLocalized: string[]
  ingredientsLocalized: string[]
}

interface Taste {
  [key: string]: string
}

export default function MenuList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const menu = useMenuStore((s) => s.menu || [])
  const loadMenu = useMenuStore((s) => s.loadMenu)
  const { mode, canOrder } = useRouteMode()
  const locale = useLocale()
  const t = useTranslations()

  const [localized, setLocalized] = useState<LocalizedMenuItem[]>([])
  const [loading, setLoading] = useState(true)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [selectedTastes, setSelectedTastes] = useState<string[]>(
    searchParams.get('tastes')?.split(',').filter(Boolean) || []
  )

  // Modal state for item detail
  const [selectedItem, setSelectedItem] = useState<(MenuItem & Record<string, unknown>) | null>(null)

  // Taste filter section collapsed by default
  const [tastesExpanded, setTastesExpanded] = useState(false)

  // Section refs for scroll-spy
  const sichuanRef = useRef<HTMLElement>(null)
  const xianRef = useRef<HTMLElement>(null)
  const [activeSection, setActiveSection] = useState<string>('all')

  useEffect(() => {
    setLoading(true)
    loadMenu(mode).finally(() => setLoading(false))
  }, [loadMenu, mode])

  useEffect(() => {
    setLocalized(localizeMenu(menu, locale) as LocalizedMenuItem[])
  }, [menu, locale])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (category !== 'all') params.set('category', category)
    if (selectedTastes.length > 0) params.set('tastes', selectedTastes.join(','))

    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : window.location.pathname
    router.replace(newUrl, { scroll: false })
  }, [searchQuery, category, selectedTastes, router])

  // IntersectionObserver for scroll-spy
  useEffect(() => {
    const sections = [
      { ref: sichuanRef, id: 'sichuan' },
      { ref: xianRef, id: 'xian' },
    ]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id.replace('-section', '')
            setActiveSection(sectionId)
          }
        })
      },
      {
        rootMargin: '-120px 0px -60% 0px',
        threshold: 0,
      }
    )

    sections.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => observer.disconnect()
  }, [loading])

  // Get all available tastes from menu items
  const availableTastes = useMemo(() => {
    const tastesSet = new Set<string>()
    localized.forEach((item) => {
      if (item.tastes && Array.isArray(item.tastes)) {
        item.tastes.forEach((taste: Taste) => {
          const tasteText = taste[locale] || taste.en
          if (tasteText) tastesSet.add(tasteText)
        })
      }
    })
    return Array.from(tastesSet).sort()
  }, [localized, locale])

  // Filter menu items
  const filteredMenu = useMemo(() => {
    let filtered = [...localized]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) => {
        const translations = item.translations as Record<string, {
          name?: string
          shortDescription?: string
          detailedDescription?: string
        }>

        // Search across all language fields
        return Object.values(translations).some((t) =>
          t.name?.toLowerCase().includes(query) ||
          t.shortDescription?.toLowerCase().includes(query) ||
          t.detailedDescription?.toLowerCase().includes(query)
        )
      })
    }

    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter((item) => item.category === category)
    }

    // Apply taste filters (HIDE items with hidden tastes)
    if (selectedTastes.length > 0) {
      filtered = filtered.filter((item) => {
        if (!item.tastes || !Array.isArray(item.tastes)) return true

        const itemTastes = item.tastes.map((taste: Taste) =>
          taste[locale] || taste.en
        )

        // Hide items that have ANY of the hidden tastes
        const hasHiddenTaste = selectedTastes.some((hiddenTaste) =>
          itemTastes.some((itemTaste) =>
            itemTaste.toLowerCase().includes(hiddenTaste.toLowerCase()) ||
            hiddenTaste.toLowerCase().includes(itemTaste.toLowerCase())
          )
        )
        return !hasHiddenTaste
      })
    }

    return filtered
  }, [localized, searchQuery, category, selectedTastes, locale])

  // Memoized callbacks to prevent child re-renders (must be before any early returns)
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
  }, [])

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value)
  }, [])

  const handleTastesChange = useCallback((value: string[]) => {
    setSelectedTastes(value)
  }, [])

  const handleOpenDetail = useCallback((item: MenuItem & Record<string, unknown>) => {
    setSelectedItem(item)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedItem(null)
  }, [])

  const sichuan = filteredMenu.filter((m) => m.category === 'sichuan')
  const xian = filteredMenu.filter((m) => m.category === 'xian')

  if (loading) {
    return (
      <div className="py-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-full" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Sichuan (川菜)</h2>
          <MenuCardSkeletonGrid count={5} />
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Xi'an (西安菜)</h2>
          <MenuCardSkeletonGrid count={5} />
        </section>
      </div>
    )
  }

  const hasActiveFilters = searchQuery || category !== 'all' || selectedTastes.length > 0
  const showCategoryHeaders = category === 'all' && !searchQuery

  return (
    <div className="space-y-0">
      {/* Category Navigation - Sticky */}
      <CategoryNav
        activeCategory={hasActiveFilters ? category : activeSection}
        onCategoryClick={handleCategoryChange}
      />

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mt-4 space-y-4">
        {/* Search Bar */}
        <MenuSearch
          value={searchQuery}
          onChange={handleSearchChange}
          resultCount={hasActiveFilters ? filteredMenu.length : undefined}
        />

        {/* Taste Filters - Collapsible */}
        {availableTastes.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setTastesExpanded(!tastesExpanded)}
              className="flex items-center justify-between w-full py-2 text-left group"
              aria-expanded={tastesExpanded}
            >
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {t('filter.tasteCharacteristics')}
                </span>
                {selectedTastes.length > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    {selectedTastes.length} {t('filter.hidden')}
                  </span>
                )}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                <span>{tastesExpanded ? t('filter.collapse') : t('filter.expand')}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${tastesExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {tastesExpanded && (
              <div className="flex flex-wrap gap-2">
                {availableTastes.map((taste) => {
                  const isHidden = selectedTastes.includes(taste)
                  return (
                    <button
                      key={taste}
                      onClick={() => {
                        if (isHidden) {
                          handleTastesChange(selectedTastes.filter((t) => t !== taste))
                        } else {
                          handleTastesChange([...selectedTastes, taste])
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        isHidden
                          ? 'bg-gray-200 text-gray-400 line-through ring-2 ring-red-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {taste}
                      {isHidden && <span className="ml-1">✕</span>}
                    </button>
                  )
                })}
                {selectedTastes.length > 0 && (
                  <button
                    onClick={() => handleTastesChange([])}
                    className="px-3 py-1.5 rounded-full text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {t('filter.reset')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      {hasActiveFilters && filteredMenu.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('results.noMatches')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('results.tryAdjusting')}
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setCategory('all')
              setSelectedTastes([])
            }}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {t('filter.clearAll')}
          </button>
        </div>
      ) : showCategoryHeaders ? (
        // Show by category with section refs for scroll-spy
        <div className="space-y-8 mt-6">
          {sichuan.length > 0 && (
            <section id="sichuan-section" ref={sichuanRef}>
              <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-3">
                <span>Sichuan</span>
                <span className="text-base font-normal text-gray-400">川菜</span>
                <span className="text-sm font-normal text-gray-500">
                  {sichuan.length} {sichuan.length === 1 ? 'dish' : 'dishes'}
                </span>
              </h2>
              <div className="space-y-3">
                {sichuan.map((it: LocalizedMenuItem) => (
                  <MenuItemCard
                    key={it.id}
                    item={it as MenuItem}
                    onOpenDetail={handleOpenDetail}
                    canOrder={canOrder}
                  />
                ))}
              </div>
            </section>
          )}

          {xian.length > 0 && (
            <section id="xian-section" ref={xianRef}>
              <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-3">
                <span>Xi'an</span>
                <span className="text-base font-normal text-gray-400">西安菜</span>
                <span className="text-sm font-normal text-gray-500">
                  {xian.length} {xian.length === 1 ? 'dish' : 'dishes'}
                </span>
              </h2>
              <div className="space-y-3">
                {xian.map((it: LocalizedMenuItem) => (
                  <MenuItemCard
                    key={it.id}
                    item={it as MenuItem}
                    onOpenDetail={handleOpenDetail}
                    canOrder={canOrder}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        // Show all filtered results without category separation
        <section className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {t('results.searchResults')}
            <span className="ml-3 text-sm font-normal text-gray-500">
              {t('search.resultCount', { count: filteredMenu.length })}
            </span>
          </h2>
          <div className="space-y-3">
            {filteredMenu.map((it: LocalizedMenuItem) => (
              <MenuItemCard
                key={it.id}
                item={it as MenuItem}
                onOpenDetail={handleOpenDetail}
                canOrder={canOrder}
              />
            ))}
          </div>
        </section>
      )}

      {/* Item Detail Modal */}
      <MenuDetailModal item={selectedItem} onClose={handleCloseDetail} canOrder={canOrder} />
    </div>
  )
}
