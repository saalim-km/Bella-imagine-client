import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2, Menu } from "lucide-react";
import { EditProfileForm } from "@/components/User/EditProfileForm";
import { Sidebar } from "@/components/User/Sidebar";
import { ProfileInfo } from "@/components/User/ProfileInfo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Header from "@/components/common/Header";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  useClientDetailsQuery,
  useUpdateClientMutation,
} from "@/hooks/client/useClient";
import {
  useUpdateVendorMutation,
  useVendorDetailsQuery,
} from "@/hooks/vendor/useVendor";
import { IProfileUpdate } from "@/types/interfaces/User";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { VendorCategoryModal } from "@/components/modals/VendorCategoryModal";
import { useJoinCategoryRequestMutation } from "@/hooks/vendor/useVendor";
import { handleError } from "@/utils/Error/error-handler.utils";
import { ServiceForm } from "@/components/vendor/services/serviceForm/Service";
import VendorServices from "@/components/vendor/services/serviceForm/VendorServices";
import {
  IServiceResponse,
  IWorkSampleResponse,
} from "@/types/interfaces/vendor";
import VendorWorkSample from "@/components/vendor/VendorWorkSample";
import WorkSampleUpload, {
} from "@/components/vendor/work-sample/WorkSampleUpload";
import ClientWallet from "./ClientWalletPage";
import VendorWallet from "../vendor/VendorWallet";
import { useDispatch } from "react-redux";
import { updateVendorSlice } from "@/store/slices/vendorSlice";
import { Spinner } from "@/components/ui/spinner";
import { IVendor } from "@/services/vendor/vendorService";
import { IClient } from "@/services/client/clientService";
import { updateClientslice } from "@/store/slices/clientSlice";
import ClientBookingList from "./ClientBookingListing";
import VendorBookingList from "../vendor/vendorBookingListing";

const tabTitles: Record<string, string> = {
  profile: "Profile",
  "bookings-history": "Bookings & History",
  wallet: "Wallet & Transactions",
  bookings: "Bookings",
  "allocate-slot": "Allocate Slot",
  "upload-work": "Upload Work",
  services: "Services",
  "work-sample": "Work Sample",
};

