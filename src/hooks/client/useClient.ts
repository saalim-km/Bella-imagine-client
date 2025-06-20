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
import { getAllClientNotification } from "@/services/notification/notificationService";
import { IVendorsFilter, IVendorsResponse } from "@/types/interfaces/User";
import { PaginatedResponse } from "@/types/interfaces/vendor";
import { useMutation, useQuery } from "@tanstack/react-query";



export const useClientDetailsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["client-profile"],
    queryFn: getClientDetails,
    enabled,
  });
};

export const useUpdateClientMutation = () => {
  return useMutation({
    mutationFn: updateClientDetails,
  });
};


export const useAllClientNotification = (enabled = true)=> {
  return useQuery({
    queryKey : ["client-notification"],
    queryFn : getAllClientNotification,
    enabled
  })
}

export const useAllVendorsListQuery = (filter: IVendorsFilter) => {
  return useQuery<BasePaginatedResponse<PaginatedResponse<IVendorsResponse>>, Error>({
    queryKey: ["client", filter],
    queryFn: () => getAllVendors(filter),
    staleTime: 5 * 60 * 1000
  });
};

export const useAllClientCategories = ()=> {
  return useQuery({
    queryKey : ["client-categories"],
    queryFn : getAllClientCategories
  })
}

export const useGetPhotographerDetails = (input : GetVendorDetails , vendorId: string)=> {
  return useQuery({
    queryKey : ["photographer",vendorId,input],
    queryFn : ()=> getPhotographerDetails(input,vendorId)
  })
}

export const useGetServiceQuery = (id : string)=> {
  return useQuery({
    queryKey : ["service",id],
    queryFn : ()=> getService(id)
  })
}

