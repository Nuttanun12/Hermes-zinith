import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import TeamClient from '@/components/pages/TeamClient'

export default async function TeamPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang as Locale)

  return <TeamClient dict={dict} lang={resolvedParams.lang} />
}
