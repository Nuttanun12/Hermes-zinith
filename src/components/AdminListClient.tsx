'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Trash2, Edit } from 'lucide-react'
import Link from 'next/link'

export default function AdminListClient({
  initialProducts,
  dict,
  lang,
}: {
  initialProducts: any[]
  dict: any
  lang: string
}) {
  const [products, setProducts] = useState(initialProducts)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    // Attempt deleting from storage if image exists
    // (Assuming simple filename from URL strategy if using supabase storage, but skip for now
    // as it requires parsing the URL, or we let a database trigger handle it)

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      setProducts(products.filter(p => p.id !== id))
      router.refresh()
    } else {
      alert('Error deleting product')
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 uppercase tracking-wider text-xs font-semibold text-gray-500">
          <tr>
            <th className="px-6 py-3 text-left">Image</th>
            <th className="px-6 py-3 text-left">Title (EN)</th>
            <th className="px-6 py-3 text-left">Category</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {product.image_url ? (
                  <img src={product.image_url} alt="" className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">No img</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {product.title_en}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {product.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                <Link
                  href={`/${lang}/admin/edit/${product.id}`}
                  className="text-primary hover:text-primary-dark mr-4 inline-flex items-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id, product.image_url)}
                  className="text-red-600 hover:text-red-900 inline-flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {dict.admin.delete}
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                {dict.products.no_products}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
