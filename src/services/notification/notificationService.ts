import { clientAxiosInstance } from "@/api/client.axios";
import { vendorAxiosInstance } from "@/api/vendor.axios"
import { TNotification } from "@/components/common/Notification";
import { BasePaginatedResponse } from "../client/clientService";
import { ApiResponse } from "@/hooks/vendor/useVendor";

export interface GetAllNotificationsInput {
    limit : number;
    page : number
}

export interface NotificationPaginatedResponse {
  data : TNotification[];
  total : number;
  unReadTotal : number
}

export const getAllVendorNotification = async (input : GetAllNotificationsInput): Promise<BasePaginatedResponse<NotificationPaginatedResponse>> => {
    const response = await vendorAxiosInstance.get('/vendor/notification',{params : input})
    return response.data;
}

export const getAllClientNotification = async(input : GetAllNotificationsInput) : Promise<BasePaginatedResponse<NotificationPaginatedResponse>> => {
    console.log('client notificaiton service triggered ');
    const response = await clientAxiosInstance.get('/client/notification',{params : input})
    console.log(response);
    return response.data;
}

// update notification service
export const updateClientNotificationService = async():Promise<ApiResponse> => {
    const response = await clientAxiosInstance.patch('/client/notification')
    return response.data;
}

export const updateVendorNotificationService = async():Promise<ApiResponse> => {
    const response = await vendorAxiosInstance.patch('/vendor/notification')
    return response.data;
}

// delete notification service
export const deleteClientNotifications = async(): Promise<ApiResponse>=> {
    const response = await clientAxiosInstance.delete('/client/notification')
    return response.data
}

export const deleteVendorNotifications = async(): Promise<ApiResponse>=> {
    const response = await vendorAxiosInstance.delete('/vendor/notification')
    return response.data
}