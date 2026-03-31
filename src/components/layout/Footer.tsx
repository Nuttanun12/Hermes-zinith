import Link from 'next/link'
import { getDictionary } from '@/get-dictionary'
import { type Locale } from '@/i18n-config'
import { Mail, MapPin, Phone } from 'lucide-react'

export async function Footer({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang)

  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8 text-gray-300">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-x-4 mb-6">
            <img src="/logo.svg" alt="Hermes-Zenith Logo" className="h-10 w-auto" />
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">
              Hermes-Zenith
            </h2>
          </div>
          <p className="text-sm text-gray-400 max-w-sm">
            {dict.home.hero.subtitle}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white uppercase tracking-wider">
            {dict.footer.quick_links}
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href={`/${lang}/about`}
                className="hover:text-primary transition-colors text-sm"
              >
                {dict.nav.about}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/products`}
                className="hover:text-primary transition-colors text-sm"
              >
                {dict.nav.products}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/services`}
                className="hover:text-primary transition-colors text-sm"
              >
                {dict.nav.services}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/admin`}
                className="hover:text-primary transition-colors text-sm"
              >
                {dict.nav.admin}
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white uppercase tracking-wider">
            {dict.footer.contact_us}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 text-primary shrink-0" />
              <span>
                389/157 Moo.6, Phrakesa Subdistrict, <br />
                Mueang Samut Prakan District, <br />
                Samut Prakan 10280 TH
              </span>
            </li>
            <li className="flex items-center">
              <Phone className="w-5 h-5 mr-3 text-primary shrink-0" />
              <span>061-426-2362, 097-964-9987</span>
            </li>
            <li className="flex items-center">
              <Mail className="w-5 h-5 mr-3 text-primary shrink-0" />
              <div className="flex flex-col">
                <a
                  href="mailto:sale@hermes-zenith.com"
                  className="hover:text-primary transition-colors"
                >
                  sale@hermes-zenith.com
                </a>
                <a
                  href="mailto:hermeszenith9@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  hermeszenith9@gmail.com
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Hermes-Zenith. {dict.footer.rights_reserved}
      </div>
    </footer>
  )
}
