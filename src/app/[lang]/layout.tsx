import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { i18n, type Locale } from '@/i18n-config'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hermes-Zenith | Premium Industrial Solutions',
  description:
    'Hermes-Zenith provides state-of-the-art industrial products, focusing on process rotating equipment. We aim to increase productivity, reduce maintenance costs, and extend equipment lifespans.',
  icons: {
    icon: '/logo.svg',
  },
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  const resolvingLang = resolvedParams.lang as Locale
  
  return (
    <html lang={resolvedParams.lang} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Navbar lang={resolvingLang} />
        <main className="min-h-screen bg-gray-50">{children}</main>
        <Footer lang={resolvingLang} />
      </body>
    </html>
  )
}
