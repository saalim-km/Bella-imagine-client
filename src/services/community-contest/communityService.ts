import { adminAxiosInstance } from "@/api/admin.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import { ApiResponse } from "@/hooks/vendor/useVendor";
import { Community, CommunityResponse } from "@/types/interfaces/Community"
import { PaginatedResponse } from "@/types/interfaces/vendor";
import { BasePaginatedResponse } from "../client/clientService";

export interface CommunityBySlugResponse {
    community : CommunityResponse;
    isMember : boolean
}

export const createCommunityService = async(dto : Partial<Community>) : Promise<ApiResponse>=> {
    const response = await adminAxiosInstance.post('/community',dto,{
        headers : {
            'Content-Type' : 'multipart/form-data'
        }
    });
    return response.data;
}

export const getAllCommunites = async(dto : { page : number , limit : number , search : string}) : Promise<BasePaginatedResponse<PaginatedResponse<CommunityResponse>>> => {
    const response = await adminAxiosInstance.get('/community',{params : dto})
    return response.data;
}

export const deleteCommunityService = async(communityId : string): Promise<ApiResponse> => {
    console.log('community delte service trigger : ',communityId);
    const response = await adminAxiosInstance.delete(`/community`,{data : {communityId : communityId}});
    return response.data;
}

export const getCommunityBySlugService = async(slug : string) : Promise<BasePaginatedResponse<CommunityBySlugResponse>> =>{
    const response = await adminAxiosInstance.get(`/community/${slug}`);
    return response.data;
}

export const updateCommunityService = async(dto : Partial<Community>) : Promise<ApiResponse> => {
    const response = await adminAxiosInstance.put(`/community`, dto , {
        headers : {
            'Content-Type' : 'multipart/form-data'
        }
    });
    return response.data;
}

export const getCommunityBySlugForClient = async(slug : string):Promise<{community : Community , isMember : boolean}>=> {
    const response = await clientAxiosInstance.get(`/client/community/${slug}`)
    return response.data;
}

export const joinCommunityService = async(dto : {communityId : string , userId : string}) : Promise<ApiResponse> => {
    const response = await clientAxiosInstance.post(`/client/community/join`, dto);
    return response.data;
}

export const leaveCommunityService = async(dto : {communityId : string}) : Promise<ApiResponse> => {
    const response = await clientAxiosInstance.delete(`/client/community/join`, {data : dto});
    return response.data;
}