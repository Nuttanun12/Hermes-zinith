'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'
import { Plus, Trash2, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'

export default function ProductFormClient({
  initialData,
  dict,
  lang,
}: {
  initialData?: any
  dict: any
  lang: string
}) {
  const isEditing = !!initialData
  const [formData, setFormData] = useState({
    title_en: initialData?.title_en || '',
    title_th: initialData?.title_th || '',
    title_zh: initialData?.title_zh || '',
    description_en: initialData?.description_en || '',
    description_th: initialData?.description_th || '',
    description_zh: initialData?.description_zh || '',
    category: initialData?.category || '',
  })

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [newCat, setNewCat] = useState({ slug: '', name_en: '', name_th: '', name_zh: '' })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name_en')
    if (!error && data) {
      setCategories(data)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCat.slug || !newCat.name_en) return
    
    const { error } = await supabase.from('categories').insert([newCat])
    if (!error) {
      setNewCat({ slug: '', name_en: '', name_th: '', name_zh: '' })
      fetchCategories()
    } else {
      alert(dict.admin.error_adding_category + ': ' + error.message)
    }
  }

  const handleDeleteCategory = (slug: string) => {
    setCategoryToDelete(slug)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return
    
    const { error } = await supabase.from('categories').delete().eq('slug', categoryToDelete)
    if (!error) {
      fetchCategories()
    } else {
      alert(dict.admin.error_deleting_category + ': ' + error.message)
    }
    setCategoryToDelete(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let image_url = initialData?.image_url

    // Handle Image Upload
    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('Product_img')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Storage error:', uploadError)
        alert(dict.admin.error_uploading + ': ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('Product_img')
        .getPublicUrl(fileName)

      image_url = publicUrl
    }

    const payload = { ...formData, image_url }

    if (isEditing) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', initialData.id)

      if (error) {
        console.error('Update error:', error)
        alert(dict.admin.error_updating + ': ' + error.message)
        setLoading(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert(payload)

      if (error) {
        console.error('Insert error:', error)
        alert(dict.admin.error_inserting + ': ' + error.message)
        setLoading(false)
        return
      }
    }

    setLoading(false)
    router.push(`/${lang}/admin`)
    router.refresh()
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase tracking-wide">
        {isEditing ? dict.admin.edit_product : dict.admin.add_product}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <h3 className="font-semibold text-gray-700 mb-2 underline underline-offset-4 uppercase tracking-wider">{dict.admin.lang_en}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">{dict.admin.product_name} (EN)</label>
                <input required type="text" name="title_en" value={formData.title_en} onChange={handleChange} className="w-full border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border text-black placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">{dict.admin.description} (EN)</label>
                <textarea rows={4} name="description_en" value={formData.description_en} onChange={handleChange} className="w-full border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border shadow-sm text-black placeholder:text-gray-400" />
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <h3 className="font-semibold text-gray-700 mb-2 underline underline-offset-4 uppercase tracking-wider">{dict.admin.lang_th}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">{dict.admin.product_name} (TH)</label>
                <input required type="text" name="title_th" value={formData.title_th} onChange={handleChange} className="w-full border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border text-black placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">{dict.admin.description} (TH)</label>
                <textarea rows={4} name="description_th" value={formData.description_th} onChange={handleChange} className="w-full border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border shadow-sm text-black placeholder:text-gray-400" />
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-semibold text-gray-700 mb-2 underline underline-offset-4 uppercase tracking-wider">{dict.admin.lang_zh}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">{dict.admin.product_name} (ZH)</label>
                <input required type="text" name="title_zh" value={formData.title_zh} onChange={handleChange} className="w-full border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border text-black placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">{dict.admin.description} (ZH)</label>
                <textarea rows={4} name="description_zh" value={formData.description_zh} onChange={handleChange} className="w-full border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border shadow-sm text-black placeholder:text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 space-y-4 mt-8 border-t pt-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="block text-gray-700 font-medium">{dict.admin.category}</label>
              <button 
                type="button"
                onClick={() => setShowCategoryManager(!showCategoryManager)}
                className="text-xs text-primary font-bold flex items-center hover:underline cursor-pointer"
              >
                <Tag className="w-3 h-3 mr-1" />
                {showCategoryManager ? dict.admin.close_manager : dict.admin.manage_categories}
              </button>
            </div>

            {showCategoryManager && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-100 text-[10px] font-bold text-gray-600">
                      {cat[`name_${lang}`] || cat.name_en}
                      <button 
                        type="button"
                        onClick={() => handleDeleteCategory(cat.slug)}
                        className="ml-2 text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">{dict.admin.add_new_category}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      placeholder={dict.admin.category_slug_placeholder} 
                      className="p-2 border rounded text-[10px] w-full border-gray-300 focus:ring-primary focus:border-primary text-black placeholder:text-gray-400" 
                      value={newCat.slug}
                      onChange={(e) => setNewCat({...newCat, slug: e.target.value})}
                    />
                    <input 
                      placeholder={dict.admin.category_name_en_placeholder} 
                      className="p-2 border rounded text-[10px] w-full border-gray-300 focus:ring-primary focus:border-primary text-black placeholder:text-gray-400" 
                      value={newCat.name_en}
                      onChange={(e) => setNewCat({...newCat, name_en: e.target.value})}
                    />
                    <input 
                      placeholder={dict.admin.category_name_th_placeholder} 
                      className="p-2 border rounded text-[10px] w-full border-gray-300 focus:ring-primary focus:border-primary text-black placeholder:text-gray-400" 
                      value={newCat.name_th}
                      onChange={(e) => setNewCat({...newCat, name_th: e.target.value})}
                    />
                    <input 
                      placeholder={dict.admin.category_name_zh_placeholder} 
                      className="p-2 border rounded text-[10px] w-full border-gray-300 focus:ring-primary focus:border-primary text-black placeholder:text-gray-400" 
                      value={newCat.name_zh}
                      onChange={(e) => setNewCat({...newCat, name_zh: e.target.value})}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={handleAddCategory}
                    className="mt-3 w-full py-2 bg-gray-900 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors cursor-pointer"
                  >
                    {dict.admin.add_category_btn}
                  </button>
                </div>
              </div>
            )}

            <select name="category" value={formData.category} onChange={handleChange} className="w-full border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border bg-white text-black cursor-pointer">
              <option value="">{dict.admin.select_category}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat[`name_${lang}`] || cat.name_en}
                </option>
              ))}
              {/* Fallback to dictionary labels for legacy hardcoded categories if not in DB yet */}
              {categories.length === 0 && (
                <>
                  <option value="air_compressor">{dict.products.categories.air_compressor}</option>
                  <option value="filters">{dict.products.categories.filters}</option>
                  <option value="lubrication">{dict.products.categories.lubrication}</option>
                  <option value="storage">{dict.products.categories.storage}</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">{dict.admin.product_image}</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
            {initialData?.image_url && !file && (
              <div className="mt-2 text-xs text-gray-500">{dict.admin.current_image}</div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded font-bold uppercase tracking-widest disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? dict.admin.saving : dict.admin.save}
        </button>
      </form>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCategory}
        title={dict.admin.confirm_delete}
        message={dict.admin.delete_confirm_msg}
        confirmText={dict.admin.confirm}
        cancelText={dict.admin.cancel}
        isDangerous={true}
      />
    </div>
  )
}
