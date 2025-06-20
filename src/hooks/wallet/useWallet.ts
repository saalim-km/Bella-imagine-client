import { getAdminWalletDetails, getClientWalletDetails, getVendorWalletDetails } from "@/services/wallet/WalletService";
import { useQuery } from "@tanstack/react-query";

// for client wallet
export const useClientWallet = () => {
  return useQuery({
    queryKey: ["client-wallet"],
    queryFn: getClientWalletDetails,
  });
};

// for vendor wallet
export const useVendorWallet = () => {
  return useQuery({
    queryKey: ["vendor-wallet"],
    queryFn: getVendorWalletDetails,
  });
};

// for admin wallet
export const useAdminWallet = () => {
  return useQuery({
    queryKey: ["admin-wallet"],
    queryFn: getAdminWalletDetails,
  });
};
