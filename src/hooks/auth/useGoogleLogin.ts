import { googleAuth } from "@/services/auth/googleService"
import { useMutation } from "@tanstack/react-query"

export const useGoogleLoginMutataion = ()=> {
    return useMutation({
        mutationFn : googleAuth
    })
}