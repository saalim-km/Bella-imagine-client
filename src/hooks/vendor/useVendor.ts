import { getAllCategories, vendorJoinCategory } from "@/services/categories/categoryService";
import { getAllVendorNotification } from "@/services/notification/notificationService";
import { cerateWorkSampleService, createService, getAllVendorServices, getAllWorkSampleService, getVendorDetails, updateVendorDetails, updateVendorService } from "@/services/vendor/vendorService";
import { PaginationParams } from "@/types/Admin";
import { IService, IServiceFilter, IServiceResponse, IWorkSampleFilter, PaginatedResponse } from "@/types/vendor";
import { useMutation, useQuery } from "@tanstack/react-query";


export interface ApiResponse {
  success : boolean,
  message : string
}
export const useVendorDetailsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["vendor-profile"],
    queryFn: getVendorDetails,
    enabled,
  });
};


export const useUpdateVendorMutation = ()=> {
    return useMutation({
        mutationFn : updateVendorDetails,
    })
}

export const useAllVendorCategoryQuery = ()=> {
  return useQuery({
    queryKey : ["vendor-categorries"],
    queryFn : getAllCategories,
  })
}


export const useJoinCategoryRequestMutation = ()=> {
  return useMutation({
    mutationFn : vendorJoinCategory
  })
}


export const useAllVendortNotification = (enabled = true)=> {
  return useQuery({
    queryKey : ["vendor-notifications"],
    queryFn : getAllVendorNotification,
    enabled
  })
}


//vendor-service
export const useCreateServiceMutation = ()=> {
  return useMutation({
    mutationFn : createService
  })
}
export const useVendorServices = (filters: IServiceFilter) => {
  return useQuery<PaginatedResponse<IServiceResponse>>({
    queryKey: ["services", filters],
    queryFn: () => getAllVendorServices(filters),
  });
};
export const useUpdateVendorServiceMutation = ()=> {
  return useMutation({
    mutationFn : updateVendorService,
  })
}


//vendor-workSample
export const useVendorWorkSampleUploadMutataion = ()=> {
  return useMutation({
    mutationFn : cerateWorkSampleService
  })
}

export const useAllVendorWorkSample = (filters : IWorkSampleFilter)=> {
  return useQuery({
    queryKey : ["vendor",filters],
    queryFn : ()=> getAllWorkSampleService(filters)
  })
}