import { createCommunityService, deleteCommunityService, getAllCommunites } from "@/services/community-contest/communityService"
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