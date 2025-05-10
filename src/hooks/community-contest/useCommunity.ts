import { createCommunityService, deleteCommunityService, getAllCommunites, getCommunityBySlugForClient, getCommunityBySlugService, joinCommunityService, leaveCommunityService, updateCommunityService } from "@/services/community-contest/communityService"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useCreateCommunityMutation = ()=> {
    return useMutation({
        mutationFn : createCommunityService
    })
}

export const useGetlAllCommunity = (dto : { page : number , limit : number})=> {
    return useQuery({
        queryKey : ["all-community",dto],
        queryFn : ()=> getAllCommunites(dto)
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