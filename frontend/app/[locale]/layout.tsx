import '../globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import ThemeProvider from '@/components/ui/ThemeProvider'
import OrderPanel from '@/components/order/OrderPanel'
import FloatingCartButton from '@/components/order/FloatingCartButton'
import ModeBanner from '@/components/ModeBanner'
import type { ReactNode } from 'react'

const locales = ['en', 'zh', 'de'];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: ReactNode, params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  // Get messages from next-intl
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className='min-h-screen bg-gray-50'>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            {/* Mode Banner - Dismissible info about local/server mode */}
            <ModeBanner />
            <Navbar />
            <div className="container flex gap-6">
              {/* Main Content Area */}
              <main className="flex-1 min-w-0 py-4">{children}</main>

              {/* Persistent Cart Sidebar - Hidden on mobile */}
              <aside className="hidden md:block w-80 flex-shrink-0 py-4">
                <div className="sticky top-20">
                  <OrderPanel />
                </div>
              </aside>
            </div>

            {/* Floating Cart Button - Visible on mobile only */}
            <FloatingCartButton />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
