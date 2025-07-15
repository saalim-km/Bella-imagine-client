"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  CreditCard,
  Camera,
  MessageCircle,
  FileText,
} from "lucide-react";

const clientNavItems = [
  { icon: FileText, label: "Posts", id: "posts" },
  { icon: MessageCircle, label: "Comments", id: "comments" },
  { icon: Calendar, label: "Bookings & History", id: "bookings-history" },
  { icon: CreditCard, label: "Wallet & Transactions", id: "wallet" },
];

const vendorNavItems = [
  { icon: Calendar, label: "Bookings", id: "bookings" },
  { icon: CreditCard, label: "Wallet & Transactions", id: "wallet" },
  { icon: Camera, label: "Services", id: "services" },
  { icon: Camera, label: "Work Sample", id: "work-sample" },
  { icon: FileText, label: "Posts", id: "posts" },
  { icon: MessageCircle, label: "Comments", id: "comments" },
];

interface SidebarProps {
  name: string;
  profileImage?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: "client" | "vendor";
  hasCategory?: boolean;
}

function Sidebar({
  name,
  profileImage,
  activeTab,
  setActiveTab,
  role,
  hasCategory,
}: SidebarProps) {
  const navItems = role === "client" ? clientNavItems : vendorNavItems;

  return (
    <div className="border rounded shadow-sm h-full">
      <div className="p-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4 mb-8">
          <Avatar className="w-20 h-20 border-2 border-orange-200">
            <AvatarImage
              src={profileImage || "/placeholder.svg"}
              alt={name}
              className="object-cover"
            />
            <AvatarFallback className="bg-orange-100 dark:bg-orange-700 text-foreground text-xl font-semibold">
              {name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-lg font-bold">{name}</h2>
            <p className="text-sm text-gray-600">
              {role === "vendor" ? "Photographer" : "Client"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <Button
            variant={activeTab === "profile" ? "ghost" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "profile"
                ? "bg-orange-700 hover:bg-orange-800 text-white dark:hover:text-white hover:text-white"
                : "hover:bg-orange-50 dark:hover:text-orange-700"
            }`}
            onClick={() => setActiveTab && setActiveTab("profile")}
          >
            <User className="mr-3 h-4 w-4" />
            Profile
          </Button>

          {/* Other tabs */}
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === item.id
                  ? "bg-orange-700 hover:bg-orange-800 text-white"
                  : "text-foreground hover:bg-orange-50 hover:text-orange-700"
              } ${
                role === "vendor" && item.id !== "profile" && !hasCategory
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
              onClick={() => setActiveTab && setActiveTab(item.id)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;