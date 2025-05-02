
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/community-contest/layout/CommunityLayout";
import { CreatePostForm } from "@/components/community-contest/community/CommunityPostForm";

const CreatePostPage = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const { slug } = useParams<{ slug: string }>();
  console.log('slug in the createpost : ',slug);
  const navigate = useNavigate();
  const [communityName, setCommunityName] = useState("");


  return (
    <PageLayout>
      <div className="py-8">
        <CreatePostForm
          communityId={communityId!}
          communityName={communityName}
        />
      </div>
    </PageLayout>
  );
};

export default CreatePostPage;
