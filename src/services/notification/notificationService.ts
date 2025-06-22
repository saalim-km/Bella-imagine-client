import { clientAxiosInstance } from "@/api/client.axios";
import { vendorAxiosInstance } from "@/api/vendor.axios"
import { TNotification } from "@/components/common/Notification";
import { PaginatedResponse } from "@/types/interfaces/vendor";
import { BasePaginatedResponse } from "../client/clientService";

export interface GetAllNotificationsInput {
    limit : number;
    page : number
}

export const getAllVendorNotification = async (input : GetAllNotificationsInput): Promise<BasePaginatedResponse<PaginatedResponse<TNotification>>> => {
    const response = await vendorAxiosInstance.get('/vendor/notification')
    return response.data;
}

export const getAllClientNotification = async(input : GetAllNotificationsInput) : Promise<BasePaginatedResponse<PaginatedResponse<TNotification>>> => {
    console.log('client notificaiton service triggered ');
    const response = await clientAxiosInstance.get('/client/notification',{params : input})
    console.log(response);
    return response.data;
}