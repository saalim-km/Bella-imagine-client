import { adminAxiosInstance } from "@/api/admin.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import { ENDPOINTS } from "@/api/endpoints";
import { vendorAxiosInstance } from "@/api/vendor.axios";
import { CategoryType } from "@/hooks/admin/useAllCategory";
import { ApiResponse } from "@/hooks/vendor/useVendor";
import { IVendor } from "../vendor/vendorService";
import { data } from "react-router-dom";

export type Category = {
  _id: string;
  categoryId: string;
  status: boolean;
  title: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface CategoryResponse {
  success: boolean;
  categories: Category[];
}

export interface RequestCategoryResponse {
  success : boolean,
  categoryRequest : ICategoryRequest
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


export const getAllCategories = async () => {
  const response = await vendorAxiosInstance.get<CategoryResponse>(ENDPOINTS.VENDOR_CATEGORIES);
  return response.data;
};

export const updateCategoryStatus = async(id : string , data : Partial<CategoryType>)=> {
  const response = await adminAxiosInstance.patch('/categories',{id : id , data : data })
  console.log(response);
  return response.data;
}

export const getAllCategoryJoinRequests = async(): Promise<RequestCategoryResponse> => {
  const response = await adminAxiosInstance.get('/category-request')
  console.log(response);
  return response.data
}

export const updateCategoryJoinRequest = async(data : {vendorId : string , categoryId : string , status : "rejected" | "approved"}) : Promise<ApiResponse>=> {
  const response = await adminAxiosInstance.patch('/category-request',data)
  return response.data;
}


export const vendorJoinCategory = async (category: string) => {
  const response = await vendorAxiosInstance.post<ApiResponse>("/vendor/categories/join",
    {
      category,
    }
  );

  return response.data;
};


export const updateCategoryService = async(dto : {id : string , data : Partial<Category>}) : Promise<ApiResponse>=> {
  delete dto.data._id;
  const response = await adminAxiosInstance.put('/categories', dto)
  return response.data
}