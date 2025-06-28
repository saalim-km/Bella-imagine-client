import {
  BasePaginatedResponse,
  getAllClientCategories,
  getAllVendors,
  getClientDetails,
  getPhotographerDetails,
  getService,
  GetVendorDetails,
  updateClientDetails,
} from "@/services/client/clientService";
import { IVendorsFilter, IVendorsResponse } from "@/types/interfaces/User";
import { PaginatedResponse } from "@/types/interfaces/vendor";
import { useMutation, useQuery } from "@tanstack/react-query";



export const useClientDetailsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["client-profile"],
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

export const useAllVendorsListQuery = (filter: IVendorsFilter) => {
  return useQuery<BasePaginatedResponse<PaginatedResponse<IVendorsResponse>>, Error>({
    queryKey: ["client", filter,filter.location],
    queryFn: () => getAllVendors(filter),
    staleTime: 1000 *60 *5,
    enabled : filter.enabled
  });
};

export const useAllClientCategories = ()=> {
  return useQuery({
    queryKey : ["client-categories"],
    queryFn : getAllClientCategories,
    staleTime : 1000 * 60 * 5 // 5 minutes
  })
}

export const useGetPhotographerDetails = (input : GetVendorDetails , vendorId: string)=> {
  return useQuery({
    queryKey : ["photographer",vendorId,input],
    queryFn : ()=> getPhotographerDetails(input,vendorId),
    staleTime : 1000 * 60 * 5 // 15 minutes
  })
}

export const useGetServiceQuery = (id : string)=> {
  return useQuery({
    queryKey : ["service",id],
    queryFn : ()=> getService(id),
    staleTime : 1000 * 60 * 5 // 15 minutes
  })
}