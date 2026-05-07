'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useGallery } from '@/hooks/use-gallery'
import { cubicBezier, motion } from 'framer-motion'

export function HomeGalleryPreview() {
  const { images, loading } = useGallery('2026')

  const easeOut = cubicBezier(0.22, 1, 0.36, 1)

  // Show latest 8 images from 2026 category
  const previewImages = images.slice(0, 8)

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading gallery...
      </div>
    )
  }

  if (previewImages.length === 0) {
    return (
      <div className="text-center py-12 border border-border rounded-xl bg-card">
        <p className="text-muted-foreground text-sm">No 2026 gallery images uploaded yet.</p>
        <p className="text-muted-foreground/60 text-xs mt-1">Stay tuned — photos will appear here soon!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {previewImages.map((image, idx) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeOut, delay: idx * 0.05 }}
            className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-muted cursor-pointer"
          >
            <Image
              src={image.image_url}
              alt={image.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
              <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs font-semibold line-clamp-1 drop-shadow-md">
                  {image.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/gallery"
          className="inline-block px-8 py-3 rounded-lg bg-black text-white font-bold tracking-wider uppercase text-sm hover:bg-black/85 transition-all duration-300 border border-black"
        >
          View All Photos
        </Link>
      </div>
    </div>
  )
}
