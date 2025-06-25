import { useQuery } from "@tanstack/react-query"
import AdminService from "@/services/admin/adminService"
import { ENDPOINTS } from "@/api/endpoints"
import { PaginationParams,  } from "@/types/interfaces/Admin"
import { PaginatedResponse } from "@/types/interfaces/vendor"

// Query keys
export const notificationKeys = {
  all: ["notifications"] as const,
  list: (pagination: PaginationParams) => [...notificationKeys.all, pagination] as const,
  unread: () => [...notificationKeys.all, "unread"] as const,
}

// Fetch all notifications with pagination
export const useNotifications = (pagination: PaginationParams = { page: 1, limit: 10 }) => {
  return useQuery({
    queryKey: notificationKeys.list(pagination),
    queryFn: () => AdminService.get<PaginatedResponse<Notification>>(ENDPOINTS.NOTIFICATIONS, pagination),
  })
}