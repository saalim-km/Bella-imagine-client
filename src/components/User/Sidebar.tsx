import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useThemeConstants } from "@/utils/theme/themeUtills";
import { User, Calendar, CreditCard, Image, Camera, Upload, Folder, Ticket } from "lucide-react";

const clientNavItems = [
  { icon: User, label: "Profile Management", id: "profile" },
  { icon: Calendar, label: "Bookings & History", id: "bookings-history" },
  { icon: CreditCard, label: "Wallet & Transactions", id: "wallet" },
  { icon: Image, label: "Received Work", id: "received-work" }, // Renamed for professionalism
];

const vendorNavItems = [
  { icon: User, label: "Profile Management", id: "profile" },
  { icon: Calendar, label: "Bookings", id: "bookings" },
  { icon: CreditCard, label: "Wallet & Transactions", id: "wallet" },
  { icon: Ticket, label: "Allocate Slot", id: "allocate-slot" },
  { icon: Upload, label: "Upload Work for Clients", id: "upload-work" },
  { icon: Camera, label: "Services & Portfolio", id: "services-portfolio" },
];

interface SidebarProps {
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  role: "client" | "vendor"; 
}

export function Sidebar({
  firstName,
  lastName,
  profileImage,
  activeTab,
  setActiveTab,
  role,
}: SidebarProps) {
  const navItems = role === "client" ? clientNavItems : vendorNavItems;
  const {bgColor} = useThemeConstants()
  return (
    <Card className={`h-full p-4 ${bgColor}`}>
      <div className="flex flex-col h-full">
        {/* Profile Section */}
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="w-12 h-12">
            <AvatarImage src={profileImage} alt={`${firstName} ${lastName}`} />
            <AvatarFallback>
              {firstName?.charAt(0).toUpperCase()}
              {lastName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">
              {firstName} {lastName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {role === "vendor" ? "Photographer" : "Event Enthusiast"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-grow">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className="w-full justify-start"
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
