'use client'

import { useState, useMemo } from 'react'
import { ProductCard } from './ProductCard'
import { Search, Filter, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductsClient({
  products,
  initialCategories,
  dict,
  lang,
}: {
  products: any[]
  initialCategories: any[]
  dict: any
  lang: string
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCategories, setShowCategories] = useState(false)

  const categories = useMemo(() => {
    if (initialCategories && initialCategories.length > 0) {
      return ['all', ...initialCategories.map(c => c.slug)]
    }
    const cats = ['all']
    products.forEach(p => {
      if (p.category && !cats.includes(p.category)) {
        cats.push(p.category)
      }
    })
    return cats
  }, [products, initialCategories])

  const getCategoryLabel = (slug: string) => {
    if (slug === 'all') return dict.products.filter_all
    const dbCat = initialCategories?.find(c => c.slug === slug)
    if (dbCat) return dbCat[`name_${lang}`] || dbCat.name_en
    return (dict.products.categories[slug] || 
            dict.products.categories[slug.toLowerCase()] || 
            slug.replace(/_/g, ' '))
  }

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const title = (product[`title_${lang}`] || product.title_en || '').toLowerCase()
      const desc = (product[`description_${lang}`] || product.description_en || '').toLowerCase()
      const matchesSearch = title.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, selectedCategory, lang])

  return (
    <div className="flex flex-col gap-12">
      {/* Controls Bar */}
      {/* Controls Bar */}
      <div className="flex flex-col p-6 rounded-3xl shadow-xs border border-gray-100 sticky top-20 z-30 ring-1 ring-black/5 backdrop-blur-sm bg-white/90">
        <div className="flex flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
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
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 border ${
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
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border-gray-100'
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

      {/* Grid */}
      <div className="min-h-100">
        {filteredProducts.length === 0 ? (
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
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product) => (
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
        )}
      </div>
    </div>
  )
}
