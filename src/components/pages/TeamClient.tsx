'use client'

import { motion, Variants } from 'framer-motion'
import { Hexagon, User, IdCard, Briefcase } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'

export default function TeamClient({ dict, lang }: { dict: any; lang: string }) {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const members = [
    { id: '6788008', ...dict.team.members['6788008'] },
    { id: '6788009', ...dict.team.members['6788009'] },
    { id: '6788031', ...dict.team.members['6788031'] },
    { id: '6788060', ...dict.team.members['6788060'] },
  ]

  return (
    <div className="flex flex-col bg-white overflow-hidden text-sm md:text-base">
      <PageHero
        title={dict.team.title}
        subtitle={dict.team.subtitle}
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
        icon={<User />}
      />

      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <SectionHeader title={dict.team.title} icon={<Hexagon />} />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {members.map((member) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                className="group relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl"
              >
                {/* Image Container */}
                <div className="aspect-4/5 relative overflow-hidden bg-gray-200">
                  <img
                    src={`/photo/${member.id}.jpg`}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop'
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Hover Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-white/90 text-xs">
                        <IdCard className="w-3 h-3 text-primary" />
                        <span className="font-mono">{member.id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-xs">
                        <Briefcase className="w-3 h-3 text-primary" />
                        <span>{member.role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-6 text-center group-hover:bg-primary transition-colors duration-500">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-white transition-colors duration-500 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-500 uppercase tracking-wider font-semibold">
                    {member.role}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 group-hover:text-white/60 transition-colors duration-500">
                    <IdCard className="w-4 h-4" />
                    <span className="text-xs font-mono">{member.id}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
