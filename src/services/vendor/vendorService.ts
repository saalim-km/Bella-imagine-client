import { vendorAxiosInstance } from "@/api/vendor.axios";
import { BasePaginatedResponse, IClient } from "../client/clientService";
import { ENDPOINTS } from "@/api/endpoints";
import { IProfileUpdate } from "@/types/interfaces/User";
import {
  IService,
  IServiceFilter,
  IServiceResponse,
  IWorkSampleRequest,
  IWorkSampleFilter,
  PaginatedResponse,
  IWorkSampleResponse,
} from "@/types/interfaces/vendor";
import { ApiResponse } from "@/hooks/vendor/useVendor";
import { Category } from "../categories/categoryService";

export interface IVendor extends IClient {
  vendorId?: string;
  categories?: Category[];
  portfolioWebsite: string;
  languages?: string[];
  description?: string;
  verificationDocument: string;
  isVerified?: "pending" | "accept" | "reject";
}

export const getVendorDetails = async (): Promise<BasePaginatedResponse<IVendor>> => {
  const response = await vendorAxiosInstance.get(ENDPOINTS.VENDOR_DETAILS);
  return response.data;
};

export const updateVendorDetails = async (payload: IProfileUpdate) : Promise<BasePaginatedResponse<IVendor>> => {
  const response = await vendorAxiosInstance.put(
    ENDPOINTS.VENDOR_DETAILS,
    payload,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

// vendor-service-management
export const createService = async (
  payload: Partial<IService>
): Promise<ApiResponse> => {
  const reponse = await vendorAxiosInstance.post(
    ENDPOINTS.CREATE_SERVICE,
    payload
  );
  return reponse.data;
};

export const getAllVendorServices = async (
  payload: IServiceFilter
): Promise<BasePaginatedResponse<PaginatedResponse<IServiceResponse>>> => {
  const response = await vendorAxiosInstance.get(`/vendor/service`, {
    params: payload,
  });
  return response.data
};

export const updateVendorService = async (
  payload: Partial<IService>
): Promise<ApiResponse> => {
  const response = await vendorAxiosInstance.put("/vendor/service", payload);
  return response.data;
};

export const deleteVendorService = async (serviceId : string) : Promise<ApiResponse> => {
  const response = await vendorAxiosInstance.delete(`/vendor/service/${serviceId}`)
  return response.data
}

// vendor-work-sample-management
export const cerateWorkSampleService = async (
  payload: IWorkSampleRequest
): Promise<ApiResponse> => {
  const response = await vendorAxiosInstance.post(
    "/vendor/work-sample",
    payload
  );
  return response.data;
};

export const getAllWorkSampleService = async (
  payload: IWorkSampleFilter
): Promise<BasePaginatedResponse<PaginatedResponse<IWorkSampleResponse>>> => {
  const response = await vendorAxiosInstance.get("/vendor/work-sample", {
    params: payload,
  });
  return response.data;
};

export const deleteWorkSampleService = async (
  workSampleId: string
): Promise<ApiResponse> => {
  const response = await vendorAxiosInstance.delete(`/vendor/work-sample/${workSampleId}`)
  return response.data;
};

export const updateWorkSampleService = async (
  payload: Partial<IWorkSampleRequest>
): Promise<ApiResponse> => {
  const response = await vendorAxiosInstance.put("/vendor/work-sample", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};