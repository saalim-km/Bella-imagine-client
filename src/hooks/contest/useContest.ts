import { createContestService, getPaginatedContestService } from "@/services/contest/adminContestManagement"
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