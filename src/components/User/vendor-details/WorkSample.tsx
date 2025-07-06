"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { ArrowUpRight, X, Eye, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import type { IWorkSampleResponse } from "@/types/interfaces/vendor"

interface WorkSampleProps {
  workSample: IWorkSampleResponse
  viewMode?: "grid" | "list"
}

// Image cache for storing loaded images
const imageCache = new Map<string, HTMLImageElement>()

// Optimized Image Component with lazy loading and caching
const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  onClick, 
  priority = false,
  ...props 
}: {
  src: string
  alt: string
  className?: string
  onClick?: () => void
  priority?: boolean
  [key: string]: any
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observerRef.current?.disconnect()
          }
        })
      },
      { rootMargin: '50px' }
    )

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [priority])

  // Preload and cache image
  const preloadImage = useCallback((imageSrc: string) => {
    if (imageCache.has(imageSrc)) {
      setIsLoading(false)
      return
    }

    const img = new Image()
    img.onload = () => {
      imageCache.set(imageSrc, img)
      setIsLoading(false)
    }
    img.onerror = () => {
      setHasError(true)
      setIsLoading(false)
    }
    img.src = imageSrc
  }, [])

  useEffect(() => {
    if (isInView && src) {
      preloadImage(src)
    }
  }, [isInView, src, preloadImage])

  if (!isInView) {
    return (
      <div 
        ref={imgRef}
        className={`bg-muted animate-pulse ${className}`}
        {...props}
      />
    )
  }

  if (hasError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <X className="w-8 h-8 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
        </div>
      )}
      <img
        ref={imgRef}
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`object-cover w-full h-full transition-opacity duration-200 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  )
}

// Enhanced Carousel with better controls
const EnhancedCarousel = ({ 
  images, 
  initialIndex = 0, 
  title, 
  onClose 
}: {
  images: string[]
  initialIndex: number
  title: string
  onClose: () => void
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isImageLoading, setIsImageLoading] = useState(true)

  // Preload adjacent images for smoother navigation
  useEffect(() => {
    const preloadAdjacentImages = () => {
      const indicesToPreload = [
        currentIndex - 1,
        currentIndex + 1,
        currentIndex - 2,
        currentIndex + 2
      ].filter(i => i >= 0 && i < images.length)

      indicesToPreload.forEach(index => {
        if (!imageCache.has(images[index])) {
          const img = new Image()
          img.src = images[index]
          img.onload = () => imageCache.set(images[index], img)
        }
      })
    }

    preloadAdjacentImages()
  }, [currentIndex, images])

  const goToPrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : images.length - 1)
    setIsImageLoading(true)
  }

  const goToNext = () => {
    setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0)
    setIsImageLoading(true)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full p-2"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Image Counter */}
        <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full p-3"
          onClick={goToPrevious}
          disabled={images.length <= 1}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full p-3"
          onClick={goToNext}
          disabled={images.length <= 1}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Main Image Container */}
        <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-16">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          <div className="relative flex items-center justify-center w-full h-full">
            <img
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`${title} ${currentIndex + 1}`}
              className={`block max-w-full max-h-full object-contain transition-opacity duration-200 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ 
                maxWidth: 'calc(100vw - 8rem)',
                maxHeight: 'calc(100vh - 12rem)'
              }}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/50 p-2 rounded-lg backdrop-blur-sm max-w-[calc(100vw-2rem)] overflow-x-auto">
            {images.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((image, idx) => {
              const actualIndex = Math.max(0, currentIndex - 2) + idx
              return (
                <button
                  key={actualIndex}
                  onClick={() => {
                    setCurrentIndex(actualIndex)
                    setIsImageLoading(true)
                  }}
                  className={`w-12 h-12 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
                    actualIndex === currentIndex 
                      ? 'border-white' 
                      : 'border-transparent hover:border-white/50'
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${actualIndex + 1}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function WorkSample({ workSample, viewMode = "grid" }: WorkSampleProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(0)

  const imagesPerPage = viewMode === "grid" ? 4 : 6
  const displayedImages = useMemo(() => (
    workSample.media.slice(0, (currentPage + 1) * imagesPerPage)
  ), [workSample.media, currentPage, imagesPerPage])

  const hasMoreImages = workSample.media.length > displayedImages.length

  const handleShowMore = useCallback(() => {
    setCurrentPage(prev => prev + 1)
  }, [])

  const openModal = useCallback((index: number) => {
    setSelectedImageIndex(index)
  }, [])

  const closeModal = useCallback(() => {
    setSelectedImageIndex(null)
  }, [])

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden bg-background border border-border">
        <div className="flex flex-col md:flex-row">
          {/* Featured Image */}
          <div className="w-full md:w-[360px] h-48 md:h-auto md:min-h-[320px] flex-shrink-0 relative">
            <AspectRatio ratio={16/9}>
              <OptimizedImage
                src={workSample.media[0]}
                alt={workSample.title}
                className="cursor-pointer"
                onClick={() => openModal(0)}
                priority
              />
            </AspectRatio>
            <Badge className="absolute top-3 right-3 bg-black/70 text-white border-0 backdrop-blur-sm">
              {workSample.media.length} photos
            </Badge>
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{workSample.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{workSample.description}</p>
              </div>

              {/* Image Grid Preview */}
              <div className="grid grid-cols-4 gap-2">
                {workSample.media.slice(1, 5).map((item, idx) => (
                  <div
                    key={idx}
                    className="aspect-square overflow-hidden rounded cursor-pointer group relative"
                    onClick={() => openModal(idx + 1)}
                  >
                    <OptimizedImage
                      src={item}
                      alt={`${workSample.title} ${idx + 2}`}
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-end pt-2 border-t border-border mt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/50"
                onClick={() => openModal(0)}
              >
                View Gallery
              </Button>
            </div>
          </CardContent>
        </div>

        {/* Enhanced Carousel Modal */}
        <Dialog open={selectedImageIndex !== null} onOpenChange={closeModal}>
          <DialogContent className="max-w-none max-h-none w-full h-full p-0 bg-transparent border-none overflow-hidden">
            {selectedImageIndex !== null && (
              <EnhancedCarousel
                images={workSample.media}
                initialIndex={selectedImageIndex}
                title={workSample.title}
                onClose={closeModal}
              />
            )}
          </DialogContent>
        </Dialog>
      </Card>
    )
  }

  // Grid view (default)
  return (
    <Card className="overflow-hidden bg-background border border-border hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{workSample.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{workSample.description}</p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          {displayedImages.map((item, idx) => (
            <div
              key={idx}
              className="relative aspect-square overflow-hidden cursor-pointer group"
              onClick={() => openModal(idx)}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 z-10 flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <OptimizedImage
                src={item}
                alt={`${workSample.title} ${idx + 1}`}
                className="w-full h-full"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {hasMoreImages && (
          <div className="text-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowMore}
              className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/50"
            >
              Show {Math.min(imagesPerPage, workSample.media.length - displayedImages.length)} More
            </Button>
          </div>
        )}
      </CardContent>

      {/* Enhanced Carousel Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeModal}>
        <DialogContent className="max-w-none max-h-none w-full h-full p-0 bg-transparent border-none overflow-hidden">
          {selectedImageIndex !== null && (
            <EnhancedCarousel
              images={workSample.media}
              initialIndex={selectedImageIndex}
              title={workSample.title}
              onClose={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}