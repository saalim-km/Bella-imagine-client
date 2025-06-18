import { chatAxionInstance } from "@/api/chat.axios"
import { BasePaginatedResponse } from "../client/clientService"

export interface IUploadMediaResponse {
    key : string,
    mediaUrl : string
}

export const uploadMediaChatService = async(payload : {media : File , conversationId : string}): Promise<BasePaginatedResponse<IUploadMediaResponse>> => {
    const response = await chatAxionInstance.post('/upload-media',payload,{headers : {'Content-Type' : 'multipart/form-data'}})
    return response.data
}