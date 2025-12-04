'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Globe } from 'lucide-react'
import Select from '@/components/ui/Select'

const LANGUAGES = ['en', 'zh', 'de'] as const

export default function LanguageToggle({ locale }: { locale: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('language')
  const [currentLocale, setCurrentLocale] = useState(locale)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Normalize locale (handle zh-CN → zh)
  const normalizedLocale = currentLocale.startsWith('zh') ? 'zh' : currentLocale

  useEffect(() => {
    setCurrentLocale(locale)
  }, [locale])

  const switchTo = (newLocale: string) => {
    if (newLocale === normalizedLocale || isTransitioning) return

    setIsTransitioning(true)

    // Extract path segments and replace locale
    const segments = pathname.split('/').filter(Boolean)
    const supportedLocales = ['en', 'zh', 'zh-CN', 'de']

    if (supportedLocales.includes(segments[0])) {
      segments[0] = newLocale
    } else {
      segments.unshift(newLocale)
    }

    const newPath = '/' + segments.join('/')
    router.push(newPath)

    // Reset transition state after navigation
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const options = LANGUAGES.map((code) => ({
    value: code,
    label: t(code),
    icon: <Globe className="w-4 h-4 text-gray-500" />,
  }))

  return (
    <Select
      value={normalizedLocale}
      onChange={switchTo}
      options={options}
      disabled={isTransitioning}
      aria-label={t('select')}
    />
  )
}
