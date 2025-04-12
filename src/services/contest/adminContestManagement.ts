import { adminAxiosInstance } from "@/api/admin.axios"
import { ApiResponse } from "@/hooks/vendor/useVendor"
import { IContest } from "@/types/Contest"

export const createContestService = async(data : Partial<IContest>) : Promise<ApiResponse>=> {
    const response = await adminAxiosInstance.post('/contest',data);
    return response.data;
}