import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useThemeConstants } from "@/utils/theme/themeUtills";
import { useTheme } from "@/context/ThemeContext";

const fadeInVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const backgroundImages = [
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741542792/unnamed_7_ojnw3l.webp",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187701/hisu-lee-FTW8ADj5igs-unsplash_ctadks.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187701/marc-a-sporys-NO8Sj4dKE8k-unsplash_yg4unz.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187702/jonathan-borba-eg-72fI9wK4-unsplash_otweju.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187701/nathan-dumlao-5BB_atDT4oA-unsplash_lwukhj.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187700/asdrubal-luna-33yonj9AKyU-unsplash_vpgsfh.jpg",
  "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187699/anna-vi-QUi84upBhoc-unsplash_ur8gdq.jpg"
];
  
const Landing = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const aboutRef = useRef(null);
  const whyChooseRef = useRef(null);
  const isAboutInView = useInView(aboutRef, { once: true, margin: "-150px" });
  const isWhyChooseInView = useInView(whyChooseRef, { once: true, margin: "-150px" });

  const { theme } = useTheme();
  const { textColor } = useThemeConstants();
  
  // Define background color based on theme
  const bgColor = theme === "dark" ? "hsl(240 10% 3.9%)" : "white";
  const textColorClass = theme === "dark" ? "text-gray-300" : `text-${textColor}-600`;

  // Auto Image Carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <motion.div
        className="relative w-full h-screen flex flex-col items-center justify-center text-center text-white bg-cover bg-center"
        style={{ backgroundColor: bgColor }}
        initial="hidden"
        animate="visible"
        variants={fadeInVariant}
      >
        {/* Background Image Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImages[currentImage]})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Overlay - Adjust for Dark Mode */}
        <div
          className={`absolute inset-0 ${theme === "dark" ? "bg-black bg-opacity-50" : "bg-black bg-opacity-40"}`}
        />

        {/* Content */}
        <motion.div 
          className="relative z-10 px-4"
          variants={fadeInVariant}
        >
          <motion.p className={`text-lg ${textColorClass} mb-2`}>
            Discover the Beauty of Bella Imagine
          </motion.p>
          <motion.h1 className="text-5xl font-bold">
            Timeless Moments
          </motion.h1>
          <motion.p className={`text-lg ${textColorClass} mt-2 max-w-2xl mx-auto`}>
            Bella Imagine is a premier wedding photography studio dedicated to capturing the essence of your special day
          </motion.p>
          <motion.button
            onClick={() => navigate("/register")}
            className="mt-6 px-6 py-3 bg-black text-white font-medium text-lg rounded-md hover:bg-gray-800"
          >
            Book Your Session
          </motion.button>
        </motion.div>
      </motion.div>

      {/* About Section */}
      <motion.div
        ref={aboutRef}
        className="container mx-auto px-4 py-32 flex flex-col md:flex-row items-center justify-center gap-20"
        style={{ backgroundColor: bgColor }}
        initial="hidden"
        animate={isAboutInView ? "visible" : "hidden"}
        variants={fadeInVariant}
      >
        <motion.div className="md:w-2/6 mb-8 md:mb-0" variants={fadeInVariant}>
          <motion.img
            src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740647777/unsplash_K8KiCHh4WU4_afyfh4.png"
            alt="Wedding Venue"
            className="w-full rounded-lg"
          />
        </motion.div>
        <motion.div className="md:w-1/2 text-right md:text-left" variants={fadeInVariant}>
          <motion.p className={`text-sm ${textColorClass} mb-2`}>
            About Bella Imagine
          </motion.p>
          <motion.h2 className="text-4xl font-bold mb-4">
            A Passion for Capturing Your Love Story
          </motion.h2>
          <motion.p className={`text-lg ${textColorClass} mb-6`}>
            At Bella Imagine, we believe that every wedding is a unique and special celebration, and our mission is to help you preserve those cherished moments in the most beautiful and artistic way possible.
          </motion.p>
          <motion.button className="px-6 py-3 bg-black text-white font-medium text-lg rounded-md hover:bg-gray-900">
            Join us
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        ref={whyChooseRef}
        className="container mx-auto px-4 py-32 flex flex-col md:flex-row items-center justify-center gap-20"
        style={{ backgroundColor: bgColor }}
        initial="hidden"
        animate={isWhyChooseInView ? "visible" : "hidden"}
        variants={fadeInVariant}
      >
        <motion.div className="md:w-1/2 mb-8 md:mb-0" variants={fadeInVariant}>
          <motion.h2 className="text-4xl font-bold mb-4">
            Why Choose Bella Imagine?
          </motion.h2>
          <motion.p className={`text-sm ${textColorClass} mb-2`}>
            Empowering Photographers, Connecting Clients
          </motion.p>
          <motion.p className={`text-lg ${textColorClass} mb-6`}>
            Bella Imagine helps photographers connect with clients, manage bookings, and get paid securely—all with just a 2% commission. Focus on your craft while we handle the rest!
          </motion.p>
          <motion.button className="px-6 py-3 bg-black text-white font-medium text-lg rounded-md hover:bg-gray-800">
            Join as Photographer
          </motion.button>
        </motion.div>
        <motion.div className="md:w-2/5 text-right md:text-left" variants={fadeInVariant}>
          <motion.img
            src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740647790/unsplash_yvChHgSbkuk_xvjnqa.png"
            alt="Wedding Venue"
            className="w-full rounded-lg"
          />
        </motion.div>
      </motion.div>
    </>
  );
};

export default Landing;