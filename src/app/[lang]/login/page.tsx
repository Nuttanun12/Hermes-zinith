import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import LoginClient from '@/components/LoginClient'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  
  // Checking session
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Prevent accessing login page if already authenticated!
  if (session) {
    redirect(`/${resolvedParams.lang}/admin`)
  }

  const dict = await getDictionary(resolvedParams.lang as Locale)

  return <LoginClient dict={dict} lang={resolvedParams.lang} />
}
