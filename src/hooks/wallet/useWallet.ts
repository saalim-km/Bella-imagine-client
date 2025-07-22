import { adminWalletService, clientWalletService, vendorWalletService } from "@/services/wallet/WalletService";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react"


export interface WalletQueryParams {
  search?: string
  status?: string
  purpose?: string
  dateRange?: string
  sortField?: string
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}



export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// for client wallet
export const useClientWallet = (queryParams?: WalletQueryParams) => {
  return useQuery({
    queryKey: ["client-wallet", queryParams],
    queryFn: () => clientWalletService.getWallet(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useVendorWallet = (queryParams?: WalletQueryParams) => {
  return useQuery({
    queryKey: ["vendor-wallet", queryParams],
    queryFn: () => vendorWalletService.getWallet(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useAdminWallet = (queryParams?: WalletQueryParams) => {
  return useQuery({
    queryKey: ["admin-wallet", queryParams],
    queryFn: () => adminWalletService.getWallet(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
