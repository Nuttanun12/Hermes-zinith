import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import HomeClient from '@/components/HomeClient'

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang as Locale)

  return <HomeClient dict={dict} lang={resolvedParams.lang} />
}
