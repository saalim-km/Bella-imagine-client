import type { RootState } from "@/store/store"
import type React from "react"
import { useEffect, useState, useCallback, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import useInfiniteScroll from "../../hooks/community/useInfiniteScroll"
import PostCard from "../../components/community-contest/PostCard"
import PostSkeleton from "../../components/community-contest/PostSkeleton"
import type { AppDispatch } from "@/store/store"
import CommunityLayout from "@/components/layout/CommunityLayout"
import { useGetAllPostForClient, useGetAllPostForVendor } from "@/hooks/community/useCommunity"
import { incrementPage, setPosts, toggleLike } from "@/store/slices/feedslice"
import { useSocket } from "@/context/SocketContext"
import { communityToast } from "@/components/ui/community-toast"
import type { ICommunityPostResponse } from "@/components/User/Home"
import { useQueryClient } from "@tanstack/react-query"

const ExplorePage: React.FC = () => {
  const user = useSelector((state : RootState)=> {
    if(state.client.client) return state.client.client;
    if(state.vendor.vendor) return state.vendor.vendor;
    return undefined;
  })


  if(!user){
    return <p>user not found please try again later , or please relogin to continue</p>
  }


  const dispatch = useDispatch<AppDispatch>()
  const { limit, page, posts, total } = useSelector((state: RootState) => state.feed)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set())
  const queryClient = useQueryClient()
  const { socket } = useSocket()

  // Use ref to track if socket listeners are already set up
  const socketListenersSetup = useRef(false)

  const { data: postsDataClient, isLoading : isClientLoading, isError : isClientError } = useGetAllPostForClient({ page, limit , enabled : user.role === 'client'})
  const { data: postsDataVendor, isLoading : isVendorLoading, isError : isVendorError } = useGetAllPostForVendor({ page, limit , enabled : user.role === 'vendor'})


  const postsData = postsDataClient?.data.data ? postsDataClient.data : postsDataVendor?.data

  // Update Redux store when new data is fetched
  useEffect(() => {
    if (postsData) {
      dispatch(
        setPosts({
          data: postsData.data,
          total: postsData.total,
        }),
      )
      setIsLoading(false)
    }
  }, [postsData, dispatch])


  // Set up socket listeners once
  useEffect(() => {
    if (!socket || socketListenersSetup.current) return

    const handleLikeConfirm = ({
      success,
      postId,
      action,
      error,
    }: {
      success: boolean
      postId: string
      action: "like" | "unlike"
      error?: string
    }) => {
      console.log("Like confirm received:", { success, postId, action })

      // Remove from liking state
      setLikingPosts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })

      if (success) {
        const isLiked = action === "like"
        dispatch(toggleLike({ postId : postId , isLiked : isLiked }))
        queryClient.invalidateQueries({queryKey : ['community_post']})
        queryClient.invalidateQueries({queryKey : ['post',postId,1]})
        communityToast.success({
          title: "Success",
          description: `Post ${isLiked ? "liked" : "unliked"} successfully`,
        })
      } else {
        communityToast.error({
          title: "Error",
          description: error || `Failed to ${action} post. Please try again.`,
        })
      }
    }

    socket.on("like_confirm", handleLikeConfirm)
    socketListenersSetup.current = true

    // Cleanup function
    return () => {
      socket.off("like_confirm", handleLikeConfirm)
      socketListenersSetup.current = false
    }
  }, [socket, dispatch])

  // Infinite scroll callback
  const loadMorePosts = useCallback(() => {
    if (!isLoading && posts.length < total) {
      setIsLoading(true)
      dispatch(incrementPage())
    }
  }, [isLoading, posts.length, total, dispatch])

  // Initialize infinite scroll
  const infiniteScrollRef = useInfiniteScroll(loadMorePosts)

  const   handleLikeToggle = useCallback(
    (post: ICommunityPostResponse) => {
      if (!socket) {
        communityToast.error({
          title: "Connection Error",
          description: "Socket connection not available. Please refresh the page.",
        })
        return
      }

      if (!post._id) {
        communityToast.error({
          title: "Error",
          description: "Invalid post data.",
        })
        return
      }

      // Prevent multiple simultaneous like/unlike operations on the same post
      if (likingPosts.has(post._id.toString())) {
        return
      }

      // Add to liking state
      setLikingPosts((prev) => new Set(prev).add(post._id!.toString()))

      const eventName = post.isLiked ? "unLike_post" : "like_post"

      console.log(`Emitting ${eventName} for post:`, post._id)
      socket.emit(eventName, { postId: post._id })
    },
    [socket, likingPosts],
  )

  if(isClientError || isVendorError){
    return <p className="text-red-700">error feching post please try again later</p>
  }

  return (
    <CommunityLayout>
      <div className="flex-1">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLikeToggle={handleLikeToggle}
              isLiking={post._id ? likingPosts.has(post._id.toString()) : false}
            />
          ))}

          {(isClientLoading || isVendorLoading) && (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}

          {posts.length >= total && posts.length > 0 && (
            <div className="text-center py-6 text-gray-500">You've reached the end of the feed</div>
          )}

          {!isLoading && posts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No posts found</h3>
              <p className="text-gray-500">Try changing your filters or create a new post</p>
            </div>
          )}

          <div ref={infiniteScrollRef} className="h-1 w-full" />
        </div>
      </div>
    </CommunityLayout>
  )
}

export default ExplorePage