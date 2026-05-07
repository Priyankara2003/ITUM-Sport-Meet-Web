'use client'

import Image from 'next/image'
import { GalleryImage } from '@/hooks/use-gallery'

interface GalleryItemProps {
  image: GalleryImage
  onClick?: () => void
}

export function GalleryItem({ image, onClick }: GalleryItemProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={image.image_url}
          alt={image.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>

      <div className="p-4 bg-card">
        <h3 className="font-bold text-foreground line-clamp-2">
          {image.title}
        </h3>
        {image.description && (
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
            {image.description}
          </p>
        )}
        <div className="flex items-center mt-3">
          <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
            {image.category}
          </span>
        </div>
      </div>
    </div>
  )
}
