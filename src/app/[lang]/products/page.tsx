import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import { createClient } from '@/lib/supabase/server'
import ProductsClient from '@/components/ProductsClient'
import { PageHero } from '@/components/ui/PageHero'
import { Package } from 'lucide-react'

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang as Locale)
  
  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PageHero
        title={dict.products.hero_title}
        subtitle={dict.products.hero_subtitle}
        backgroundImage="https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop"
        icon={<Package />}
      />

      <div className="container mx-auto px-4 py-16 -mt-10 relative z-30">
        {error ? (
          <div className="bg-white p-20 rounded-3xl shadow-xl text-center text-red-500 border border-red-100">
            <h3 className="text-xl font-bold mb-2 uppercase">Database Error</h3>
            <p>Failed to load products. Please check your Supabase connection.</p>
          </div>
        ) : (
          <ProductsClient 
            products={products || []} 
            dict={dict} 
            lang={resolvedParams.lang} 
          />
        )}
      </div>
    </div>
  )
}
