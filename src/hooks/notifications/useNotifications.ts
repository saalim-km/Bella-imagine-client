import { TNotification } from "@/components/common/Notification"
import { BasePaginatedResponse } from "@/services/client/clientService"
import { GetAllNotificationsInput } from "@/services/notification/notificationService"
import { TRole } from "@/types/interfaces/User"
import { PaginatedResponse } from "@/types/interfaces/vendor"
import { useQuery } from "@tanstack/react-query"

export const useGetAllNotifications = (queryFn: (input : GetAllNotificationsInput) => Promise<BasePaginatedResponse<PaginatedResponse<TNotification>>> , role : TRole , enabled : boolean = false,input :GetAllNotificationsInput) => {
    return useQuery({
        queryKey : ['notifications',input],
        queryFn : ()=> queryFn(input),
        enabled : enabled
    })
}   