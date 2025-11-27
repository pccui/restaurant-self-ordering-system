'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import Dialog from '@/components/ui/Dialog'
import { useOrderStore } from '@/lib/store/orderStore'
import { getTasteBadgeClasses, getTasteIcon } from '@/lib/utils/tasteColors'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { MenuItem } from '@restaurant/shared/src/schemas/menu'

interface Taste {
  [key: string]: string
}

interface Ingredient {
  [key: string]: string
}

interface MenuDetailModalProps {
  item: (MenuItem & Record<string, unknown>) | null
  onClose: () => void
}

export default function MenuDetailModal({ item, onClose }: MenuDetailModalProps) {
  const locale = useLocale()
  const add = useOrderStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)

  if (!item) return null

  const translations = item.translations as Record<string, {
    name?: string
    shortDescription?: string
    detailedDescription?: string
  }>
  const t = translations[locale] || translations.en || {
    name: '',
    shortDescription: '',
    detailedDescription: ''
  }

  const handleAddToCart = () => {
    add({
      id: item.id,
      name: t.name || '',
      priceCents: item.priceCents,
      qty: quantity
    })
    setQuantity(1)
    onClose()
  }

  return (
    <Dialog open={!!item} onClose={onClose} size="xl" title={t.name}>
      <div className="p-4 sm:p-6 space-y-4">
        {/* Hero Image */}
        {item.imageUrl && (
          <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={item.imageUrl as string}
              alt={t.name || 'Menu item'}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        )}

        {/* Price */}
        <div className="text-xl font-bold text-primary-600">
          {formatPrice(item.priceCents)}
        </div>

        {/* Detailed Description */}
        {t.detailedDescription && (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {t.detailedDescription}
            </p>
          </div>
        )}

        {/* Taste Characteristics */}
        {item.tastes && Array.isArray(item.tastes) && item.tastes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Taste Characteristics
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.tastes.map((taste: Taste, idx: number) => {
                const tasteText = taste[locale] || taste.en || ''
                const icon = getTasteIcon(tasteText)
                return (
                  <span
                    key={idx}
                    className={getTasteBadgeClasses(tasteText)}
                    aria-label={tasteText}
                  >
                    <span aria-hidden="true">{icon}</span>
                    <span>{tasteText}</span>
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Ingredients */}
        {item.ingredients && Array.isArray(item.ingredients) && item.ingredients.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Ingredients
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {item.ingredients.map((ingredient: Ingredient, idx: number) => (
                <li
                  key={idx}
                  className="flex items-center text-sm text-gray-700 bg-gray-50 rounded px-3 py-2"
                >
                  <span className="mr-2 text-gray-400">•</span>
                  {ingredient[locale] || ingredient.en}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sticky Bottom Add to Cart Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-200 rounded-full">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-full transition-colors text-lg"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(99, quantity + 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-full transition-colors text-lg"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white py-3 px-6 rounded-full font-medium transition-colors text-base"
          >
            Add to Cart · {formatPrice(item.priceCents * quantity)}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
