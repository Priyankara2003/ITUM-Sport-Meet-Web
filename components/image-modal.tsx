'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GalleryImage } from '@/hooks/use-gallery'

interface ImageModalProps {
  image: GalleryImage
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export function ImageModal({
  image,
  onClose,
  onNext,
  onPrev,
}: ImageModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    },
    [onClose, onNext, onPrev]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all backdrop-blur-md"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Previous button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all backdrop-blur-md"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Next button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all backdrop-blur-md"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>

        {/* Image container */}
        <motion.div
          className="relative z-[1] flex flex-col items-center max-w-[95vw] sm:max-w-[90vw] lg:max-w-[80vw] max-h-[95vh] mx-auto px-12 sm:px-16"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Image */}
          <div className="relative w-full flex items-center justify-center" style={{ maxHeight: '80vh' }}>
            <Image
              src={image.image_url}
              alt={image.title}
              width={1200}
              height={800}
              className="object-contain max-h-[80vh] w-auto h-auto rounded-lg shadow-2xl"
              priority
            />
          </div>

          {/* Info bar */}
          <div className="w-full mt-4 px-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                  {image.title}
                </h2>
                {image.description && (
                  <p className="text-sm text-white/60 truncate mt-0.5">
                    {image.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded-md bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                  {image.category}
                </span>
                {image.uploaded_by && (
                  <span className="text-xs text-white/40">
                    by {image.uploaded_by}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
