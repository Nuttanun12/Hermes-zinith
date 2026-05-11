import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import { createClient } from '@/lib/supabase/server'
import ProductDetailClient from '@/components/features/products/ProductDetailClient'
import { notFound } from 'next/navigation'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang as Locale)
  
  const supabase = await createClient()
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <ProductDetailClient 
        product={product} 
        dict={dict} 
        lang={resolvedParams.lang} 
      />
    </div>
  )
}
