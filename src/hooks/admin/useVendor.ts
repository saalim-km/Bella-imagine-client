import AdminService from "@/services/admin/adminService";
import { IVendor } from "@/services/vendor/vendorService";
import { ApiResponse, PaginatedResponse, PaginationParams, UserFilters } from "@/types/Admin";
import { useMutation, useQuery } from "@tanstack/react-query";

export const vendorKeys = {
    all: ["vendors"] as const,
    lists: () => [...vendorKeys.all, "list"] as const,
    list: (filters: any, pagination: PaginationParams) => [...vendorKeys.lists(), filters, pagination] as const,
    details: () => [...vendorKeys.all, "detail"] as const,
    detail: (id: number) => [...vendorKeys.details(), id] as const,
}

export const useAllVendorQuery = (filter: any = {}, pagination: PaginationParams = { page: 1, limit: 4 }) => {
    console.log('usevendorquery ->');
    console.log(pagination);
  return useQuery({
    queryKey: vendorKeys.list(filter, pagination),
    queryFn: () => AdminService.get<PaginatedResponse<IVendor>>('/vendor', { ...filter, ...pagination }),
  });
};

export const useBlockVendor = () => {
    return useMutation({
      mutationFn: (id: string) => AdminService.patch<ApiResponse>('/user-status',{userId : id , userType : 'vendor'}),
    })
}
export const useUnBlockVendor = () => {
    return useMutation({
      mutationFn: (id: string) => AdminService.patch<ApiResponse>('/user-status',{userId : id , userType : 'vendor'}),
    })
}



