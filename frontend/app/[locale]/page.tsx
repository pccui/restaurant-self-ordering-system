import { redirect } from 'next/navigation'

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  // Redirect to menu page for the current locale
  redirect(`/${locale}/menu`)
}
