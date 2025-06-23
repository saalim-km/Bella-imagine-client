import React from "react";
import Header from "@/components/common/Header";
import LeftSidebar from "../community-contest/community/Leftsidebar";
import { useLocation } from "react-router-dom";
import RightSidebar from "../community-contest/community/RightSidebar";

interface CommunityLayoutProps {
  children: React.ReactNode;
}

const CommunityLayout: React.FC<CommunityLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <LeftSidebar />

          {/* Main Content */}
          <div className="flex-1 max-w-3xl">{children}</div>

          {/* Right Sidebar */}
          {location.pathname !== "/community/submit" && (
            <div className="md:w-80 space-y-6">
              <RightSidebar />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommunityLayout;
