import { getAllCategories, vendorJoinCategory } from "@/services/categories/categoryService";
import { BasePaginatedResponse, GetVendorDetails } from "@/services/client/clientService";
import { cerateWorkSampleService, createService, deleteWorkSampleService, getAllVendorServices, getAllWorkSampleService, getVendorDetails, updateVendorDetails,updateWorkSampleService, updateVendorService, deleteVendorService, getAllVendorsServiceVendor, getPhotographerDetailsVendor, getServiceVendor } from "@/services/vendor/vendorService";
import { IVendorsFilter, IVendorsResponse } from "@/types/interfaces/User";
import { IServiceFilter, IServiceResponse, IWorkSampleFilter, PaginatedResponse } from "@/types/interfaces/vendor";
import { useMutation, useQuery } from "@tanstack/react-query";


export interface ApiResponse {
  success : boolean,
  message : string
}

export const useVendorDetailsQuery = (enabled = true,userId : string) => {
  return useQuery({
    queryKey: ["vendor-profile",userId],
    queryFn: getVendorDetails,
    enabled,
    staleTime : 1000 * 60 * 5 // 15 minutes
  });
};


export const useUpdateVendorMutation = ()=> {
    return useMutation({
        mutationFn : updateVendorDetails,
    })
}

export const useAllVendorCategoryQuery = (enabled : boolean)=> {
  return useQuery({
    queryKey : ["vendor-categorries"],
    queryFn : getAllCategories,
    staleTime : 1000 * 60 * 5, // 15 minutes,
    enabled : enabled
  })
}


export const useJoinCategoryRequestMutation = ()=> {
  return useMutation({
    mutationFn : vendorJoinCategory
  })
}

//vendor-service
export const useCreateServiceMutation = ()=> {
  return useMutation({
    mutationFn : createService
  })
}

export const useVendorServices = (filters: IServiceFilter) => {
  return useQuery<BasePaginatedResponse<PaginatedResponse<IServiceResponse>>>({
    queryKey: ["vendor_services", filters],
    queryFn: () => getAllVendorServices(filters),
    staleTime : 1000 * 60 * 5 
  });
};

export const useUpdateVendorServiceMutation = ()=> {
  return useMutation({
    mutationFn : updateVendorService,
  })
}

export const useDeleteService = ()=> {
  return useMutation({
    mutationFn : deleteVendorService
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
    queryKey : ["worksamples",filters],
    queryFn : ()=> getAllWorkSampleService(filters),
    staleTime : 1000 * 60 * 5 // 15 minutes
  })
}

export const useDeleteWorkSample = ()=> {
  return useMutation({
    mutationFn : deleteWorkSampleService
  })
}

export const useUpdateWorkSample = ()=> {
  return useMutation({
    mutationFn : updateWorkSampleService
  })
}


// query hooks
export const useAllVendorsListQueryVendor = (filter: IVendorsFilter) => {
  return useQuery<BasePaginatedResponse<PaginatedResponse<IVendorsResponse>>, Error>({
    queryKey: ["client", filter,filter.location],
    queryFn: () => getAllVendorsServiceVendor(filter),
    staleTime: 1000 *60 *5,
    enabled : filter.enabled
  });
};

export const useGetPhotographerDetailsVendor = (input : GetVendorDetails , vendorId: string)=> {
  return useQuery({
    queryKey : ["photographer",vendorId,input],
    queryFn : ()=> getPhotographerDetailsVendor(input,vendorId),
    staleTime : 1000 * 60 * 5, // 15 minutes,
    enabled : input.enabled
  })
}

export const useGetServiceQueryVendor = (id : string , enabled : boolean)=> {
  return useQuery({
    queryKey : ["service",id],
    queryFn : ()=> getServiceVendor(id),
    staleTime : 1000 * 60 * 5, // 15 minutes
    enabled : enabled
  })
}