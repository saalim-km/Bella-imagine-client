import { uploadMediaChatService } from "@/services/chat/chatService"
import { useMutation } from "@tanstack/react-query"

export const useUploadChatMedia = ()=> {
    return useMutation({
        mutationFn : uploadMediaChatService
    })
}