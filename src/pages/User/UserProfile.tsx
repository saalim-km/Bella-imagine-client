import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2, Menu } from "lucide-react";
import { EditProfileForm } from "@/components/User/EditProfileForm";
import { Sidebar } from "@/components/User/Sidebar";
import { ProfileInfo } from "@/components/User/ProfileInfo";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Header from "@/components/headers/Header";
import { useThemeConstants } from "@/utils/theme/themeUtills";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const {bgColor} = useThemeConstants()

  
  const role = "client"

  
  const tabTitles: Record<string, string> = {
    profile: "Profile",
    "bookings-history": "Bookings & History",
    wallet: "Wallet & Transactions",
    "received-work": "Received Work",
    bookings: "Bookings",
    "allocate-slot": "Allocate Slot",
    "upload-work": "Upload Work",
    "services-portfolio": "Services & Portfolio",
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Sidebar role={role} activeTab={activeTab} setActiveTab={setActiveTab} />
          </aside>



          {/* Mobile Sidebar */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden mb-4">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar role={role} activeTab={activeTab} setActiveTab={setActiveTab} />
            </SheetContent>
          </Sheet>



          {/* Main Content */}
          <main className="flex-1">
            <Card className={`p-6 ${bgColor }`}>
              <div className="flex justify-between items-center mb-6">
                {/* Dynamic Title */}
                <h2 className="text-2xl font-bold">{tabTitles[activeTab] || "Dashboard"}</h2>

                {/* Edit Profile Button (only in Profile tab) */}
                {activeTab === "profile" && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Dynamic Content Rendering */}
              <div className={cn("transition-all duration-300 ease-in-out")}>
                {activeTab === "profile" && (isEditing ? <EditProfileForm role={role}/> : <ProfileInfo />)}
                {/* {activeTab === "bookings-history" && <ClientBookingListing />} */}
                {/* {activeTab === "wallet" && <WalletTransactions />} */}
                {/* {activeTab === "received-work" && <ReceivedWork />} */}
                {/* {activeTab === "bookings" && <VendorBookingList />} */}
                {/* {activeTab === "allocate-slot" && <AllocateSlot />} */}
                {/* {activeTab === "upload-work" && <UploadWork />} */}
                {/* {activeTab === "services-portfolio" && <Portfolio />} */}
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
