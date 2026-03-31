'use client'

import { motion, Variants } from 'framer-motion'
import { ArrowRight, Settings, ShieldCheck, Factory, Wind, Droplets, Palette, Filter, MapPin, Phone, Mail, Send, Target, Eye, Hexagon } from 'lucide-react'
import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'

export default function HomeClient({ dict, lang }: { dict: any; lang: string }) {
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

  const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  }

  const slideInRight: Variants = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  }

  const productCards = [
    {
      icon: <Wind />,
      title: dict.home.products_section.breather_title,
      desc: dict.home.products_section.breather_desc,
    },
    {
      icon: <Droplets />,
      title: dict.home.products_section.grease_title,
      desc: dict.home.products_section.grease_desc,
    },
    {
      icon: <Palette />,
      title: dict.home.products_section.container_title,
      desc: dict.home.products_section.container_desc,
    },
    {
      icon: <Filter />,
      title: dict.home.products_section.filter_title,
      desc: dict.home.products_section.filter_desc,
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-gray-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/90 z-10" />
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 12, ease: 'linear' }}
            className="w-full h-full bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-40"
          />
        </div>

        <motion.div
          className="relative z-20 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-block mb-10"
          >
            <span className="text-primary text-xs md:text-sm font-black tracking-[0.5em] uppercase py-3 px-6 border border-primary/30 rounded-full backdrop-blur-md bg-primary/5">
              {dict.home.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {dict.home.hero.title}
          </motion.h1>
          <motion.h2
            className="text-lg md:text-2xl text-primary-light/80 mb-14 font-medium tracking-wide max-w-2xl mx-auto italic leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {dict.home.hero.subtitle}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              href={`/${lang}/products`}
              className="inline-flex items-center justify-center px-12 py-5 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 tracking-widest uppercase text-xs shadow-2xl shadow-primary/30"
            >
              {dict.home.hero.cta}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a
              href="#about"
              className="inline-flex items-center justify-center px-12 py-5 border-2 border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 tracking-widest uppercase text-xs backdrop-blur-md"
            >
              {dict.home.about_section.learn_more}
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-8 h-14 rounded-full border-2 border-white/10 flex items-start justify-center p-2 backdrop-blur-xs">
            <motion.div 
               animate={{ opacity: [0.3, 1, 0.3] }}
               transition={{ duration: 1.5, repeat: Infinity }}
               className="w-1.5 h-3 bg-primary rounded-full" 
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader 
            title={dict.home.features.title} 
            subtitle={dict.home.features.desc}
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="bg-gray-50 p-12 rounded-4xl border border-gray-100 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
              <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
                <Factory className="w-12 h-12 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold mb-5 uppercase text-foreground tracking-tight">
                {dict.products.categories.air_compressor}
              </h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                {dict.home.features.air_compressor_desc}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gray-50 p-12 rounded-4xl border border-gray-100 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
              <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-primary group-hover:-rotate-6 transition-all duration-300">
                <ShieldCheck className="w-12 h-12 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold mb-5 uppercase text-foreground tracking-tight">
                {dict.products.categories.filters} & {dict.products.categories.lubrication}
              </h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                {dict.home.features.filtration_desc}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gray-50 p-12 rounded-4xl border border-gray-100 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
              <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
                <Settings className="w-12 h-12 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold mb-5 uppercase text-foreground tracking-tight">{dict.nav.services}</h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                {dict.home.features.services_desc}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Showcase Section */}
      <section id="about" className="py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/10 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div variants={slideInLeft}>
              <SectionHeader 
                title="Hermes-Zenith" 
                label={dict.home.about_section.title}
                centered={false}
                icon={<Hexagon />}
                dark={true}
              />
              <p className="text-gray-400 text-xl leading-relaxed mb-12 italic border-l-4 border-primary/30 pl-8">
                {dict.home.about_section.desc}
              </p>

              <Link
                href={`/${lang}/about`}
                className="inline-flex items-center px-12 py-5 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 tracking-widest uppercase text-xs"
              >
                {dict.home.about_section.learn_more}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div variants={slideInRight} className="space-y-8">
              <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-12 hover:bg-white/8 transition-all duration-500 group">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-all">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider">
                    {dict.home.about_section.mission_title}
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {dict.home.about_section.mission}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-12 hover:bg-white/8 transition-all duration-500 group">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-all">
                    <Eye className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider">
                    {dict.home.about_section.vision_title}
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {dict.home.about_section.vision}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Products Showcase Section */}
      <section id="products" className="py-32 bg-white relative">
        <div className="container mx-auto px-4">
          <SectionHeader 
             title={dict.home.products_section.title}
             subtitle={dict.home.products_section.desc}
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
          >
            {productCards.map((card, index) => {
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative bg-gray-50 rounded-4xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-12"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
                  
                  <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
                    <div className="text-primary group-hover:text-white transition-colors duration-300 [&>svg]:w-12 [&>svg]:h-12">
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-5 uppercase tracking-wide text-foreground leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">{card.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>

          <div className="text-center mt-20">
            <Link
              href={`/${lang}/products`}
              className="inline-flex items-center px-14 py-6 bg-white border-2 border-primary/20 text-primary font-bold rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 transform hover:scale-105 tracking-widest uppercase text-xs shadow-sm"
            >
              {dict.home.products_section.view_all}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section Preview */}
      <section id="contact" className="py-32 bg-gray-50 relative">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title={dict.home.contact_section.title}
            subtitle={dict.home.contact_section.desc}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
            <motion.div variants={slideInLeft} className="space-y-8">
              {[
                { icon: MapPin, label: dict.home.contact_section.address_label, value: dict.home.contact_section.address },
                { icon: Phone, label: dict.home.contact_section.phone_label, value: dict.home.contact_section.phone },
                { icon: Mail, label: dict.home.contact_section.email_label, value: dict.home.contact_section.email_1 }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group flex items-start gap-8">
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                    <item.icon className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-2">{item.label}</h4>
                    <p className="text-gray-600 text-lg font-medium leading-relaxed">{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={slideInRight}>
               <div className="bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl border border-gray-100 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <h3 className="text-3xl font-black text-foreground mb-10 uppercase tracking-tight">
                    {dict.home.contact_section.quick_inquiry}
                  </h3>
                  <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <input 
                         type="text" 
                         placeholder={dict.home.contact_section.name_placeholder}
                         className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 text-black"
                       />
                       <input 
                         type="email" 
                         placeholder={dict.home.contact_section.email_placeholder}
                         className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 text-black"
                       />
                    </div>
                    <textarea 
                      placeholder={dict.home.contact_section.message_placeholder}
                      rows={4}
                      className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-gray-400 text-black"
                    />
                    <button className="w-full py-6 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20">
                      {dict.home.contact_section.submit}
                    </button>
                  </form>
               </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
