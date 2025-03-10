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
import { useClientQuery } from "@/hooks/client/useClientProfile";
import Spinner from "@/components/common/LogoSpinner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useVendorQuery } from "@/hooks/vendor/useVendorProfile";

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

export default function UserProfile() {
  const { bgColor } = useThemeConstants();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const userType  = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor.role;
    if (state.client.client) return state.client.client.role;
    return null;
  });
  // Fetch client data only if userType is "client"
  const {
    data: clientData,
    isLoading: isClientLoading,
    isError: isClientError,
  } = useClientQuery(userType === "client" );
  
  // Fetch vendor data only if userType is "vendor"
  const {
    data: vendorData,
    isLoading: isVendorLoading,
    isError: isVendorError,
  } = useVendorQuery(userType === "vendor");
  
  // Unified states
  const isLoading = isClientLoading || isVendorLoading;
  const isError = isClientError || isVendorError;
  const userData = userType === "client" ? clientData?.client : vendorData?.vendor;
  
  console.log(`User data:`, userData);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }
  
  // Error or missing data state
  if (isError || !userData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        An error occurred. Please try again.
      </div>
    );
  }
  

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Sidebar
              name={userData.name}
              profileImage={userData.profileImage}
              role={userData.role}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </aside>

          {/* Mobile Sidebar */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden mb-4">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar
                name={userData.name}
                profileImage={userData.profileImage}
                role={userData.role}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </SheetContent>
          </Sheet>

          {/* Main Content */}
          <main className="flex-1">
            <Card className={`p-6 ${bgColor}`}>
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
                {activeTab === "profile" &&
                  (isEditing ? (
                    <EditProfileForm setIsEditing={setIsEditing} role={userData.role} data={userData} />
                  ) : (
                    <ProfileInfo data={userData} />
                  ))}
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}