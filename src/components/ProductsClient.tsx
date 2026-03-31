'use client'

import { useState, useMemo } from 'react'
import { ProductCard } from './ProductCard'
import { Search, Filter, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductsClient({
  products,
  dict,
  lang,
}: {
  products: any[]
  dict: any
  lang: string
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = useMemo(() => {
    const cats = ['all']
    products.forEach(p => {
      if (p.category && !cats.includes(p.category)) {
        cats.push(p.category)
      }
    })
    return cats
  }, [products])

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
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between p-6 rounded-3xl shadow-xs border border-gray-100 sticky top-20 z-30 ring-1 ring-black/5 backdrop-blur-sm bg-white/90">
        
        {/* Search */}
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder={dict.products.search_placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
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

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-end w-full lg:w-auto">
          <div className="flex items-center gap-2 mr-2 text-gray-400">
             <Filter className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-widest">{dict.products.category_label}</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-2 ring-primary/20'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-100'
              }`}
            >
              {cat === 'all' ? dict.products.filter_all : cat}
            </button>
          ))}
        </div>
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
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
