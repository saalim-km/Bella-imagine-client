import EditCommunityForm  from "@/components/admin/community/EditCommunity";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Spinner } from "@/components/ui/spinner";
import { useGetCommunityBySlug } from "@/hooks/community/useCommunity";
import { useLocation } from "react-router-dom";

const EditCommunityPage = () => {
  const location = useLocation();
  const communitySlug = location.pathname.split("/").pop();

  const { data: community, isLoading , refetch} = useGetCommunityBySlug(communitySlug!);

  function refetchUpdatedData(){
    refetch()
  }

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <AdminLayout>
      <EditCommunityForm community={community?.data.community} refetch={refetchUpdatedData}/>
    </AdminLayout>
  );
};

export default EditCommunityPage;
