import { resetPassword } from "@/services/auth/authService"
import { useMutation } from "@tanstack/react-query"

export const useResetPasswordMUtation = ()=> {
    return useMutation({
        mutationFn : resetPassword
    })
}