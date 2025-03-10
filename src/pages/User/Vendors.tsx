import Filters from '@/components/User/Filters';
import LocationHeader from '@/components/User/LocationHeader';
import PhotographerCard from '@/components/User/PhotographerCard';
import Footer from '@/components/common/Footer';
import Header from '@/components/headers/Header';
import AccountTypeModal from '@/components/modals/AccountTypeModal';
import LocationModal from '@/components/modals/LocationModal';
import { useTheme } from '@/context/ThemeContext';
import { useThemeConstants } from '@/utils/theme/themeUtills';
import React, { useState } from 'react'

const Vendors = () => {

    const portfolioImages = [
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719962/unnamed_1_wkcshf.png",
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719962/unnamed_1_wkcshf.png",
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719962/unnamed_1_wkcshf.png",
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719962/unnamed_1_wkcshf.png",
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719962/unnamed_1_wkcshf.png",
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719962/unnamed_1_wkcshf.png",
    ] 
  


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    

    const handleLocationSelect = (location: string) => {
      setSelectedLocation(location);
      setIsModalOpen(false); 
    };
  
    return (
      <div>
        <Header/>
        <LocationHeader
          onOpenModal={() => setIsModalOpen(true)}
          selectedLocation={selectedLocation}
        />
        <LocationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectLocation={handleLocationSelect} 
        />
        <Filters />
        <PhotographerCard portfolioImages={portfolioImages}/>
        <Footer/>
      </div>
    );
}

export default Vendors