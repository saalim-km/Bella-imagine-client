import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  onOpenModal: () => void;
  selectedLocation?: string | null; // New prop to receive the selected location
}

export default function LocationHeader({ onOpenModal, selectedLocation }: HeaderProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black";
  const buttonPrimary = isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-900 hover:bg-gray-800";

  return (
    <header className={`flex flex-col items-center py-4 ${bgColor}`}>
      <h1 className="text-3xl font-bold mb-4">India's Best Wedding Photographers</h1>
      <Button onClick={onOpenModal} className={`${buttonPrimary} text-white px-4 py-2 rounded-md`}>
        {selectedLocation || "Choose Location"}
      </Button>
    </header>
  );
}