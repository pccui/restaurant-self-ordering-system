'use client'
import React from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { useLocale } from 'next-intl'
import { useOrderStore } from '@/lib/store/orderStore'
import type { MenuItem } from '@restaurant/shared/src/schemas/menu'

export default function MenuDetail({ item }: { item: MenuItem & Record<string, unknown> }) {
  const locale = typeof useLocale === 'function' ? useLocale() : 'en';
  const translations = item.translations as Record<string, { name?: string; detailedDescription?: string }>;
  const t = translations[locale as keyof typeof translations] || translations.en || {};
  const add = useOrderStore((s) => s.addItem);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{t.name}</h1>
      {item.imageUrl && <img src={item.imageUrl} alt={t.name} className="w-full rounded-lg mb-4" />}
      <div className="prose mb-4">{t.detailedDescription}</div>
      <div className="mb-4 text-lg font-semibold">¥{(item.priceCents/100).toFixed(2)}</div>
      <div className="flex gap-2">
        <Button className="bg-primary-500 text-white" onClick={() => add({ id: item.id, name: t.name || '', priceCents: item.priceCents, qty: 1 })}>Add to basket</Button>
      </div>
    </div>
  )
}
