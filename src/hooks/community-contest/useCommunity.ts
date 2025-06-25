import { createCommunityService, createPostService, deleteCommunityService, getAllCommunitesAdmin, getAllCommunities, GetAllPostInput, getAllPostService, GetCommMemberInput, getCommunityBySlugForClient, getCommunityBySlugService, getCommunityMembersService, joinCommunityService, leaveCommunityService, updateCommunityService } from "@/services/community-contest/communityService"
import { Community } from "@/types/interfaces/Community"

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"

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
        queryKey : ['community-members'],
        queryFn : ()=> getCommunityMembersService(input)
    })
}


// ------------------------Client hooks for community --------------------------------------------------

export const useGetAllCommunities = (
  dto: { 
    page: number; 
    limit: number; 
    search?: string; 
    category?: string; 
    membership?: string; 
    sort?: string;
  }
) => {
  return useQuery({
    queryKey: ["Communities_User", dto],
    queryFn: () => getAllCommunities(dto),
    placeholderData: keepPreviousData, 
    staleTime : 1000 * 60 * 5 // 15 minutes
  });
};

export const useGetCommunityBySlugQueryClient = (slug : string)=> {
    return useQuery({
        queryKey : ['community',slug],
        queryFn : ()=> getCommunityBySlugForClient(slug)
    })
}

export const useJoinCommunity = ()=> {
    return useMutation({
        mutationFn : joinCommunityService
    })
}

export const useLeaveCommunity = ()=> {
    return useMutation({
        mutationFn : leaveCommunityService,
    })
}

// post 
export const useCreatePost = ()=> {
    return useMutation({
        mutationFn : createPostService
    })
}

export const useGetAllPost = (input : GetAllPostInput)=> {
    return useQuery({
        queryKey : ['community-post',input],
        queryFn : ()=> getAllPostService(input),
        staleTime : 1000 * 60 * 5 // 15 minutes
    })
}

export const useGetCommunityPosts = (input: GetAllPostInput) => {
  return useQuery({
    queryKey: ["community-post-details", input],
    queryFn: () => getAllPostService(input),
    staleTime : 1000 * 60 * 5, // 15 minutes
    enabled : input.enabled
  })
}