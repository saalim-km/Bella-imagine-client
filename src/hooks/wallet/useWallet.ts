import { getAdminWalletDetails, getClientWalletDetails, getVendorWalletDetails } from "@/services/wallet/WalletService";
import { useQuery } from "@tanstack/react-query";

// for client wallet
export const useClientWallet = () => {
  return useQuery({
    queryKey: ["client-wallet"],
    queryFn: getClientWalletDetails,
    staleTime : 1000 * 60 * 15 // 15 minutes
  });
};

// for vendor wallet
export const useVendorWallet = () => {
  return useQuery({
    queryKey: ["vendor-wallet"],
    queryFn: getVendorWalletDetails,
    staleTime : 1000 * 60 * 15 // 15 minutes
  });
};

// for admin wallet
export const useAdminWallet = () => {
  return useQuery({
    queryKey: ["admin-wallet"],
    queryFn: getAdminWalletDetails,
    staleTime : 1000 * 60 * 15 // 15 minutes
  });
};
