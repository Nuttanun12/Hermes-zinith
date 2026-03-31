import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Locale } from '@/i18n-config'
import LogoutButton from '@/components/layout/LogoutButton'
import { getDictionary } from '@/get-dictionary'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/${resolvedParams.lang}/login`)
  }

  const dict = await getDictionary(resolvedParams.lang as Locale)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Hermes-Zenith Logo" className="h-10 w-auto" />
          </div>
            <h1 className="text-lg font-black text-gray-900 uppercase tracking-[0.2em]">
              {dict.admin.dashboard}
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Administrator</span>
              <span className="text-xs text-gray-400 font-medium">
                {session.user.email}
              </span>
            </div>
            <div className="h-8 w-px bg-gray-100 mx-2" />
            <LogoutButton lang={resolvedParams.lang} label={dict.admin.logout} />
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        {children}
      </main>
    </div>
  )
}
