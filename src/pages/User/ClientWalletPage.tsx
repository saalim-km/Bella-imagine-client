"use client"

import { useState, useCallback } from "react"
import { Spinner } from "@/components/ui/spinner"
import { useClientWallet, type WalletQueryParams } from "@/hooks/wallet/useWallet"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import EnhancedWalletComponent from "@/components/common/WalletComponent"

export default function ClientWallet() {
  const [queryParams, setQueryParams] = useState<WalletQueryParams>({
    page: 1,
    limit: 5,
  })

  const { data, isLoading, isError, refetch } = useClientWallet(queryParams)

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
          <Spinner />
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

  console.log('wallet data :',data);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wallet</h1>
          <p className="text-muted-foreground">Manage your funds, view transaction history, and track your spending.</p>
        </div>

        <EnhancedWalletComponent
          walletData={data.data.wallet}
          userRole="client"
          isLoading={isLoading}
          onFiltersChange={handleFiltersChange}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  )
}
