import { adminAxiosInstance } from "@/api/admin.axios";
import { ENDPOINTS } from "@/api/endpoints";
import { vendorAxiosInstance } from "@/api/vendor.axios";
import { ApiResponse } from "@/hooks/vendor/useVendor";
import { IVendor } from "../vendor/vendorService";
import { PaginatedResponse } from "@/types/interfaces/vendor";
import { BasePaginatedResponse } from "../client/clientService";

export interface Category {
  _id: string;
  categoryId: string;
  status: boolean;
  title: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};


export interface RequestCategoryResponse {
  success : boolean,
  data : ICategoryRequest
}


export interface ICategoryRequest {
  _id: string;
  vendorId: Partial<IVendor>;
  categoryId: Partial<Category>;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IUpdateCategoryStatus {
  id : string;
}

export interface PaginatedDataRequest {
  page : number;
  limit : number;
}

export interface PaginatedCatRequestResponse {
  data : PaginatedResponse<RequestCategoryResponse>
}

export const getAllCategories = async () => {
  const response = await vendorAxiosInstance.get<BasePaginatedResponse<PaginatedResponse<Category>>>(ENDPOINTS.VENDOR_CATEGORIES);
  return response.data;
};

export const updateCategoryStatus = async(input : IUpdateCategoryStatus)=> {
  const response = await adminAxiosInstance.patch('/categories',{},{params : input})
  return response.data;
}

export const getAllCategoryJoinRequests = async(input : PaginatedDataRequest): Promise<PaginatedCatRequestResponse> => {
  const response = await adminAxiosInstance.get('/category-request',{params : input})
  return response.data
}

export const updateCategoryJoinRequest = async(data : {vendorId : string , categoryId : string , status : "rejected" | "approved"}) : Promise<ApiResponse>=> {
  const response = await adminAxiosInstance.patch('/category-request',data)
  return response.data;
}


export const vendorJoinCategory = async (category: string) => {
  const response = await vendorAxiosInstance.post<ApiResponse>("/vendor/categories",
    {
      category,
    }
  );

  return response.data;
};


export const updateCategoryService = async(dto : {id : string , data : Partial<Category>}) : Promise<ApiResponse>=> {
  const response = await adminAxiosInstance.put('/categories', dto)
  return response.data
}