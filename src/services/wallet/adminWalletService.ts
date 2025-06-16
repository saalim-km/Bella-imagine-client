import { adminAxiosInstance } from "@/api/admin.axios";
import { BasePaginatedResponse } from "../client/clientService";
import { PopulatedWallet } from "@/types/interfaces/Wallet";

export const getAdminWalletDetails =
  async (): Promise<BasePaginatedResponse<PopulatedWallet>> => {
    const response = await adminAxiosInstance.get("/wallet");
    return response.data;
  };
