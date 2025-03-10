import { authAxiosInstance } from "@/api/auth.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import { vendorAxiosInstance } from "@/api/vendor.axios";
import { ILogin, IUser } from "@/types/User";
import { AxiosResponse } from "axios";
// import { vendorAxiosInstance } from "@/api/vendor.axios";
// import { UserDTO } from "@/types/User";

export interface AuthResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "client" | "admin" | "vendor";
  };
}

// export interface AxiosResponse {
//   success: boolean;
//   message: string;
// }

// export interface ILoginData {
//   email: string;
//   password: string;
//   role: "admin" | "client" | "vendor";
// }

export const signup = async (user: IUser): Promise<any> => {
  const response = await authAxiosInstance.post("/register", user);
  return response.data;
};

export const login = async (user: ILogin): Promise<AxiosResponse> => {
  const response = await authAxiosInstance.post("/login", user);
  return response.data;
};

export const sendOtp = async (email: string): Promise<any> => {
  const response = await authAxiosInstance.post("/send-otp", {
    email,
  });
  console.log(response);
  return response.data;
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await authAxiosInstance.post("/verify-otp", data);
  console.log(response);
  return response.data;
};

export const logoutClient = async (): Promise<AxiosResponse> => {
  const response = await clientAxiosInstance.post("/client/logout");
  return response.data;
};

export const logoutVendor = async ()=> {
  const response = await vendorAxiosInstance.post('/vendor/logout')
  console.log(response);
  return response.data;
}