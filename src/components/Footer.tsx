import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#5C5147] text-white py-14 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Section - Logo and Copyright */}
        <div className="flex flex-col space-y-4">
          <Logo />
          <p className="text-sm text-white">
            © 2025 Bella Imagine, Inc. <br /> All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-medium">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Vendors</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-medium">Resources</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li><a href="#" className="hover:underline">FAQs</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">Testimonials</a></li>
            <li><a href="#" className="hover:underline">Gallery</a></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-lg font-medium">Connect</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li><a href="#" className="hover:underline">Instagram</a></li>
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">Twitter</a></li>
            <li><a href="#" className="hover:underline">Pinterest</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
