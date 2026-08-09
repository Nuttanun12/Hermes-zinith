'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Trash2, Edit, Pencil, Check, Loader2, Tag,
  ChevronDown, ChevronUp, GripVertical,
} from 'lucide-react'
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

  useEffect(() => {
    if (!editing) return
    supabase
      .from('categories')
      .select('*')
      .order('name_en')
      .then(({ data }) => {
        if (data) setCategories(data)
        setTimeout(() => selectRef.current?.focus(), 50)
      })
  }, [editing])

  const handleSave = async (newValue: string) => {
    if (newValue === product.category) { setEditing(false); return }
    setSaving(true)
    const { error } = await supabase
      .from('products').update({ category: newValue }).eq('id', product.id)
    setSaving(false)
    if (!error) { setValue(newValue); onUpdate(newValue) } else { alert(dict.admin.error_updating) }
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
            <option key={cat.id} value={cat.slug}>{cat[`name_${lang}`] || cat.name_en}</option>
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
        {saving
          ? <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
          : (
            <button
              onMouseDown={(e) => { e.preventDefault(); handleSave(value) }}
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

// ── Main component ────────────────────────────────────────────────────────────
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
  const [productToDelete, setProductToDelete] = useState<{ id: string; imageUrl: string } | null>(null)
  const [showCategories, setShowCategories] = useState(false)
  const [isSavingOrder, setIsSavingOrder] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)

  // Drag state
  const dragIndexRef = useRef<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  // Navigation guard refs
  const pendingNavRef = useRef<string | null>(null)
  const originalPushStateRef = useRef<typeof window.history.pushState | null>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => { setProducts(initialProducts) }, [initialProducts])

  // ── Navigation guard — block leaving with unsaved order ─────────────────────
  useEffect(() => {
    if (!isDirty) return

    // 1. Browser close / refresh / external URL
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)

    // 2. Next.js Link / router.push intercept
    const original = window.history.pushState.bind(window.history)
    originalPushStateRef.current = original
      ; (window.history as any).pushState = (state: any, title: string, url?: string | URL | null) => {
        const target = url ? url.toString() : null
        const current = window.location.pathname + window.location.search
        if (target && target !== current) {
          pendingNavRef.current = target
          // Defer to avoid calling setState inside React's synchronous pushState context
          setTimeout(() => setShowLeaveModal(true), 0)
          return // block navigation
        }
        original(state, title, url)
      }

    // 3. Browser back / forward button
    const onPopState = () => {
      // Push current URL back to cancel the navigation
      window.history.pushState(null, '', window.location.href)
      pendingNavRef.current = null
      setTimeout(() => setShowLeaveModal(true), 0)
    }
    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('popstate', onPopState)
      if (originalPushStateRef.current) {
        window.history.pushState = originalPushStateRef.current
        originalPushStateRef.current = null
      }
    }
  }, [isDirty])

  // Restore pushState and navigate away (user confirmed leave)
  const confirmLeave = () => {
    setShowLeaveModal(false)
    if (originalPushStateRef.current) {
      window.history.pushState = originalPushStateRef.current
      originalPushStateRef.current = null
    }
    setIsDirty(false)
    if (pendingNavRef.current) {
      router.push(pendingNavRef.current)
    } else {
      router.back()
    }
    pendingNavRef.current = null
  }

  const cancelLeave = () => {
    setShowLeaveModal(false)
    pendingNavRef.current = null
  }

  // ── Drag handlers ───────────────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    dragIndexRef.current = index
    e.dataTransfer.effectAllowed = 'move'
    // Ghost image: slightly transparent clone (browser default is fine)
  }

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragIndexRef.current !== index) setDragOver(index)
  }

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, dropIndex: number) => {
    e.preventDefault()
    const fromIndex = dragIndexRef.current
    if (fromIndex === null || fromIndex === dropIndex) {
      setDragOver(null)
      dragIndexRef.current = null
      return
    }

    // Reorder locally only — no DB write yet
    const reordered = [...products]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(dropIndex, 0, moved)

    setProducts(reordered)
    setIsDirty(true)
    setDragOver(null)
    dragIndexRef.current = null
  }

  // ── Save order handler ──────────────────────────────────────────────────────
  const saveOrder = async () => {
    setIsSavingOrder(true)
    const withPriority = products.map((p, i) => ({ ...p, priority: i + 1 }))
    // Large offset ensures the temp range (100001, 100002, …) never overlaps
    // with the final range (1, 2, 3, …), satisfying both NOT NULL and UNIQUE.
    const OFFSET = 100000
    try {
      // Phase 1 — shift everyone into a safe temp range so the unique
      // constraint is never violated when values cross during reassignment.
      const shiftResults = await Promise.all(
        products.map((p, i) =>
          supabase.from('products').update({ priority: i + 1 + OFFSET }).eq('id', p.id)
        )
      )
      const shiftErrors = shiftResults.filter((r) => r.error)
      if (shiftErrors.length > 0) {
        console.error('Priority shift errors:', shiftErrors.map((r) => r.error))
        alert('Failed to save order (phase 1). Please try again.')
        return
      }

      // Phase 2 — assign the real sequential values 1, 2, 3 …
      const setResults = await Promise.all(
        withPriority.map((p) =>
          supabase.from('products').update({ priority: p.priority }).eq('id', p.id)
        )
      )
      const setErrors = setResults.filter((r) => r.error)
      if (setErrors.length > 0) {
        console.error('Priority set errors:', setErrors.map((r) => r.error))
        alert(`Failed to save order for ${setErrors.length} product(s). Please try again.`)
        return
      }

      setProducts(withPriority)
      setIsDirty(false)
      router.refresh()
    } catch (err) {
      console.error('saveOrder unexpected error:', err)
      alert('Failed to save order. Please try again.')
    } finally {
      setIsSavingOrder(false)
    }
  }

  const handleDragEnd = () => {
    dragIndexRef.current = null
    setDragOver(null)
  }

  // ── Delete handlers ─────────────────────────────────────────────────────────
  const triggerDelete = (id: string, imageUrl: string) => {
    setProductToDelete({ id, imageUrl })
    setIsDeleting(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return
    const { id } = productToDelete
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      setProducts(products.filter((p) => p.id !== id))
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
      <div className="flex items-center justify-between">
        {/* Save Order button — shown outside & below the table, right-aligned */}
        <div className="flex items-center justify-start gap-3">
          <button
            onClick={saveOrder}
            disabled={!isDirty || isSavingOrder}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white text-xs font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary-dark hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
            >
            {isSavingOrder ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              <>Save Order</>
            )}
          </button>
            {isDirty && !isSavingOrder && (
              <span className="text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                Unsaved changes
              </span>
            )}
        </div>
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
          <CategoryManager dict={dict} lang={lang} onCategoriesChange={() => router.refresh()} />
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 uppercase tracking-wider text-xs font-semibold text-gray-500">
            <tr>
              {/* Drag handle col */}
              <th className="px-3 py-3 w-10" />
              {/* Order badge col */}
              <th className="px-3 py-3 text-center w-12">#</th>
              <th className="px-6 py-3 text-left">{dict.admin.image}</th>
              <th className="px-6 py-3 text-left">{dict.admin.title_en}</th>
              <th className="px-6 py-3 text-left">{dict.admin.category}</th>
              <th className="px-6 py-3 text-right">{dict.admin.actions}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product, index) => {
              const isDraggingOver = dragOver === index
              return (
                <tr
                  key={product.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`transition-all duration-150 ${isDraggingOver
                      ? 'bg-primary/5 border-t-2 border-primary shadow-inner'
                      : 'hover:bg-gray-50'
                    }`}
                >
                  {/* Drag handle */}
                  <td className="px-3 py-4 text-center">
                    <div
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-300 hover:text-primary hover:bg-primary/10 transition-all cursor-grab active:cursor-grabbing"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                  </td>

                  {/* Priority badge */}
                  <td className="px-3 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black bg-gray-100 text-gray-400">
                      {index + 1}
                    </span>
                  </td>

                  {/* Image */}
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
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                          {dict.admin.no_img}
                        </div>
                      )
                    })()}
                  </td>

                  {/* Title */}
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {product.title_en}
                  </td>

                  {/* Category */}
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

                  {/* Actions */}
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
              )
            })}

            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
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

      {/* Leave without saving modal */}
      <ConfirmationModal
        isOpen={showLeaveModal}
        onClose={cancelLeave}
        onConfirm={confirmLeave}
        title="Unsaved Order Changes"
        message="You have unsaved changes to the product order. If you leave now, your changes will be lost."
        confirmText="Leave without saving"
        cancelText="Stay & save"
        isDangerous={true}
      />
    </div>
  )
}
