'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'
import { Plus, Trash2, Tag, ChevronDown, ChevronUp, GripVertical, X, ImagePlus, Loader2 } from 'lucide-react'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { CategoryManager } from '@/components/features/admin/CategoryManager'

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
    priority: initialData?.priority != null ? String(initialData.priority) : '',
  })

  // Multiple images support
  // Existing images from the DB (URLs)
  const getInitialImages = (): string[] => {
    if (initialData?.image_urls && Array.isArray(initialData.image_urls) && initialData.image_urls.length > 0) {
      return initialData.image_urls
    }
    if (initialData?.image_url) {
      return [initialData.image_url]
    }
    return []
  }

  const [existingImages, setExistingImages] = useState<string[]>(getInitialImages)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newFilePreviews, setNewFilePreviews] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Drag state for reordering
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragType = useRef<'existing' | 'new' | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [])

  // Generate previews for new files
  useEffect(() => {
    const previews: string[] = []
    newFiles.forEach((file) => {
      previews.push(URL.createObjectURL(file))
    })
    setNewFilePreviews(previews)

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [newFiles])

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name_en')
    if (!error && data) {
      setCategories(data)
    }
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setNewFiles((prev) => [...prev, ...files])
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Remove an existing image
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Remove a new file
  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Drag handlers for existing images
  const handleDragStartExisting = (index: number) => {
    setDragIndex(index)
    dragType.current = 'existing'
  }

  const handleDragOverExisting = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragType.current === 'existing') {
      setDragOverIndex(index)
    }
  }

  const handleDropExisting = (index: number) => {
    if (dragType.current === 'existing' && dragIndex !== null && dragIndex !== index) {
      setExistingImages((prev) => {
        const copy = [...prev]
        const [moved] = copy.splice(dragIndex, 1)
        copy.splice(index, 0, moved)
        return copy
      })
    }
    setDragIndex(null)
    setDragOverIndex(null)
    dragType.current = null
  }

  // Drag handlers for new files
  const handleDragStartNew = (index: number) => {
    setDragIndex(index)
    dragType.current = 'new'
  }

  const handleDragOverNew = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragType.current === 'new') {
      setDragOverIndex(index)
    }
  }

  const handleDropNew = (index: number) => {
    if (dragType.current === 'new' && dragIndex !== null && dragIndex !== index) {
      setNewFiles((prev) => {
        const copy = [...prev]
        const [moved] = copy.splice(dragIndex, 1)
        copy.splice(index, 0, moved)
        return copy
      })
    }
    setDragIndex(null)
    setDragOverIndex(null)
    dragType.current = null
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
    dragType.current = null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Upload new files
    const uploadedUrls: string[] = []
    for (const file of newFiles) {
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

      uploadedUrls.push(publicUrl)
    }

    // Combine existing + newly uploaded
    const allImageUrls = [...existingImages, ...uploadedUrls]

    const priorityValue = formData.priority.trim() === '' ? null : parseInt(formData.priority, 10)
    const payload = {
      ...formData,
      priority: isNaN(priorityValue as number) ? null : priorityValue,
      image_urls: allImageUrls,
      // Keep image_url as the first image for backward compatibility
      image_url: allImageUrls[0] || null,
    }

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

  const totalImages = existingImages.length + newFiles.length

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

        <div className="space-y-4 mt-8 border-t pt-8">
          {/* Priority field */}
          <div className="flex flex-col gap-2">
            <label className="block text-gray-700 font-medium">
              Priority
              <span className="ml-2 text-xs text-gray-400 font-normal">(lower number = shown first; leave blank for no priority)</span>
            </label>
            <input
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              min={1}
              placeholder="e.g. 1, 2, 3 …"
              className="w-40 border-gray-300 rounded focus:ring-primary focus:border-primary p-2 border text-black placeholder:text-gray-400"
            />
          </div>

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
              <div className="mb-4">
                <CategoryManager 
                  dict={dict} 
                  lang={lang} 
                  onCategoriesChange={fetchCategories} 
                />
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

          {/* ─── Multiple Image Upload Section ─── */}
          <div className="md:col-span-3">
            <label className="block text-gray-700 font-medium mb-3">
              {dict.admin.product_images || 'Product Images'}
              <span className="text-gray-400 font-normal ml-2 text-xs">
                ({totalImages} {dict.admin.images_count || 'image(s)'})
              </span>
            </label>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  {dict.admin.current_images || 'Current Images'}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {existingImages.map((url, index) => (
                    <div
                      key={`existing-${index}`}
                      draggable
                      onDragStart={() => handleDragStartExisting(index)}
                      onDragOver={(e) => handleDragOverExisting(e, index)}
                      onDrop={() => handleDropExisting(index)}
                      onDragEnd={handleDragEnd}
                      className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-grab active:cursor-grabbing ${
                        dragType.current === 'existing' && dragOverIndex === index
                          ? 'border-primary scale-105 shadow-lg'
                          : index === 0
                          ? 'border-primary/40 ring-2 ring-primary/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      
                      {/* Primary badge */}
                      {index === 0 && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary text-white text-[8px] font-black uppercase tracking-wider rounded-md shadow">
                          {dict.admin.primary || 'Primary'}
                        </div>
                      )}

                      {/* Overlay controls */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex items-center gap-1">
                          <div className="p-1 bg-white/90 rounded-md">
                            <GripVertical className="w-3.5 h-3.5 text-gray-600" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="p-1 bg-red-500 rounded-md hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New files to upload */}
            {newFiles.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  {dict.admin.new_images || 'New Images to Upload'}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {newFilePreviews.map((preview, index) => (
                    <div
                      key={`new-${index}`}
                      draggable
                      onDragStart={() => handleDragStartNew(index)}
                      onDragOver={(e) => handleDragOverNew(e, index)}
                      onDrop={() => handleDropNew(index)}
                      onDragEnd={handleDragEnd}
                      className={`relative group aspect-square rounded-xl overflow-hidden border-2 border-dashed transition-all duration-200 cursor-grab active:cursor-grabbing ${
                        dragType.current === 'new' && dragOverIndex === index
                          ? 'border-primary scale-105 shadow-lg'
                          : 'border-blue-300 hover:border-blue-400'
                      }`}
                    >
                      <img src={preview} alt="" className="w-full h-full object-cover" />

                      {/* "NEW" badge */}
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-blue-500 text-white text-[8px] font-black uppercase tracking-wider rounded-md shadow">
                        {dict.admin.new_badge || 'New'}
                      </div>

                      {/* Overlay controls */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex items-center gap-1">
                          <div className="p-1 bg-white/90 rounded-md">
                            <GripVertical className="w-3.5 h-3.5 text-gray-600" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNewFile(index)}
                            className="p-1 bg-red-500 rounded-md hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add images button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer group"
            >
              <ImagePlus className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-gray-500 group-hover:text-primary transition-colors">
                {dict.admin.add_images || 'Click to add images'}
              </span>
              <span className="text-[10px] text-gray-400">
                {dict.admin.drag_to_reorder || 'Drag to reorder • First image is the cover'}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
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

    </div>
  )
}
