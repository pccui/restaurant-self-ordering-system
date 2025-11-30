import { notFound } from 'next/navigation'
import { menuData } from '@/lib/data/menuData'
import MenuDetail from '@/components/menu/MenuDetail'

export default async function MenuItemPage({
  params
}: {
  params: Promise<{ locale: string; tableId: string; id: string }>
}) {
  const { id } = await params

  // Find the menu item by ID
  const item = menuData.find((menuItem) => menuItem.id === id)

  if (!item) {
    notFound()
  }

  return <MenuDetail item={item} />
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; tableId: string; id: string }>
}) {
  const { locale, id } = await params
  const item = menuData.find((menuItem) => menuItem.id === id)

  if (!item) {
    return {
      title: 'Menu Item Not Found',
    }
  }

  const translations = item.translations as Record<string, {
    name?: string
    shortDescription?: string
  }>
  const t = translations[locale] || translations.en || {}

  return {
    title: `${t.name} - Restaurant Menu`,
    description: t.shortDescription || t.name,
  }
}
