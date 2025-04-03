import { useState } from "react";
import { IVendorsResponse } from "@/types/User";
import { useThemeConstants } from "@/utils/theme/themeUtills";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, RotateCcw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
  vendors: IVendorsResponse[];
}

const validLocations = new Set([
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune",
  // ... (rest of the locations remain the same)
]);

export default function LocationModal({ isOpen, onClose, onSelectLocation, vendors }: LocationModalProps) {
  const { bgColor } = useThemeConstants();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<string[]>(Array.from(validLocations));
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSearch = () => {
    const filtered = Array.from(validLocations).filter((location) =>
      location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
    setIsPopoverOpen(true);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredLocations(Array.from(validLocations));
    setIsPopoverOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`w-full max-w-md p-6 rounded-lg ${bgColor} border shadow-lg`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select Location</h2>
              <button onClick={onClose}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  Select a location
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <ScrollArea className="h-60 w-full rounded-md border">
                  <ul className="p-2 space-y-1">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((location) => (
                        <li
                          key={location}
                          className="cursor-pointer p-2 hover:bg-accent hover:text-accent-foreground rounded-md"
                          onClick={() => {
                            onSelectLocation(location);
                            setIsPopoverOpen(false);
                            setSearchTerm("");
                            setFilteredLocations(Array.from(validLocations));
                          }}
                        >
                          {location}
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-muted-foreground">No locations found</li>
                    )}
                  </ul>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}