import { useTheme } from '@/context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

interface ModalProps {
  onClick: () => void;
  onClose: () => void;
  isModalOpen: boolean;
}

const PhoneNumberModal = ({ onClick, onClose, isModalOpen }: ModalProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black";
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const buttonPrimary = isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-[#8B5A2B] hover:bg-[#704832]";

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose()}
        >
          <motion.div
            className={`w-full max-w-sm p-6 rounded-lg ${bgColor} shadow-lg`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">Salim K M</h2>
                <p className={`text-sm ${textColor}`}>Kochi, India</p>
              </div>
              <button onClick={() => onClose()}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Section */}
            <div className="text-center">
              <p className="text-xl font-medium mb-2">+91 9895012661</p>
              <p className={`text-sm ${textColor} mb-2`}>
                Tell the photographer that you have found them on Bella Imagine
              </p>
              <p className={`text-sm ${textColor} mb-4`}>
                Alternatively, you can send a personal message to the photographer
              </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={onClick}
              className={`${buttonPrimary} text-white w-full px-3 py-2 text-sm rounded-md`}
            >
              Send a message
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhoneNumberModal;