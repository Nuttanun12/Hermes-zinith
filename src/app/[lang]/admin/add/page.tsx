import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import ProductFormClient from '@/components/features/products/ProductFormClient'

export default async function AddProductPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang as Locale)

  return (
    <div className="py-8">
      <ProductFormClient dict={dict} lang={resolvedParams.lang} />
    </div>
  )
}
