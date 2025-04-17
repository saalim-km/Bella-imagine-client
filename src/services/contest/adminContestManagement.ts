import { adminAxiosInstance } from "@/api/admin.axios"
import { clientAxiosInstance } from "@/api/client.axios";
import { ApiResponse } from "@/hooks/vendor/useVendor"
import { IContest, PaginatedRequestContest } from "@/types/Contest"
import { PaginatedResponse } from "@/types/vendor";

export const createContestService = async(data : Partial<IContest>) : Promise<ApiResponse>=> {
    const response = await adminAxiosInstance.post('/contest',data);
    return response.data;
}

//get contest
export const getPaginatedContestService = async(data : PaginatedRequestContest): Promise<PaginatedResponse<IContest>> => {
    const response = await adminAxiosInstance.get('/contest',{params : data});
    return response.data;
}

export const getAllClientContestService = async(data : PaginatedRequestContest): Promise<PaginatedResponse<IContest>> => {
    const response = await clientAxiosInstance.get('/client/contest',{params : data});
    return response.data;
}

