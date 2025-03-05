import { useTheme } from "@/context/ThemeContext";
import Logo from "./Logo";

export default function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer
      className={`${
        theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
      } py-14 px-6 md:px-16 mt-24`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Section - Logo and Copyright */}
        <div className="flex flex-col space-y-4">
          <Logo />
          <p className="text-sm">
            © 2025 Bella Imagine, Inc. <br /> All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-medium">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary">Home</a></li>
            <li><a href="#" className="hover:text-primary">About</a></li>
            <li><a href="#" className="hover:text-primary">Vendors</a></li>
            <li><a href="#" className="hover:text-primary">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-medium">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary">FAQs</a></li>
            <li><a href="#" className="hover:text-primary">Blog</a></li>
            <li><a href="#" className="hover:text-primary">Testimonials</a></li>
            <li><a href="#" className="hover:text-primary">Gallery</a></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-lg font-medium">Connect</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary">Instagram</a></li>
            <li><a href="#" className="hover:text-primary">Facebook</a></li>
            <li><a href="#" className="hover:text-primary">Twitter</a></li>
            <li><a href="#" className="hover:text-primary">Pinterest</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
