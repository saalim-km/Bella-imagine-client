import { verifyOtp } from "@/services/auth/authService"
import { useMutation } from "@tanstack/react-query"

export const useOtpVerifyMutataion = ()=>{
    return useMutation({
        mutationFn : verifyOtp
    })
}