import { vendorAxiosInstance } from "@/api/vendor.axios";
import { IClient } from "../client/clientService";
import { ENDPOINTS } from "@/api/endpoints";
import { IProfileUpdate, IVendorReponse } from "@/types/User";


type TSlot = {
    slotDate : Date,
    slotBooked : boolean,
}

type TService = {
    duration : number,
    pricePerHour : number
}

export interface IVendor extends IClient {
    vendorId ?: string,
    categories ?: string[];
    portfolioWebsite : string;
    languages ?: string[];
    description ?: string;
    notifications ?: string[];
    availableSlots ?: TSlot[];
    verificationDocuments : string[]
    services ?: TService[];
    isVerified ?: boolean
}


export const getVendorDetails = async() : Promise<IVendorReponse>=> {
    console.log('vendor service called');
    const response = await vendorAxiosInstance.get(ENDPOINTS.VENDOR_DETAILS);
    console.log(response);
    return response.data;
}

export const updateVendorDetails = async(data : IProfileUpdate)=> {
    console.log('vendor service called for updating')
    const response = await vendorAxiosInstance.put(ENDPOINTS.VENDOR_DETAILS , data);
    console.log(response);
    return response.data;
}