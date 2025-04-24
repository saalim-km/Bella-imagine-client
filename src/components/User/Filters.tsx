import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter } from "lucide-react";
import { useThemeConstants } from "@/utils/theme/themeUtills";
import { Category } from "@/services/categories/categoryService";
import { IVendorsResponse } from "@/types/User";
import { getLocationFromCordinates } from "@/utils/location/get-location.utils";
import { handleError } from "@/utils/Error/errorHandler";
import { popularLanguages } from "./EditProfileForm";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterProps {
  categories: Category[];
  handleSpecialitySelect(speciality: string): void;
  handleCategorySelect(category: string, categoryId: string): void;
  handleLanguageSelect(language: string): void;
  selectedCategory: string | undefined;
  selectedLanguage: string | undefined;
  selectedSpeciality: string | undefined;
  vendors: IVendorsResponse[];
  resetFilter(): void
}

export default function Filters({
  handleSpecialitySelect,
  handleCategorySelect,
  handleLanguageSelect,
  selectedCategory,
  selectedLanguage,
  selectedSpeciality,
  categories = [],
  vendors,
  resetFilter
}: FilterProps) {
  const { bgColor, textColor, borderColor } = useThemeConstants();

  const handleLocation = (position: GeolocationPosition) => {
    getLocationFromCordinates(
      position.coords.latitude,
      position.coords.longitude
    );
  };

  const handleLocationErr = (err: any) => {
    handleError(err);
  };
  return (
    <div className={`flex justify-center space-x-4 py-4 mb-14`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`${borderColor}`}>
            {selectedLanguage || "Photographer's Language"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={`${bgColor} w-64`}>
          <DropdownMenuLabel>Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="h-48">
            <DropdownMenuItem
              className={`${textColor} ${!selectedLanguage ? "font-bold" : ""}`}
              onClick={() => handleLanguageSelect("")}
            >
              All Languages
            </DropdownMenuItem>
            {popularLanguages.map((language, index) => (
              <DropdownMenuItem
                key={index}
                className={`${textColor} ${
                  selectedLanguage === language ? "font-bold" : ""
                }`}
                onClick={() => handleLanguageSelect(language)}
              >
                {language}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`${borderColor} `}>
            {selectedCategory || "Category"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={bgColor}>
          <DropdownMenuLabel>Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={`${textColor} ${
              !selectedCategory ? "font-bold bg-gray-200 dark:bg-gray-700" : ""
            }`}
            onClick={() => handleCategorySelect("", "")}
          >
            All Categories
          </DropdownMenuItem>
          {categories &&
            categories.map((category) => (
              <DropdownMenuItem
                key={category._id}
                className={`${textColor} ${
                  selectedCategory === category.title
                    ? "font-bold bg-gray-200 dark:bg-gray-700"
                    : ""
                }`}
                onClick={() =>
                  handleCategorySelect(category.title, category._id)
                }
              >
                {category.title}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        onClick={() =>
          navigator.geolocation.getCurrentPosition(
            handleLocation,
            handleLocationErr,
            { enableHighAccuracy: true }
          )
        }
        variant={"outline"}
      >
        Find Nearby Photographers
      </Button>

      <Button variant="outline" onClick={resetFilter}>
        <Filter className="w-4 h-4 mr-2" />
        Reset
      </Button>
    </div>
  );
}
