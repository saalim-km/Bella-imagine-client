import { clientAxiosInstance } from "@/api/client.axios";
import { PopulatedWallet } from "@/types/Wallet";

export interface WalletDetailsResponse {
  walletData: PopulatedWallet;
  success: boolean;
}

export const getClientWalletDetails =
  async (): Promise<WalletDetailsResponse> => {
    const response = await clientAxiosInstance.get("/client/wallet");
    return response.data;
  };
