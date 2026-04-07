'use client'

import { motion, Variants } from 'framer-motion'
import { Landmark, ShieldCheck, Users, Briefcase, Award, TrendingUp, Factory, Hexagon } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import Link from 'next/link'

export default function AboutClient({ dict, lang }: { dict: any; lang: string }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const statCards = [
    { label: dict.about.stats.experience, value: '2+', icon: Briefcase },
    { label: dict.about.stats.reliability, value: '100%', icon: ShieldCheck },
    { label: dict.about.stats.partners, value: '50+', icon: Users },
  ]

  const coreValues = [
    { label: dict.about.values.integrity, icon: Landmark, desc: dict.about.values.integrity_desc },
    { label: dict.about.values.innovation, icon: TrendingUp, desc: dict.about.values.innovation_desc },
    { label: dict.about.values.quality, icon: Award, desc: dict.about.values.quality_desc },
  ]

  return (
    <div className="flex flex-col bg-white overflow-hidden text-sm md:text-base">
      <PageHero
        title={dict.about.hero_title}
        subtitle={dict.about.hero_desc}
        backgroundImage="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
        icon={<Hexagon />}
      />

      {/* Story & Stats Section */}
      <section className="py-24 bg-white relative">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <motion.div
                 initial={{ opacity: 0, x: -30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
               >
                  <SectionHeader 
                    title={dict.about.story_title} 
                    centered={false} 
                    icon={<Hexagon />}
                  />
                  <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                    {dict.about.story_content}
                  </p>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-primary/20 pl-6 mb-12">
                     {dict.about.content}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {statCards.map((stat, idx) => (
                       <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-primary/20 transition-colors">
                          <stat.icon className="w-6 h-6 text-primary mb-4" />
                          <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</div>
                       </div>
                     ))}
                  </div>
               </motion.div>
               
               <motion.div
                 initial={{ opacity: 0, x: 30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 className="relative"
               >
                  <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-2xl relative">
                     <img 
                       src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop" 
                       alt="Industrial Excellence" 
                       className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                     />
                     <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary/5 rounded-full blur-2xl -z-10" />
               </motion.div>
            </div>
         </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
         <div className="container mx-auto px-4">
            <SectionHeader title={dict.about.values.title} />

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
               {coreValues.map((value, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={itemVariants}
                    className="bg-white p-10 rounded-2xl shadow-xs border border-gray-100 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group text-center"
                  >
                     <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary transition-colors duration-300">
                        <value.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                     </div>
                     <h3 className="text-xl font-bold text-foreground mb-4 uppercase tracking-wide">
                        {value.label}
                     </h3>
                     <p className="text-gray-500 leading-relaxed">
                        {value.desc}
                     </p>
                  </motion.div>
               ))}
            </motion.div>
         </div>
      </section>

       {/* CTA Section */}
       <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-black/5 -skew-x-12 translate-x-1/2" />
          <div className="container mx-auto px-4 relative z-10 text-center">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 uppercase tracking-tight">
                {dict.about.cta_title}
             </h2>
             <Link 
               href={`/${lang}/contact`} 
               className="inline-flex items-center px-12 py-5 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl uppercase tracking-widest text-sm"
             >
                {dict.about.cta_button}
             </Link>
          </div>
       </section>
    </div>
  )
}
