'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface PageHeroProps {
  title: string
  subtitle?: string
  backgroundImage: string
  icon?: React.ReactNode
}

export function PageHero({ title, subtitle, backgroundImage, icon }: PageHeroProps) {
  return (
    <section className="relative h-[45vh] md:h-[50vh] flex items-center justify-center bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/90 z-10" />
        <motion.div
           initial={{ scale: 1.1 }}
           animate={{ scale: 1 }}
           transition={{ duration: 10 }}
           className="w-full h-full"
        >
          <img 
            src={backgroundImage} 
            alt={title} 
            className="w-full h-full object-cover grayscale opacity-40" 
          />
        </motion.div>
      </div>
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        {icon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex justify-center [&>svg]:w-16 [&>svg]:h-16 [&>svg]:text-primary"
          >
            {icon}
          </motion.div>
        )}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-6xl font-extrabold text-white mb-6 uppercase tracking-tight"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-primary-light max-w-2xl mx-auto leading-relaxed italic"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}
