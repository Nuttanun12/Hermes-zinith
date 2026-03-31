'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock as LockIcon } from 'lucide-react'

interface LoginClientProps {
  dict: any
  lang: string
}

export default function LoginClient({ dict, lang }: LoginClientProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      router.push(`/${lang}/admin`)
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-primary/10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-4xl bg-white shadow-xl shadow-gray-200/50 mb-10 border border-gray-50 transform -rotate-12">
          <LockIcon className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2 italic">
          {dict.admin.login}
        </h2>
        <p className="text-gray-400 text-sm font-medium tracking-widest uppercase mb-12">
          Hermes-Zenith Control Center
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-12 px-10 shadow-2xl shadow-gray-200/50 rounded-[3rem] border border-gray-50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
          
          <form className="space-y-10 relative z-10" onSubmit={handleLogin}>
            <div className="space-y-8">
              <div className="relative">
                <label className="block text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 ml-1">
                  {dict.admin.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium text-black placeholder:text-gray-400"
                  placeholder="admin@hermes-zenith.com"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 ml-1">
                  {dict.admin.password}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium text-black placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-8 py-6 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all duration-300 transform hover:scale-[1.02] active:scale-95 tracking-[0.2em] uppercase text-xs shadow-xl shadow-primary/20 disabled:opacity-50"
            >
               {loading ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
               ) : (
                 <LockIcon className="w-5 h-5 mr-3" />
               )}
               {dict.admin.submit}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
