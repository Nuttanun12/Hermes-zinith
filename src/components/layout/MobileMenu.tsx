'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { i18n, type Locale } from '@/i18n-config'
import { flags } from './Flags'

interface MobileMenuProps {
  dict: any
  lang: Locale
}

export default function MobileMenu({ dict, lang }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleLanguageChange = (newLocale: Locale) => {
    if (!pathname) return
    const segments = pathname.split('/')
    const hasLocale = i18n.locales.some((loc) => pathname.startsWith(`/${loc}`))

    if (hasLocale) {
      segments[1] = newLocale
      router.push(segments.join('/'))
    } else {
      router.push(`/${newLocale}${pathname}`)
    }
    setIsOpen(false)
  }

  const menuItems = [
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/products`, label: dict.nav.products },
    { href: `/${lang}/services`, label: dict.nav.services },
    { href: `/${lang}/contact`, label: dict.nav.contact, primary: true },
  ]

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-foreground hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        aria-label="Open Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100"
            />

            {/* Menu drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-70 bg-white z-101 shadow-2xl flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b">
                <Link href={`/${lang}`} onClick={() => setIsOpen(false)} className="flex items-center gap-x-2">
                    <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
                    <span className="font-black text-lg tracking-tighter uppercase text-foreground">Hermes-Zenith</span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close Menu"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-8 px-6 flex flex-col">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-bold tracking-widest uppercase py-4 border-b border-gray-100 flex items-center justify-between transition-colors ${
                       item.primary ? 'text-primary' : 'text-foreground hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="p-6 border-t bg-gray-50 flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Select Language</span>
                <div className="flex items-center gap-2">
                    {i18n.locales.map((locale) => (
                        <button
                            key={locale}
                            onClick={() => handleLanguageChange(locale)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-300 active:scale-95 ${
                                lang === locale 
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                : 'bg-white border-gray-200 text-gray-500 hover:border-primary/30 cursor-pointer'
                            }`}
                        >
                            <span className="shrink-0">{flags[locale]}</span>
                            <span className="uppercase text-[10px] font-black tracking-widest">{locale}</span>
                        </button>
                    ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
