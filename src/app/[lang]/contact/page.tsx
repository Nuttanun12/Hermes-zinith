import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import ContactClient from '@/components/ContactClient'

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang as Locale)

  return <ContactClient dict={dict} />
}
