'use client'
import React from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useOrderStore } from '@/lib/store/orderStore'
import { getTasteBadgeClasses, getTasteIcon } from '@/lib/utils/tasteColors'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { MenuItem } from '@restaurant/shared/src/schemas/menu'

interface Taste {
  [key: string]: string;
}

interface MenuItemCardProps {
  item: MenuItem & { tastes?: Taste[] }
  onOpenDetail?: (item: MenuItem & { tastes?: Taste[] }) => void
  /** Whether user can add items to cart (has table ID) */
  canOrder?: boolean
}

function MenuItemCard({ item, onOpenDetail, canOrder = true }: MenuItemCardProps) {
  const locale = useLocale();
  const translations = item.translations as Record<string, { name?: string; shortDescription?: string }>;
  const t = translations[locale as keyof typeof translations] || translations.en || { name: '', shortDescription: '' };
  const add = useOrderStore((s) => s.addItem);

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(item)
    }
  }

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    add({
      id: item.id,
      name: t.name || '',
      priceCents: item.priceCents,
      qty: 1
    })
  }

  return (
    <article
      className="flex gap-4 p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      aria-label={`View details for ${t.name}`}
    >
      {/* Square Thumbnail - 100x100px */}
      {item.thumbnailUrl && (
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={item.thumbnailUrl}
            alt={t.name || 'Menu item'}
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            fill
            sizes="112px"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          {/* Name */}
          <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-1">
            {t.name}
          </h3>

          {/* Short Description */}
          {t.shortDescription && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-snug">
              {t.shortDescription}
            </p>
          )}

          {/* Taste Badges - Compact */}
          <div className="mt-2 flex flex-wrap gap-1">
            {(item.tastes || []).slice(0, 2).map((taste: Taste, idx: number) => {
              const tasteText = taste[locale] || taste.en || ''
              const icon = getTasteIcon(tasteText)
              return (
                <span
                  key={idx}
                  className={getTasteBadgeClasses(tasteText) + ' text-xs py-0.5 px-1.5'}
                  aria-label={tasteText}
                >
                  <span aria-hidden="true">{icon}</span>
                  <span>{tasteText}</span>
                </span>
              )
            })}
          </div>
        </div>

        {/* Price */}
        <div className="text-base font-bold text-gray-900 mt-2">
          {formatPrice(item.priceCents)}
        </div>
      </div>

      {/* Add Button - Right side (only shown when ordering is enabled) */}
      {canOrder && (
        <div className="flex items-center">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white transition-colors shadow-sm"
            onClick={handleAddClick}
            aria-label={`Add ${t.name} to cart`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}
    </article>
  )
}

export default React.memo(MenuItemCard)
