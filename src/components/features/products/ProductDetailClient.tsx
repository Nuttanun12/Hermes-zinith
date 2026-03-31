'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Mail, MapPin, Phone, Package, ShieldCheck, Zap } from 'lucide-react'
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
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-2xl group ring-1 ring-black/5">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                />
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
            </div>
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
