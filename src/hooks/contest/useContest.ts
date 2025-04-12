import { createContestService } from "@/services/contest/adminContestManagement"
import { useMutation } from "@tanstack/react-query"

export const useCreateContestMutation = ()=> {
    return useMutation({
        mutationFn : createContestService
    })
}