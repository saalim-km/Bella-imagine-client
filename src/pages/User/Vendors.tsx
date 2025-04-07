import React, { useState } from 'react';
import Filters from '@/components/User/Filters';
import LocationHeader from '@/components/User/LocationHeader';
import PhotographerCard from '@/components/User/PhotographerCard';
import Footer from '@/components/common/Footer';
import Pagination from '@/components/common/Pagination';
import Header from '@/components/headers/Header';
import LocationModal from '@/components/modals/LocationModal';
import { Spinner } from '@/components/ui/spinner';
import { useAllClientCategories, useAllVendorsListQuery } from '@/hooks/client/useClient';

const Vendors = () => {
    const [selectedCategory , setSelectedCategory] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        location: undefined as string | undefined,
        specialty: undefined as string | undefined,
        language: undefined as string | undefined,
        category: undefined as string | undefined,
    });

    const { data: categories } = useAllClientCategories();
    const { data: vendors, isLoading, isError } = useAllVendorsListQuery({
        page: currentPage,
        limit: 2,
        category: selectedCategory,
        languages: filters.language,
        location: filters.location,
    });
    console.log('vendors : ',vendors);
    const totalVendors = vendors?.total || 0
    const totalPages = Math.max(1, Math.ceil(totalVendors / 2))

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
          setCurrentPage(newPage)
        }
    }


    const handleFilterChange = (key: keyof typeof filters, value: string | undefined) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleSelectCategory = (category : string,categoryId : string)=> {
      setSelectedCategory(categoryId)
      handleFilterChange('category',category)
    }

    const handleLocationChange = (location : string)=> {
        console.log(location);
        handleFilterChange('location',location);
        setIsModalOpen(!isModalOpen)
    }

    if(isLoading) {
        return <Spinner/>
    }

    return (
        <div className="mt-20">
            <Header/>
            <LocationHeader onOpenModal={() => setIsModalOpen(true)} selectedLocation={filters.location} />
            <LocationModal
            vendors={vendors?.data || []}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectLocation={handleLocationChange}
            />  
            <Filters
                vendors={vendors?.data || []}      
                handleSpecialitySelect={(specialty) => handleFilterChange('specialty', specialty)}
                handleCategorySelect={(category,categoryId) => handleSelectCategory(category,categoryId)}
                handleLanguageSelect={(language) => handleFilterChange('language', language)}
                selectedCategory={filters.category}
                selectedLanguage={filters.language}
                selectedSpeciality={filters.specialty}
                categories={categories?.data || []}
            />

            {vendors && vendors.data.map((vendor)=> (
              <PhotographerCard key={vendor._id} vendorData={vendor}/>
            ))}

            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange}/>
            <Footer />
        </div>
    );
};

export default Vendors;