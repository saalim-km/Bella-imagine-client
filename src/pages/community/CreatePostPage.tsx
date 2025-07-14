import { useParams } from "react-router-dom";
import { CreatePostForm } from "@/components/community-contest/CommunityPostForm";
import CommunityLayout from "@/components/layout/CommunityLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const CreatePostPage = () => {
  const client = useSelector((state: RootState) => state.client.client);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const user = client || vendor;

  const { communityId } = useParams<{ communityId: string }>();

  if (!user) {
    return (
      <p className="text-red-700">
        user not found please try again later , or please relogin to continue
      </p>
    );
  }
  return (
    <CommunityLayout>
      <CreatePostForm user={user} communityId={communityId!} />
    </CommunityLayout>
  );
};

export default CreatePostPage;
