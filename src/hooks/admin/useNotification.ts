import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import AdminService from "@/services/admin/adminService"
import { ENDPOINTS } from "@/api/endpoints"
import { Notification, PaginatedResponse, PaginationParams, ApiResponse } from "@/types/Admin"

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

// Fetch unread notifications count
export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: () => AdminService.get<ApiResponse<{ count: number }>>(`${ENDPOINTS.NOTIFICATIONS}/unread/count`),
    // Polling for real-time updates
    refetchInterval: 30000, // 30 seconds
  })
}

// Mark a notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => AdminService.post<ApiResponse<Notification>>(ENDPOINTS.MARK_NOTIFICATION_READ(id), {}),
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      })
    },
  })
}

// Mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => AdminService.post<ApiResponse<void>>(ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ, {}),
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      })
    },
  })
}

