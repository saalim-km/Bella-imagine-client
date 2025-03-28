import { useState } from 'react';
import { X, Maximize, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
  public_id?: string;
}

interface ImagePreviewProps {
  media: MediaItem[];
  onRemove?: (index: number) => void;
  className?: string;
  readOnly?: boolean;
}

const ImagePreview = ({
  media,
  onRemove,
  className,
  readOnly = false,
}: ImagePreviewProps) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const handleRemove = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onRemove) {
      onRemove(index);
    }
  };

  const closeExpandedImage = () => {
    setExpandedImage(null);
  };

  return (
    <>
      <div
        className={cn(
          'image-preview-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
          className
        )}
      >
        {media.map((item, index) => (
          <div
            key={index}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary/30 shadow-sm transition-all duration-300 hover:shadow-md"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={`Preview ${index + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
            ) : (
              <video
                src={item.url}
                controls
                className="h-full w-full object-cover"
              />
            )}
            
            <div className="absolute inset-0 flex items-end p-2 opacity-0 transition-opacity duration-300 bg-gradient-to-t from-black/70 to-transparent group-hover:opacity-100">
              <div className="flex w-full justify-between text-white">
                <button
                  type="button"
                  className="rounded-full p-1.5 bg-black/40 hover:bg-black/60 transition-colors"
                  onClick={() => setExpandedImage(item.url)}
                >
                  <Maximize size={16} />
                </button>
                
                {!readOnly && onRemove && (
                  <button
                    type="button"
                    className="rounded-full p-1.5 bg-red-500/80 hover:bg-red-500 transition-colors"
                    onClick={(e) => handleRemove(index, e)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full-screen image viewer */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in"
          onClick={closeExpandedImage}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <img
              src={expandedImage}
              alt="Expanded preview"
              className="max-h-[90vh] max-w-[90vw] object-contain animate-scale-in"
            />
            <button
              className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              onClick={closeExpandedImage}
            >
              <X size={24} />
            </button>
            <a
              href={expandedImage}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={20} />
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePreview;