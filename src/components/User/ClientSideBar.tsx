import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Calendar, BarChart2, Ticket } from "lucide-react";

const navItems = [
  { icon: User, label: "Profile", id: "profile" },
  { icon: Calendar, label: "Events", id: "events" },
  { icon: BarChart2, label: "Bookings", id: "bookings" },
  { icon: Ticket, label: "Host Events", id: "event-list" },
];

interface ClientSidebarProps {
  firstName: string;
  lastName: string;
  profileImage: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ClientSidebar({
  firstName,
  lastName,
  profileImage,
  activeTab,
  setActiveTab,
}: ClientSidebarProps) {
  return (
    <Card className="h-full p-4">
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="w-12 h-12">
            <AvatarImage src={profileImage} alt={`${firstName} ${lastName}`} />
            <AvatarFallback>
              {firstName && firstName[0].toUpperCase()}
              {lastName ? lastName[0].toUpperCase() : ""}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">
              {firstName} {lastName}
            </h2>
            <p className="text-sm text-muted-foreground">Event Enthusiast</p>
          </div>
        </div>
        <nav className="space-y-2 flex-grow">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab(item.id)}
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
