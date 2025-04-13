import { adminAxiosInstance } from "@/api/admin.axios"
import { ApiResponse } from "@/hooks/vendor/useVendor"
import { IContest, PaginatedRequestContest } from "@/types/Contest"
import { PaginatedResponse } from "@/types/vendor";

export const createContestService = async(data : Partial<IContest>) : Promise<ApiResponse>=> {
    const response = await adminAxiosInstance.post('/contest',data);
    return response.data;
}

export const getPaginatedContestService = async(data : PaginatedRequestContest): Promise<PaginatedResponse<IContest>> => {
    const response = await adminAxiosInstance.get('/contest',{params : data});
    return response.data;
}