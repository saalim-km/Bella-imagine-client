import {
  BasePaginatedResponse,
  getAllClientCategories,
  getAllVendorsServiceClient,
  getClientDetails,
  getPhotographerDetailsClient,
  getServiceClient,
  GetVendorDetails,
  updateClientDetails,
} from "@/services/client/clientService";
import { IVendorsFilter, IVendorsResponse } from "@/types/interfaces/User";
import { PaginatedResponse } from "@/types/interfaces/vendor";
import { useMutation, useQuery } from "@tanstack/react-query";



export const useClientDetailsQuery = (enabled = true , userId : string) => {
  return useQuery({
    queryKey: ["client-profile",userId],
    queryFn: getClientDetails,
    enabled,
    staleTime : 1000 * 60 * 5 // 15 minutes
  });
};

export const useUpdateClientMutation = () => {
  return useMutation({
    mutationFn: updateClientDetails,
  });
};

export const useAllVendorsListQueryClient = (filter: IVendorsFilter) => {
  return useQuery<BasePaginatedResponse<PaginatedResponse<IVendorsResponse>>, Error>({
    queryKey: ["client", filter,filter.location],
    queryFn: () => getAllVendorsServiceClient(filter),
    staleTime: 1000 *60 *5,
    enabled : filter.enabled
  });
};

export const useAllClientCategories = (enabled : boolean)=> {
  return useQuery({
    queryKey : ["client-categories"],
    queryFn : getAllClientCategories,
    staleTime : 1000 * 60 * 5, // 5 minutes,
    enabled : enabled
  })
}

export const useGetPhotographerDetailsClient = (input : GetVendorDetails , vendorId: string)=> {
  return useQuery({
    queryKey : ["photographer",vendorId,input],
    queryFn : ()=> getPhotographerDetailsClient(input,vendorId),
    enabled : input.enabled,
    staleTime : 1000 * 60 * 5
  })
}

export const useGetServiceQueryClient = (id : string , enabled : boolean)=> {
  return useQuery({
    queryKey : ["service",id],
    queryFn : ()=> getServiceClient(id),
    enabled : enabled
  })
}