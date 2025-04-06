import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  motion, 
  useScroll, 
  useTransform, 
  AnimatePresence, 
  useInView 
} from "framer-motion";
import AnimatedImage from "./AnimatedImage";
import ParallaxSection from "./ParallaxSelection";
import { ChevronDown, MapPin, Camera, Clock, Users, CreditCard, ArrowRight } from "lucide-react";
import HomeVendorCard from "./HomeVendorCard";
import { Button } from "../ui/button";
import { backgroundImages } from "@/assets/mock-data";
import { useAllVendorsListQuery } from "@/hooks/client/useClient";
import { IVendorsResponse } from "@/types/User";


const Landing = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const aboutRef = useRef(null);
  const photographersRef = useRef(null);
  const ctaRef = useRef(null);
  
  const isAboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const isPhotographersInView = useInView(photographersRef, { once: true, margin: "-100px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const {data : vendors , isLoading} = useAllVendorsListQuery({page : 1 , limit : 4});
  const photographers : IVendorsResponse[] = vendors?.data || [];
  console.log('vendors in landing : ',photographers);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full   overflow-x-hidden">
      <section id="home" ref={heroRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImages[currentImage]})` }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        {/* Content */}
        <motion.div 
          className="relative container mx-auto px-6 z-10 text-center"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.span 
            className="inline-block mb-2 px-4 py-1 bg-white/10 backdrop-blur-md text-white text-sm rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            India's Premier Photography Platform
          </motion.span>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 text-shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="block">Capture Your</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Perfect Moments
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Connect with professional photographers across India for your special occasions,
            portraits, events and commercial needs.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.button
              onClick={() => navigate("/register")}
              className="px-8 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors shadow-md"
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.97 }}
            >
              Find a Photographer
            </motion.button>
            
            <motion.button
              onClick={() => document.getElementById("about")?.scrollIntoView()}
              className="px-8 py-3 bg-transparent text-white border border-white/30 font-medium rounded-full hover:bg-white/10 transition-colors"
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.97 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown size={36} strokeWidth={1} />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Photographers Section */}
      <section id="photographers" ref={photographersRef} className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isPhotographersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block mb-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded-full">
              Featured Photographers
            </span>
            <h2 className="text-4xl font-bold mb-4">
              Meet Our Top Photographers
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover talented photographers across India ready to capture your special moments
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {photographers.map((photographer, index) => (
              <HomeVendorCard
                key={photographer._id}
                name={photographer.name}
                location={photographer.location || ''}
                image={photographer.profileImage || ''}
                delay={index}
                rating={0}
              />
            ))}
          </div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isPhotographersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
            variant={"outline"}
            onClick={() => navigate("/vendors")}
            >view all photographer</Button>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section ref={ctaRef} className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div/>
        </div>
        
        <div className="container relative mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block mb-2 px-3 py-1 bg-white/10 backdrop-blur-sm  text-sm rounded-full">
              Join Bella Imagine Today
            </span>
            <h2 className="text-4xl md:text-5xl font-bold  mb-6">
              Ready to Capture Your Perfect Moments?
            </h2>
            <p className="text-xl /80 mb-8">
              Whether you're looking for a photographer or are a photographer looking to grow your business, Bella Imagine is here for you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="rounded" variant={"outline"} onClick={() => navigate("/register")}>
                Find a Photographer
              </Button>
              <Button className="rounded bg-transparent " variant={"outline"} onClick={() => navigate("/vendor/signup")}>
                Register as Photographer
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
