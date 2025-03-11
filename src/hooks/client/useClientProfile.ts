import { getClientDetails } from "@/services/client/clientService"
import { useQuery } from "@tanstack/react-query"

export const useClientQuery = (enabled = true)=> {
    return useQuery({
        queryKey : ["client-profile"],
        queryFn : getClientDetails,
        enabled
    })
}