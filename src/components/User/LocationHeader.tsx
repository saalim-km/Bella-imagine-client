import { Button } from "@/components/ui/button";
import { useThemeConstants } from "@/utils/theme/theme.utils";

interface HeaderProps {
  onOpenModal: () => void;
  selectedLocation?: string | null; // New prop to receive the selected location
}

export default function LocationHeader({ onOpenModal, selectedLocation }: HeaderProps) {
  const {bgColor , buttonPrimary} = useThemeConstants()

  return (
    <header className={`flex flex-col items-center py-20`}>
      <h1 className="font-serif tracking-tight text-4xl  mb-4">India's Best Wedding Photographers</h1>
      <Button onClick={onOpenModal} className={`${buttonPrimary} text-white px-4 py-2 rounded-md`}>
        {selectedLocation || "Choose Location"}
      </Button>
    </header>
  );
}