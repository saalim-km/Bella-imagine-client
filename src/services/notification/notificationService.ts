import { clientAxiosInstance } from "@/api/client.axios";
import { vendorAxiosInstance } from "@/api/vendor.axios"

export const getAllVendorNotification = async ()=> {
    const response = await vendorAxiosInstance.get('/vendor/notification')
    console.log(response);
    return response.data;
}

export const getAllClientNotification = async()=> {
    const response = await clientAxiosInstance.get('/client/notification')
    console.log(response);
    return response.data;
}