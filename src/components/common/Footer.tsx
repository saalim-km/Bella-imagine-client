import { useTheme } from "@/context/ThemeContext";
import Logo from "./Logo";

export default function Footer() {
  
  return (
    <footer
      className={`py-8 px-6 md:px-16 justify-center align-middle flex border-t`}
      style={{ opacity: 0.5 }}
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
