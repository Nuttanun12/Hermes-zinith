import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import ServicesClient from '@/components/pages/ServicesClient'

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang as Locale)

  return <ServicesClient dict={dict} />
}
