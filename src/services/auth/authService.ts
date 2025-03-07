import { authAxiosInstance } from "@/api/auth.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import { handleError } from "@/utils/Error/errorHandler";
// import { vendorAxiosInstance } from "@/api/vendor.axios";
// import { UserDTO } from "@/types/User";

// export interface AuthResponse {
//   success: boolean;
//   message: string;
//   user: {
//     id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     role: "client" | "admin" | "vendor";
//   };
// }

// export interface AxiosResponse {
//   success: boolean;
//   message: string;
// }

// export interface ILoginData {
//   email: string;
//   password: string;
//   role: "admin" | "client" | "vendor";
// }

export const signup = async (user : any): Promise<any> => {
    try {
        const response = await authAxiosInstance.post(
            "/register",
            user
          );
          return response.data;
    } catch (error) {
        handleError(error)
    }   
};

// export const login = async (user: ILoginData): Promise<AuthResponse> => {
//   const response = await authAxiosInstance.post<AuthResponse>("/login", user);
//   return response.data;
// };

export const sendOtp = async (email: string): Promise<any> => {
    try {
        const response = await authAxiosInstance.post("/send-otp", {
            email,
          });
          return response.data;
    } catch (error) {
        handleError(error)
    }
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
    try {
        const response = await authAxiosInstance.post<any>(
            "/verify-otp",
            data
          );
          return response.data;
    } catch (error) {
        handleError(error)
    }
};

// export const logoutClient = async (): Promise<AxiosResponse> => {
//   const response = await clientAxiosInstance.post("/_cl/client/logout");
//   return response.data;
// };

// export const logoutVendor = async (): Promise<AxiosResponse> => {
//   const response = await vendorAxiosInstance.post("/_ve/vendor/logout");
//   return response.data;
// };

// export const logoutAdmin = async (): Promise<AxiosResponse> => {
//   const response = await adminAxiosInstance.post("/_ad/admin/logout");
//   return response.data;
// };
