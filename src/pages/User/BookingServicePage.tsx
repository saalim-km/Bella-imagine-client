import Header from "@/components/common/Header";
import { Spinner } from "@/components/ui/spinner";
import BookingPage from "@/components/User/booking/BookingComp";
import { useGetServiceQueryClient } from "@/hooks/client/useClient";
import { useGetServiceQueryVendor } from "@/hooks/vendor/useVendor";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const BookingServicePage = () => {
  const { id, vendorId } = useParams();

  const user = useSelector((state: RootState) => {
    if (state.client.client) return state.client.client;
    if (state.vendor.vendor) return state.vendor.vendor;
    return undefined;
  });

  if (!user) {
    return (
      <p>
        user not found please try again later , or please relogin to continue
      </p>
    );
  }

  const { data: clientData, isLoading : isClientLoading } = useGetServiceQueryClient(id as string , user.role === 'client');
  const { data: vendorData, isLoading : isVendorLoading } = useGetServiceQueryVendor(id as string , user.role === 'vendor');

  if (isClientLoading || isVendorLoading) {
    return <Spinner />;
  }

  const serviceDetails = clientData?.data ? clientData.data : vendorData?.data

  if(!serviceDetails){
    return <p className="text-red-700">An unexpected error occured while fetching service details for booking , please try again later</p>
  }
  return (
    <>
      <Header />
      <BookingPage service={serviceDetails} vendorId={vendorId!} />
    </>
  );
};

export default BookingServicePage;
