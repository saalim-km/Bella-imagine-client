"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface Photo {
  id: string;
  src: string;
  alt: string;
  photographer: string;
  category: string;
}

interface PhotoCardProps {
  photo: Photo;
  featured?: boolean;
}

export default function PhotoCard({ photo, featured = false }: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="w-full h-full relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <img
        src={photo.src || "/placeholder.svg"}
        alt={photo.alt}
        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="text-white text-lg font-medium mb-1">{photo.photographer}</h3>
          <p className="text-white/70 mb-4">{photo.category} Specialist</p>

          <a
            href={`/photographers/${photo.id}`}
            className="inline-flex items-center gap-1 text-white text-sm group/link"
          >
            <span className="border-b border-white/0 group-hover/link:border-white/100 transition-all">
              View Profile
            </span>
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>

      {featured && (
        <div className="absolute top-6 left-6 z-20">
          <span className="px-3 py-1 bg-white text-black text-xs uppercase tracking-wider">Featured</span>
        </div>
      )}
    </motion.div>
  );
}