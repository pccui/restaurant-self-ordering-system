import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import ThemeProvider from '@/components/ui/ThemeProvider'
import type { ReactNode } from 'react'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh-CN' }, { locale: 'de' }];
}

export default async function LocaleLayout({ children, params }: { children: ReactNode, params: { locale: string } }) {
  const locale = params.locale;
  let messages;
  try {
    messages = (await import(`../../messages/${locale === 'zh-CN' ? 'zh' : locale}.json`)).default;
  } catch (e) {
    // fallback to English
    try { messages = (await import('../../messages/en.json')).default; } catch { messages = {}; }
  }
  if (!messages) return notFound();
  return (
    <html lang={locale}>
      <body className='min-h-screen bg-gray-50'>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <Navbar />
            <main className="container">{children}</main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
