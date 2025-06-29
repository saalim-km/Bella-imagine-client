import { addCommentService, createCommunityService, createPostService, deleteCommunityService, getAllCommunitesAdmin, getAllCommunities, GetAllPostInput, getAllPostService, GetCommMemberInput, getCommunityBySlugForClient, getCommunityBySlugService, getCommunityMembersService, getPostDetails, joinCommunityService, leaveCommunityService, PostDetailsInput, updateCommunityService } from "@/services/community-contest/communityService"

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
        queryKey : ['community_post',input],
        queryFn : ()=> getAllPostService(input),
    })
}

export const useGetCommunityPosts = (input: GetAllPostInput) => {
  return useQuery({
    queryKey: ["community-post-details", input],
    queryFn: () => getAllPostService(input),
    staleTime : 1000 * 60 * 1, 
    enabled : input.enabled
  })
}

export const useGetPostDetails = (input: PostDetailsInput)=> {
    return useQuery({
        queryKey: ['post',input.postId,input.page],
        queryFn : ()=> getPostDetails(input)
    })
}

export const useAddComment = ()=> {
    return useMutation({
        mutationFn : addCommentService
    })
}