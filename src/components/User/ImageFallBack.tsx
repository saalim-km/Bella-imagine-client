import { ImageIcon, User } from "lucide-react";
import { useState } from "react";

export const ImageWithFallback = ({
  src,
  alt,
  className,
  fallbackType = "work",
}: {
  src?: string;
  alt: string;
  className: string;
  fallbackType?: "profile" | "work";
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Fallback gradient backgrounds
  const fallbackGradients = {
    profile:
      "bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20",
    work: "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20",
  };

  if (!src || imageError) {
    return (
      <div
        className={`${className} ${fallbackGradients[fallbackType]} flex items-center justify-center`}
      >
        {fallbackType === "profile" ? (
          <User className="h-12 w-12 text-muted-foreground/60" />
        ) : (
          <ImageIcon className="h-16 w-16 text-muted-foreground/60" />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div
          className={`absolute inset-0 ${fallbackGradients[fallbackType]} flex items-center justify-center animate-pulse`}
        >
          {fallbackType === "profile" ? (
            <User className="h-12 w-12 text-muted-foreground/60" />
          ) : (
            <ImageIcon className="h-16 w-16 text-muted-foreground/60" />
          )}
        </div>
      )}
      <svg
        baseProfile="full"
        viewBox="0 0 172 200"
        preserveAspectRatio="xMidYMin slice"
        version="1.2"
        style={{ display: "block" }}
      >
        <foreignObject width="100%" height="100%">
          <img
            src={src}
            alt={alt}
            className={`${className} ${
              imageLoading ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </foreignObject>
      </svg>
    </div>
  );
};