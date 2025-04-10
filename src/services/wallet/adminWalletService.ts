import { adminAxiosInstance } from "@/api/admin.axios";
import { WalletDetailsResponse } from "./clientWalletService";

export const getAdminWalletDetails =
  async (): Promise<WalletDetailsResponse> => {
    const response = await adminAxiosInstance.get("/wallet");
    return response.data;
  };
