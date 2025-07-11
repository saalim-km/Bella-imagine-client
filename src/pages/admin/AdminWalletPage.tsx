"use client"

import { useState, useCallback } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useAdminWallet, WalletQueryParams } from "@/hooks/wallet/useWallet"
import EnhancedWalletComponent from "@/components/common/WalletComponent"

const AdminWalletPage = () => {
  const [queryParams, setQueryParams] = useState<WalletQueryParams>({
    page: 1,
    limit: 50,
  })

  const { data, isLoading, isError, refetch } = useAdminWallet(queryParams)

  const handleFiltersChange = useCallback((filters: WalletQueryParams) => {
    setQueryParams(filters)
  }, [])

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  if (isLoading && !data) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner />
        </div>
      </AdminLayout>
    )
  }

  if (isError || !data) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8 text-center max-w-md">
            <CardContent className="space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <h3 className="text-lg font-semibold">Error Loading Wallet</h3>
              <p className="text-muted-foreground">
                An error occurred while fetching wallet data. Please try again later.
              </p>
              <Button onClick={handleRefresh} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Wallet</h1>
          <p className="text-muted-foreground">Manage admin wallet transactions and monitor financial activities.</p>
        </div>
        <EnhancedWalletComponent
          walletData={data.data.wallet}
          pagination={data.data.pagination}
          userRole="admin"
          isLoading={isLoading}
          onFiltersChange={handleFiltersChange}
          onRefresh={handleRefresh}
          currentQueryParams={queryParams} // Pass current query params
        />
      </div>
    </AdminLayout>
  )
}

export default AdminWalletPage