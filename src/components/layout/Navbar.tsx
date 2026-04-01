import Link from 'next/link'
import { getDictionary } from '@/get-dictionary'
import { type Locale } from '@/i18n-config'
import LanguageSwitcher from './LanguageSwitcher'

export async function Navbar({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang)

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-x-4 transition-transform hover:scale-105">
          <img src="/logo.svg" alt="Hermes-Zenith Logo" className="h-10 w-auto" />
          <span className="font-black text-xl tracking-tighter text-foreground uppercase hidden sm:block">
            Hermes-Zenith
          </span>
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href={`/${lang}/about`}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide"
          >
            {dict.nav.about}
          </Link>
          <Link
            href={`/${lang}/products`}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide"
          >
            {dict.nav.products}
          </Link>
          <Link
            href={`/${lang}/services`}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide"
          >
            {dict.nav.services}
          </Link>
          <LanguageSwitcher currentLocale={lang} />
          <Link
            href={`/${lang}/contact`}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-md transition-colors"
          >
            {dict.nav.contact}
          </Link>
        </nav>
      </div>
    </header>
  )
}
