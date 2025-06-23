import { useState } from "react";
import { useParams, Link, data } from "react-router-dom";
import { Image, MessageSquare, Users, Info, MessageCircle } from "lucide-react";
import { PageLayout } from "@/components/community-contest/layout/CommunityLayout";
import { Button } from "@/components/ui/button";
import { CreatePostDialog } from "@/components/community-contest/community/CreatePostDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsTab } from "@/components/community-contest/community/tab/PostTab";
import { AboutTab } from "@/components/community-contest/community/tab/AboutTab";
import { CommunityInfo } from "@/components/community-contest/community/CommunityInto";
import {
  useGetCommunityBySlugQueryClient,
  useJoinCommunity,
  useLeaveCommunity,
} from "@/hooks/community-contest/useCommunity";
import { Spinner } from "@/components/ui/spinner";
import { CommunityHeader } from "@/components/community-contest/community/CommunityHeader";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const CommunityDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState("posts");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const { mutate: joinCommunity } = useJoinCommunity();
  const { mutate: leaveCommunity } = useLeaveCommunity();

  const user = useSelector((state: RootState) =>
    state.client.client ? state.client.client : state.vendor.vendor
  );
  const {
    data: communityData,
    isLoading,
    refetch,
  } = useGetCommunityBySlugQueryClient(slug as string);

  const community = communityData?.data.community;
  console.log(communityData);
  const handleJoinToggle = (communityId: string) => {
    setIsJoining(true);
    joinCommunity(communityId, {
      onSuccess: (data) => {
        refetch();
        setIsJoining(false);
      },
      onError: (err) => {
        handleError(err);
        setIsJoining(false);
      },
    });
  };

  const handleLeaveCommunity = (communityId: string) => {
    leaveCommunity(communityId, {
      onSuccess: (data) => {
        refetch();
      },
      onError: (err) => {
        handleError(err);
      },
    });
  };

  if (isLoading || !community) {
    return <Spinner />;
  }

  return (
    <PageLayout>
      <div className="flex flex-col min-h-screen">
        <CommunityHeader community={community} />
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <Tabs
              defaultValue="posts"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="flex justify-between items-center mb-4">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="posts" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Posts
                  </TabsTrigger>
                  <TabsTrigger value="members" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Members
                  </TabsTrigger>
                  <TabsTrigger value="about" className="flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    About
                  </TabsTrigger>
                </TabsList>

                {communityData.data.isMember ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex items-center"
                    asChild
                  >
                    <Link to={`/communities/${community._id}/chat`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat Room
                    </Link>
                  </Button>
                ) : null}
              </div>

              <TabsContent value="posts">
                <PostsTab
                  slug={community.slug!}
                  posts={[]} // Replace with fetched posts if available
                  isMember={communityData.data.isMember}
                  communityId={community._id}
                />
              </TabsContent>

              <TabsContent value="members">
                {/* You can render members list here if available */}
              </TabsContent>

              <TabsContent value="about">
                <AboutTab
                  createdAt={community.createdAt!}
                  rules={community.rules!}
                  communityName={community.name}
                  description={community.description!}
                  memberCount={community.memberCount!}
                  postCount={community.postCount!}
                  isMember={communityData.data.isMember}
                  communityId={community._id}
                />
              </TabsContent>
            </Tabs>

            <div className="sm:hidden">
              <Button className="w-full" asChild>
                <Link to={`/communities/${community._id}/chat`}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enter Community Chat
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              <CommunityInfo
                isLeaving={isLeaving}
                onLeaveToggle={handleLeaveCommunity}
                communityId={community._id}
                createdAt={community.createdAt!}
                description={community.description!}
                memberCount={community.memberCount!}
                isMember={communityData.data.isMember}
                isJoining={isJoining}
                onJoinToggle={handleJoinToggle}
              />

              <div className="bg-secondary/30 rounded-lg p-4">
                <h3 className="font-medium mb-2">Community Rules</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  {community.rules!.map((rule, index) => (
                    <li
                      key={index}
                      className={
                        index !== community.rules!.length - 1
                          ? "border-b pb-1"
                          : ""
                      }
                    >
                      {index + 1}. {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <CreatePostDialog
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
          communityId={community._id}
          communityName={community.name}
        />
      </div>
    </PageLayout>
  );
};

export default CommunityDetailPage;
