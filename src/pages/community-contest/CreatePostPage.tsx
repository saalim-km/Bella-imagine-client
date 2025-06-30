import { useParams } from "react-router-dom";
import { CreatePostForm } from "@/components/community-contest/CommunityPostForm";
import CommunityLayout from "@/components/layout/CommunityLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const CreatePostPage = () => {
  const user = useSelector((state: RootState) => {
    if (state.client.client) return state.client.client;
    if (state.vendor.vendor) return state.vendor.vendor;
    return undefined;
  });

  if (!user) {
    return (
      <p className="text-red-700">
        user not found please try again later , or please relogin to continue
      </p>
    );
  }

  const { communityId } = useParams<{ communityId: string }>();
  const { slug } = useParams<{ slug: string }>();
  console.log("slug in the createpost : ", slug);

  return (
    <CommunityLayout>
      <CreatePostForm user={user} communityId={communityId!} />
    </CommunityLayout>
  );
};

export default CreatePostPage;
