"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { ArrowDownIcon, ArrowUpIcon, Wallet, Search, ArrowUpDown, X, RefreshCw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PaymentStatus, type PopulatedWallet } from "@/types/interfaces/Wallet"
import moment from "moment"
import { formatPrice } from "@/utils/formatters/format-price.utils"
import { useDebounce } from "@/hooks/wallet/useWallet"
import type { WalletQueryParams } from "@/hooks/wallet/useWallet"

const StatusBadge = ({ status }: { status: PaymentStatus }) => {
  const statusVariants = {
    [PaymentStatus.COMPLETED]: "bg-success text-success-foreground",
    [PaymentStatus.PENDING]: "bg-warning text-warning-foreground",
    [PaymentStatus.FAILED]: "bg-destructive text-destructive-foreground",
    [PaymentStatus.REFUNDED]: "bg-info text-info-foreground",
  }

  return (
    <Badge variant="outline" className={statusVariants[status]}>
      {status}
    </Badge>
  )
}

interface EnhancedWalletComponentProps {
  walletData: PopulatedWallet
  userRole: "client" | "vendor" | "admin"
  isLoading?: boolean
  onFiltersChange: (filters: WalletQueryParams) => void
  onRefresh: () => void
}

type SortField = "date" | "amount" | "status" | "purpose"
type SortOrder = "asc" | "desc"

interface FilterState {
  search: string
  status: string
  purpose: string
  dateRange: string
  sortField: SortField
  sortOrder: SortOrder
}

export default function EnhancedWalletComponent({
  walletData,
  userRole,
  isLoading = false,
  onFiltersChange,
  onRefresh,
}: EnhancedWalletComponentProps) {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    purpose: "all",
    dateRange: "all",
    sortField: "date",
    sortOrder: "desc",
  })

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(filters.search, 500)

  // Get unique purposes for filter dropdown
  const uniquePurposes = walletData?.paymentId?.map((t) => t.purpose) || []
  const uniquePurposesSet = [...new Set(uniquePurposes)]

  // Calculate stats from current data
  const stats = {
    totalDeposits:
      walletData?.paymentId
        ?.filter((t) => ["wallet-credit", "refund-amount", "commission-credit"].includes(t.purpose))
        ?.reduce((sum, t) => sum + t.amount, 0) || 0,
    totalWithdrawals:
      walletData?.paymentId
        ?.filter((t) => ["vendor-booking", "withdrawal"].includes(t.purpose))
        ?.reduce((sum, t) => sum + t.amount, 0) || 0,
    pendingCount: walletData?.paymentId?.filter((t) => t.status === PaymentStatus.PENDING)?.length || 0,
  }

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSortChange = useCallback((field: SortField) => {
    setFilters((prev) => ({
      ...prev,
      sortField: field,
      sortOrder: prev.sortField === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "all",
      purpose: "all",
      dateRange: "all",
      sortField: "date",
      sortOrder: "desc",
    })
  }, [])

  // Effect to call API when filters change
  useEffect(() => {
    const queryParams: WalletQueryParams = {
      limit : 50,
      page : 1,
      search: debouncedSearch || undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      purpose: filters.purpose !== "all" ? filters.purpose : undefined,
      dateRange: filters.dateRange !== "all" ? filters.dateRange : undefined,
      sortField: filters.sortField,
      sortOrder: filters.sortOrder,
    }

    // Remove undefined values
    const cleanParams = Object.fromEntries(Object.entries(queryParams).filter(([_, value]) => value !== undefined))

    onFiltersChange(cleanParams)
  }, [
    debouncedSearch,
    filters.status,
    filters.purpose,
    filters.dateRange,
    filters.sortField,
    filters.sortOrder,
    onFiltersChange,
  ])

  const hasActiveFilters =
    filters.search || filters.status !== "all" || filters.purpose !== "all" || filters.dateRange !== "all"

  return (
    <div className="flex flex-col gap-6">
      {/* Wallet Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                {userRole === "admin" ? "Admin Wallet" : "My Wallet"}
              </CardTitle>
              <CardDescription>Manage your funds and transactions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading} className="bg-transparent">
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{formatPrice(walletData?.balance || 0)}</div>
              <p className="text-xs text-muted-foreground">Available Balance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Transaction History</CardTitle>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="w-fit bg-transparent">
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters Section */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>

              {/* Status Filter */}
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={PaymentStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={PaymentStatus.FAILED}>Failed</SelectItem>
                  <SelectItem value={PaymentStatus.REFUNDED}>Refunded</SelectItem>
                </SelectContent>
              </Select>

              {/* Purpose Filter */}
              <Select
                value={filters.purpose}
                onValueChange={(value) => handleFilterChange("purpose", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Purposes</SelectItem>
                  {uniquePurposesSet.map((purpose) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Range Filter */}
              <Select
                value={filters.dateRange}
                onValueChange={(value) => handleFilterChange("dateRange", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value={activeTab} className="mt-0">
              <ScrollArea className="w-full rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      {userRole === "admin" && <TableHead>User</TableHead>}
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSortChange("date")}
                          className="h-auto p-0 font-medium hover:bg-transparent"
                          disabled={isLoading}
                        >
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSortChange("purpose")}
                          className="h-auto p-0 font-medium hover:bg-transparent"
                          disabled={isLoading}
                        >
                          Type
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSortChange("amount")}
                          className="h-auto p-0 font-medium hover:bg-transparent"
                          disabled={isLoading}
                        >
                          Amount
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSortChange("status")}
                          className="h-auto p-0 font-medium hover:bg-transparent"
                          disabled={isLoading}
                        >
                          Status
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={userRole === "admin" ? 7 : 6} className="text-center py-10">
                          <div className="flex items-center justify-center">
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            Loading transactions...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : !walletData?.paymentId || walletData.paymentId.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={userRole === "admin" ? 7 : 6} className="text-center py-10">
                          {hasActiveFilters ? "No transactions match your filters" : "No transactions found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      walletData.paymentId.map((transaction) => (
                        <TableRow key={`${transaction._id}-${transaction.transactionId}`}>
                          {userRole === "admin" && (
                            <TableCell className="font-medium">{transaction.userId?.name || "Unknown User"}</TableCell>
                          )}
                          <TableCell className="font-medium">{transaction.transactionId}</TableCell>
                          <TableCell>{moment(transaction.createdAt).format("LLL")}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {transaction.purpose === "vendor-booking" ? (
                                <ArrowDownIcon className="h-4 w-4 text-destructive" />
                              ) : (
                                <ArrowUpIcon className="h-4 w-4 text-success" />
                              )}
                              <span className="text-sm">
                                {transaction.purpose.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell
                            className={`font-medium ${
                              ["refund-amount", "wallet-credit", "commission-credit"].includes(transaction.purpose)
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {["refund-amount", "wallet-credit", "commission-credit"].includes(transaction.purpose)
                              ? "+"
                              : "-"}
                            {formatPrice(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={transaction.status} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
