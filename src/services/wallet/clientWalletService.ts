import { clientAxiosInstance } from "@/api/client.axios";
import { PopulatedWallet } from "@/types/interfaces/Wallet";
import { BasePaginatedResponse } from "../client/clientService";

export const getClientWalletDetails =
  async (): Promise<BasePaginatedResponse<PopulatedWallet>> => {
    const response = await clientAxiosInstance.get("/client/wallet");
    return response.data;
  };
