'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

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
  const supabase = createClient()
  const router = useRouter()

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
        .from('products')
        .upload(fileName, file)

      if (uploadError) {
        alert('Error uploading image!')
        setLoading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)
      
      image_url = publicUrl
    }

    const payload = { ...formData, image_url }

    if (isEditing) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', initialData.id)
      
      if (error) alert('Error updating')
    } else {
      const { error } = await supabase
        .from('products')
        .insert(payload)

      if (error) alert('Error inserting')
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
            <h3 className="font-semibold text-gray-700 mb-2 underline underline-offset-4 uppercase tracking-wider">English Data</h3>
             <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Title (EN)</label>
                <input required type="text" name="title_en" value={formData.title_en} onChange={handleChange} className="w-full border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Description (EN)</label>
                <textarea rows={4} name="description_en" value={formData.description_en} onChange={handleChange} className="w-full border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border shadow-sm" />
              </div>
            </div>
           </div>

           <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 mb-2 underline underline-offset-4 uppercase tracking-wider">Thai (th)</h3>
            <div>
               <label className="block text-gray-700 font-medium mb-1">Title (TH)</label>
               <input required type="text" name="title_th" value={formData.title_th} onChange={handleChange} className="w-full border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border" />
            </div>
            <div>
               <label className="block text-gray-700 font-medium mb-1">Description (TH)</label>
               <textarea rows={4} name="description_th" value={formData.description_th} onChange={handleChange} className="w-full border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border shadow-sm" />
            </div>
           </div>

           <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 mb-2 underline underline-offset-4 uppercase tracking-wider">Chinese (zh)</h3>
            <div>
               <label className="block text-gray-700 font-medium mb-1">Title (ZH)</label>
               <input required type="text" name="title_zh" value={formData.title_zh} onChange={handleChange} className="w-full border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border" />
            </div>
            <div>
               <label className="block text-gray-700 font-medium mb-1">Description (ZH)</label>
               <textarea rows={4} name="description_zh" value={formData.description_zh} onChange={handleChange} className="w-full border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border shadow-sm" />
            </div>
           </div>
        </div>

        <div className="md:w-1/2 space-y-4 mt-8 border-t pt-8">
           <div>
             <label className="block text-gray-700 font-medium mb-1">{dict.admin.category}</label>
             <select name="category" value={formData.category} onChange={handleChange} className="w-full border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border bg-white">
                <option value="">Select Category</option>
                <option value={dict.products.categories.air_compressor}>{dict.products.categories.air_compressor}</option>
                <option value={dict.products.categories.filters}>{dict.products.categories.filters}</option>
                <option value={dict.products.categories.lubrication}>{dict.products.categories.lubrication}</option>
                <option value={dict.products.categories.storage}>{dict.products.categories.storage}</option>
             </select>
           </div>
           
           <div>
             <label className="block text-gray-700 font-medium mb-1">Product Image</label>
             <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
             {initialData?.image_url && !file && (
               <div className="mt-2 text-xs text-gray-500">Current image uploaded. Leave empty to keep it.</div>
             )}
           </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded font-bold uppercase tracking-widest disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : dict.admin.save}
        </button>
      </form>
    </div>
  )
}
