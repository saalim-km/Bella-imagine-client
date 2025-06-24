import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import LeftSidebar from "../community-contest/Leftsidebar";
import { useLocation } from "react-router-dom";
import RightSidebar from "../community-contest/RightSidebar";
import { useGetAllCommunities } from "@/hooks/community-contest/useCommunity";
import { useAllVendorsListQuery } from "@/hooks/client/useClient";

interface CommunityLayoutProps {
  children: React.ReactNode;
}

const CommunityLayout: React.FC<CommunityLayoutProps> = ({ children }) => {
  const location = useLocation();
    const { data: communitiesData } = useGetAllCommunities({
      limit: 1000,
      page: 1,
    });
  const [marker,setMarker] = useState<{lat : number,lng : number}>({lat:0,lng:0})
  const communities = communitiesData?.data.data || [];
  const {data} = useAllVendorsListQuery({page : 1 , limit : 5 , location : {lat : marker.lat , lng : marker.lng}})
  const vendors = data?.data.data || []

  useEffect(() => {
    if (navigator.geolocation && marker.lat === 0) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setMarker(userLocation)
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [marker])

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6 bg-background">
        <div className="flex flex-col md:flex-row gap-6">
          <LeftSidebar communities={communities}/>

          {/* Main Content */}
          <div className="flex-1 max-w-3xl">{children}</div>

          {/* Right Sidebar */}
          {location.pathname !== "/community/submit" && (
            <div className="md:w-80 space-y-6">
              <RightSidebar vendors={vendors}/>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommunityLayout;
