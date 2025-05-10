import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IPostRequest } from "@/types/Community";
// import { PostGrid } from "@/components/post/PostGrid";
// import { Post } from "@/types";

interface PostsTabProps {
  posts: IPostRequest[];
  isMember: boolean;
  communityId: string;
  slug : string
}

export function PostsTab({ posts, isMember, communityId , slug }: PostsTabProps) {
  console.log("is user member : ", isMember);
  const [sortOption, setSortOption] = useState<"new" | "top" | "trending">(
    "new"
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 w-full sm:w-auto justify-end">
        {isMember ? (
          <Link to={`/community/post/${slug}`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
          </Link>
        ) : (
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Button>
        )}
      </div>

      {/* {posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <div className="flex flex-col items-center justify-center p-10 text-center bg-secondary/30 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-4">
            Be the first to share content in this community
          </p>
          <Button
            asChild
            disabled={!isMember}
          >
            <Link to={`/communities/${communityId}/create-post`}>
              <Plus className="mr-2 h-4 w-4" /> Create Post
            </Link>
          </Button>
        </div>
      )} */}
    </div>
  );
}
