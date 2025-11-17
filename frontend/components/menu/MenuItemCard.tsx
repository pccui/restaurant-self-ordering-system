'use client'
import React from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useLocale } from 'next-intl'
import { useOrderStore } from '@/lib/store/orderStore'
import type { MenuItem } from '@restaurant/shared/src/schemas/menu'

interface Taste {
  [key: string]: string;
}

export default function MenuItemCard({ item }: { item: MenuItem & { tastes?: Taste[] } }) {
  const locale = typeof useLocale === 'function' ? useLocale() : 'en';
  const translations = item.translations as Record<string, { name?: string; shortDescription?: string }>;
  const t = translations[locale as keyof typeof translations] || translations.en || { name: '', shortDescription: '' };
  const add = useOrderStore((s) => s.addItem);
  return (
    <Card className="flex flex-col h-full">
      {item.thumbnailUrl && <div className="h-44 bg-gray-100 overflow-hidden"><img src={item.thumbnailUrl} alt={t.name} className="w-full h-full object-cover" /></div>}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold">{t.name}</h3>
            <div className="text-sm font-medium">¥{(item.priceCents/100).toFixed(2)}</div>
          </div>
          {t.shortDescription && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{t.shortDescription}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {(item.tastes || []).slice(0,3).map((tt: Taste, idx: number) => <Badge key={idx}>{tt[locale] || tt.en}</Badge>)}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Button className="bg-primary-500 text-white" onClick={() => add({ id: item.id, name: t.name || '', priceCents: item.priceCents, qty: 1 })}>Add</Button>
          <a href={`/menu/${item.id}`} className="text-sm text-slate-600">Details</a>
        </div>
      </div>
    </Card>
  )
}
