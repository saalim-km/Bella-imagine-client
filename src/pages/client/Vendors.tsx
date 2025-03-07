import Filters from '@/components/client/Filters';
import LocationHeader from '@/components/client/LocationHeader';
import PhotographerCard from '@/components/client/PhotographerCard';
import Footer from '@/components/Footer';
import Header from '@/components/headers/Header';
import LocationModal from '@/components/modals/LocationModal';
import { useTheme } from '@/context/ThemeContext';
import React, { useState } from 'react'

const Vendors = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";
    const bgColor = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black";

    const portfolioImages = [
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719962/unnamed_1_wkcshf.png",
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719962/unnamed_1_wkcshf.png",
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719962/unnamed_1_wkcshf.png",
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719962/unnamed_1_wkcshf.png",
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719962/unnamed_1_wkcshf.png",
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719962/unnamed_1_wkcshf.png",
    ] 

    const textColor = isDarkMode ? "text-gray-300" : "text-gray-600"
    const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
    // Callback to handle location selection from the modal
    const handleLocationSelect = (location: string) => {
      setSelectedLocation(location);
      setIsModalOpen(false); // Close the modal after selection
    };
  
    return (
      <div className={`min-h-screen ${bgColor}`}>
        <Header/>
        <LocationHeader
          onOpenModal={() => setIsModalOpen(true)}
          selectedLocation={selectedLocation}
        />
        <LocationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectLocation={handleLocationSelect} // Pass this to the modal
        />
        <Filters />
        <PhotographerCard
        portfolioImages={portfolioImages}
        bgColor={bgColor}
        textColor={textColor}
        borderColor={borderColor}
         />
        <Footer/>
      </div>
    );
}

export default Vendors