import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  motion, 
  useScroll, 
  useTransform, 
  AnimatePresence, 
  useInView 
} from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import AnimatedImage from "./AnimatedImage";
import ParallaxSection from "./ParallaxSelection";
import { ChevronDown, MapPin, Camera, Clock, Users, CreditCard, ArrowRight } from "lucide-react";
import HomeVendorCard from "./HomeVendorCard";

// Background images
const backgroundImages = [
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741542792/unnamed_7_ojnw3l.webp",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187701/hisu-lee-FTW8ADj5igs-unsplash_ctadks.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187701/marc-a-sporys-NO8Sj4dKE8k-unsplash_yg4unz.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187702/jonathan-borba-eg-72fI9wK4-unsplash_otweju.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187701/nathan-dumlao-5BB_atDT4oA-unsplash_lwukhj.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187700/asdrubal-luna-33yonj9AKyU-unsplash_vpgsfh.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187699/anna-vi-QUi84upBhoc-unsplash_ur8gdq.jpg"
];

// Mock photographers data
const photographers = [
  {
    id: 1,
    name: "Anika Sharma",
    specialty: "Wedding & Portrait",
    location: "Mumbai, Maharashtra",
    image: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187701/hisu-lee-FTW8ADj5igs-unsplash_ctadks.jpg",
    rating: 4.9,
    price: "₹25,000/day"
  },
  {
    id: 2,
    name: "Rajiv Kumar",
    specialty: "Fashion & Commercial",
    location: "Delhi, NCR",
    image: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187701/marc-a-sporys-NO8Sj4dKE8k-unsplash_yg4unz.jpg",
    rating: 4.8,
    price: "₹30,000/day"
  },
  {
    id: 3,
    name: "Priya Mehta",
    specialty: "Wedding & Events",
    location: "Bangalore, Karnataka",
    image: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187702/jonathan-borba-eg-72fI9wK4-unsplash_otweju.jpg",
    rating: 4.7,
    price: "₹22,000/day"
  },
  {
    id: 4,
    name: "Vikram Singh",
    specialty: "Wildlife & Nature",
    location: "Jaipur, Rajasthan",
    image: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187701/nathan-dumlao-5BB_atDT4oA-unsplash_lwukhj.jpg",
    rating: 4.6,
    price: "₹18,000/day"
  }
];

// Features data
const features = [
  {
    icon: <Camera className="w-6 h-6" />,
    title: "Professional Photographers",
    description: "Connect with India's top photographers, all verified and experienced."
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Nationwide Coverage",
    description: "Find photographers across all major cities and regions in India."
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Instant Booking",
    description: "Book your session in minutes with our streamlined process."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Personalized Experience",
    description: "Match with photographers that fit your style and requirements."
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Secure Payments",
    description: "Our platform ensures safe transactions and clear pricing."
  }
];

const Landing = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const photographersRef = useRef(null);
  const ctaRef = useRef(null);
  
  const isAboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const isServicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const isPhotographersInView = useInView(photographersRef, { once: true, margin: "-100px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });
  
  const { theme } = useTheme();
  // Parallax refs for hero section
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Auto Image Carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full bg-white dark:bg-gray-950 overflow-x-hidden">
      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Carousel */}
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
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Find a Photographer
            </motion.button>
            
            <motion.button
              onClick={() => document.getElementById("about")?.scrollIntoView()}
              className="px-8 py-3 bg-transparent text-white border border-white/30 font-medium rounded-full hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.03 }}
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
      
      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ParallaxSection speed={0.1}>
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: -50 }}
                animate={isAboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="relative z-10 rounded-2xl overflow-hidden">
                  <AnimatedImage 
                    src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740647777/unsplash_K8KiCHh4WU4_afyfh4.png"
                    alt="Wedding Photography"
                    className="w-full rounded-2xl shadow-soft"
                    priority
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 -z-10" />
                <motion.div 
                  className="absolute -top-6 -left-6 p-4 glass-effect rounded-xl shadow-soft"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">4,000+ Photographers</span>
                  </div>
                </motion.div>
              </motion.div>
            </ParallaxSection>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isAboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              <span className="inline-block mb-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                About Bella Imagine
              </span>
              <h2 className="text-4xl font-bold mb-6">
                India's Largest Network of Professional Photographers
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Founded in 2020, Bella Imagine has grown to become India's leading platform connecting talented photographers with clients across the country. We've carefully curated a network of over 4,000 professional photographers specializing in various fields.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Our mission is to make professional photography accessible to everyone while providing photographers with a platform to showcase their work and grow their business.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">4,000+</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Photographers</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">250+</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Cities</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">50,000+</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Bookings</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">4.8</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Average Rating</span>
                </div>
              </div>
              
              <motion.button
                onClick={() => document.getElementById("photographers")?.scrollIntoView()}
                className="flex items-center space-x-2 font-medium"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span>Browse Photographers</span>
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features/Services Section */}
      <section id="services" ref={servicesRef} className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block mb-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded-full">
              Our Services
            </span>
            <h2 className="text-4xl font-bold mb-4">
              What Makes Us Different
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We're not just another photography platform. Our unique features help you find the perfect photographer while giving photographers the tools they need to succeed.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft"
                initial={{ opacity: 0, y: 30 }}
                animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              >
                <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 inline-block rounded-xl text-gray-700 dark:text-gray-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
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
                key={photographer.id}
                name={photographer.name}
                specialty={photographer.specialty}
                location={photographer.location}
                image={photographer.image}
                rating={photographer.rating}
                price={photographer.price}
                delay={index}
              />
            ))}
          </div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isPhotographersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={() => navigate("/vendors")}
              className="px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white font-medium rounded-full hover:bg-black dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Photographers
            </motion.button>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section ref={ctaRef} className="py-24 md:py-32 relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-30" />
          <img 
            src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1741542792/unnamed_7_ojnw3l.webp" 
            alt="Background pattern" 
            className="w-full h-full object-cover mix-blend-overlay opacity-20"
          />
        </div>
        
        <div className="container relative mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block mb-2 px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full">
              Join Bella Imagine Today
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Capture Your Perfect Moments?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Whether you're looking for a photographer or are a photographer looking to grow your business, Bella Imagine is here for you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => navigate("/register")}
                className="w-full sm:w-auto px-8 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Find a Photographer
              </motion.button>
              
              <motion.button
                onClick={() => navigate("/vendor/signup")}
                className="w-full sm:w-auto px-8 py-3 bg-transparent text-white border border-white font-medium rounded-full hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Register as Photographer
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
