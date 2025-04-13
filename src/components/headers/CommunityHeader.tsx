
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  Trophy, 
  Home, 
  Menu, 
  X, 
  Upload, 
  Users, 
  Settings 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const CommunityHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Community", path: "/community", icon: Users },
    { name: "Contests", path: "/contests", icon: Trophy },
    { name: "Upload", path: "/upload", icon: Upload },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Admin", path: "/admin", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <header className=" mt-56">
      <div className="container flex h-16 items-center justify-between">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              asChild
              className="text-sm"
              onClick={closeMenu}
            >
              <Link to={item.path} className="flex items-center gap-1">
                <item.icon className="h-4 w-4 mr-1" />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 top-16 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.nav
              className="relative p-6 bg-background border-l h-[calc(100vh-4rem)] w-3/4 max-w-xs overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    asChild
                    className="justify-start"
                    onClick={closeMenu}
                  >
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default CommunityHeader;