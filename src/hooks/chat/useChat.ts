import { getContacts, getConversations } from "@/services/chat/chatService"
import { TRole } from "@/types/User"
import { useQuery } from "@tanstack/react-query"

export const useContactsQuery = ({userId , userType} : {userId: string , userType : TRole})=> {
    return useQuery({
        queryKey : ["contacts",userId+userType],
        queryFn : ()=> getContacts(userId,userType)
    })
}

export const useConversations = ({userId , userType} : {userId : string , userType: string})=> {
    return useQuery({
        queryKey : ["conversations",userId],
        queryFn : ()=> getConversations(userId,userType)
    })
}