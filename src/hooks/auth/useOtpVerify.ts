import { verifyOtp } from "@/services/auth/authService";
import { useMutation } from "@tanstack/react-query";

export interface AxiosResponse {
  success: boolean;
  message: string;
}

export const useOtpVerifyMutataion = () => {
  return useMutation<AxiosResponse, Error, { email: string; otp: string }>({
    mutationFn: verifyOtp,
  });
};
