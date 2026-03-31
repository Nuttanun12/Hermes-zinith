'use client'

import { motion } from 'framer-motion'
import { LucideIcon, Hexagon } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  label?: string
  icon?: React.ReactNode
  centered?: boolean
  dark?: boolean
}

export function SectionHeader({ title, subtitle, label, icon, centered = true, dark = false }: SectionHeaderProps) {
  return (
    <motion.div
      className={`${centered ? 'text-center max-w-3xl mx-auto' : 'text-left'} mb-16`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      {label && (
        <span className={`text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4 block`}>
          {label}
        </span>
      )}
      <div className={`flex flex-col ${centered ? 'items-center' : 'items-start'} gap-4 mb-6`}>
        {icon ? (
           <div className="[&>svg]:w-12 [&>svg]:h-12 [&>svg]:text-primary">
              {icon}
           </div>
        ) : (
           <Hexagon className="w-12 h-12 text-primary" fill="none" />
        )}
        <h2 className={`text-3xl md:text-5xl font-bold uppercase tracking-tight ${dark ? 'text-white' : 'text-foreground'}`}>
          {title}
        </h2>
      </div>
      <div className={`w-24 h-1 bg-primary ${centered ? 'mx-auto' : ''} mb-6`} />
      {subtitle && (
        <p className={`text-lg leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
