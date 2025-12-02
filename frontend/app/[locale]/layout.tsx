import '../globals.css'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import NavbarWrapper from '@/components/ui/NavbarWrapper'
import MainContentWrapper from '@/components/ui/MainContentWrapper'
import ThemeProvider from '@/components/ui/ThemeProvider'
import { CartSidebar, CartFloatingButton } from '@/components/order/CartWrapper'
import ModeBanner from '@/components/ModeBanner'
import type { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

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
      <body className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${inter.variable} font-sans`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            {/* Mode Banner - Dismissible info about local/server mode */}
            <ModeBanner />

            {/* Main Navbar - Hidden on dashboard (has its own header) */}
            <NavbarWrapper />

            {/* Main Content - Conditional layout based on route */}
            <MainContentWrapper cartSidebar={<CartSidebar />}>
              {children}
            </MainContentWrapper>

            {/* Floating Cart Button - Hidden on dashboard/login */}
            <CartFloatingButton />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
