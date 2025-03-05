import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Filters() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black";
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";

  // State to track selected options for each dropdown
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const specialties = ["Wedding", "Portrait", "Event", "Fashion"];
  const priceRanges = ["0 - 25,000 INR", "25,000 - 50,000 INR", "50,000 - 75,000 INR"];
  const languages = ["Any Language", "English", "Hindi", "Tamil", "Telugu"];

  return (
    <div className={`flex justify-center space-x-4 py-4 ${bgColor}`}>
      {/* Photographer's Specialty */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`${borderColor} ${textColor}`}>
            {selectedSpecialty || "Photographer's Specialty"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={bgColor}>
          <DropdownMenuLabel>Specialty</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {specialties.map((specialty) => (
            <DropdownMenuItem
              key={specialty}
              className={`${textColor} ${selectedSpecialty === specialty ? "font-bold bg-gray-200 dark:bg-gray-700" : ""}`}
              onClick={() => setSelectedSpecialty(specialty)}
            >
              {specialty}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Charges per Hour */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`${borderColor} ${textColor}`}>
            {selectedPriceRange || "Charges per Hour"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={bgColor}>
          <DropdownMenuLabel>Price Range</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {priceRanges.map((range) => (
            <DropdownMenuItem
              key={range}
              className={`${textColor} ${selectedPriceRange === range ? "font-bold bg-gray-200 dark:bg-gray-700" : ""}`}
              onClick={() => setSelectedPriceRange(range)}
            >
              {range}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Photographer's Language */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`${borderColor} ${textColor}`}>
            {selectedLanguage || "Photographer's Language"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={bgColor}>
          <DropdownMenuLabel>Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {languages.map((language) => (
            <DropdownMenuItem
              key={language}
              className={`${textColor} ${selectedLanguage === language ? "font-bold bg-gray-200 dark:bg-gray-700" : ""}`}
              onClick={() => setSelectedLanguage(language)}
            >
              {language}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}