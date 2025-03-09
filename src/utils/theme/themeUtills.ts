import { useTheme } from '@/context/ThemeContext';

interface ThemeConstants {
    isDarkMode: boolean;
    bgColor: string;
    textColor: string;
    buttonPrimary: string;
    buttonSecondary: string;
    borderColor : string
}

export const useThemeConstants = (): ThemeConstants => {
    const { theme } = useTheme()

    const isDarkMode: boolean = theme === "dark";

    return {
        isDarkMode,
        bgColor: isDarkMode ? "bg-[#09090f] text-white" : "bg-white text-black",
        textColor: isDarkMode ? "text-white" : "text-gray-600",
        buttonPrimary: isDarkMode ? "bg-[#1a1a23] hover:bg-[#2a2a33]" : "bg-gray-900 hover:bg-gray-800",
        buttonSecondary: isDarkMode ? "bg-[#32323e] hover:bg-[#444454]" : "bg-[#85786F] hover:bg-[#6d645c]", 
        borderColor: isDarkMode ? "border-gray-700" : "border-gray-300",  // Added border color
    };
    
};