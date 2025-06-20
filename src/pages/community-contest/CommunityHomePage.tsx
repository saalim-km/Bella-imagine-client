
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/community-contest/layout/CommunityLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Users, Calendar } from "lucide-react";
import { useGetlAllCommunity } from "@/hooks/community-contest/useCommunity";
import { CommunityCard } from "../../components/community-contest/community/CommunityCard";

const CommunityHomePage = () => {
  const [activeTab, setActiveTab] = useState("featured");
  
  // const {data  , isLoading} = useGetlAllCommunity({page : 1 , limit : 5});
  // const commnities = data?.data || []
  return (
    <PageLayout containerClassName="py-6 md:py-8 mt-36">
      <section className="mb-10 md:mb-16">
        <div className="flex flex-col gap-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif tracking-tighter text-9xl sm:text-5xl mb-2 text-center">
              Welcome to <span className="text-">BellaCommunity</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              Join our photography communities, share your work, and participate in contests to showcase your talent.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/communities">Explore Communities</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contests">View Contests</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-10">
        {/* <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="contests">Contests</TabsTrigger>
          </TabsList>
        </div> */}

        <TabsContent value="featured" className="animate-fade-in space-y-10">
          {/* Featured Post */}
          <section>
            {/* <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Featured Posts</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/posts">View All</Link>
              </Button>
            </div>
             */}
            {/* {featuredPosts.length > 0 && (
              <PostCard post={featuredPosts[0]} featured />
            )} */}
          </section>

          {/* Featured Communities */}
          <section>
            {/* <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <Users className="mr-2 h-5 w-5" />
                <span>Popular Communities</span>
              </h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/communities">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {commnities.map(community => (
                <CommunityCard key={community._id} community={community} />
              ))}
            </div> */}
          </section>

          {/* Active Contests */}
          {/* <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                <span>Active Contests</span>
              </h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/contests">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeContests.slice(0, 3).map(contest => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          </section> */}
        </TabsContent>

        <TabsContent value="communities" className="animate-fade-in">
          {/* <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Discover Communities</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/communities">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {commnities.concat(commnities).slice(0, 6).map(community => (
              <CommunityCard key={`explore-${community._id}`} community={community} />
            ))}
          </div> */}
        </TabsContent>

        <TabsContent value="contests" className="animate-fade-in">
          <div className="space-y-10">
            {/* Active Contests */}
            {/* <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Active Contests</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contests">View All</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeContests.map(contest => (
                  <ContestCard key={`active-${contest.id}`} contest={contest} />
                ))}
              </div>
            </section> */}

            {/* Upcoming Contests */}
            {/* <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Upcoming Contests</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contests">View All</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingContests.map(contest => (
                  <ContestCard key={`upcoming-${contest.id}`} contest={contest} />
                ))}
              </div>
            </section> */}
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default CommunityHomePage;