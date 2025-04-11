import { clientAxiosInstance } from "@/api/client.axios";
import { ENDPOINTS } from "@/api/endpoints";
import {
  IClientReponse,
  IProfileUpdate,
  IProfileUpdateResponse,
  IVendorsFilter,
  IVendorsResponse,
} from "@/types/User";
import { IServiceResponse, PaginatedResponse } from "@/types/vendor";
import { Category } from "../categories/categoryService";
import { ApiResponse } from "@/hooks/vendor/useVendor";

export interface IClient {
  _id?: string;
  name: string;
  email: string;
  profileImage?: string;
  password?: string;
  phoneNumber?: number;
  location?: string;
  googleId?: string;
  role: "client" | "vendor";
  savedPhotographers?: string[];
  savedPhotos?: string[];
  isActive?: boolean;
  isblocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const getClientDetails = async (): Promise<IClientReponse> => {
  const response = await clientAxiosInstance.get(ENDPOINTS.CLIENT_DETAILS);
  return response.data;
};

export const updateClientDetails = async (
  data: IProfileUpdate
): Promise<IProfileUpdateResponse> => {
  const response = await clientAxiosInstance.put(
    ENDPOINTS.CLIENT_DETAILS,
    data
  );
  return response.data;
};

export const getAllVendors = async (
  data: IVendorsFilter
): Promise<PaginatedResponse<IVendorsResponse>> => {
  console.log(`in vendors listing hook : `, data);
  const response = await clientAxiosInstance.get("/client/vendors", {
    params: data,
  });
  return response.data;
};

export const getAllClientCategories = async (): Promise<{
  success: boolean;
  data: Category[];
}> => {
  const response = await clientAxiosInstance.get("/client/categories");
  return response.data;
};

export const getPhotographerDetails = async (
  id: string
): Promise<IVendorsResponse> => {
  const response = await clientAxiosInstance.get(`/client/photographer/${id}`);
  return response.data;
};

export const getService = async (id: string): Promise<IServiceResponse> => {
  const response = await clientAxiosInstance.get(`/client/service/${id}`);
  return response.data;
};