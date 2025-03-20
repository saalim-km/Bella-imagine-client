
import { motion } from 'framer-motion';
import AnimatedImage from './AnimatedImage';

interface PhotographerCardProps {
  name: string;
  specialty: string;
  location: string;
  image: string;
  rating: number;
  price: string;
  delay?: number;
}

const HomeVendorCard = ({
  name,
  specialty,
  location,
  image,
  rating,
  price,
  delay = 0
}: PhotographerCardProps) => {
  return (
    <motion.div
      className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: delay * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative h-60 w-full overflow-hidden">
        <AnimatedImage 
          src={image} 
          alt={name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
          {price}
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center text-amber-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="ml-1 text-xs">{rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{specialty}</p>
        <div className="flex items-center text-gray-500 dark:text-gray-500 text-xs">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </div>
      </div>
      
      <motion.button 
        className="m-4 mt-0 py-2 rounded-xl bg-gray-900 dark:bg-gray-800 text-white text-sm font-medium hover:bg-black dark:hover:bg-gray-700 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Book Now
      </motion.button>
    </motion.div>
  );
};

export default HomeVendorCard;