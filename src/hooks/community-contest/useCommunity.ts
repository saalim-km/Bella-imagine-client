import { AddCommentInput, addCommentServiceClient, createCommunityService, createPostServiceClient, deleteCommunityService, getAllCommunitesAdmin, getAllCommunitiesClient, getAllCommunitiesVendor, GetAllPostInput, getAllPostServiceClient, getAllPostServiceVendor, GetCommMemberInput, getCommunityBySlugForClient, getCommunityBySlugForVendor, getCommunityBySlugService, getCommunityMemersAdmin, getPostDetailsClient, getPostDetailsVendor, joinCommunityServiceClient, leaveCommunityServiceClient, PostDetailsInput, updateCommunityService } from "@/services/community-contest/communityService"

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import { ApiResponse } from "../vendor/useVendor"

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

export const useGetCommunityBySlugQueryClient = (slug : string , enabled : boolean)=> {
    return useQuery({
        queryKey : ['community',slug],
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

// post 
export const useCreatePost = ()=> {
    return useMutation({
        mutationFn : createPostServiceClient
    })
}

// explore page hook for client
export const useGetAllPostForClient = (
    input: GetAllPostInput,
) => {
    return useQuery({
        queryKey: ['community_post', input],
        queryFn: () => getAllPostServiceClient(input),
        enabled: input.enabled
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



// ------------------------Vendor hooks for community --------------------------------------------------
export const useGetAllPostForVendor = (
    input: GetAllPostInput,
) => {
    return useQuery({
        queryKey: ['community_post', input],
        queryFn: () => getAllPostServiceVendor(input),
        enabled: input.enabled
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

export const useGetCommunityBySlugQueryVendor = (slug : string , enabled : boolean)=> {
    return useQuery({
        queryKey : ['community',slug],
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