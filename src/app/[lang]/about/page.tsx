import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import AboutClient from '@/components/AboutClient'

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang as Locale)

  return <AboutClient dict={dict} />
}
