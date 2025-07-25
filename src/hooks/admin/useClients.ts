import AdminService from "@/services/admin/adminService";
import { IClient } from "@/services/client/clientService";
import { PaginationParams,  } from "@/types/interfaces/Admin";
import { useMutation, useQuery } from "@tanstack/react-query";


export interface ClientRequest {
  data : IClient[],
  total : number
}

export type TPaginatedClientRequest =  {
  data : ClientRequest
}

interface ApiResponse {
  success : boolean,
  message : string
}


export const clientKeys = {
    all: ["clients"] as const,
    lists: () => [...clientKeys.all, "list"] as const,
    list: (filters: any, pagination: PaginationParams) => [...clientKeys.lists(), filters, pagination] as const,
    details: () => [...clientKeys.all, "detail"] as const,
    detail: (id: string) => [...clientKeys.details(), id] as const,
}

export const useAllClientQuery = (filter : any = {} ,pagination : PaginationParams = {page : 1 , limit : 4} )=> {
    return useQuery({
        queryKey : ["client-list-admin",filter,pagination],
        queryFn : ()=> AdminService.get<TPaginatedClientRequest>('/users',{...filter,...pagination,role : "client"}),
        staleTime : 1000 * 60 * 5
    })
}


export const useBlockClient = () => {
    return useMutation({
      mutationFn: (id: string) => AdminService.patch<ApiResponse>('/user-status',{id : id , role : 'client' , isblock : true}),
    })
}

export const useUnBlockClient = () => {
    return useMutation({
      mutationFn: (id: string) => AdminService.patch<ApiResponse>('/user-status',{id : id , role : 'client' , isblock : false}),
    })
}
