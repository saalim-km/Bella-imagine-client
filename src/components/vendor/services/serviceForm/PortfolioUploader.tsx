
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, Image, Upload } from "lucide-react";

interface PortfolioUploaderProps {
  images: string[];
  updateImages: (images: string[]) => void;
}

export const PortfolioUploader: React.FC<PortfolioUploaderProps> = ({ 
  images, 
  updateImages 
}) => {
  const [dragging, setDragging] = useState(false);

  // In a real implementation, this would upload to a server
  // Here we'll just create a local URL for demonstration
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Create URL previews (in a real app, you'd upload these to a server)
      const newImages = newFiles.map(file => URL.createObjectURL(file));
      
      updateImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    updateImages(newImages);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      
      // Create URL previews
      const newImages = newFiles.map(file => URL.createObjectURL(file));
      
      updateImages([...images, ...newImages]);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <Image className="h-12 w-12 text-gray-400" />
          <div className="text-gray-600">
            <p className="font-medium">Drag and drop your images here</p>
            <p className="text-sm text-gray-500">or click to upload</p>
          </div>
          <label 
            htmlFor="file-upload" 
            className="cursor-pointer bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Upload className="h-4 w-4 inline-block mr-1" />
            Select Files
          </label>
          <input 
            id="file-upload" 
            type="file" 
            multiple 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((src, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg">
              <img 
                src={src} 
                alt={`Portfolio ${index + 1}`} 
                className="w-full h-32 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
