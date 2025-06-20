import { useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, FilterX, LocateIcon } from "lucide-react";
import { useThemeConstants } from "@/utils/theme/theme.utils";
import { Category } from "@/services/categories/categoryService";
import { IVendorsResponse } from "@/types/interfaces/User";

interface FilterProps {
  categories: Category[];
  handleCategorySelect: (category: string, categoryId: string) => void;
  selectedCategory: string | undefined;
  vendors: IVendorsResponse[];
  resetFilter: () => void;
  setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
  handleNearbySearch: () => void;
  handleSortChange: (sortBy: string) => void;
  sortBy?: string;
}

export default function Filters({
  handleCategorySelect,
  selectedCategory,
  categories = [],
  vendors,
  resetFilter,
  setIsFilter,
  handleNearbySearch,
  handleSortChange,
  sortBy,
}: FilterProps) {
  const { bgColor, textColor, borderColor } = useThemeConstants();

  const getSortLabel = (value: string | undefined) => {
    switch (value) {
      case "newest":
        return "Newest";
      case "oldest":
        return "Oldest";
      case "priceLowToHigh":
        return "Price: Low to High";
      case "priceHighToLow":
        return "Price: High to Low";
      default:
        return "Sort By";
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 py-4 mb-8">
      <Button
        variant="outline"
        onClick={handleNearbySearch}
        className={`${borderColor} min-w-[150px]`}
        aria-label="Find nearby photographers"
      >
        <LocateIcon className="w-4 h-4 mr-2" />
        Nearby Photographers
      </Button>

      <Button
        variant="outline"
        onClick={resetFilter}
        className={`${borderColor} min-w-[100px]`}
        aria-label="Reset filters"
      >
        <FilterX className="w-4 h-4 mr-2" />
        Reset
      </Button>

      <Button
        variant="outline"
        onClick={() => setIsFilter(true)}
        className={`${borderColor} min-w-[100px]`}
        aria-label="Open advanced filters"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filters
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`${borderColor} min-w-[150px]`}
            aria-label="Select sort option"
          >
            {getSortLabel(sortBy)}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleSortChange("newest")}>
            Newest
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange("oldest")}>
            Oldest
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange("priceLowToHigh")}>
            Price: Low to High
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange("priceHighToLow")}>
            Price: High to Low
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
