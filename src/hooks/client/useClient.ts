import {
  getClientDetails,
  updateClientDetails,
} from "@/services/client/clientService";
import { getAllClientNotification } from "@/services/notification/notificationService";
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