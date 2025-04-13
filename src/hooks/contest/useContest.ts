import { createContestService, getAllClientContestService, getPaginatedContestService } from "@/services/contest/adminContestManagement"
import { PaginatedRequestContest } from "@/types/Contest"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useCreateContestMutation = ()=> {
    return useMutation({
        mutationFn : createContestService
    })
}

export const useGetPaginatedContestQuery = (data : PaginatedRequestContest)=> {
    return useQuery({
        queryKey : ['contest',data],
        queryFn : ()=> getPaginatedContestService(data)
    })
}

export const useAllClientContestQuery = (data : PaginatedRequestContest)=> {
    return useQuery({
        queryKey : ['contest',data],
        queryFn : ()=> getAllClientContestService(data)
    })
}
