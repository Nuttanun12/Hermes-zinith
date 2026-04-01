'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ContactForm({ dict }: { dict: any }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-6"
            key="success"
          >
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-black text-foreground uppercase tracking-tight">
                {dict.home.contact_section.success}
              </h4>
              <p className="text-gray-500 font-medium">
                We'll get back to you as soon as possible.
              </p>
            </div>
            <button
              onClick={() => setStatus('idle')}
              className="text-primary font-black uppercase tracking-widest text-xs hover:underline mt-4 cursor-pointer"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
            onSubmit={handleSubmit}
            key="form"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <label className="block text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 ml-1">
                  {dict.home.contact_section.name_label}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={dict.home.contact_section.name_placeholder}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium text-black placeholder:text-gray-400 outline-hidden"
                />
              </div>
              <div className="relative">
                <label className="block text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 ml-1">
                  {dict.home.contact_section.email_label_field}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={dict.home.contact_section.email_placeholder}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium text-black placeholder:text-gray-400 outline-hidden"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 ml-1">
                {dict.home.contact_section.message_label_field}
              </label>
              <textarea
                rows={6}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={dict.home.contact_section.message_placeholder}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium resize-none text-black placeholder:text-gray-400 outline-hidden"
              />
            </div>
            
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-red-600 text-sm font-bold bg-red-50 p-5 rounded-2xl border border-red-100"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {dict.home.contact_section.error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full inline-flex items-center justify-center px-8 py-6 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all duration-300 transform hover:scale-[1.02] active:scale-95 tracking-widest uppercase text-xs shadow-xl shadow-primary/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  {dict.home.contact_section.sending}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-3" />
                  {dict.home.contact_section.submit}
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
