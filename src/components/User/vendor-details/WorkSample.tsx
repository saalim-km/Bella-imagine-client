"use client"

import { useState } from "react"
import { ArrowUpRight, X, Eye, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { IWorkSampleResponse } from "@/types/interfaces/vendor"

interface WorkSampleProps {
  workSample: IWorkSampleResponse
  viewMode?: "grid" | "list"
}

export default function WorkSample({ workSample, viewMode = "grid" }: WorkSampleProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const imagesPerPage = viewMode === "grid" ? 4 : 6
  const startIndex = currentPage * imagesPerPage
  const displayedImages = workSample.media.slice(0, startIndex + imagesPerPage)
  const hasMoreImages = workSample.media.length > startIndex + imagesPerPage

  const handleShowMore = () => {
    setCurrentPage((prev) => prev + 1)
  }

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden bg-background border border-border hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
        <div className="flex">
          {/* Featured Image */}
          <div className="w-80 h-48 flex-shrink-0 relative overflow-hidden">
            <img
              src={workSample.media[0] || "/placeholder.svg?height=192&width=320"}
              alt={workSample.title}
              className="object-cover w-full h-full cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage(workSample.media[0])}
            />
            <div className="absolute top-3 right-3">
              <Badge className="bg-black/70 text-white border-0 backdrop-blur-sm">
                {workSample.media.length} photos
              </Badge>
            </div>
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-6">
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
                    onClick={() => setSelectedImage(item)}
                  >
                    <img
                      src={item || "/placeholder.svg"}
                      alt={`${workSample.title} ${idx + 2}`}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-0 h-auto ${isLiked ? "text-red-500" : "text-muted-foreground"}`}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                    <span className="text-sm">24</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-muted-foreground">
                    <Share2 className="w-4 h-4 mr-1" />
                    <span className="text-sm">Share</span>
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/50 bg-transparent"
                  onClick={() => setSelectedImage(workSample.media[0])}
                >
                  View Gallery
                </Button>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Fullscreen Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-6 right-6 text-white hover:text-white/80 z-10 h-auto p-2"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="relative max-w-6xl max-h-[90vh] w-full h-full">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Full size work sample"
                className="object-contain w-full h-full"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
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
              onClick={() => setSelectedImage(item)}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 z-10 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <img
                src={item || "/placeholder.svg"}
                alt={`${workSample.title} ${idx + 1}`}
                className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
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
              className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/50 bg-transparent"
            >
              Show {Math.min(imagesPerPage, workSample.media.length - displayedImages.length)} More Photos
            </Button>
          </div>
        )}
      </CardContent>

      {/* Fullscreen Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-6 right-6 text-white hover:text-white/80 z-10 h-auto p-2"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Full size work sample"
              className="object-contain w-full h-full"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </Card>
  )
}
