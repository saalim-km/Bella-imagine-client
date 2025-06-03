import EditCommunityForm  from "@/components/admin/community_contest/EditCommunity";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Spinner } from "@/components/ui/spinner";
import { useGetCommunityBySlug } from "@/hooks/community-contest/useCommunity";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const EditCommunityPage = () => {
  const location = useLocation();
  const communitySlug = location.pathname.split("/").pop();
  console.log("community slug : ", communitySlug);

  const { data: community, isLoading , refetch} = useGetCommunityBySlug(communitySlug!);
  console.log("community : ", community);

  function refetchUpdatedData(){
    refetch()
  }

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <AdminLayout>
      <EditCommunityForm community={community?.community} refetch={refetchUpdatedData}/>
    </AdminLayout>
  );
};

export default EditCommunityPage;
