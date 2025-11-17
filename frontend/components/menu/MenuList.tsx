'use client'
import React, { useEffect, useState } from 'react'
import MenuItemCard from './MenuItemCard'
import { useMenuStore } from '@/lib/store/menuStore'
import { useLocale } from 'next-intl'
import { localizeMenu } from '@/lib/api/menu'
import type { MenuItem } from '@restaurant/shared/src/schemas/menu'

interface LocalizedMenuItem extends MenuItem {
  localizedName: string;
  localizedShort: string;
  localizedDetailed: string;
  tastesLocalized: string[];
  ingredientsLocalized: string[];
}

export default function MenuList() {
  const menu = useMenuStore((s) => s.menu || [])
  const loadMenu = useMenuStore((s) => s.loadMenu)
  const locale = typeof useLocale === 'function' ? useLocale() : 'en';
  const [localized, setLocalized] = useState<LocalizedMenuItem[]>([]);

  useEffect(() => { loadMenu() }, [loadMenu])
  useEffect(() => {
    setLocalized(localizeMenu(menu, locale) as LocalizedMenuItem[])
  }, [menu, locale])

  const sichuan = localized.filter((m: LocalizedMenuItem) => m.category === 'sichuan')
  const xian = localized.filter((m: LocalizedMenuItem) => m.category === 'xian')

  return (
    <div className="py-6">
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sichuan (川菜)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sichuan.map((it: LocalizedMenuItem) => <MenuItemCard key={it.id} item={it as MenuItem} />)}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Xi'an (西安菜)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {xian.map((it: LocalizedMenuItem) => <MenuItemCard key={it.id} item={it as MenuItem} />)}
        </div>
      </section>
    </div>
  )
}
