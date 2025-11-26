'use client'
import React from 'react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'

interface CategoryNavProps {
  activeCategory: string
  onCategoryClick: (category: string) => void
}

const categories = [
  { id: 'all', labelKey: 'all' },
  { id: 'sichuan', labelKey: 'sichuan' },
  { id: 'xian', labelKey: 'xian' },
]

export default function CategoryNav({ activeCategory, onCategoryClick }: CategoryNavProps) {
  const t = useTranslations('filter')

  const handleClick = (categoryId: string) => {
    onCategoryClick(categoryId)

    // Scroll to section if not 'all'
    if (categoryId !== 'all') {
      const section = document.getElementById(`${categoryId}-section`)
      if (section) {
        const navHeight = 120 // Approximate navbar + category nav height
        const sectionTop = section.getBoundingClientRect().top + window.scrollY - navHeight
        window.scrollTo({ top: sectionTop, behavior: 'smooth' })
      }
    } else {
      // Scroll to top for 'all'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <nav
      className="sticky top-14 z-30 bg-white border-b border-gray-100 -mx-4 px-4 md:-mx-0 md:px-0"
      aria-label="Menu categories"
    >
      <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleClick(cat.id)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              activeCategory === cat.id
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
            aria-pressed={activeCategory === cat.id}
          >
            {t(cat.labelKey)}
          </button>
        ))}
      </div>
    </nav>
  )
}
