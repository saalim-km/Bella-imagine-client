// Define all types used across the application

export interface Photographer {
    id: number
    name: string
    email: string
    status: "Active" | "Inactive"
    joinDate: string
    earnings: string
  }
  
  export interface Client {
    id: number
    name: string
    email: string
    status: "Active" | "Inactive"
    joinDate: string
    orders: number
  }
  
  export interface VendorRequest {
    id: number
    name: string
    email: string
    requestDate: string
    category: string
    status: "Pending" | "Approved" | "Rejected"
  }
  
  export interface Transaction {
    id: number
    date: string
    amount: string
    type: "Payment" | "Withdrawal"
    status: "Completed" | "Pending" | "Failed"
    user: string
    vendor: string
  }
  
  export interface Category {
    id: number
    name: string
    vendors: number
    status: "Active" | "Inactive"
  }
  
  export interface Notification {
    id: number
    title: string
    message: string
    time: string
    read: boolean
  }
  
  export interface AnalyticsData {
    totalUsers: number
    activeVendors: number
    totalRevenue: string
    pendingRequests: number
    conversionRate: string
  }
  
  export interface ChartDataPoint {
    date: string
    users: number
    vendors: number
    transactions: number
  }
  
  // API response types
  export interface ApiResponse<T> {
    data: T
    message: string
    success: boolean
  }
  
  export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
  
  // Filter and pagination types
  export interface PaginationParams {
    page: number
    limit: number
  }
  
  export interface UserFilters {
    status?: "Active" | "Inactive"
    search?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }
  
  export interface TransactionFilters {
    type?: "Payment" | "Withdrawal"
    status?: "Completed" | "Pending" | "Failed"
    dateFrom?: string
    dateTo?: string
    search?: string
  }
  
  export interface CategoryFilters {
    status?: "Active" | "Inactive"
    search?: string
  }
  
  export interface VendorRequestFilters {
    status?: "Pending" | "Approved" | "Rejected"
    search?: string
    dateFrom?: string
    dateTo?: string
  }
  
  export interface AnalyticsParams {
    period: "daily" | "weekly" | "monthly" | "yearly"
    startDate?: string
    endDate?: string
  }
  
  