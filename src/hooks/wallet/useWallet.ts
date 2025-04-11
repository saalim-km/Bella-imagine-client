import { getAdminWalletDetails } from "@/services/wallet/adminWalletService";
import { getClientWalletDetails } from "@/services/wallet/clientWalletService";
import { getVendorWalletDetails } from "@/services/wallet/vendorWalletService";
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
