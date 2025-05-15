import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useThemeConstants } from "@/utils/theme/theme.utils";

interface HeaderProps {
  onOpenModal: () => void;
  selectedLocation?: string | null; // New prop to receive the selected location
}

export default function LocationHeader({ onOpenModal, selectedLocation }: HeaderProps) {
  const {bgColor , buttonPrimary} = useThemeConstants()

  return (
    <header className={`flex flex-col items-center py-20`}>
      <h1 className="text-3xl font-bold mb-4">India's Best Wedding Photographers</h1>
      <Button onClick={onOpenModal} className={`${buttonPrimary} text-white px-4 py-2 rounded-md`}>
        {selectedLocation || "Choose Location"}
      </Button>
    </header>
  );
}