'use client'

import { usePathname, useRouter } from 'next/navigation'
import { i18n, type Locale } from '@/i18n-config'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { flags } from './Flags'

export default function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: Locale
}) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-foreground hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="shrink-0">{flags[currentLocale]}</span>
        <span className="uppercase text-xs tracking-widest">{currentLocale}</span>
        <motion.div
           animate={{ rotate: isOpen ? 180 : 0 }}
           transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-32 origin-top-right bg-white rounded-xl shadow-xl border border-gray-100 ring-1 ring-black/5 z-60 overflow-hidden"
          >
            <div className="py-1">
              {i18n.locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLanguageChange(locale)}
                  className={`flex items-center w-full px-4 py-3 text-sm transition-colors duration-150 ${
                    currentLocale === locale
                      ? 'bg-primary/5 text-primary'
                      : 'text-gray-700 hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                   <span className="shrink-0 mr-3">{flags[locale]}</span>
                   <span className="uppercase text-xs font-bold tracking-widest">{locale}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
