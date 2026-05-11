'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Edit, Check, X, Tag, Plus, Loader2 } from 'lucide-react'

export function CategoryManager({
  dict,
  lang,
  onCategoriesChange,
}: {
  dict: any
  lang: string
  onCategoriesChange?: () => void
}) {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null) // category slug being saved
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ slug: '', name_en: '', name_th: '', name_zh: '' })
  const [newCat, setNewCat] = useState({ slug: '', name_en: '', name_th: '', name_zh: '' })
  const [showAdd, setShowAdd] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('categories').select('*').order('name_en')
    if (!error && data) {
      setCategories(data)
    }
    setLoading(false)
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCat.slug || !newCat.name_en) return
    
    setSaving('new')
    const { error } = await supabase.from('categories').insert([newCat])
    if (!error) {
      setNewCat({ slug: '', name_en: '', name_th: '', name_zh: '' })
      setShowAdd(false)
      fetchCategories()
      if (onCategoriesChange) onCategoriesChange()
    } else {
      alert(dict.admin.error_adding_category + ': ' + error.message)
    }
    setSaving(null)
  }

  const startEdit = (cat: any) => {
    setEditingId(cat.id)
    setEditForm({
      slug: cat.slug,
      name_en: cat.name_en,
      name_th: cat.name_th || '',
      name_zh: cat.name_zh || '',
    })
  }

  const handleUpdateCategory = async (id: string, oldSlug: string) => {
    if (!editForm.slug || !editForm.name_en) return

    setSaving(id)
    
    // 1. Update the category
    const { error: catError } = await supabase
      .from('categories')
      .update(editForm)
      .eq('id', id)

    if (!catError) {
      // 2. If slug changed, update all products using this slug
      if (editForm.slug !== oldSlug) {
        const { error: prodError } = await supabase
          .from('products')
          .update({ category: editForm.slug })
          .eq('category', oldSlug)
        
        if (prodError) {
          console.error('Error updating products category slug:', prodError)
        }
      }
      
      setEditingId(null)
      fetchCategories()
      if (onCategoriesChange) onCategoriesChange()
    } else {
      alert(dict.admin.error_updating + ': ' + catError.message)
    }
    setSaving(null)
  }

  const handleDeleteCategory = async (id: string, slug: string) => {
    if (!confirm(dict.admin.delete_confirm_msg)) return

    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (!error) {
      fetchCategories()
      if (onCategoriesChange) onCategoriesChange()
    } else {
      alert(dict.admin.error_deleting_category + ': ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-black uppercase tracking-tight text-gray-900">
            {dict.admin.manage_categories}
          </h3>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all cursor-pointer"
        >
          {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddCategory} className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <input
            placeholder={dict.admin.category_slug_placeholder}
            className="p-2 border rounded-lg text-xs border-gray-200 focus:ring-primary focus:border-primary text-black"
            value={newCat.slug}
            onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
            required
          />
          <input
            placeholder={dict.admin.category_name_en_placeholder}
            className="p-2 border rounded-lg text-xs border-gray-200 focus:ring-primary focus:border-primary text-black"
            value={newCat.name_en}
            onChange={(e) => setNewCat({ ...newCat, name_en: e.target.value })}
            required
          />
          <input
            placeholder={dict.admin.category_name_th_placeholder}
            className="p-2 border rounded-lg text-xs border-gray-200 focus:ring-primary focus:border-primary text-black"
            value={newCat.name_th}
            onChange={(e) => setNewCat({ ...newCat, name_th: e.target.value })}
          />
          <input
            placeholder={dict.admin.category_name_zh_placeholder}
            className="p-2 border rounded-lg text-xs border-gray-200 focus:ring-primary focus:border-primary text-black"
            value={newCat.name_zh}
            onChange={(e) => setNewCat({ ...newCat, name_zh: e.target.value })}
          />
          <button
            type="submit"
            disabled={saving === 'new'}
            className="bg-gray-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 py-2 cursor-pointer"
          >
            {saving === 'new' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
            {dict.admin.add_category_btn}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group hover:border-primary/20 transition-all"
          >
            {editingId === cat.id ? (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Slug</label>
                  <input
                    className="w-full p-2 border rounded-lg text-xs border-gray-200 focus:ring-primary focus:border-primary text-black"
                    value={editForm.slug}
                    onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">EN</label>
                  <input
                    className="w-full p-2 border rounded-lg text-xs border-gray-200 focus:ring-primary focus:border-primary text-black"
                    value={editForm.name_en}
                    onChange={(e) => setEditForm({ ...editForm, name_en: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TH</label>
                  <input
                    className="w-full p-2 border rounded-lg text-xs border-gray-200 focus:ring-primary focus:border-primary text-black"
                    value={editForm.name_th}
                    onChange={(e) => setEditForm({ ...editForm, name_th: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ZH</label>
                  <input
                    className="w-full p-2 border rounded-lg text-xs border-gray-200 focus:ring-primary focus:border-primary text-black"
                    value={editForm.name_zh}
                    onChange={(e) => setEditForm({ ...editForm, name_zh: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-wrap items-center gap-4">
                <div className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {cat.slug}
                </div>
                <div className="font-bold text-gray-900 text-sm">
                  {cat.name_en}
                </div>
                <div className="text-gray-400 text-sm">
                  {cat.name_th}
                </div>
                <div className="text-gray-400 text-sm">
                  {cat.name_zh}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              {editingId === cat.id ? (
                <>
                  <button
                    onClick={() => handleUpdateCategory(cat.id, cat.slug)}
                    disabled={saving === cat.id}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all cursor-pointer"
                  >
                    {saving === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.slug)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-400 font-medium">
            No categories found. Add your first category above.
          </div>
        )}
      </div>
    </div>
  )
}
