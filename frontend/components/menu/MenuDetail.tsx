'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useOrderStore } from '@/lib/store/orderStore'
import { getTasteBadgeClasses, getTasteIcon } from '@/lib/utils/tasteColors'
import { formatPrice } from '@/lib/utils/formatPrice'
import Button from '@/components/ui/Button'
import type { MenuItem } from '@restaurant/shared/src/schemas/menu'

interface Taste {
  [key: string]: string
}

interface Ingredient {
  [key: string]: string
}

/**
 * Detect if a URL is a YouTube video
 */
function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

export default function MenuDetail({ item }: { item: MenuItem & Record<string, unknown> }) {
  const locale = useLocale()
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

  const add = useOrderStore((s) => s.addItem)
  const [quantity, setQuantity] = React.useState(1)

  const handleAddToCart = () => {
    add({
      id: item.id,
      name: t.name || '',
      priceCents: item.priceCents,
      qty: quantity
    })
    setQuantity(1) // Reset quantity after adding
  }

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 px-4">
      {/* Back Navigation */}
      <Link
        href={`/${locale}/menu`}
        className="inline-flex items-center text-primary-600 hover:text-primary-700 active:text-primary-800 mb-4 sm:mb-6 text-sm font-medium transition-colors min-h-[44px]"
      >
        ← Back to Menu
      </Link>

      {/* Hero Image */}
      {item.imageUrl && (
        <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-6">
          <Image
            src={item.imageUrl}
            alt={t.name || 'Menu item'}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      )}

      {/* Video Embed */}
      {item.videoUrl && typeof item.videoUrl === 'string' && item.videoUrl.trim() && (
        <div className="mb-6">
          {isYouTubeUrl(item.videoUrl) ? (
            <iframe
              src={item.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
              className="w-full aspect-video rounded-lg"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${t.name} video`}
            />
          ) : (
            <video
              src={item.videoUrl}
              controls
              preload="metadata"
              className="w-full aspect-video rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      {/* Name and Price */}
      <div className="flex justify-between items-start mb-4 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t.name}
        </h1>
        <div className="text-xl sm:text-2xl font-bold text-primary-600 whitespace-nowrap">
          {formatPrice(item.priceCents)}
        </div>
      </div>

      {/* Detailed Description */}
      {t.detailedDescription && (
        <div className="prose prose-sm max-w-none mb-6">
          <p className="text-gray-700 leading-relaxed">
            {t.detailedDescription}
          </p>
        </div>
      )}

      {/* Taste Characteristics */}
      {item.tastes && Array.isArray(item.tastes) && item.tastes.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
            Taste Characteristics
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {item.tastes.map((taste: Taste, idx: number) => {
              const tasteText = taste[locale] || taste.en || ''
              const icon = getTasteIcon(tasteText)
              return (
                <span
                  key={idx}
                  className={getTasteBadgeClasses(tasteText) + ' text-sm'}
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
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
            Ingredients
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {item.ingredients.map((ingredient: Ingredient, idx: number) => (
              <li
                key={idx}
                className="flex items-center text-sm text-gray-700 bg-gray-50 rounded px-3 py-2"
              >
                <span className="mr-2">•</span>
                {ingredient[locale] || ingredient.en}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add to Cart Section */}
      <div className="border-t pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 sm:px-3 sm:py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-lg sm:text-base"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                id="quantity"
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                className="w-16 sm:w-16 text-center border-x py-3 sm:py-2 focus:outline-none text-base"
                aria-label="Quantity"
              />
              <button
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                className="px-4 py-3 sm:px-3 sm:py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-lg sm:text-base"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="flex-1 sm:flex-initial bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-6 sm:px-8 py-3.5 sm:py-3 text-base font-medium transition-colors min-h-[52px] sm:min-h-0"
          >
            Add to Cart · {formatPrice(item.priceCents * quantity)}
          </Button>
        </div>
      </div>
    </div>
  )
}
