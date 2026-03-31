import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import ProductFormClient from '@/components/ProductFormClient'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang as Locale)
  
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="py-8">
      <ProductFormClient initialData={product} dict={dict} lang={resolvedParams.lang} />
    </div>
  )
}
