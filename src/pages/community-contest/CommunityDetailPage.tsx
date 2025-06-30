// src/pages/CommunityDetailPage.tsx
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { MessageSquare, Users, Info, MessageCircle } from "lucide-react"
import { PageLayout } from "@/components/community-contest/layout/CommunityLayout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostsTab } from "@/components/community-contest/tab/PostTab"
import { AboutTab } from "@/components/community-contest/tab/AboutTab"
import {
  useGetCommunityBySlugQueryClient,
  useGetCommunityBySlugQueryVendor,
  useJoinCommunity,
  useLeaveCommunity,
} from "@/hooks/community-contest/useCommunity"
import { CommunityHeader } from "@/components/community-contest/CommunityHeader"
import { handleError } from "@/utils/Error/error-handler.utils"
import { useQueryClient } from "@tanstack/react-query"
import { resetState } from "@/store/slices/communityDetailsSlice"
import type { AppDispatch, RootState } from "@/store/store"
import { CommunityInfo } from "@/components/community-contest/CommunityInto"
import { LoadingBar } from "@/components/ui/LoadBar"
import { useSelector } from "react-redux"
import { joinCommunityServiceClient, joinCommunityServiceVendor, leaveCommunityServiceClient, leaveCommunityServiceVendor } from "@/services/community-contest/communityService"

const CommunityDetailPage = () => {
    const user = useSelector((state : RootState)=> {
    if(state.client.client) return state.client.client;
    if(state.vendor.vendor) return state.vendor.vendor;
    return undefined;
  })


  if(!user){
    return <p>user not found please try again later , or please relogin to continue</p>
  }


  const { slug } = useParams<{ slug: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [activeTab, setActiveTab] = useState("posts")
  const [isJoining, setIsJoining] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const { 
    data: communityDataClient, 
    isLoading : isCLientLoading, 
    error : isClientError,
    refetch : refetchClient
  } = useGetCommunityBySlugQueryClient(slug as string , user.role === 'client')

  const { 
    data: communityDataVendor, 
    isLoading : isVendorLoading, 
    error : isVendorError,
    refetch : refetchVendor
  } = useGetCommunityBySlugQueryVendor(slug as string , user.role === 'vendor')


  const joinMutateFn = user.role === 'client' ? joinCommunityServiceClient : joinCommunityServiceVendor
  const { mutate: joinCommunity } = useJoinCommunity(joinMutateFn)

  const leaveMutateFn = user.role === 'client' ? leaveCommunityServiceClient : leaveCommunityServiceVendor
  const { mutate: leaveCommunity } = useLeaveCommunity(leaveMutateFn)

  // Reset state when component unmounts or slug changes
  useEffect(() => {
    return () => {
      dispatch(resetState())
    }
  }, [dispatch, slug])

  const handleJoinToggle = (communityId: string) => {
    setIsJoining(true)
    joinCommunity(communityId, {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey : ["community", slug]})
        user.role === 'client' ? refetchClient() : refetchVendor()

      },
      onError: handleError,
      onSettled: () => setIsJoining(false),
    })
  }

  const handleLeaveCommunity = (communityId: string) => {
    setIsLeaving(true)
    leaveCommunity(communityId, {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey : ["community", slug]})
        user.role === 'client' ? refetchClient() : refetchVendor()
      },
      onError: handleError,
      onSettled: () => setIsLeaving(false),
    })
  }

  if (isCLientLoading || isVendorLoading) {
    return <LoadingBar />
  }

  const community = communityDataClient?.data.community ? communityDataClient?.data : communityDataVendor?.data 

  if(!community){
    return <p className="text-red-700">an unexpected error occured please try again later</p>
  }

  return (
    <PageLayout>
      <div className="flex flex-col min-h-screen">
        <CommunityHeader community={community.community} />
        
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

                {community.isMember && (
                  <Button variant="outline" size="sm" className="hidden sm:flex items-center" asChild>
                    <Link to={`/communities/${community.community._id}/chat`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat Room
                    </Link>
                  </Button>
                )}
              </div>

              <TabsContent value="posts">
                <PostsTab
                  slug={community.community.slug!}
                  isMember={community.isMember}
                  communityId={community.community._id}
                />
              </TabsContent>

              <TabsContent value="members">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">Members</h3>
                  <p className="text-gray-500">Members list coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="about">
                <AboutTab
                  createdAt={community.community.createdAt ?? ""}
                  rules={community.community.rules!}
                  communityName={community.community.name}
                  description={community.community.description!}
                  memberCount={community.community.memberCount!}
                  postCount={community.community.postCount!}
                  isMember={community.isMember}
                  communityId={community.community._id}
                />
              </TabsContent>
            </Tabs>

            {community.isMember && (
              <div className="sm:hidden">
                <Button className="w-full" asChild>
                  <Link to={`/communities/${community.community._id}/chat`}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Enter Community Chat
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              <CommunityInfo
                isLeaving={isLeaving}
                onLeaveToggle={handleLeaveCommunity}
                communityId={community.community._id}
                createdAt={community.community.createdAt!}
                description={community.community.description!}
                memberCount={community.community.memberCount!}
                isMember={community.isMember}
                isJoining={isJoining}
                onJoinToggle={handleJoinToggle}
              />

              <div className="bg-secondary/30 rounded-lg p-4">
                <h3 className="font-medium mb-2">Community Rules</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  {Array.isArray(community.community.rules) && community.community.rules.map((rule, index) => (
                    <li 
                      key={index} 
                      className={index !== (community.community.rules?.length ?? 0) - 1 ? "border-b pb-1" : ""}
                    >
                      {index + 1}. {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default CommunityDetailPage