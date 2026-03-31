import { Package } from 'lucide-react'

export function ProductCard({
  product,
  lang,
  dict,
}: {
  product: any
  lang: string
  dict: any
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
  const desc = getLocalizedField('description')

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex flex-col h-full ring-1 ring-black/5">
      <div className="w-full h-64 bg-gray-50 flex items-center justify-center overflow-hidden relative">
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-bold text-primary uppercase tracking-widest rounded-full shadow-sm border border-primary/10">
            {product.category || dict.products.categories.all}
          </span>
        </div>
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={title || 'Product Image'} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-20">
            <Package className="w-16 h-16 text-gray-400" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-8 flex flex-col grow">
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-1">
          {title}
        </h3>
        <p className="text-gray-500 text-sm mb-8 grow line-clamp-3 leading-relaxed">
          {desc}
        </p>
        <button className="mt-auto px-6 py-3 bg-white border-2 border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary font-bold rounded-xl transition-all duration-300 text-xs w-full uppercase tracking-widest shadow-xs group-hover:shadow-md active:scale-95">
          {dict.products.view_details}
        </button>
      </div>
    </div>
  )
}
