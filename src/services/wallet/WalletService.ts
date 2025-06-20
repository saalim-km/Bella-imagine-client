import { clientAxiosInstance } from "@/api/client.axios";
import { PopulatedWallet } from "@/types/interfaces/Wallet";
import { BasePaginatedResponse } from "../client/clientService";
import { vendorAxiosInstance } from "@/api/vendor.axios";
import { adminAxiosInstance } from "@/api/admin.axios";

export const getClientWalletDetails = async (): Promise<
  BasePaginatedResponse<PopulatedWallet>
> => {
  const response = await clientAxiosInstance.get("/client/wallet");
  return response.data;
};

export const getVendorWalletDetails = async (): Promise<
  BasePaginatedResponse<PopulatedWallet>
> => {
  const response = await vendorAxiosInstance.get("/vendor/wallet");
  return response.data;
};

export const getAdminWalletDetails = async (): Promise<
  BasePaginatedResponse<PopulatedWallet>
> => {
  const response = await adminAxiosInstance.get("/wallet");
  return response.data;
};
