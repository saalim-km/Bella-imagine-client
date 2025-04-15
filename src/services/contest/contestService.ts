import { clientAxiosInstance } from "@/api/client.axios"
import { ApiResponse } from "@/hooks/vendor/useVendor"
import { IContestUpload } from "@/types/Contest"

export const participateContestService = async (data : IContestUpload) : Promise<ApiResponse>=> {
    const response = await clientAxiosInstance.post('/client/contest',data)
    return response.data;
}