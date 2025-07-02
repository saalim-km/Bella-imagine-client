import { CreateConvInput, uploadMediaChatService } from "@/services/chat/chatService"
import { useMutation } from "@tanstack/react-query"
import { ApiResponse } from "../vendor/useVendor"

export const useUploadChatMedia = ()=> {
    return useMutation({
        mutationFn : uploadMediaChatService
    })
}

export const useCreateConversation = (mutateFn : (input : CreateConvInput) => Promise<ApiResponse> )=> {
    return useMutation({
        mutationFn : mutateFn,
    })
}