import Header from "@/components/common/Header";
import VendorDetails from "@/components/User/vendor-details/VendorDetails";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const VendorDetailsPage = () => {
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
  
  return (
    <>
      <Header />
      <VendorDetails user={user}/>
    </>
  );
};

export default VendorDetailsPage;
