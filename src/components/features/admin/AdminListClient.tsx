'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Trash2, Edit } from 'lucide-react'
import Link from 'next/link'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'

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
  const [isDeleting, setIsDeleting] = useState(false)
  const [productToDelete, setProductToDelete] = useState<{id: string, imageUrl: string} | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const triggerDelete = (id: string, imageUrl: string) => {
    setProductToDelete({ id, imageUrl })
    setIsDeleting(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return
    
    const { id } = productToDelete
    const { error } = await supabase.from('products').delete().eq('id', id)
    
    if (!error) {
      setProducts(products.filter(p => p.id !== id))
      router.refresh()
    } else {
      alert(dict.admin.error_deleting)
    }
    
    setProductToDelete(null)
    setIsDeleting(false)
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 uppercase tracking-wider text-xs font-semibold text-gray-500">
          <tr>
            <th className="px-6 py-3 text-left">{dict.admin.image}</th>
            <th className="px-6 py-3 text-left">{dict.admin.title_en}</th>
            <th className="px-6 py-3 text-left">{dict.admin.category}</th>
            <th className="px-6 py-3 text-right">{dict.admin.actions}</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {product.image_url ? (
                  <img src={product.image_url} alt="" className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">{dict.admin.no_img}</div>
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
                  {dict.admin.edit}
                </Link>
                <button
                  onClick={() => triggerDelete(product.id, product.image_url)}
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

      <ConfirmationModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={confirmDelete}
        title={dict.admin.delete_product}
        message={dict.admin.delete_confirm_msg}
        confirmText={dict.admin.confirm_delete}
        cancelText={dict.admin.keep_product}
        isDangerous={true}
      />
    </div>
  )
}
