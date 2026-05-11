'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Trash2, Edit, Pencil, Check, Loader2, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { CategoryManager } from './CategoryManager'

// ── Inline category editor cell ──────────────────────────────────────────────
function CategoryCell({
  product,
  dict,
  lang,
  onUpdate,
}: {
  product: any
  dict: any
  lang: string
  onUpdate: (newCategory: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [value, setValue] = useState(product.category || '')
  const selectRef = useRef<HTMLSelectElement>(null)
  const supabase = createClient()

  // Fetch categories once when editing begins
  useEffect(() => {
    if (!editing) return
    supabase
      .from('categories')
      .select('*')
      .order('name_en')
      .then(({ data }) => {
        if (data) setCategories(data)
        // Focus the select after categories load
        setTimeout(() => selectRef.current?.focus(), 50)
      })
  }, [editing])

  const handleSave = async (newValue: string) => {
    if (newValue === product.category) {
      setEditing(false)
      return
    }
    setSaving(true)
    const { error } = await supabase
      .from('products')
      .update({ category: newValue })
      .eq('id', product.id)
    setSaving(false)
    if (!error) {
      setValue(newValue)
      onUpdate(newValue)
    } else {
      alert(dict.admin.error_updating)
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <select
          ref={selectRef}
          value={value}
          disabled={saving}
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => handleSave(e.target.value)}
          className="border border-primary rounded px-2 py-1 text-xs text-black bg-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          <option value="">{dict.admin.select_category}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat[`name_${lang}`] || cat.name_en}
            </option>
          ))}
          {categories.length === 0 && (
            <>
              <option value="air_compressor">{dict.products.categories.air_compressor}</option>
              <option value="filters">{dict.products.categories.filters}</option>
              <option value="lubrication">{dict.products.categories.lubrication}</option>
              <option value="storage">{dict.products.categories.storage}</option>
            </>
          )}
        </select>
        {saving ? (
          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
        ) : (
          <button
            onMouseDown={(e) => {
              e.preventDefault() // prevent blur from firing before click
              handleSave(value)
            }}
            className="text-primary hover:text-primary-dark cursor-pointer"
            title="Save"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="group flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors cursor-pointer"
      title="Click to edit category"
    >
      <span>{value || <span className="italic text-gray-400 text-xs">{dict.admin.select_category}</span>}</span>
      <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
    </button>
  )
}

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
  const [showCategories, setShowCategories] = useState(false)
  
  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])
  
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
    <div className="space-y-8">
      {/* Categories Toggle */}
      <div className="flex">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 text-xs font-black rounded-2xl hover:bg-gray-200 transition-all tracking-widest uppercase cursor-pointer"
        >
          <Tag className="w-4 h-4" />
          {showCategories ? dict.admin.close_manager : dict.admin.manage_categories}
          {showCategories ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>
      </div>

      {showCategories && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <CategoryManager 
            dict={dict} 
            lang={lang} 
            onCategoriesChange={() => router.refresh()} 
          />
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
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
                  {(() => {
                    const coverImg = product.image_urls?.[0] || product.image_url
                    const imgCount = product.image_urls?.length || (product.image_url ? 1 : 0)
                    return coverImg ? (
                      <div className="relative inline-block">
                        <img src={coverImg} alt="" className="w-12 h-12 object-cover rounded" />
                        {imgCount > 1 && (
                          <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                            {imgCount}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">{dict.admin.no_img}</div>
                    )
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {product.title_en}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <CategoryCell
                    product={product}
                    dict={dict}
                    lang={lang}
                    onUpdate={(newCategory) =>
                      setProducts((prev) =>
                        prev.map((p) => p.id === product.id ? { ...p, category: newCategory } : p)
                      )
                    }
                  />
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
                    className="text-red-600 hover:text-red-900 inline-flex items-center cursor-pointer"
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
