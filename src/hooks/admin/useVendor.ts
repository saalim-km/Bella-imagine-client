import AdminService, { updateVendorRequestService } from "@/services/admin/adminService";
import { IClient } from "@/services/client/clientService";
import { IVendor } from "@/services/vendor/vendorService";
import { PaginationParams } from "@/types/interfaces/Admin";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface VendorRequest {
  data : IVendor[],
  total : number

}

export type TPaginatedVendorRequest =  {
  data : VendorRequest
}

interface ApiResponse {
  success : boolean,
  message : string
}

export interface IUserDetailsResponse {
  success : boolean,
  data : IVendor | IClient
}

export const vendorKeys = {
    all: ["vendors"] as const,
    lists: () => [...vendorKeys.all, "list"] as const,
    list: (filters: any, pagination: PaginationParams) => [...vendorKeys.lists(), filters, pagination] as const,
    details: () => [...vendorKeys.all, "detail"] as const,
    detail: (id: string) => [...vendorKeys.details(), id] as const,
}

export const useAllVendorQuery = (filter: any = {}, pagination: PaginationParams = { page: 1, limit: 4 }) => {
    console.log('usevendorquery ->');
    console.log(pagination);
  return useQuery({
    queryKey: vendorKeys.list(filter, pagination),
    queryFn: () => AdminService.get<TPaginatedVendorRequest>('/users', { ...filter, ...pagination,role : "vendor"}),
  });
};

export const useVendorDetailsQuery = (userId : string , role : 'vendor' | 'client')=> {
  return useQuery({
    queryKey : vendorKeys.detail(userId),
    queryFn : ()=> AdminService.get<IUserDetailsResponse>('/user',{id : userId , role : role})
  })
}

export const useBlockVendor = () => {
    return useMutation({
      mutationFn: (id: string) => AdminService.patch<ApiResponse>('/user-status',{id : id , role : 'vendor' , isblock : true}),
    })
}

export const useUnBlockVendor = () => {
    return useMutation({
      mutationFn: (id: string) => AdminService.patch<ApiResponse>('/user-status',{id : id , role : 'vendor' , isblock : false}),
    })
}

export const useVendorRequest = (filter : any = {} , pagination : PaginationParams = {page : 1 , limit : 4})=> {
    return useQuery({
        queryKey : vendorKeys.list(filter,pagination),
        queryFn : ()=>  AdminService.get<TPaginatedVendorRequest>('/vendor-request',{...filter,...pagination})
    })
}

export const useUpdateVendorRequest = ()=> {
  return useMutation({
    mutationFn : (data : {reason ?: string , id : string,status : any})=> updateVendorRequestService(data)
  })
}