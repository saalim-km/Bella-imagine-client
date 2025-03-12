import { authAxiosInstance } from "@/api/auth.axios";
import { AuthResponse } from "./authService";
import { ENDPOINTS } from "@/api/endpoints";

export const googleAuth = async ({
    credential,
    client_id,
    role,
  }: {
    credential: any;
    client_id: any;
    role: string;
  }): Promise<AuthResponse> => {
    const response = await authAxiosInstance.post<AuthResponse>(ENDPOINTS.GOOGLE_LOGIN, {
      credential,
      client_id,
      role,
    });
    console.log(response);
    return response.data;
  };
  