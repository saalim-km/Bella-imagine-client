import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import LeftSidebar from "../community-contest/Leftsidebar";
import { useLocation } from "react-router-dom";
import RightSidebar from "../community-contest/RightSidebar";
import { useAllVendorsListQueryClient } from "@/hooks/client/useClient";
import {
  useGetAllCommunitiesClient,
  useGetAllCommunitiesVendor,
} from "@/hooks/community-contest/useCommunity";
import { useAllVendorsListQueryVendor } from "@/hooks/vendor/useVendor";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface CommunityLayoutProps {
  children: React.ReactNode;
}

const CommunityLayout: React.FC<CommunityLayoutProps> = ({ children }) => {
  const user = useSelector((state: RootState) => {
    if (state.client.client) return state.client.client;
    if (state.vendor.vendor) return state.vendor.vendor;
    return undefined;
  });

  
  if(!user){
    return <p className="text-red-700">user not found please try again later , or please relogin to continue</p>
  }

  const location = useLocation();
  const { data: communitiesDataClient } = useGetAllCommunitiesClient({
    limit: 1000,
    page: 1,
    enabled: user.role === "client",
  });
  const { data: communitiesDataVendor } = useGetAllCommunitiesVendor({
    limit: 1000,
    page: 1,
    enabled: user.role === "vendor",
  });

  const [marker, setMarker] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const communities = communitiesDataClient?.data.data
    ? communitiesDataClient?.data.data
    : communitiesDataVendor?.data.data || [];

  const { data: vendorsForClient } = useAllVendorsListQueryClient({
    page: 1,
    limit: 5,
    location: { lat: marker.lat, lng: marker.lng },
    maxCharge: 100000,
    enabled: user.role === "client",
  });
  const { data: vendorsForVendor } = useAllVendorsListQueryVendor({
    page: 1,
    limit: 5,
    location: { lat: marker.lat, lng: marker.lng },
    maxCharge: 100000,
    enabled: user.role === "vendor",
  });
  const vendors = vendorsForClient?.data.data
    ? vendorsForClient?.data.data
    : vendorsForVendor?.data.data || [];

  useEffect(() => {
    if (navigator.geolocation && marker.lat === 0) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("userlocation: ", userLocation);
          setMarker(userLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [marker]);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6 bg-background">
        <div className="flex flex-col md:flex-row gap-6">
          <LeftSidebar communities={communities} />

          {/* Main Content */}
          <div className="flex-1 max-w-3xl">{children}</div>

          {/* Right Sidebar */}
          {location.pathname !== "/community/submit" && (
            <div className="md:w-80 space-y-6">
              <RightSidebar vendors={vendors} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommunityLayout;
