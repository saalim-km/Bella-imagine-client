import { useParams } from "react-router-dom";
import CommunityLayout from "@/components/layout/CommunityLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { EditPostForm } from "@/components/community/EditPostForm";
import {
  useGetPostDetailsClient,
  useGetPostDetailsVendor,
} from "@/hooks/community/useCommunity";
import { LoadingBar } from "@/components/ui/LoadBar";
import { Card } from "@/components/ui/card";

const EditPostPage = () => {
  const client = useSelector((state: RootState) => state.client.client);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const user = client || vendor;

  const { postId } = useParams<{ postId: string }>();

  const queryData = {
    postId: postId!,
    limit: 2,
    page: 1,
  };
  const { data: postDetailsClient, isLoading: isLoadingClient } =
    useGetPostDetailsClient({
      ...queryData,
      enabled: user?.role === "client",
    });

  const { data: postDetailsVendor, isLoading: isLoadingVendor } =
    useGetPostDetailsVendor({
      ...queryData,
      enabled: user?.role === "vendor",
    });

  const post = postDetailsClient?.data
    ? postDetailsClient.data
    : postDetailsVendor?.data;

  if (!postId) {
    return (
      <CommunityLayout>
        <Card className="p-6 text-center">
          <p className="text-red-600 dark:text-red-400">
            Post ID is required to fetch details. Please try again later.
          </p>
        </Card>
      </CommunityLayout>
    );
  }

  if (isLoadingClient || isLoadingVendor) {
    return (
      <CommunityLayout>
        <LoadingBar />
      </CommunityLayout>
    );
  }

  if (!user) {
    return (
      <p className="text-red-700">
        user not found please try again later , or please relogin to continue
      </p>
    );
  }

  if (!post) {
    return (
      <CommunityLayout>
        <Card className="p-6 text-center">
          <p className="text-red-600 dark:text-red-400">
            Post not found or you do not have permission to edit this post.
          </p>
        </Card>
      </CommunityLayout>
    );
  }
  return (
    <CommunityLayout>
      <EditPostForm post={post} user={user} />
    </CommunityLayout>
  );
};

export default EditPostPage;
