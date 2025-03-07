import { signup } from "@/services/auth/authService"
import { useMutation } from "@tanstack/react-query"

export const useRegisterMutation = ()=> {
    return useMutation({
        mutationFn : signup
    })
}