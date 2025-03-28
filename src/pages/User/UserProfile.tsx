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
import Spinner from "@/components/common/LogoSpinner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useClientDetailsQuery, useUpdateClientMutation } from "@/hooks/client/useClient";
import { useUpdateVendorMutation, useVendorDetailsQuery } from "@/hooks/vendor/useVendor";
import { IProfileUpdate } from "@/types/User";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { VendorCategoryModal } from "@/components/modals/VendorCategoryModal";
import { useJoinCategoryRequestMutation } from "@/hooks/vendor/useVendor";
import { handleError } from "@/utils/Error/errorHandler";
import { ServiceForm } from "@/components/vendor/services/serviceForm/Service";
import VendorServices from "@/components/vendor/VendorServices";
import { IServiceResponse, IWorkSampleResponse } from "@/types/vendor";
import VendorWorkSample from "@/components/vendor/VendorWorkSample";
import WorkSampleUpload from "@/components/vendor/work-sample/WorkSampleUpload";
import WorkSampleDetails from "@/components/vendor/work-sample/WorkDetails";

const tabTitles: Record<string, string> = {
  profile: "Profile",
  "bookings-history": "Bookings & History",
  wallet: "Wallet & Transactions",
  "received-work": "Received Work",
  bookings: "Bookings",
  "allocate-slot": "Allocate Slot",
  "upload-work": "Upload Work",
  "services": "Services",
  "work-sample" : "Work Sample"
};

export default function UserProfile() {
  const queryClient = useQueryClient() 
  const {mutate : joinCategory} = useJoinCategoryRequestMutation()
  const {mutate : updateVendor} = useUpdateVendorMutation()
  const {mutate : updateClient} = useUpdateClientMutation()
  const [isModal , setIsModal] = useState(false)
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isServiceCreating , setServiceCreating] = useState(false);
  const [serviceEditData , setIsServiceEditData] = useState<IServiceResponse>();
  const [isWorkSampleCreating , setIsWorkSampleCreating] = useState(false);
  const [isWorkSampleViewDetails , setIsWorkSampleViewDetails] = useState(false);
  const [workSample , sestWorkSample] = useState<IWorkSampleResponse>();
  const userType = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor;
    if (state.client.client) return state.client.client;
    return null;
  });
  
  // ---------------------------Fetching client data if the role is only cient--------------------------------|
  const {
    data: clientData,
    isLoading: isClientLoading,
    isError: isClientError,
  } = useClientDetailsQuery(userType?.role === "client");
  
  // ---------------------------Fetching vendor data if the role is only vendor--------------------------------|
  const {
    data: vendorData,
    isLoading: isVendorLoading,
    isError: isVendorError,
  } = useVendorDetailsQuery(userType?.role === "vendor");
  
  
  const isLoading = isClientLoading || isVendorLoading;
  const isError = isClientError || isVendorError;
  const userData = userType?.role === "client" ? clientData?.client : vendorData?.vendor;
  
  console.log(`User data:`, userData);
  
  const hasCategory = userType?.role === "vendor" && vendorData?.vendor?.categories?.length !== 0;

  function handleIsServiceEditing(data : IServiceResponse) {
    setIsServiceEditData(data);
    setServiceCreating(!isServiceCreating)
  }

  function handleIsWorkSampleCreating() {
    setIsWorkSampleCreating(!isWorkSampleCreating)
  }

  function handleUpdateProfile(data : IProfileUpdate) {
    console.log('data for update : ',data);
    if(userType?.role === "vendor") {
      console.log(data);
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

  function handleModalOpen() {
    setIsModal(true);
  }

  function handleModalClose() {
    setIsModal(false)
  }

  function handleJoinCategory(category : string) {
    joinCategory(category,{
      onSuccess : (data)=> {
        queryClient.invalidateQueries({queryKey : ["client-profile"]})
        toast.success(data.message)
      },
      onError :(err)=> {
        handleError(err)
      }
    })
  }

  function handleIsServiceCreating(){
    setServiceCreating(!isServiceCreating)
    localStorage.removeItem("serviceDraft");
    setIsServiceEditData(undefined)
  }

  function handleWorkSampleViewDetails(workSample : IWorkSampleResponse) {
    setIsWorkSampleViewDetails(!isWorkSampleViewDetails);
    sestWorkSample(workSample);
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
    <div className="mt-14">
      <Header />
      <div className="container mx-auto p-4 lg:p-6">
        {!hasCategory && userType?.role === "vendor" ? (
          <div className="mb-4">
            <Button variant="outline" onClick={handleModalOpen}>
              Choose a Category
            </Button>
          </div>
        )
        :
        <div className="mb-4">
            <Button variant="outline" onClick={handleModalOpen}>
              Add Category
            </Button>
          </div>
      }
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Sidebar
              name={userData.name}
              profileImage={userData.profileImage}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              role={userData.role}
              hasCategory={hasCategory}
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
                hasCategory={hasCategory}
              />
            </SheetContent>
          </Sheet>

          {/* Main Content */}
          <main className="flex-1">
            <Card className={`p-6`}>
              <div className="flex justify-between items-center mb-6">
                {/* Dynamic Title */}
                <h2 className="text-2xl font-bold">{tabTitles[activeTab] || "Dashboard"}</h2>

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
                {activeTab === "profile" ? (
                  isEditing ? (
                    <EditProfileForm
                      setIsEditing={setIsEditing}
                      role={userData.role}
                      data={userData}
                      handleUpdateProfile={handleUpdateProfile}
                    />
                  ) : (
                    <ProfileInfo data={userData} />
                  )
                ) :''}

                {activeTab === "services" ? (
                  isServiceCreating ? (
                    <ServiceForm handleIsCreatingService={handleIsServiceCreating} editData={serviceEditData}/>
                  ) : (
                    <VendorServices handleIsCreateService={handleIsServiceCreating} handleIsEditingService={handleIsServiceEditing} />
                  )
                ) : ''}


                {activeTab === "work-sample" ? (
                  isWorkSampleCreating ? (
                    <WorkSampleUpload vendorId={userType?._id || ""} handleCancelCreatingWorkSample={handleIsWorkSampleCreating}/>
                  )
                  :(
                    <VendorWorkSample handleIsCreateWorkSample={handleIsWorkSampleCreating} handleWorkSampleViewDetails={handleWorkSampleViewDetails}/>
                  )
                  ) 
                  : (
                    ""
                  )
                }

                {
                  activeTab === "work-sample" ? (
                    isWorkSampleViewDetails && workSample ? (
                      <WorkSampleDetails workSample={workSample}/>
                    ):(
                      ""
                    )
                  ):(
                    ""
                  )
                }
              </div>
            </Card>
          </main>
        </div>
      </div>

      {isModal &&
      <VendorCategoryModal isOpen = {isModal} onClose={handleModalClose} onSave={handleJoinCategory}/>
      }
    </div>
  );
}