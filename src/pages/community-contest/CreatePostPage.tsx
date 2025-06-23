import { useParams } from "react-router-dom";
import { CreatePostForm } from "@/components/community-contest/community/CommunityPostForm";
import CommunityLayout from "@/components/layout/CommunityLayout";

const CreatePostPage = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const { slug } = useParams<{ slug: string }>();
  console.log("slug in the createpost : ", slug);

  return (
    <CommunityLayout>
      <CreatePostForm
        communityId={communityId!}
      />
    </CommunityLayout>
  );
};

export default CreatePostPage;
