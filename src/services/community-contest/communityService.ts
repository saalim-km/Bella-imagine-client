import { adminAxiosInstance } from "@/api/admin.axios";
import { communityAxiosInstance } from "@/api/community.axios"
import { ApiResponse } from "@/hooks/vendor/useVendor";
import { Community } from "@/types/Community"
import { PaginatedResponse } from "@/types/vendor";

export const createCommunityService = async(dto : Partial<Community>) : Promise<ApiResponse>=> {
    const response = await adminAxiosInstance.post('/community',dto);
    return response.data;
}

export const getAllCommunites = async(dto : { page : number , limit : number}) : Promise<PaginatedResponse<Community>> => {
    const response = await adminAxiosInstance.get('/community',{params : dto})
    return response.data;
}

export const deleteCommunityService = async(communityId : string): Promise<ApiResponse> => {
    console.log('community delte service trigger : ',communityId);
    const response = await adminAxiosInstance.delete(`/community`,{data : {communityId : communityId}});
    return response.data;
}