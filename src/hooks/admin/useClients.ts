import AdminService from "@/services/admin/adminService";
import { IClient } from "@/services/client/clientService";
import { ApiResponse, PaginatedResponse, PaginationParams, UserFilters } from "@/types/Admin";
import { useMutation, useQuery } from "@tanstack/react-query";

export const clientKeys = {
    all: ["clients"] as const,
    lists: () => [...clientKeys.all, "list"] as const,
    list: (filters: any, pagination: PaginationParams) => [...clientKeys.lists(), filters, pagination] as const,
    details: () => [...clientKeys.all, "detail"] as const,
    detail: (id: number) => [...clientKeys.details(), id] as const,
}

export const useAllClientQuery = (filter : UserFilters = {} ,pagination : PaginationParams = {page : 1 , limit : 4} )=> {
    console.log('useAllClientQuery called');
    return useQuery({
        queryKey : clientKeys.list(filter,pagination),
        queryFn : ()=> AdminService.get<PaginatedResponse<IClient>>('/client',{...filter,...pagination})
    })
}

export const useBlockClient = () => {
    return useMutation({
      mutationFn: (id: string) => AdminService.patch<ApiResponse>('/user-status',{userId : id , userType : 'client'}),
    })
}
export const useUnBlockClient = () => {
    return useMutation({
      mutationFn: (id: string) => AdminService.patch<ApiResponse>('/user-status',{userId : id , userType : 'client'}),
    })
}
