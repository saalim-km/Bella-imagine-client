import AdminService from "@/services/admin/adminService";
import { updateCategoryStatus } from "@/services/categories/categoryService";
import { PaginationParams } from "@/types/Admin";
import { useMutation, useQuery } from "@tanstack/react-query";

export const categoryKeys = {
  all: ["vendors"] as const,
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

export type CategoryResponse = {
  categories: CategoryType[];
  totalCategory: number;
  currentPage: number;
  totalPages: number;
};




export const useAllCategoryQuery = (
  filter: any = {},
  pagination: PaginationParams = { page: 1, limit: 4 }
) =>  {
  return useQuery({
    queryKey: categoryKeys.list(filter,pagination),
    queryFn: (): Promise<CategoryResponse> =>
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
    mutationFn: ({id , data } : {id : string , data : Partial<CategoryType>}) =>
      updateCategoryStatus(id,{...data})
  });
};
