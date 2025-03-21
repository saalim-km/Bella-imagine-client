import { useTheme } from "@/context/ThemeContext";
import { useThemeConstants } from "@/utils/theme/themeUtills";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void; // New prop to handle location selection
}

export default function LocationModal({ isOpen, onClose, onSelectLocation }: LocationModalProps) {
  const {bgColor , isDarkMode , borderColor} = useThemeConstants()
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Tamil Nadu"
  ];

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
            className={`w-full max-w-md p-6 rounded-lg ${bgColor} ${borderColor} border shadow-lg`}
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
            <div>
              <h3 className="font-medium text-lg">India</h3>
              <ul className="mt-2 space-y-2">
                {states.map((state) => (
                  <li
                    key={state}
                    className="cursor-pointer hover:underline"
                    onClick={() => onSelectLocation(`${state}, India`)} // Pass selected location
                  >
                    {state}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}