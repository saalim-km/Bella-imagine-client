import { createCommunityService, deleteCommunityService, getAllCommunitesAdmin, getAllCommunities, getCommunityBySlugForClient, getCommunityBySlugService, joinCommunityService, leaveCommunityService, updateCommunityService } from "@/services/community-contest/communityService"

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"

export const useCreateCommunityMutation = ()=> {
    return useMutation({
        mutationFn : createCommunityService
    })
}

export const useGetlAllCommunityAdmin = (dto : { page : number , limit : number , search : string})=> {
    return useQuery({
        queryKey : ["all-community",dto],
        queryFn : ()=> getAllCommunitesAdmin(dto)
    })
}

export const useGetAllCommunities = (
  dto: { 
    page: number; 
    limit: number; 
    search?: string; 
    category?: string; 
    membership?: string; 
    sort?: string 
  }
) => {
  return useQuery({
    queryKey: ["all-communities", dto],
    queryFn: () => getAllCommunities(dto),
    placeholderData: keepPreviousData, 
    staleTime: 1000 * 60, 
  });
};

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