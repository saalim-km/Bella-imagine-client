import { clientAxiosInstance } from "@/api/client.axios";
import { ENDPOINTS } from "@/api/endpoints";
import {
  IClientReponse,
  IProfileUpdate,
  IProfileUpdateResponse,
  IVendorsFilter,
  IVendorsResponse,
} from "@/types/interfaces/User";
import { IServiceResponse, IVendorDetails, PaginatedResponse } from "@/types/interfaces/vendor";
import { Category } from "../categories/categoryService";

export type TLocation = {
  lat: number;
  lng: number;
  address?: string;
};

export interface IClient {
  _id?: string;
  name: string;
  email: string;
  profileImage?: string;
  password?: string;
  phoneNumber?: number;
  location?: TLocation;
  googleId?: string;
  role: "client" | "vendor";
  savedPhotographers?: string[];
  savedPhotos?: string[];
  isActive?: boolean;
  isblocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BasePaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface GetVendorDetails {
  servicePage: number;
  samplePage: number;
  sampleLimit: number;
  serviceLimit: number;
}

export const getClientDetails = async (): Promise<IClientReponse> => {
  const response = await clientAxiosInstance.get(ENDPOINTS.CLIENT_DETAILS);
  return response.data;
};

export const updateClientDetails = async (
  data: IProfileUpdate
): Promise<IProfileUpdateResponse> => {
  console.log("in updateclient profile service : ✅ ", data);
  const response = await clientAxiosInstance.put(
    ENDPOINTS.CLIENT_DETAILS,
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

export const getAllVendors = async (
  data: IVendorsFilter
): Promise<BasePaginatedResponse<PaginatedResponse<IVendorsResponse>>> => {
  console.log(`in vendors listing hook : `, data);
  const response = await clientAxiosInstance.get("/client/vendors", {
    params: data,
  });
  return response.data;
};

export const getAllClientCategories = async (): Promise<
  BasePaginatedResponse<PaginatedResponse<Category>>
> => {
  const response = await clientAxiosInstance.get("/client/categories");
  return response.data;
};

export const getPhotographerDetails = async (input : GetVendorDetails , vendorId: string): Promise<BasePaginatedResponse<IVendorDetails>> => {
  const response = await clientAxiosInstance.get(`/client/photographer/${vendorId}`, {
    params: input,
  });
  return response.data;
};

export const getService = async (id: string): Promise<BasePaginatedResponse<IServiceResponse>> => {
  const response = await clientAxiosInstance.get(`/client/service/${id}`);
  return response.data;
};
