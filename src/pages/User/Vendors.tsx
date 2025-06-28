import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import Filters from "@/components/User/Filters";
import LocationHeader from "@/components/User/LocationHeader";
import PhotographerCard from "@/components/User/PhotographerCard";
import Footer from "@/components/common/Footer";
import Pagination from "@/components/common/Pagination";
import Header from "@/components/common/Header";
import { FilterPanel } from "@/components/User/FilterPanel";
import {
  useAllClientCategories,
  useAllVendorsListQuery,
} from "@/hooks/client/useClient";
import { handleError } from "@/utils/Error/error-handler.utils";
import { IVendorsResponse } from "@/types/interfaces/User";
import { LoadingBar } from "@/components/ui/LoadBar";

interface FilterParams {
  location?: { lat: number; lng: number };
  categories?: string[];
  priceRange?: [number, number];
  tags?: string[];
  services?: string[];
  languages?: string[];
  sortBy?: string;
}

const Vendors = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterParams>({
    location: { lat: 0, lng: 0 },
    categories: [],
    priceRange: [0, 100000],
    tags: [],
    services: [],
    languages: [],
    sortBy: "newest",
  });
  const [debouncedFilters, setDebouncedFilters] = useState<FilterParams>(filters);

  // Memoize debounced filter handler
  const debouncedSetFilters = useMemo(
    () =>
      debounce((newFilters: FilterParams) => {
        setDebouncedFilters(newFilters);
      }, 1000),
    []
  );

  // Update debounced filters when filters change
  useEffect(() => {
    debouncedSetFilters(filters);
    return () => debouncedSetFilters.cancel();
  }, [filters, debouncedSetFilters]);

  const { data: categories } = useAllClientCategories();
  const {
    data: vendors,
    isLoading,
    isError,
  } = useAllVendorsListQuery({
    page: currentPage,
    limit: 6,
    category: selectedCategory,
    location: debouncedFilters.location,
    categories: debouncedFilters.categories,
    minCharge: debouncedFilters.priceRange?.[0],
    maxCharge: debouncedFilters.priceRange?.[1],
    tags: debouncedFilters.tags,
    services: debouncedFilters.services,
    languages: debouncedFilters.languages,
    sortBy: debouncedFilters.sortBy,
    enabled : true
  });

  const totalVendors = vendors?.data.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalVendors / 6));

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const resetFilters = () => {
    const newFilters: FilterParams = {
      location: { lat: 0, lng: 0 },
      categories: [],
      priceRange: [0, 100000],
      tags: [],
      services: [],
      languages: [],
      sortBy: "newest",
    };
    setFilters(newFilters);
    setSelectedCategory(undefined);
  };

  const handleApplyFilters = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setSelectedCategory(newFilters.categories?.length ? newFilters.categories[0] : undefined);
  };

  const handleSelectCategory = (category: string, categoryId: string) => {
    setSelectedCategory(categoryId);
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories?.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...(prev.categories || []), categoryId],
    }));
  };

  const handleNearbySearch = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFilters((prev) => ({ ...prev, location: { lat: latitude, lng: longitude } }));
      },
      (err) => handleError(err),
      { enableHighAccuracy: true }
    );
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingBar />
      </div>
    );
  }

  return (
    <div className=" relative">
      <Header />
      <LocationHeader />
      <div className="container mx-auto px-4">
        <Filters
          vendors={vendors?.data.data || []}
          handleCategorySelect={handleSelectCategory}
          selectedCategory={filters.categories?.[0]}
          categories={categories?.data.data || []}
          resetFilter={resetFilters}
          setIsFilter={setIsFiltersOpen}
          handleNearbySearch={handleNearbySearch}
          handleSortChange={handleSortChange}
          sortBy={filters.sortBy}
        />
        <div>
          {vendors &&
            vendors.data.data.map((vendor: IVendorsResponse) => (
              <PhotographerCard key={vendor._id} vendorData={vendor} />
            ))}
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
      <FilterPanel
        allCategories={categories?.data.data || []}
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
        vendors={vendors?.data.data || []}
      />
      <Footer />
    </div>
  );
};

export default Vendors;