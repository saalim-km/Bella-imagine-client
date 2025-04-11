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
  });
};

export const useVendorTransactionsQuery = () => {
  return useQuery({
    queryKey: ["vendor-transactions"],
    queryFn: getAllTransactionsByVendorId,
  });
};

export const useAdminTransactionsQuery = () => {
  return useQuery({
    queryKey: ["admin-transactions"],
    queryFn: getAllTransactionsByAdminId,
  });
};
