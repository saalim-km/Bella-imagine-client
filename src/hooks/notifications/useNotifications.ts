import { BasePaginatedResponse } from "@/services/client/clientService"
import { GetAllNotificationsInput, NotificationPaginatedResponse } from "@/services/notification/notificationService"
import { TRole } from "@/types/interfaces/User"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ApiResponse } from "../vendor/useVendor"

export const useGetAllNotifications = (queryFn: (input : GetAllNotificationsInput) => Promise<BasePaginatedResponse<NotificationPaginatedResponse>> , role : TRole , enabled : boolean = false,input :GetAllNotificationsInput) => {
    return useQuery({
        queryKey : ['notifications',input,role],
        queryFn : ()=> queryFn(input),
        enabled : enabled
    })
}

export const useUpdateNotification = (mutateFn : ()=> Promise<ApiResponse>)=> {
    return useMutation({
        mutationFn : mutateFn
    })
}