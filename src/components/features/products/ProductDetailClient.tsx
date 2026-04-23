'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, MapPin, Phone, Package, ShieldCheck, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function ProductDetailClient({
  product,
  dict,
  lang,
}: {
  product: any
  dict: any
  lang: string
}) {
  const getLocalizedField = (field: string) => {
    switch (lang) {
      case 'th': return product[`${field}_th`] || product[`${field}_en`]
      case 'zh': return product[`${field}_zh`] || product[`${field}_en`]
      case 'en':
      default: return product[`${field}_en`]
    }
  }

  const title = getLocalizedField('title')
  const description = getLocalizedField('description')

  // Build images array — prefer image_urls, fallback to image_url
  const images: string[] = (() => {
    if (product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
      return product.image_urls
    }
    if (product.image_url) {
      return [product.image_url]
    }
    return []
  })()

  const [selectedIndex, setSelectedIndex] = useState(0)
  const hasMultipleImages = images.length > 1

  const goToPrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Breadcrumb / Back Navigation */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="mb-12"
        >
          <Link 
            href={`/${lang}/products`}
            className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-primary transition-colors group uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {dict.products.back_to_products}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
          {/* Image Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="sticky top-32"
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-2xl group ring-1 ring-black/5">
              {images.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedIndex}
                    src={images[selectedIndex]}
                    alt={`${title} - ${selectedIndex + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center opacity-10">
                   <Package className="w-32 h-32" />
                   <span className="font-black text-xl uppercase tracking-widest mt-4">{dict.products.no_image}</span>
                </div>
              )}
              
              {/* Category Overlay */}
              <div className="absolute top-8 left-8">
                <span className="px-6 py-2 bg-white/90 backdrop-blur-md text-xs font-black text-primary uppercase tracking-[0.2em] rounded-full shadow-lg border border-primary/10">
                  {product.category || dict.products.industrial}
                </span>
              </div>

              {/* Navigation Arrows (only when multiple images) */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={goToPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/50 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/50 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* Image counter pill */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-wider">
                    {selectedIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {hasMultipleImages && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
              >
                {images.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                      selectedIndex === index
                        ? 'border-primary ring-2 ring-primary/30 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-gray-300 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-primary" />
                <span className="text-xs font-black text-primary uppercase tracking-[0.5em]">{dict.products.specification}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-[0.9] mb-8">
                {title}
              </h1>
              <div className="prose prose-lg text-gray-500 leading-relaxed max-w-none whitespace-pre-wrap font-medium">
                {description}
              </div>
            </div>

            {/* Inquiry Section Card */}
            <div className="bg-gray-900 rounded-[2.5rem] p-10 md:p-12 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/30 transition-all duration-700" />
              
              <h3 className="text-2xl font-black uppercase tracking-tight mb-8 relative z-10 leading-tight">
                 {dict.products.interested} <br />
                 <span className="text-primary">{dict.products.get_quote}</span>
              </h3>
              
              <div className="space-y-6 mb-10 relative z-10">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-gray-300">061-426-2362</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-gray-300">sale@hermes-zenith.com</span>
                </div>
              </div>

              <Link
                href={`/${lang}/contact?subject=Inquiry: ${title}`}
                className="inline-flex items-center justify-center px-10 py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 tracking-widest uppercase text-xs shadow-xl shadow-primary/20 relative z-10"
              >
                {dict.products.send_inquiry}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
