'use client'

import { usePathname, useRouter } from 'next/navigation'
import { i18n, type Locale } from '@/i18n-config'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const flags: Record<string, React.ReactNode> = {
  en: (
    <svg viewBox="0 0 640 480" className="w-5 h-4 rounded-sm shadow-xs">
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path
        fill="#FFF"
        d="m75 0 244 181L562 0h78v62L400 240l240 178v62h-78L320 300 78 480H0v-62l240-178L0 62V0h75z"
      />
      <path
        fill="#C8102E"
        d="m424 281 216 159v40L369 281h55zM216 199 0 40V0l271 199h-55zm-141 0C47 180 0 146 0 146l216 159H75zm349 82 216 159h-75L369 281c0 62 55 0 55 0z"
      />
      <path fill="#FFF" d="M256 0v480h128V0H256zM0 176v128h640V176H0z" />
      <path fill="#C8102E" d="M288 0v480h64V0h-64zM0 208v64h640v-64H0z" />
    </svg>
  ),
  th: (
    <svg viewBox="0 0 640 480" className="w-5 h-4 rounded-sm shadow-xs">
      <path fill="#ED1C24" d="M0 0h640v480H0z" />
      <path fill="#FFF" d="M0 80h640v320H0z" />
      <path fill="#241D4E" d="M0 160h640v160H0z" />
    </svg>
  ),
  zh: (
    <svg viewBox="0 0 640 480" className="w-5 h-4 rounded-sm shadow-xs">
      <path fill="#ee1c25" d="M0 0h640v480H0z" />
      <path
        fill="#ffff00"
        d="M160 160l-31 92 81-59h-99l81 59zm114-111l-9 28 25-18h-31l25 18zm46 46l-9 28 25-18h-31l25 18zm0 65l-9 28 25-18h-31l25 18zm-46 46l-9 28 25-18h-31l25 18z"
      />
    </svg>
  ),
}

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
        className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-foreground hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none"
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
                      : 'text-gray-700 hover:bg-gray-50'
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
