import { useTheme } from '@/context/ThemeContext';

interface ThemeConstants {
    isDarkMode: boolean;
    bgColor: string;
    textColor: string;
    buttonPrimary: string;
    buttonSecondary: string;
    borderColor: string;
}

export const useThemeConstants = (): ThemeConstants => {
    const { theme } = useTheme()

    const isDarkMode: boolean = theme === "dark";

    return {
        isDarkMode,
        bgColor: isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black",
        textColor: isDarkMode ? "text-gray-300" : "text-gray-600",
        buttonPrimary: isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-900 hover:bg-gray-800",
        buttonSecondary: isDarkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-[#85786F] hover:bg-[#6d645c]",
        borderColor: isDarkMode ? "border-gray-700" : "border-gray-300",
    };
};