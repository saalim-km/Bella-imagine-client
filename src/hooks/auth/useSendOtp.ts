import { sendOtp } from "@/services/auth/authService"
import { useMutation } from "@tanstack/react-query"

export const useSendOtp = ()=> {
    return useMutation({
        mutationFn : sendOtp
    })
}

export const useForgotPassSendOtp = ()=> {
    return useMutation({
        mutationFn : sendOtp
    })
}