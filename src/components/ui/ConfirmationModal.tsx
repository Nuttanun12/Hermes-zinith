'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Header / Icon */}
            <div className="pt-10 pb-6 px-10 flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${
                isDangerous ? 'bg-red-50 text-red-600' : 'bg-primary/10 text-primary'
              }`}>
                <AlertTriangle className="w-10 h-10" />
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-3">
                {title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="p-10 pt-0 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-8 py-4 bg-gray-50 text-gray-600 text-xs font-black rounded-2xl hover:bg-gray-100 transition-all tracking-widest uppercase"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm()
                  onClose()
                }}
                className={`flex-1 px-8 py-4 text-white text-xs font-black rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 tracking-widest uppercase shadow-xl ${
                  isDangerous 
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                    : 'bg-primary hover:bg-primary-dark shadow-primary/20'
                }`}
              >
                {confirmText}
              </button>
            </div>

            {/* Close Button (Top right) */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
