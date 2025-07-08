import { useState, useEffect, useRef, useMemo } from "react";
import { X, MapPin, IndianRupee, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { IVendorsResponse } from "@/types/interfaces/User";
import { popularLanguages } from "./EditProfileForm";
import { Category } from "@/services/categories/categoryService";

interface FilterParams {
  location?: { lat: number; lng: number };
  categories?: string[];
  priceRange?: [number, number];
  tags?: string[];
  services?: string[];
  languages?: string[];
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterParams) => void;
  currentFilters: FilterParams;
  vendors: IVendorsResponse[];
  allCategories : Category[]
}

const libraries: ("places")[] = ["places"];

export const FilterPanel = ({ isOpen, onClose, onApplyFilters, currentFilters, vendors , allCategories}: FilterPanelProps) => {
  const [location, setLocation] = useState("");
  const [localFilters, setLocalFilters] = useState<FilterParams>(currentFilters);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  // Dynamically derive filter options from vendors
  const filterOptions = useMemo(() => {
    const categories = allCategories.filter((cat, index, self) => 
      index === self.findIndex(c => c._id === cat._id)
    ).sort((a, b) => a.title.localeCompare(b.title));

    const services = vendors.flatMap(vendor => 
      vendor.services.map(s => ({ id: s._id, title: s.serviceTitle }))
    ).filter((svc, index, self) => 
      index === self.findIndex(s => s.id === svc.id)
    ).sort((a, b) => a.title.localeCompare(b.title));

    const tags = Array.from(new Set(vendors.flatMap(vendor => 
      vendor.workSamples.flatMap(ws => ws.tags)
    ))).sort();

    return { categories, services, tags };
  }, [allCategories,vendors]);

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = localFilters.categories?.includes(categoryId)
      ? localFilters.categories.filter(c => c !== categoryId)
      : [...(localFilters.categories || []), categoryId];
    setLocalFilters({ ...localFilters, categories: newCategories });
  };

  const handleServiceToggle = (serviceId: string) => {
    const newServices = localFilters.services?.includes(serviceId)
      ? localFilters.services.filter(s => s !== serviceId)
      : [...(localFilters.services || []), serviceId];
    setLocalFilters({ ...localFilters, services: newServices });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = localFilters.tags?.includes(tag)
      ? localFilters.tags.filter(t => t !== tag)
      : [...(localFilters.tags || []), tag];
    setLocalFilters({ ...localFilters, tags: newTags });
  };

  const handleLanguageToggle = (language: string) => {
    const currentLanguages = localFilters.languages || [];
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language];
    setLocalFilters({ ...localFilters, languages: newLanguages });
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: FilterParams = {
      location: { lat: 0, lng: 0 },
      categories: [],
      priceRange: [0, 100000],
      tags: [],
      services: [],
      languages: [],
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace?.();
      if (place && place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLocalFilters({ ...localFilters, location: { lat, lng } });
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 backdrop-blur-md z-50 duration-100 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Filter Panel */}
      <div 
        className={`fixed bottom-0 left-0 right-0 rounded-t-3xl shadow-2xl z-50  duration-300 transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } bg-background`}
        style={{ maxHeight: '90vh' }}
        aria-modal="true"
        role="dialog"
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold">Filter Photographers</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full"
            aria-label="Close filter panel"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 180px)' }}>
          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
            libraries={libraries}
            onLoad={() => setIsMapLoaded(true)}
          >
            {/* Location Filter */}
            <div className="mb-6">
              <Label className="text-base font-semibold mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </Label>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocompleteRef.current = autocomplete;
                }}
                onPlaceChanged={handlePlaceChanged}
                restrictions={{ country: "in" }}
                types={["(cities)"]}
              >
                <Input
                  placeholder="Enter city, state, or address..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border-foreground"
                  aria-label="Search for a city or address"
                  disabled={!isMapLoaded}
                />
              </Autocomplete>
            </div>
          </LoadScript>

          {/* Price Range */}
          <div className="mb-6">
            <Label className="text-base font-semibold mb-3 flex items-center">
              <IndianRupee className="h-4 w-4 mr-2" />
              Price Range
            </Label>
            <div className="px-2">
              <Slider
                value={localFilters.priceRange || [0, 100000]}
                onValueChange={(value) => {
                  const tuple: [number, number] = [value[0] ?? 0, value[1] ?? 100000];
                  setLocalFilters({ ...localFilters, priceRange: tuple });
                }}
                max={100000}
                min={0}
                step={100}
                className="w-full"
                aria-label="Select price range"
              />
              <div className="flex justify-between mt-2 text-sm">
                <span>₹{localFilters.priceRange?.[0] || 0}</span>
                <span>₹{localFilters.priceRange?.[1] || 100000}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <Label className="text-base font-semibold">
              Photography Categories
            </Label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.categories.length > 0 ? (
                filterOptions.categories.map((category) => (
                  <Badge
                    key={category._id}
                    variant={localFilters.categories?.includes(category._id) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 border-gray-400 px-2 py-1 rounded-full`}
                    onClick={() => handleCategoryToggle(category._id)}
                    role="button"
                    aria-pressed={localFilters.categories?.includes(category._id)}
                  >
                    {category.title}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">No categories available</p>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <Label className="text-base font-semibold mb-3">
              Specific Services
            </Label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.services && filterOptions.services.length > 0 ? (
                filterOptions.services.map((service) => (
                  <Badge
                    key={service.id}
                    variant={localFilters.services?.includes(service.id!) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 border-gray-400 px-2 py-1 rounded-full`}
                    onClick={() => handleServiceToggle(service.id!)}
                    role="button"
                    aria-pressed={localFilters.services?.includes(service.id!)}
                  >
                    {service.title}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">No services available</p>
              )}
            </div>
          </div>

          {/* Work Sample Tags */}
          <div className="mb-6">
            <Label className="text-base font-semibold mb-3">
              Work Sample Tags
            </Label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.tags.length > 0 ? (
                filterOptions.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={localFilters.tags?.includes(tag!) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 border-gray-400 px-2 py-1 rounded-full`}
                    onClick={() => handleTagToggle(tag!)}
                    role="button"
                    aria-pressed={localFilters.tags?.includes(tag!)}
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">No tags available</p>
              )}
            </div>
          </div>

          {/* Languages */}
            <div className="mb-6">
            <Label className="text-base font-semibold mb-3 flex items-center">
              <Languages className="h-4 w-4 mr-2" />
              Photographer's Language
            </Label>
            <div className="flex flex-wrap gap-2">
              {popularLanguages.map((language) => (
              <Badge
                key={language}
                variant={localFilters.languages?.includes(language) ? "default" : "outline"}
                className="cursor-pointer transition-all duration-200 border-gray-400 px-2 py-1 rounded-full"
                onClick={() => handleLanguageToggle(language)}
                role="button"
                aria-pressed={localFilters.languages?.includes(language)}
              >
                {language}
              </Badge>
              ))}
            </div>
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t rounded-t-3xl">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex-1"
              aria-label="Reset all filters"
            >
              Reset Filters
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1"
              aria-label="Apply filters"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};