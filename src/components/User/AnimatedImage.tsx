
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

const AnimatedImage = ({ src, alt, className = '', priority = false }: AnimatedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Simulate the "in view" behavior after a short delay
    const timeout = setTimeout(() => {
      setIsInView(true);
    }, 100);
    
    // Load image
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
    };
    
    return () => clearTimeout(timeout);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: isLoaded ? 1 : 0 } : { scale: 1.1, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
};

export default AnimatedImage;
