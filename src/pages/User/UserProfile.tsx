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
import Spinner from "@/components/common/LogoSpinner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useClientDetailsQuery, useUpdateClientMutation } from "@/hooks/client/useClient";
import { useUpdateVendorMutation, useVendorDetailsQuery } from "@/hooks/vendor/useVendor";
import { IProfileUpdate } from "@/types/User";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";


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
  const queryClient = useQueryClient() 
  const {mutate : updateVendor} = useUpdateVendorMutation()
  const {mutate : updateClient} = useUpdateClientMutation()
  const { bgColor } = useThemeConstants();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const userType  = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor.role;
    if (state.client.client) return state.client.client.role;
    return null;
  });
  
  // ---------------------------Fetching client data if the role is only cient--------------------------------|
  const {
    data: clientData,
    isLoading: isClientLoading,
    isError: isClientError,
  } = useClientDetailsQuery(userType === "client");
  
  // ---------------------------Fetching vendor data if the role is only vendor--------------------------------|
  const {
    data: vendorData,
    isLoading: isVendorLoading,
    isError: isVendorError,
  } = useVendorDetailsQuery(userType === "vendor");
  
  
  const isLoading = isClientLoading || isVendorLoading;
  const isError = isClientError || isVendorError;
  const userData = userType === "client" ? clientData?.client : vendorData?.vendor;
  
  console.log(`User data:`, userData);
  

  function handleUpdateProfile(data : IProfileUpdate) {
    if(userType === "vendor") {
      updateVendor(data,{
        onSuccess : (data)=> {
          queryClient.invalidateQueries({queryKey : ["vendor-profile"]})
          toast.success(data.message)
        },
        onError : (error)=> {
          console.log(error);
          toast.error(error.message)
        }
      })
    }else {
      updateClient(data,{
        onSuccess : (data)=> {
          queryClient.invalidateQueries({queryKey : ["client-profile"]})
          toast.success(data.message)
        },
        onError : (error)=> {
          console.log(error);
          console.log(error.message);
        }
      })
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }
  
  
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
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              role={userData.role}
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
                    <EditProfileForm setIsEditing={setIsEditing} role={userData.role} data={userData} handleUpdateProfile={handleUpdateProfile}/>
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