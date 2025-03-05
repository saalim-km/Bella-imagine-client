import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

// Base animation variants with smoother timing
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] } },
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } 
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const buttonFade = {
  hover: { opacity: 0.85, transition: { duration: 0.3, ease: "easeInOut" } },
  tap: { opacity: 0.95, transition: { duration: 0.2 } },
};

// Array of background images for the carousel
const backgroundImages = [
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1740647300/unsplash_IfjHaIoAoqE_z63y6p.png",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187701/hisu-lee-FTW8ADj5igs-unsplash_ctadks.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187701/marc-a-sporys-NO8Sj4dKE8k-unsplash_yg4unz.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187702/jonathan-borba-eg-72fI9wK4-unsplash_otweju.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187701/nathan-dumlao-5BB_atDT4oA-unsplash_lwukhj.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187700/asdrubal-luna-33yonj9AKyU-unsplash_vpgsfh.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187699/anna-vi-QUi84upBhoc-unsplash_ur8gdq.jpg"
];

document.documentElement.style.scrollBehavior = "smooth"

const Landing = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [currentImage, setCurrentImage] = useState(0);

  const aboutRef = useRef(null);
  const whyChooseRef = useRef(null);
  const isAboutInView = useInView(aboutRef, { once: true, margin: "-150px" });
  const isWhyChooseInView = useInView(whyChooseRef, { once: true, margin: "-150px" });

  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black";
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const buttonPrimary = isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-900 hover:bg-gray-800";
  const buttonSecondary = isDarkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-[#85786F] hover:bg-[#6d645c]";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";

  // Carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section with Carousel */}
      <motion.div
        className="relative w-full h-screen flex flex-col items-center justify-center text-center text-white bg-cover bg-center"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Background Image Carousel */}
        {backgroundImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentImage ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        ))}
        
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Content */}
        <motion.div className="relative z-10 px-4" variants={slideUp}>
          <motion.p variants={fadeIn} className="text-lg text-gray-300 mb-2">
            Discover the Beauty of Bella Imagine
          </motion.p>
          <motion.h1 variants={slideUp} className="text-5xl font-bold">
            Timeless Moments
          </motion.h1>
          <motion.p
            variants={fadeIn}
            className="text-lg text-gray-300 mt-2 max-w-2xl mx-auto"
          >
            Bella Imagine is a premier wedding photography studio dedicated to capturing the essence of your special day
          </motion.p>
          <motion.button
            onClick={() => navigate("/register")}
            className="mt-6 px-6 py-3 bg-black text-white font-medium text-lg rounded-md hover:bg-gray-800"
            variants={slideUp}
            whileHover="hover"
            whileTap="tap"
            variants={buttonFade}
          >
            Book Your Session
          </motion.button>
        </motion.div>
      </motion.div>

      {/* About Section (unchanged) */}
      <motion.div
        ref={aboutRef}
        className="container mx-auto px-4 py-32 flex flex-col md:flex-row items-center justify-center gap-20"
        initial="hidden"
        animate={isAboutInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div className="md:w-2/6 mb-8 md:mb-0" variants={fadeIn}>
          <motion.img
            src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740647777/unsplash_K8KiCHh4WU4_afyfh4.png"
            alt="Wedding Venue"
            className="w-full rounded-lg"
            initial={{ filter: "brightness(0.9)" }}
            animate={{ filter: "brightness(1)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.div className="md:w-1/2 text-right md:text-left" variants={slideUp}>
          <motion.p variants={fadeIn} className="text-sm text-gray-500 mb-2">
            About Bella Imagine
          </motion.p>
          <motion.h2 variants={slideUp} className="text-4xl font-bold mb-4">
            A Passion for Capturing Your Love Story
          </motion.h2>
          <motion.p variants={fadeIn} className={`text-lg text-${textColor}-600 mb-6`}>
            At Bella Imagine, we believe that every wedding is a unique and special celebration, and our mission is to help you preserve those cherished moments in the most beautiful and artistic way possible.
          </motion.p>
          <motion.button
            className="px-6 py-3 bg-black text-white font-medium text-lg rounded-md hover:bg-gray-800"
            variants={slideUp}
            whileHover="hover"
            whileTap="tap"
            variants={buttonFade}
          >
            Join us
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Why Choose Us Section (unchanged) */}
      <motion.div
        ref={whyChooseRef}
        className="container mx-auto px-4 py-32 flex flex-col md:flex-row items-center justify-center gap-20"
        initial="hidden"
        animate={isWhyChooseInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div className="md:w-1/2 mb-8 md:mb-0" variants={slideUp}>
          <motion.h2 variants={slideUp} className="text-4xl font-bold mb-4">
            Why Choose Bella Imagine?
          </motion.h2>
          <motion.p variants={fadeIn} className="text-sm text-gray-400 mb-2">
            Empowering Photographers, Connecting Clients
          </motion.p>
          <motion.p variants={fadeIn} className={`text-lg text-${textColor}-600 mb-6`}>
            Bella Imagine helps photographers connect with clients, manage bookings, and get paid securely—all with just a 2% commission. Focus on your craft while we handle the rest!
          </motion.p>
          <motion.button
            className="px-6 py-3 bg-black text-white font-medium text-lg rounded-md hover:bg-gray-800"
            variants={slideUp}
            whileHover="hover"
            whileTap="tap"
            variants={buttonFade}
          >
            Join as Photographer
          </motion.button>
        </motion.div>
        <motion.div className="md:w-2/5 text-right md:text-left" variants={fadeIn}>
          <motion.img
            src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740647790/unsplash_yvChHgSbkuk_xvjnqa.png"
            alt="Wedding Venue"
            className="w-full rounded-lg"
            initial={{ filter: "brightness(0.9)" }}
            animate={{ filter: "brightness(1)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </>
  );
};

export default Landing;