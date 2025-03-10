import { authAxiosInstance } from "@/api/auth.axios";
import { AuthResponse } from "./authService";

export const googleAuth = async ({
    credential,
    client_id,
    role,
  }: {
    credential: any;
    client_id: any;
    role: string;
  }): Promise<AuthResponse> => {
    const response = await authAxiosInstance.post<AuthResponse>("/google-auth", {
      credential,
      client_id,
      role,
    });
    console.log(response);
    return response.data;
  };
  