export default function UserProfile() {
  const queryClient = useQueryClient();
  const { mutate: joinCategory } = useJoinCategoryRequestMutation();
  const { mutate: updateVendor } = useUpdateVendorMutation();
  const { mutate: updateClient } = useUpdateClientMutation();
  const [isModal, setIsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isServiceCreating, setServiceCreating] = useState(false);
  const [serviceEditData, setIsServiceEditData] = useState<IServiceResponse>();
  const [isWorkSampleCreating, setIsWorkSampleCreating] = useState(false);
  const [workSample, setWorkSample] = useState<IWorkSampleResponse>();
  const dispatch = useDispatch();
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
  const userData =
    userType?.role === "client" ? clientData?.data : vendorData?.data;

  const hasCategory =
    userType?.role === "vendor" && vendorData?.data?.categories?.length !== 0;

  function handleIsServiceEditing(data: IServiceResponse) {
    setIsServiceEditData(data);
    setServiceCreating(!isServiceCreating);
  }

  function handleIsWorkSampleCreating() {
    setIsWorkSampleCreating(!isWorkSampleCreating);
    setWorkSample(undefined);
  }

  function handleUpdateProfile(data: IProfileUpdate) {
    setIsSubmitting(true)
    if (data.imageFile) {
      data = {
        ...data,
        profileImage: data.imageFile,
      };
    }
    delete data.imageFile;
    if (userType?.role === "vendor") {
      updateVendor(data, {
        onSuccess: (data) => {
          setIsSubmitting(false)
          setIsEditing(false);
          const vendor = data.data;
          const dataToUpdateRedux: Partial<IVendor> = {
            _id: vendor._id,
            role: vendor.role,
            email: vendor.email,
            name: vendor.name,
            avatar: vendor.profileImage,
          };
          dispatch(updateVendorSlice(dataToUpdateRedux));
          queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
          toast.success(data.message);
        },
        onError: (error) => {
          setIsSubmitting(false)
          setIsEditing(false);
          handleError(error);
        },
      });
    } else {
      updateClient(data, {
        onSuccess: (data) => {
          setIsSubmitting(false)
          setIsEditing(false);
          const client = data.data;
          const dataToUpdateRedux: Partial<IClient> = {
            _id: client.email,
            name: client.name,
            role: client.role,
            email: client.email,
            avatar: client.profileImage,
          };
          dispatch(updateClientslice(dataToUpdateRedux));
          queryClient.invalidateQueries({ queryKey: ["client-profile"] });
          toast.success(data.message);
        },
        onError: (error) => {
          setIsSubmitting(false)
          setIsEditing(false);
          handleError(error);
        },
      });
    }
  }

  function handleModalOpen() {
    setIsModal(true);
  }

  function handleModalClose() {
    setIsModal(false);
  }

  function handleJoinCategory(category: string) {
    joinCategory(category, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["client-profile"] });
        toast.success(data.message);
      },
      onError: (err) => {
        handleError(err);
      },
    });
  }

  function handleIsServiceCreating(state : boolean) {
    setServiceCreating(state);
    localStorage.removeItem("serviceDraft");
    setIsServiceEditData(undefined);
    handleIsServiceEditing;
  }

  function handleisWorkSampleEditing(workSample: IWorkSampleResponse) {
    setIsWorkSampleCreating(true);
    setWorkSample(workSample);
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
    <div className="mt-16">
      <Header />
      <div className="container mx-auto p-4 lg:p-6">
        {userType?.role === "vendor" &&
          (!hasCategory ? (
            <div className="mb-4">
              <Button variant="outline" onClick={handleModalOpen}>
                Choose a Category
              </Button>
            </div>
          ) : (
            <div className="mb-4">
              <Button variant="outline" onClick={handleModalOpen}>
                Add Category
              </Button>
            </div>
          ))}
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
                <h2 className="text-2xl font-bold">
                  {tabTitles[activeTab] || "Dashboard"}
                </h2>

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
                      isUpdateSubmitting={isSubmitting}
                      setIsEditing={setIsEditing}
                      role={userData.role}
                      data={userData as IVendor}
                      handleUpdateProfile={handleUpdateProfile}
                    />
                  ) : (
                    <ProfileInfo data={userData} />
                  )
                ) : (
                  ""
                )}

                {activeTab === "services" ? (
                  isServiceCreating ? (
                    <ServiceForm
                      handleIsCreatingService={handleIsServiceCreating}
                      editData={serviceEditData}
                      vendorData={vendorData ? vendorData.data : undefined}
                    />
                  ) : (
                    <VendorServices
                      handleIsCreateService={handleIsServiceCreating}
                      handleIsEditingService={handleIsServiceEditing}
                    />
                  )
                ) : (
                  ""
                )}

                {activeTab === "work-sample" ? (
                  isWorkSampleCreating ? (
                    <WorkSampleUpload
                      workSampleData={workSample}
                      vendorId={userType?._id || ""}
                      handleCancelCreatingWorkSample={
                        handleIsWorkSampleCreating
                      }
                    />
                  ) : (
                    <VendorWorkSample
                      handleIsWorkSampleEditing={handleisWorkSampleEditing}
                      handleIsCreateWorkSample={handleIsWorkSampleCreating}
                    />
                  )
                ) : (
                  ""
                )}

                {activeTab === "bookings-history" &&
                  userType?.role === "client" && (
                    <ClientBookingList userType={userType?.role} />
                  )}

                {activeTab === "bookings" && userType?.role === "vendor" && (
                  <VendorBookingList userType={userType?.role} />
                )}

                {activeTab === "wallet" && userType?.role === "client" && (
                  <ClientWallet />
                )}

                {activeTab === "wallet" && userType?.role === "vendor" && (
                  <VendorWallet />
                )}
              </div>
            </Card>
          </main>
        </div>
      </div>

      {isModal && (
        <VendorCategoryModal
          isOpen={isModal}
          onClose={handleModalClose}
          onSave={handleJoinCategory}
        />
      )}
    </div>
  );
}
