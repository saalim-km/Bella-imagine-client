"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownIcon, ArrowUpIcon, Wallet, Search, X, RefreshCw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import moment from "moment"
import { debounce } from "lodash"
import type { Wallet as WalletType, PaginationInfo, WalletQueryParams } from "@/types/interfaces/Wallet"
import Pagination from "@/components/common/Pagination"

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusVariants = {
    succeeded: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-purple-100 text-purple-800 border-purple-200",
    partially_refunded: "bg-orange-100 text-orange-800 border-orange-200",
  }

  return (
    <Badge
      variant="outline"
      className={statusVariants[status as keyof typeof statusVariants] || "bg-gray-100 text-gray-800"}
    >
      {status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
    </Badge>
  )
}

interface EnhancedWalletComponentProps {
  walletData: WalletType
  pagination: PaginationInfo
  userRole: "client" | "vendor" | "admin"
  isLoading?: boolean
  onFiltersChange: (filters: WalletQueryParams) => void
  onRefresh: () => void
  currentQueryParams?: WalletQueryParams // Add this prop to receive current query params
}

interface FilterState {
  search: string
  status: string
  purpose: string
  dateRange: string
}

export default function EnhancedWalletComponent({
  walletData,
  pagination,
  userRole,
  isLoading = false,
  onFiltersChange,
  onRefresh,
  currentQueryParams = {}, // Default to empty object
}: EnhancedWalletComponentProps) {

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    purpose: "all",
    dateRange: "all",
  })

  // Sync local filter state with current query params
  useEffect(() => {
    setFilters({
      search: currentQueryParams.search || "",
      status: currentQueryParams.status || "all",
      purpose: currentQueryParams.purpose || "all",
      dateRange: currentQueryParams.dateRange || "all",
    })
  }, [currentQueryParams])

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm: string, currentFilters: FilterState) => {
      const queryParams: WalletQueryParams = {
        page: 1, // Reset to first page on filter change
        limit: pagination.limit || 50,
        search: searchTerm || undefined,
        status: currentFilters.status !== "all" ? currentFilters.status : undefined,
        purpose: currentFilters.purpose !== "all" ? currentFilters.purpose : undefined,
        dateRange: currentFilters.dateRange !== "all" ? currentFilters.dateRange : undefined,
      }

      // Remove undefined values
      const cleanParams = Object.fromEntries(Object.entries(queryParams).filter(([_, value]) => value !== undefined))

      onFiltersChange(cleanParams)
    }, 500),
    [pagination.limit, onFiltersChange],
  )

  // Get unique purposes for filter dropdown
  const uniquePurposes = walletData?.paymentId?.map((t) => t.purpose) || []
  const uniquePurposesSet = [...new Set(uniquePurposes)]

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value }

        // For search, use debounced function
        if (key === "search") {
          debouncedSearch(value, newFilters)
        } else {
          // For other filters, call immediately
          const queryParams: WalletQueryParams = {
            page: 1, // Reset to first page on filter change
            limit: pagination.limit || 50,
            search: newFilters.search || undefined,
            status: newFilters.status !== "all" ? newFilters.status : undefined,
            purpose: newFilters.purpose !== "all" ? newFilters.purpose : undefined,
            dateRange: newFilters.dateRange !== "all" ? newFilters.dateRange : undefined,
          }

          const cleanParams = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value !== undefined),
          )

          onFiltersChange(cleanParams)
        }

        return newFilters
      })
    },
    [debouncedSearch, pagination.limit, onFiltersChange],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      const queryParams: WalletQueryParams = {
        page,
        limit: pagination.limit || 50,
        search: filters.search || undefined,
        status: filters.status !== "all" ? filters.status : undefined,
        purpose: filters.purpose !== "all" ? filters.purpose : undefined,
        dateRange: filters.dateRange !== "all" ? filters.dateRange : undefined,
      }

      const cleanParams = Object.fromEntries(Object.entries(queryParams).filter(([_, value]) => value !== undefined))

      onFiltersChange(cleanParams)
    },
    [filters, pagination.limit, onFiltersChange],
  )

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "all",
      purpose: "all",
      dateRange: "all",
    })

    onFiltersChange({
      page: 1,
      limit: pagination.limit || 50,
    })
  }, [pagination.limit, onFiltersChange])

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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="succeeded">Succeeded</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
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

          <ScrollArea className="w-full rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Loading transactions...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !walletData?.paymentId || walletData.paymentId.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      {hasActiveFilters ? "No transactions match your filters" : "No transactions found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  walletData.paymentId.map((transaction) => (
                    <TableRow key={`${transaction.transactionId}-${transaction.transactionId}`}>
                      <TableCell className="font-medium">{transaction.transactionId}</TableCell>
                      <TableCell>{moment(transaction.createdAt).format("MMM DD, YYYY HH:mm")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transaction.purpose === "vendor-booking" ? (
                            <ArrowDownIcon className="h-4 w-4 text-red-500" />
                          ) : (
                            <ArrowUpIcon className="h-4 w-4 text-green-500" />
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}