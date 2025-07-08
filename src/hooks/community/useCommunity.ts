import { createCommunityService, createPostServiceClient, createPostServiceVendor, deleteCommunityService, getAllCommentsByClient, getAllCommentsByVendor, getAllCommunitesAdmin, getAllCommunitiesClient, getAllCommunitiesVendor,  getAllPostServiceClient, getAllPostServiceVendor,  getCommunityBySlugForClient, getCommunityBySlugForVendor, getCommunityBySlugService, getCommunityMemersAdmin, getPostDetailsClient, getPostDetailsVendor, updateCommunityService } from "@/services/community/communityService"

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import { ApiResponse } from "../vendor/useVendor"
import { AddCommentInput, EditCommentInput, GetAllPostInput, GetAllPostUserInput, GetCommentsInput, GetCommMemberInput, GetPostForUserOutput, PostDetailsInput } from "@/types/interfaces/Community"
import { BasePaginatedResponse } from "@/services/client/clientService"
import { PaginatedResponse } from "@/types/interfaces/vendor"

export const useCreateCommunityMutation = ()=> {
    return useMutation({
        mutationFn : createCommunityService
    })
}

export const useGetlAllCommunityAdmin = (dto : { page : number , limit : number , search : string})=> {
    return useQuery({
        queryKey : ["Communities_Admin",dto],
        queryFn : ()=> getAllCommunitesAdmin(dto)
    })
}

export const useDeleteCommunity = ()=> {
    return useMutation({
        mutationFn: deleteCommunityService
    })
}

export const useGetCommunityBySlug = (slug : string)=> {
    return useQuery({
        queryKey : ['community',slug],
        queryFn:  ()=> getCommunityBySlugService(slug)
    })
}

export const useUpdateCommunity = ()=> {
    return useMutation({
        mutationFn : updateCommunityService
    })
}

export const useGetCommunityMembers = (input : GetCommMemberInput)=> {
    return useQuery({
        queryKey : ['community-members',input],
        queryFn : ()=> getCommunityMemersAdmin(input)
    })
}


// ------------------------Client hooks for community --------------------------------------------------

export const useGetAllCommunitiesClient = (
  dto: { 
    page: number; 
    limit: number; 
    search?: string; 
    category?: string; 
    membership?: string; 
    sort?: string;
    enabled : boolean
  }
) => {
  return useQuery({
    queryKey: ["Communities_User", dto],
    queryFn: () => getAllCommunitiesClient(dto),
    placeholderData: keepPreviousData, 
    enabled : dto.enabled
  });
};

export const useGetCommunityBySlugQueryClient = (slug : string , enabled : boolean,userId : string)=> {
    console.log('client hook trigger',enabled)
    return useQuery({
        queryKey : ['community',slug,userId],
        queryFn : ()=> getCommunityBySlugForClient(slug),
        enabled : enabled
    })
}

export const useJoinCommunity = (mutateFn : (communtyId: string) => Promise<ApiResponse> )=> {
    return useMutation({
        mutationFn : mutateFn
    })
}

export const useLeaveCommunity = (mutateFn : (communtyId: string) => Promise<ApiResponse>)=> {
    return useMutation({
        mutationFn : mutateFn,
    })
}

export const useCreatePostClient = ()=> {
    return useMutation({
        mutationFn : createPostServiceClient
    })
}

export const useGetAllPostForClient = (
    input: GetAllPostInput,
) => {
    console.log('hook trigger',input);
    return useQuery({
        queryKey: ['community_post', input],
        queryFn: () => getAllPostServiceClient(input),
        enabled: input.enabled,
        staleTime : 1000 * 60 * 5
    });
}

export const useGetCommunityPostsClient = (input: GetAllPostInput) => {
  return useQuery({
    queryKey: ["community-post-details", input],
    queryFn: () => getAllPostServiceClient(input),
    staleTime : 1000 * 60 * 1, 
    enabled : input.enabled
  })
}

export const useGetPostDetailsClient = (input: PostDetailsInput)=> {
    return useQuery({
        queryKey: ['post',input.postId,input.page],
        queryFn : ()=> getPostDetailsClient(input),
        enabled :input.enabled
    })
}

export const useAddComment = (mutateFn : (input : AddCommentInput) => Promise<ApiResponse>)=> {
    return useMutation({
        mutationFn : mutateFn
    })
}

export const useGetCommentsForClient = (input : GetCommentsInput)=> {
    return useQuery({
        queryKey : ['comments',input],
        queryFn : ()=> getAllCommentsByClient(input),
        staleTime : 1000 * 60 * 5,
        enabled : input.enabled
    })
}

export const useEditComment = (mutateFn : (input : EditCommentInput)=> Promise<ApiResponse>) => {
    return useMutation({
        mutationFn : mutateFn
    })
}

export const useDeleteComment = (mutateFn : (commentId : string)=> Promise<ApiResponse>)=> {
    return useMutation({
        mutationFn : mutateFn
    })
}

export const useEditPost = (mutateFn  : (data : any)=> Promise<ApiResponse>) => {
    return useMutation({
        mutationFn : mutateFn
    })
}

export const useDeletePost = (mutateFn : (postId : string) => Promise<ApiResponse>) => {
    return useMutation({
        mutationFn : mutateFn
    })
}

// ------------------------Vendor hooks for community --------------------------------------------------
export const useGetAllPostForVendor = (
    input: GetAllPostInput,
) => {
    return useQuery({
        queryKey: ['community_post', input],
        queryFn: () => getAllPostServiceVendor(input),
        enabled: input.enabled,
        staleTime : 1000 * 60 * 5
    });
}

export const useGetAllCommunitiesVendor = (
  dto: { 
    page: number; 
    limit: number; 
    search?: string; 
    category?: string; 
    membership?: string; 
    sort?: string;
    enabled : boolean
  }
) => {
  return useQuery({
    queryKey: ["Communities_User", dto],
    queryFn: () => getAllCommunitiesVendor(dto),
    placeholderData: keepPreviousData, 
    enabled : dto.enabled
  });
};

export const useGetCommunityBySlugQueryVendor = (slug : string , enabled : boolean,userId : string)=> {
    console.log('vendor hook trigger',enabled)
    return useQuery({
        queryKey : ['community',slug,userId],
        queryFn : ()=> getCommunityBySlugForVendor(slug),
        enabled : enabled
    })
}

export const useGetPostDetailsVendor = (input: PostDetailsInput)=> {
    return useQuery({
        queryKey: ['post',input.postId,input.page],
        queryFn : ()=> getPostDetailsVendor(input),
        enabled : input.enabled
    })
}

export const useGetCommentsForVendor = (input : GetCommentsInput)=> {
    return useQuery({
        queryKey : ['comments',input],
        queryFn : ()=> getAllCommentsByVendor(input),
        staleTime : 1000 * 60 * 5,
        enabled : input.enabled
    })
}

export const useCreatePostVendor = ()=> {
    return useMutation({
        mutationFn : createPostServiceVendor
    })
}

export const useGetAllPostUser = (input : GetAllPostUserInput , queryFn : (input : GetAllPostUserInput)=> Promise<BasePaginatedResponse<PaginatedResponse<GetPostForUserOutput>>>)=> {
    return useQuery({
        queryKey : ['user_posts',input],
        queryFn : ()=> queryFn(input),
        staleTime : 1000 * 60 * 5
    })
}