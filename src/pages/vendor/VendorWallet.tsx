"use client"

import { useState, useCallback } from "react"
import { Spinner } from "@/components/ui/spinner"
import { useVendorWallet, type WalletQueryParams } from "@/hooks/wallet/useWallet"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import EnhancedWalletComponent from "@/components/common/WalletComponent"
export default function VendorWallet() {
  const [queryParams, setQueryParams] = useState<WalletQueryParams>({
    page: 1,
    limit: 50,
  })

  const { data, isLoading, isError, refetch } = useVendorWallet(queryParams)

  const handleFiltersChange = useCallback((filters: WalletQueryParams) => {
    setQueryParams(filters)
  }, [])

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  if (isLoading && !data) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner />{" "}
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8 text-center max-w-md">
            <CardContent className="space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <h3 className="text-lg font-semibold">Error Loading Wallet</h3>
              <p className="text-muted-foreground">
                An error occurred while fetching your wallet data. Please try again later.
              </p>
              <Button onClick={handleRefresh} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Wallet</h1>
          <p className="text-muted-foreground">
            Track your earnings, manage payouts, and monitor your financial performance.
          </p>
        </div>
        <EnhancedWalletComponent
          walletData={data.data.wallet}
          pagination={data.data.pagination}
          userRole="vendor"
          isLoading={isLoading}
          onFiltersChange={handleFiltersChange}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  )
}
