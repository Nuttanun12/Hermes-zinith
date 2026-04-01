'use client'

import { motion, Variants } from 'framer-motion'
import { MapPin, Phone, Mail, Hexagon } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ContactForm } from '@/components/features/contact/ContactForm'

export default function ContactClient({ dict }: { dict: any }) {
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

  return (
    <div className="flex flex-col bg-white">
      <PageHero
        title={dict.home.contact_section.title}
        subtitle={dict.home.contact_section.desc}
        backgroundImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop"
        icon={<Mail />}
      />

      <section className="py-24 bg-gray-50/50 relative overflow-hidden">
        {/* Decorative background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <SectionHeader 
            title={dict.contact.title_main} 
            label={dict.footer.inquiries}
            subtitle={dict.home.contact_section.desc}
          />

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* Contact Info */}
            <motion.div className="space-y-8" variants={itemVariants}>
              <div className="bg-white rounded-4xl p-10 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group flex items-start gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                  <MapPin className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-3">
                    {dict.home.contact_section.address_label}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed font-medium">
                    {dict.home.contact_section.address}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-4xl p-10 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group flex items-start gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                  <Phone className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-3">
                    {dict.home.contact_section.phone_label}
                  </h3>
                  <p className="text-gray-600 text-2xl font-bold tracking-tight">{dict.home.contact_section.phone}</p>
                </div>
              </div>

              <div className="bg-white rounded-4xl p-10 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group flex items-start gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                  <Mail className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-3">
                    {dict.home.contact_section.email_label}
                  </h3>
                  <div className="space-y-2">
                    <a
                      href={`mailto:${dict.home.contact_section.email_1}`}
                      className="text-gray-600 hover:text-primary transition-colors block text-xl font-bold tracking-tight"
                    >
                      {dict.home.contact_section.email_1}
                    </a>
                    <a
                      href={`mailto:${dict.home.contact_section.email_2}`}
                      className="text-gray-600 hover:text-primary transition-colors block text-xl font-bold tracking-tight"
                    >
                      {dict.home.contact_section.email_2}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants} className="lg:sticky lg:top-24">
              <div className="bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl border border-gray-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
                
                <h3 className="text-3xl font-black text-foreground mb-10 uppercase tracking-tight">
                  {dict.home.contact_section.send_message}
                </h3>
                
                <ContactForm dict={dict} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

