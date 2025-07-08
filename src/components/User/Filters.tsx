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
  resetFilter,
  setIsFilter,
  handleNearbySearch,
  handleSortChange,
  sortBy,
}: FilterProps) {
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
    <div className="flex flex-wrap justify-center gap-3 py-4">
      <Button
        variant="outline"
        onClick={handleNearbySearch}
        className="gap-2"
      >
        <LocateIcon className="w-4 h-4" />
        Nearby
      </Button>

      <Button
        variant="outline"
        onClick={resetFilter}
        className="gap-2"
      >
        <FilterX className="w-4 h-4" />
        Reset
      </Button>

      <Button
        variant="outline"
        onClick={() => setIsFilter(true)}
        className="gap-2"
      >
        <Filter className="w-4 h-4" />
        Filters
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            {getSortLabel(sortBy)}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
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
