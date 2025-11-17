import './globals.css'
import Navbar from '@/components/ui/Navbar'

export const metadata = { title: 'Restaurant Demo' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container">{children}</main>
      </body>
    </html>
  )
}
