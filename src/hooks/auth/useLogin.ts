import { login } from "@/services/auth/authService"
import { useMutation } from "@tanstack/react-query"

export const useLoginMutation = ()=> {
    return useMutation({
        mutationFn : login
    })
}