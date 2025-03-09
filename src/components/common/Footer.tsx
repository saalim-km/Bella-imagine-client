import { useTheme } from "@/context/ThemeContext";
import Logo from "./Logo";

export default function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer
      className={` py-8 px-6 md:px-16 justify-center align-middle flex`}
    >
      <div className="flex flex-row ">
          <Logo />
          <p className="text-sm">
            © 2025 Bella Imagine, Inc. <br /> All rights reserved.
          </p>
      </div>
    </footer>
  );
}
