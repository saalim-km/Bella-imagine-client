import React from "react";
import { motion } from "framer-motion"; // Optional: for smooth transitions
import { useTheme } from "@/context/ThemeContext";

const Logo = () => {
  // Define filter styles based on theme
  const {theme} = useTheme()
  const getFilterStyle = () => {
    switch (theme) {
      case "dark":
        return "invert(100%) hue-rotate(180deg) brightness(1.2)"; // White-ish with a tint
      case "light":
        return "invert(0%) brightness(1)"; // Original colors
      default:
        return "invert(0%) brightness(1)"; // Fallback to original
    }
  };

  return (
    <motion.svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <image
        width="48"
        height="48"
        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAHlBMVEVMaXEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABKvP01AAAACXRSTlMA5iAQoYvIXDgsH2ZiAAAACXBIWXMAACxLAAAsSwGlPZapAAACUUlEQVR4nO3byXbDIAxA0XgO///DzemiPREY4QBGat/dJgthC4MYHg8AAAAAAAAAAAAAAAAAAFBhOdZ9CmHa12MZHcsH5vUV/I91Hh3PRcsWhG10SJfMk4z/lUqOXsIzEb+nFqSev6cWLCfxh7D7+BpF/ddZT57P4w/BQxKtuQY4eAXZFxAm+73gyDYgHKPjU2UzyEMO7fkG7KPjUykNmEbHp0pPI36Nju+S5Yhbc/ZPo7VDNC1KptC82a0dnnonTtQOht7CImOL/mG9dhChRQPZSe3wHBFrikihaCphvXaQtcGq/J5p6ghLlB/yud5dO8y7MkwpZFB31w5nCVsqGgTurh2UmaYav3ym8hsr/t6+FzSO//7aoSqDEh9G5Y3KT1Y9ZaqclZoe3F47fNyJpy35Sbm/dpg/6MaZKfI/rR3MiqYV9stPoaB2sE2Oa+0/o72JBthfBBNkClmYUF+h1Q7G6bVDK7U1Qaleq6i1NUGpboNAZU1QHH+3ov6m+Pstq9ySQT0XVWpqglJdlxa7d+KT2qFhCzp2Y3vL6wCAP6mmJrAwWNVPJwbvBbeYTAw9ttIg/rH7kG0mpANb0KgmGNeCVjXBuHOkrWoC+wfQ3sV7AEYOFJSTyeftFeiHP8yTewDultDlIOguh+TmvLdtJOcbefEegIOtVPeb2e6PIisvwH4ndn8c3/2FiPODld9dwMFUIptDHvaC3V/Lcn8xLne8eHRohawf8NZ5v55r/5KDzvY1kyJvKzHd94K7MHvVCgAAAAAAAAAAAAAAAAAAN74AN6d3Z4l5lSUAAAAASUVORK5CYII="
        style={{ filter: getFilterStyle() }}
      />
    </motion.svg>
  );
};

export default Logo;