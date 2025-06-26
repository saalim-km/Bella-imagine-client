// src/components/community-contest/tab/PostTab.tsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { useGetCommunityPosts } from "@/hooks/community-contest/useCommunity"
import { 
  setPosts, 
  incrementPage, 
  toggleLikeCommunity, 
  setLoading,
  setCurrentCommunity,
  setError
} from "@/store/slices/communityDetailsSlice"
import PostCard from "../PostCard"
import PostSkeleton from "../PostSkeleton"
import useInfiniteScroll from "../useInfiniteScroll"
import { useSocket } from "@/context/SocketContext"
import { communityToast } from "@/components/ui/community-toast"
import type { ICommunityPostResponse } from "@/components/User/Home"
import type { RootState, AppDispatch } from "@/store/store"
import { useQueryClient } from "@tanstack/react-query"

interface PostsTabProps {
  isMember: boolean
  communityId: string
  slug: string
}

export function PostsTab({ isMember, communityId, slug }: PostsTabProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { 
    posts, 
    total, 
    isLoading, 
    page, 
    limit,
    currentCommunityId 
  } = useSelector((state: RootState) => state.communityDetail)
  const queryClient = useQueryClient()
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set())
  const { socket } = useSocket()
  const socketListenersSetup = useRef(false)

  // Reset state when community changes
  useEffect(() => {
    if (communityId !== currentCommunityId) {
      dispatch(setCurrentCommunity(communityId))
    }
  }, [communityId, currentCommunityId, dispatch])

  const { data: postsData, isFetching, error } = useGetCommunityPosts({
    page,
    limit,
    communityId,
    enabled: communityId === currentCommunityId // Only fetch if community matches
  })

  // Handle data updates
  useEffect(() => {
    if (!postsData || communityId !== currentCommunityId) return
    
    dispatch(setPosts({
      data: postsData.data.data,
      total: postsData.data.total,
      replace: page === 1 // Replace only on first page
    }))
  }, [postsData, page, communityId, currentCommunityId, dispatch])

  // Handle errors
  useEffect(() => {
    if (error) {
      dispatch(setError(error.message))
    }
  }, [error, dispatch])

  // Socket listeners setup
  useEffect(() => {
    if (!socket || socketListenersSetup.current) return

    const handleLikeConfirm = ({
      success,
      postId,
      action
    }:{
      success: boolean
      postId: string
      action : 'like' | 'unlike'
    }) => {
      setLikingPosts(prev => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })

      if (success) {
        const isLiked = action === 'like' ? true : false
        communityToast.success({
          title: "Success",
          description: `Post ${isLiked ? "liked" : "unliked"} successfully`,
        })
        dispatch(toggleLikeCommunity({ postId, isLiked : isLiked }))
        queryClient.invalidateQueries({queryKey:  ['community-post']})
      } else {
        communityToast.error({
          title: "Error",
          description: "Failed to update like status",
        })
      }
    }

    socket.on("like_confirm", handleLikeConfirm)
    socketListenersSetup.current = true

    return () => {
      socket.off("like_confirm", handleLikeConfirm)
      socketListenersSetup.current = false
    }
  }, [socket, dispatch])

  // Infinite scroll callback
  const loadMorePosts = useCallback(() => {
    if (!isLoading && !isFetching && posts.length < total) {
      dispatch(incrementPage())
    }
  }, [isLoading, isFetching, posts.length, total, dispatch])

  const sentinelRef = useInfiniteScroll(loadMorePosts)

  const handleLikeToggle = useCallback((post: ICommunityPostResponse) => {
    if (!post._id || !socket) return

    // Prevent duplicate requests
    if (likingPosts.has(post._id)) return

    setLikingPosts(prev => new Set(prev).add(post._id!))

    const eventName = post.isLiked ? "unLike_post" : "like_post"
    socket.emit(eventName, { 
      postId: post._id,
      communityId
    })
  }, [socket, likingPosts])

  return (
    <div className="space-y-4">
      <div className="flex gap-2 w-full sm:w-auto justify-end">
        {isMember ? (
          <Link to={`/community/submit?communityId=${communityId}`}>
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

      <div className="space-y-4">
        {posts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            onLikeToggle={handleLikeToggle}
            isLiking={post._id ? likingPosts.has(post._id) : false}
          />
        ))}

        {(isLoading || isFetching) && (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}

        {posts.length >= total && posts.length > 0 && (
          <div className="text-center py-6 text-gray-500">
            You've reached the end of the posts
          </div>
        )}

        {!isLoading && !isFetching && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center p-10 text-center bg-secondary/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share content in this community
            </p>
            {isMember && (
              <Button asChild>
                <Link to={`/community/submit?communityId=${communityId}`}>
                  <Plus className="mr-2 h-4 w-4" /> Create Post
                </Link>
              </Button>
            )}
          </div>
        )}

        <div ref={sentinelRef} className="h-1 w-full" />
      </div>
    </div>
  )
}