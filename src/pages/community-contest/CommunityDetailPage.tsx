import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Image, MessageSquare, Users, Info, MessageCircle } from "lucide-react";
import { PageLayout } from "@/components/community-contest/layout/CommunityLayout";
import { Button } from "@/components/ui/button";
import { CreatePostDialog } from "@/components/community-contest/community/CreatePostDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsTab } from "@/components/community-contest/community/tab/PostTab";
import { PhotosTab } from "@/components/community-contest/community/tab/PhotosTab";
import { AboutTab } from "@/components/community-contest/community/tab/AboutTab";
import { CommunityInfo } from "@/components/community-contest/community/CommunityInto";
import { useGetCommunityBySlugQueryClient } from "@/hooks/community-contest/useCommunity";
import { Spinner } from "@/components/ui/spinner";
import { CommunityHeader } from "@/components/community-contest/community/CommunityHeader";

const CommunityDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState("posts");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const { data: community, isLoading } = useGetCommunityBySlugQueryClient(slug as string);

  const [isMember, setIsMember] = useState(false); // You can update this based on logic

  const handleJoinToggle = () => {
    console.log("joining community trigger");
  };

  if (isLoading || !community) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col min-h-screen mt-16">
      <CommunityHeader community={community}/>
      <PageLayout containerClassName="py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="posts" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Posts
                  </TabsTrigger>
                  <TabsTrigger value="photos" className="flex items-center">
                    <Image className="h-4 w-4 mr-2" />
                    Photos
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

                <Button variant="outline" size="sm" className="hidden sm:flex items-center" asChild>
                  <Link to={`/communities/${community._id}/chat`}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat Room
                  </Link>
                </Button>
              </div>

              <TabsContent value="posts">
                <PostsTab
                  posts={[]} // Replace with fetched posts if available
                  isMember={isMember}
                  communityId={community._id}
                />
              </TabsContent>

              <TabsContent value="photos">
                <PhotosTab
                  posts={[]} // Replace with fetched posts if available
                  isMember={isMember}
                  onCreatePost={() => setIsCreatePostOpen(true)}
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
                  isMember={isMember}
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
                createdAt={community.createdAt!}
                description={community.description!}
                memberCount={community.memberCount!}
                isMember={isMember}
                isJoining={isJoining}
                onJoinToggle={handleJoinToggle}
              />

              <div className="bg-secondary/30 rounded-lg p-4">
                <h3 className="font-medium mb-2">Community Rules</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  {community.rules!.map((rule, index) => (
                    <li key={index} className={index !== community.rules!.length - 1 ? "border-b pb-1" : ""}>
                      {index + 1}. {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>

      <CreatePostDialog
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        communityId={community._id}
        communityName={community.name}
      />
    </div>
  );
};

export default CommunityDetailPage;
