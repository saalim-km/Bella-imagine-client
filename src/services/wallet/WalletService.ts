import { clientAxiosInstance } from "@/api/client.axios";
import { vendorAxiosInstance } from "@/api/vendor.axios";
import { adminAxiosInstance } from "@/api/admin.axios";
import { WalletQueryParams } from "@/hooks/wallet/useWallet";


export const clientWalletService = {
  getWallet: async (queryParams?: WalletQueryParams) => {
    const response = await clientAxiosInstance.get(`/client/wallet`,{params : queryParams})
    return response.data
  },
}

export const vendorWalletService = {
  getWallet: async (queryParams?: WalletQueryParams) => {
    const response = await vendorAxiosInstance.get(`/vendor/wallet`,{params : queryParams})
    return response.data
  },
}

export const adminWalletService = {
  getWallet: async (queryParams?: WalletQueryParams) => {
    const response = await adminAxiosInstance.get(`/wallet`,{params : queryParams})
    return response.data
  },
}