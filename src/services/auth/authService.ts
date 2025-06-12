import { adminAxiosInstance } from "@/api/admin.axios";
import { authAxiosInstance } from "@/api/auth.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import { ENDPOINTS } from "@/api/endpoints";
import { vendorAxiosInstance } from "@/api/vendor.axios";
import { ILogin, IUser, TRole } from "@/types/interfaces/User";
import { AxiosResponse } from "axios";
// import { vendorAxiosInstance } from "@/api/vendor.axios";
// import { UserDTO } from "@/types/User";

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: "client" | "admin" | "vendor";
    avatar : string;
  };
}

export const signup = async (user: IUser): Promise<any> => {
  const response = await authAxiosInstance.post(ENDPOINTS.REGISTER, user);
  return response.data;
};

export const login = async (user: ILogin): Promise<AxiosResponse> => {
  const response = await authAxiosInstance.post(ENDPOINTS.LOGIN, user);
  return response.data;
};

export const sendOtp = async ({url , email , role} : {url : string , email : string , role : TRole}): Promise<any> => {
  const response = await authAxiosInstance.post(url, {
    email,
    role
  });
  console.log(response);
  return response.data;
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await authAxiosInstance.post(ENDPOINTS.VERIFY_OTP, data);
  console.log(response);
  return response.data;
};


export const forgotPassword = async (data : {email : string, userRole : TRole})=> {
  const response = await authAxiosInstance.post('/forgot-password', data)
  console.log(response);
  return response.data;
}

export const resetPassword = async (data : {email : string , password : string,role : TRole})=> {
  const response = await authAxiosInstance.patch('/forgot-password',data)
  console.log(response);
  return response.data;
}

export const logoutClient = async (): Promise<AxiosResponse> => {
  const response = await clientAxiosInstance.post(ENDPOINTS.CLIENT_LOGOUT);
  return response.data;
};

export const logoutVendor = async ()=> {
  const response = await vendorAxiosInstance.post(ENDPOINTS.VENDOR_LOGOUT)
  console.log(response);
  return response.data;
}

export const logoutAdmin = async ()=> {
  const response = await adminAxiosInstance.post(ENDPOINTS.ADMIN_LOGOUT)
  console.log(response);
  return response.data;
}
