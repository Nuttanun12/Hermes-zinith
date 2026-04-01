'use client'

import { motion, Variants } from 'framer-motion'
import { Wrench, Zap, CheckCircle2, ArrowRight, ShieldCheck, Settings, Activity, Hexagon } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import Link from 'next/link'

export default function ServicesClient({ dict, lang }: { dict: any; lang: string }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const steps = [
    { title: dict.services.process.step1_title, desc: dict.services.process.step1_desc, icon: Activity },
    { title: dict.services.process.step2_title, desc: dict.services.process.step2_desc, icon: Settings },
    { title: dict.services.process.step3_title, desc: dict.services.process.step3_desc, icon: Wrench },
    { title: dict.services.process.step4_title, desc: dict.services.process.step4_desc, icon: ShieldCheck },
  ]

  return (
    <div className="flex flex-col bg-white">
      <PageHero
        title={dict.services.title}
        subtitle={dict.services.hero_subtitle}
        backgroundImage="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
        icon={<Hexagon />}
      />

      {/* Main Services Grid */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Repair Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative bg-gray-50 rounded-3xl p-10 md:p-16 border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
              
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
                <Wrench className="w-10 h-10 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              
              <h2 className="text-3xl font-bold text-foreground mb-6 uppercase tracking-tight">
                {dict.services.repair.title}
              </h2>
              
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                {dict.services.repair.desc}
              </p>
              
              <div className="space-y-4">
                {[dict.services.repair.benefit1, dict.services.repair.benefit2, dict.services.repair.benefit3].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="shrink-0 w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center">
                       <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Cleaning Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative bg-gray-900 rounded-3xl p-10 md:p-16 border border-gray-800 hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
              
              <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:-rotate-6 transition-all duration-300">
                <Zap className="w-10 h-10 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tight">
                {dict.services.cleaning.title}
              </h2>
              
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                {dict.services.cleaning.desc}
              </p>
              
              <div className="space-y-4">
                {[dict.services.cleaning.benefit1, dict.services.cleaning.benefit2, dict.services.cleaning.benefit3].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-300">
                    <div className="shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                       <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <SectionHeader title={dict.services.process.title} />

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {steps.map((step, idx) => (
              <motion.div key={idx} variants={itemVariants} className="relative group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500 z-10 border border-gray-100 group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/20">
                    <step.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 uppercase tracking-wide">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
                
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-linear-to-r from-primary/30 to-transparent -translate-x-1/2 z-0" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-primary p-12 md:p-24 rounded-[3rem] relative overflow-hidden text-center"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 uppercase tracking-tight">
                {dict.services.cta_title}
              </h2>
              <p className="text-primary-light text-lg mb-12 opacity-90 italic">
                {dict.services.cta_desc}
              </p>
              <Link
                href={`/${lang}/contact`} 
                className="inline-flex items-center px-16 py-6 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-all duration-300 group shadow-xl uppercase tracking-widest text-sm"
              >
                {dict.services.cta_button}
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            
            {/* Decors */}
            <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-black/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
