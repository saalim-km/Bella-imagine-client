"use client";

import { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { IWorkSampleResponse } from "@/types/interfaces/vendor";

// Define the WorkSample type
interface Media {
  url: string;
}

interface WorkSampleProps {
  workSample: IWorkSampleResponse;
}

export default function WorkSample({ workSample }: WorkSampleProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 2;

  const handleShowMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const startIndex = currentPage * imagesPerPage;
  const displayedImages = workSample.media.slice(0, startIndex + imagesPerPage);
  const hasMoreImages = workSample.media.length > startIndex + imagesPerPage;

  return (
    <>
      <div className="border border-border/10 rounded-lg overflow-hidden bg-card">
        <div className="p-6">
          <h3 className="font-serif text-xl text-foreground mb-2">{workSample.title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{workSample.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-1">
          {displayedImages.map((item, idx) => (
            <div
              key={idx}
              className="relative aspect-square overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(item)}
            >
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-white" />
              </div>
              <img
                src={item || "/placeholder.svg"}
                alt={workSample.title}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>

        {hasMoreImages && (
          <div className="p-4 text-center">
            <button
              onClick={handleShowMore}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Show More
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-white/80 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt=" preservatives work sample"
              className="object-contain w-full h-full"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}