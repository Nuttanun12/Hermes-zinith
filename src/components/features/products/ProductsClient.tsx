'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { ProductCard } from './ProductCard'
import { Search, Filter, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '@/hooks/useDebounce'

const PAGE_SIZE = 12

export default function ProductsClient({
  initialProducts,
  initialCategories,
  initialTotalCount,
  dict,
  lang,
}: {
  initialProducts: any[]
  initialCategories: any[]
  initialTotalCount: number
  dict: any
  lang: string
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCategories, setShowCategories] = useState(false)

  // Infinite scroll state
  const [products, setProducts] = useState<any[]>(initialProducts)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const debouncedSearch = useDebounce(searchQuery, 350)

  const hasMore = products.length < totalCount

  const categories = useMemo(() => {
    if (initialCategories && initialCategories.length > 0) {
      return ['all', ...initialCategories.map(c => c.slug)]
    }
    const cats = ['all']
    initialProducts.forEach(p => {
      if (p.category && !cats.includes(p.category)) {
        cats.push(p.category)
      }
    })
    return cats
  }, [initialProducts, initialCategories])

  const getCategoryLabel = (slug: string) => {
    if (slug === 'all') return dict.products.filter_all
    const dbCat = initialCategories?.find(c => c.slug === slug)
    if (dbCat) return dbCat[`name_${lang}`] || dbCat.name_en
    return (dict.products.categories[slug] || 
            dict.products.categories[slug.toLowerCase()] || 
            slug.replace(/_/g, ' '))
  }

  // Fetch products from API
  const fetchProducts = useCallback(async (
    pageNum: number,
    search: string,
    category: string,
    append: boolean = false
  ) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    if (append) {
      setIsLoading(true)
    } else {
      setIsSearching(true)
    }

    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: String(PAGE_SIZE),
        search,
        category,
        lang,
      })

      const res = await fetch(`/api/products?${params}`, {
        signal: controller.signal,
      })

      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()

      if (append) {
        setProducts(prev => [...prev, ...data.products])
      } else {
        setProducts(data.products)
      }

      setTotalCount(data.totalCount)
      setPage(pageNum)
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch products:', err)
      }
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }, [lang])

  // When search or category changes, reset and refetch from page 0
  useEffect(() => {
    // On initial mount with no search/filter, use SSR data
    if (debouncedSearch === '' && selectedCategory === 'all') {
      setProducts(initialProducts)
      setTotalCount(initialTotalCount)
      setPage(0)
      setIsSearching(false)
      return
    }

    fetchProducts(0, debouncedSearch, selectedCategory, false)
  }, [debouncedSearch, selectedCategory, fetchProducts, initialProducts, initialTotalCount])

  // Show searching indicator when typing before debounce fires
  useEffect(() => {
    if (searchQuery !== debouncedSearch) {
      setIsSearching(true)
    }
  }, [searchQuery, debouncedSearch])

  // Load more (next page)
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return
    fetchProducts(page + 1, debouncedSearch, selectedCategory, true)
  }, [isLoading, hasMore, page, debouncedSearch, selectedCategory, fetchProducts])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isSearching) {
          loadMore()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoading, isSearching, loadMore])

  return (
    <div className="flex flex-col gap-12">
      {/* Controls Bar */}
      <div className="flex flex-col p-6 rounded-3xl shadow-xs border border-gray-100 sticky top-20 z-30 ring-1 ring-black/5 backdrop-blur-sm bg-white/90">
        <div className="flex flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isSearching ? 'text-primary animate-pulse' : 'text-gray-400 group-focus-within:text-primary'}`} />
            <input
              type="text"
              placeholder={dict.products.search_placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-black placeholder:text-gray-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowCategories(!showCategories)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 border cursor-pointer ${
              showCategories || selectedCategory !== 'all'
                ? 'bg-primary/5 border-primary/20 text-primary shadow-xs'
                : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Filter className={`w-4 h-4 transition-transform duration-300 ${showCategories ? 'rotate-180' : ''}`} />
            <span className="hidden sm:inline text-xs font-black uppercase tracking-widest leading-none">
              {getCategoryLabel(selectedCategory)}
            </span>
          </button>
        </div>

        {/* Categories (Collapsible) */}
        <AnimatePresence>
          {showCategories && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t border-gray-100 flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                <div className="flex items-center gap-2 mr-2 text-gray-400">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">{dict.products.category_label}</span>
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat)
                      // Optional: close after selection on mobile? 
                      // setShowCategories(false)
                    }}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 border ${
                      selectedCategory === cat
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 border-primary'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border-gray-100 cursor-pointer'
                    }`}
                  >
                    {getCategoryLabel(cat)}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-400">
          <span className="font-bold text-gray-600">{products.length}</span>
          {' / '}
          <span>{totalCount}</span>
          {' '}
          {dict.products.items_label || 'items'}
        </p>
        {isSearching && (
          <div className="flex items-center gap-2 text-primary text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-medium">{dict.products.searching || 'Searching...'}</span>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="min-h-100">
        {products.length === 0 && !isSearching ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{dict.products.no_products_found}</h3>
            <p className="text-gray-500">{dict.products.try_adjusting}</p>
          </motion.div>
        ) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode='popLayout'>
                {products.map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard
                      product={product}
                      lang={lang}
                      dict={dict}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Sentinel element + loading indicator */}
            <div ref={sentinelRef} className="flex justify-center py-12">
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg border border-gray-100"
                >
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm font-medium text-gray-600">
                    {dict.products.loading_more || 'Loading more...'}
                  </span>
                </motion.div>
              )}
              {!hasMore && products.length > 0 && (
                <p className="text-sm text-gray-300 font-medium">
                  {dict.products.all_loaded || 'All products loaded'}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
