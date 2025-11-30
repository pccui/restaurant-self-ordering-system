export const metadata = {
  title: 'Restaurant Self-Ordering System',
  description: 'Multilingual restaurant ordering system'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
