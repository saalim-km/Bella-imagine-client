import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useThemeConstants } from "@/utils/theme/themeUtills";
import { User, Calendar, CreditCard, Image, Camera, Upload, Ticket, ImageDown, CameraOffIcon, CameraIcon, LucideCamera } from "lucide-react";

const clientNavItems = [
  { icon: Calendar, label: "Bookings & History", id: "bookings-history" },
  { icon: CreditCard, label: "Wallet & Transactions", id: "wallet" },
  { icon: Image, label: "Received Work", id: "received-work" },
];

const vendorNavItems = [
  { icon: Calendar, label: "Bookings", id: "bookings" },
  { icon: CreditCard, label: "Wallet & Transactions", id: "wallet" },
  { icon: Upload, label: "Upload Work for Clients", id: "upload-work" },
  { icon: LucideCamera, label: "Services", id: "services" },
  { icon: ImageDown, label: "Work Sample", id: "work-sample" },
];

interface SidebarProps {
  name: string;
  profileImage?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: "client" | "vendor";
  hasCategory?: boolean;
}

export function Sidebar({
  name,
  profileImage,
  activeTab,
  setActiveTab,
  role,
  hasCategory,
}: SidebarProps) {
  const navItems = role === "client" ? clientNavItems : vendorNavItems;
  console.log(`user profile image ${profileImage}`);

  return (
    <Card className={`h-full p-4`}>
      <div className="flex flex-col h-full">
        {/* Profile Section */}
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="w-12 h-12">
            <AvatarImage src={profileImage} alt={`${name}`} />
            <AvatarFallback>
              {name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">
              {name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {role === "vendor" ? "Photographer" : "Client"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-grow">
          {/* Always show Profile tab */}
          <Button
            variant={activeTab === "profile" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab && setActiveTab("profile")}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>

          {/* Other tabs */}
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start ${role === "vendor" && item.id !== "profile" && !hasCategory ? "opacity-50 pointer-events-none" : ""}`}
              onClick={() => setActiveTab && setActiveTab(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </Card>
  );
}
