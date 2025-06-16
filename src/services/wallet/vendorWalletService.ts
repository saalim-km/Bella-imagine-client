import { vendorAxiosInstance } from "@/api/vendor.axios";
import { BasePaginatedResponse } from "../client/clientService";
import { PopulatedWallet } from "@/types/interfaces/Wallet";

export const getVendorWalletDetails =
  async (): Promise<BasePaginatedResponse<PopulatedWallet>> => {
    const response = await vendorAxiosInstance.get("/vendor/wallet");
    return response.data;
  };
