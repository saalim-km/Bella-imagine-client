import AdminService, { getDashBoardStatsService } from "@/services/admin/adminService";
import { Category, getAllCategoryJoinRequests, PaginatedDataRequest, updateCategoryJoinRequest, updateCategoryService, updateCategoryStatus } from "@/services/categories/categoryService";
import { PaginationParams } from "@/types/interfaces/Admin";
import { PaginatedResponse } from "@/types/interfaces/vendor";
import { useMutation, useQuery } from "@tanstack/react-query";

export const categoryKeys = {
  all: ["category "] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: any, pagination: PaginationParams) =>
    [...categoryKeys.lists(), filters, pagination] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};

export interface CategoryType {
  _id ?: any;
  categoryId ?: string
  title: string;
  status: boolean;
}


export interface TPaginatedCategoryResponse {
  data : PaginatedResponse<Category>
}



export const useAllCategoryQuery = (
  filter: any = {},
  pagination: PaginationParams = { page: 1, limit: 4 }
) =>  {
  return useQuery({
    queryKey: categoryKeys.list(filter,pagination),
    queryFn: (): Promise<TPaginatedCategoryResponse> =>
      AdminService.get("/categories", { ...filter, ...pagination}),
  });
};

export const useAllCategoryMutation = () => {
  return useMutation({
    mutationFn: (data: CategoryType) =>
      AdminService.post("/categories", {...data}),
  });
};

export const useUpdateCategoryMutation = () => {
  return useMutation({
    mutationFn : updateCategoryStatus
  })
};

export const useGetAllCategoryRequest = (input : PaginatedDataRequest)=> {
  return useQuery({
    queryKey : ["category-request",input],
    queryFn : ()=> getAllCategoryJoinRequests(input)
  })
}

export const useUpdateCategoryRequest = ()=> {
  return useMutation({
    mutationFn : updateCategoryJoinRequest,
  })
}

export const updateCategory = ()=> {
  return useMutation({
    mutationFn : updateCategoryService
  })
}

export const useGetDashBoard = ()=> {
  return useQuery({
    queryKey : ['dashboard'],
    queryFn : getDashBoardStatsService
  })
}