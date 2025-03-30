import {
  getAllClientCategories,
  getAllVendors,
  getClientDetails,
  updateClientDetails,
} from "@/services/client/clientService";
import { getAllClientNotification } from "@/services/notification/notificationService";
import { IVendorsFilter } from "@/types/User";
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

export const useAllVendorsListQuery = (filter : IVendorsFilter) => {
  console.log(`in vendors listing service `,filter);
  return useQuery({
    queryKey : ["client",filter],
    queryFn : ()=> getAllVendors(filter)
  })
}

export const useAllClientCategories = ()=> {
  return useQuery({
    queryKey : ["client-categories"],
    queryFn : getAllClientCategories
  })
}