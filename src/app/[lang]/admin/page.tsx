import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import { createClient } from '@/lib/supabase/server'
import AdminListClient from '@/components/AdminListClient'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang as Locale)
  
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-1 bg-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Inventory</span>
          </div>
          <h2 className="text-3xl font-black uppercase text-gray-900 tracking-tight">
            Products <span className="text-primary">Management</span>
          </h2>
        </div>
        <Link
          href={`/${resolvedParams.lang}/admin/add`}
          className="inline-flex items-center px-8 py-4 bg-primary text-white text-xs font-black rounded-2xl hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 tracking-widest uppercase shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          {dict.admin.add_product}
        </Link>
      </div>

      <AdminListClient 
        initialProducts={products || []} 
        dict={dict} 
        lang={resolvedParams.lang} 
      />
    </div>
  )
}
