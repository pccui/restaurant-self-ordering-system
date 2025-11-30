import { redirect } from 'next/navigation'

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  // Redirect to menu page with default table (for demo purposes)
  // In production, users would scan QR code with specific tableId
  redirect(`/${locale}/t001/menu`)
}
