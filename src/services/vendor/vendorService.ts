import { vendorAxiosInstance } from "@/api/vendor.axios";
import { IClient } from "../client/clientService";


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
    languages ?: string[];
    description ?: string;
    notifications ?: string[];
    availableSlots ?: TSlot[];
    services ?: TService[];
    isVerified ?: boolean
}


export const getVendorDetails = async() : Promise<IVendor>=> {
    console.log('vendor service called');
    const response = await vendorAxiosInstance.get('/vendor/details');
    console.log(response);
    return response.data;
}


