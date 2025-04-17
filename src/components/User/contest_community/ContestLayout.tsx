import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Camera, Users, Trophy, Upload } from "lucide-react";
import Logo from "@/components/common/Logo";
import { useThemeConstants } from "@/utils/theme/themeUtills";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  withoutPadding?: boolean;
}

const ContestLayout: React.FC<LayoutProps> = ({
  children,
  className,
  withoutPadding = false,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeConstants();
  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  const navItems = [
    { name: "Community", path: "/community/feed", icon: Users },
    { name: "Contests", path: "/contests", icon: Trophy },
    { name: "Upload", path: "/contest/upload", icon: Upload },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="">
          <motion.div
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 hover:cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Logo />
            <span
              className={`text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
                isDarkMode ? "from-white to-gray-400" : "from-black to-gray-600"
              }`}
            >
              Bella Imagine
            </span>
          </motion.div>
          <SidebarContent className="mt-5">
            <SidebarMenu className="gap-2 ">
                {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                  isActive={isActive(item.path)}
                  tooltip={item.name}
                  asChild
                  >
                  <Link
                    to={item.path}
                    className={cn(
                    "flex items-center gap-2",
                    isActive(item.path) ? "bg-gray-200 dark:bg-gray-700" : ""
                    )}
                  >
                    <item.icon className="h-32 w-8" />
                    <span>{item.name}</span>
                  </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <main
          className={cn(
            "flex-1 w-full",
            !withoutPadding && "p-6 md:p-10",
            className
          )}
        >
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ContestLayout;
