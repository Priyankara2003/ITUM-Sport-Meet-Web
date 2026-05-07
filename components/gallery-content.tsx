'use client'

import { useState, useEffect } from 'react'
import { useGallery } from '@/hooks/use-gallery'
import { GalleryItem } from './gallery-item'
import { ImageModal } from './image-modal'
import { GalleryImage } from '@/hooks/use-gallery'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ITEMS_PER_PAGE = 12

export function GalleryContent() {
  const { images, loading, error } = useGallery()
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Get all unique categories
  const categories = Array.from(new Set(images.map((img) => img.category)))

  // Filter images by selected category
  const filteredImages = selectedCategory
    ? images.filter((img) => img.category === selectedCategory)
    : images

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  // Pagination logic
  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedImages = filteredImages.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading gallery...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        Error loading gallery: {error}
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border hover:border-primary'
            }`}
          >
            All ({images.length})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:border-primary'
              }`}
            >
              {category} ({images.filter((img) => img.category === category).length})
            </button>
          ))}
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No images in this category
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedImages.map((image) => (
              <GalleryItem
                key={image.id}
                image={image}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-black text-white font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/85"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'bg-card border border-border text-foreground hover:border-primary'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-black text-white font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/85"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onNext={() => {
            const currentIdx = filteredImages.findIndex(
              (img) => img.id === selectedImage.id
            )
            if (currentIdx < filteredImages.length - 1) {
              setSelectedImage(filteredImages[currentIdx + 1])
            }
          }}
          onPrev={() => {
            const currentIdx = filteredImages.findIndex(
              (img) => img.id === selectedImage.id
            )
            if (currentIdx > 0) {
              setSelectedImage(filteredImages[currentIdx - 1])
            }
          }}
        />
      )}
    </>
  )
}
