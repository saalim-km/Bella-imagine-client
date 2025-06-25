import {
  getAllTransactionsByAdminId,
  getAllTransactionsByClientId,
  getAllTransactionsByVendorId,
} from "@/services/payment/transactionService";

import { useQuery } from "@tanstack/react-query";

export const useClientTransactionsQuery = () => {
  return useQuery({
    queryKey: ["client-transactions"],
    queryFn: getAllTransactionsByClientId,
    staleTime : 1000 * 60 * 15 // 15 minutes
  });
};

export const useVendorTransactionsQuery = () => {
  return useQuery({
    queryKey: ["vendor-transactions"],
    queryFn: getAllTransactionsByVendorId,
    staleTime : 1000 * 60 * 15 // 15 minutes
  });
};

export const useAdminTransactionsQuery = () => {
  return useQuery({
    queryKey: ["admin-transactions"],
    queryFn: getAllTransactionsByAdminId,
    staleTime : 1000 * 60 * 15 // 15 minutes
  });
};
