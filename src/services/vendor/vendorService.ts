import { vendorAxiosInstance } from "@/api/vendor.axios";
import { IClient } from "../client/clientService";
import { ENDPOINTS } from "@/api/endpoints";
import { IProfileUpdate, IVendorReponse } from "@/types/User";
import { IService } from "@/types/vendor";
import { ApiResponse } from "@/hooks/vendor/useVendor";




export interface IVendor extends IClient {
    vendorId ?: string,
    categories ?: string[];
    portfolioWebsite : string;
    languages ?: string[];
    description ?: string;
    verificationDocuments : string[]
    isVerified ?: "pending" | "accept" |  "reject"
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


export const createService = async(data : Partial<IService>):Promise<ApiResponse> => {
    const reponse = await vendorAxiosInstance.post(ENDPOINTS.CREATE_SERVICE,data);
    console.log(reponse);
    return reponse.data;
}