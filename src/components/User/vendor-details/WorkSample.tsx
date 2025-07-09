"use client";
import { useState, useEffect, useRef } from "react";
import { Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { IWorkSampleResponse } from "@/types/interfaces/vendor";
import { DialogTitle } from "@radix-ui/react-dialog";

interface MasonryPortfolioProps {
  workSamples: IWorkSampleResponse[];
}

interface MasonryItem {
  src: string;
  alt: string;
  title: string;
  description: string;
  originalIndex: number;
  sampleIndex: number;
}

export function MasonryPortfolio({ workSamples }: MasonryPortfolioProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [allImages, setAllImages] = useState<MasonryItem[]>([]);
  const [columns, setColumns] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten all images from work samples
  useEffect(() => {
    const images: MasonryItem[] = [];
    workSamples.forEach((sample, sampleIndex) => {
      sample.media.forEach((media, mediaIndex) => {
        images.push({
          src: media,
          alt: `${sample.title} ${mediaIndex + 1}`,
          title: sample.title,
          description: sample.description || "",
          originalIndex: images.length,
          sampleIndex,
        });
      });
    });
    setAllImages(images);
  }, [workSamples]);

  // Responsive columns
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) setColumns(2);
      else if (window.innerWidth < 1024) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Distribute images across columns
  const distributeImages = () => {
    const columnArrays: MasonryItem[][] = Array.from(
      { length: columns },
      () => []
    );

    allImages.forEach((image, index) => {
      const columnIndex = index % columns;
      columnArrays[columnIndex].push(image);
    });

    return columnArrays;
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prev) =>
      prev !== null ? (prev > 0 ? prev - 1 : allImages.length - 1) : null
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) =>
      prev !== null ? (prev < allImages.length - 1 ? prev + 1 : 0) : null
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex]);

  if (!allImages.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No portfolio images available</p>
      </div>
    );
  }

  const columnArrays = distributeImages();

  return (
    <>
      <div ref={containerRef} className="flex gap-4">
        {columnArrays.map((columnImages, columnIndex) => (
          <div key={columnIndex} className="flex-1 space-y-4">
            {columnImages.map((image) => (
              <div
                key={image.originalIndex}
                className="relative group cursor-pointer overflow-hidden rounded-lg bg-muted"
                onClick={() => openModal(image.originalIndex)}
              >
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="text-white font-medium text-sm truncate">
                    {image.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeModal}>
        <DialogContent className="max-w-none max-h-none w-full h-full p-0 bg-transparent border-none">
          <DialogTitle>{workSamples[0].title}</DialogTitle>

          {selectedImageIndex !== null && (
            <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full p-2"
                  onClick={closeModal}
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Image Counter */}
                <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {selectedImageIndex + 1} / {allImages.length}
                </div>

                {/* Navigation Buttons */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full p-3"
                  onClick={goToPrevious}
                  disabled={allImages.length <= 1}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full p-3"
                  onClick={goToNext}
                  disabled={allImages.length <= 1}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>

                {/* Main Image */}
                <div className="relative w-full h-full flex items-center justify-center p-8">
                  <img
                    src={
                      allImages[selectedImageIndex]?.src || "/placeholder.svg"
                    }
                    alt={allImages[selectedImageIndex]?.alt}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Image Info */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm text-center">
                  <h4 className="font-medium">
                    {allImages[selectedImageIndex]?.title}
                  </h4>
                  {allImages[selectedImageIndex]?.description && (
                    <p className="text-sm text-white/80 mt-1">
                      {allImages[selectedImageIndex].description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
