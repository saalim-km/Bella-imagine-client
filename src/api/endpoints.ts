export const ENDPOINTS = {
  // Users
  PHOTOGRAPHERS: `/photographers`,
  PHOTOGRAPHER: (id: number) => `/photographers/${id}`,

  CLIENTS: `/clients`,
  CLIENT: (id: number) => `/clients/${id}`,

  // Vendor Requests
  VENDOR_REQUESTS: `/vendor-requests`,
  VENDOR_REQUEST: (id: number) => `/vendor-requests/${id}`,
  APPROVE_VENDOR: (id: number) => `/vendor-requests/${id}/approve`,
  REJECT_VENDOR: (id: number) => `/vendor-requests/${id}/reject`,

  // Transactions
  TRANSACTIONS: `/transactions`,
  TRANSACTION: (id: number) => `/transactions/${id}`,

  // Categories
  CATEGORIES: `/categories`,
  CATEGORY: (id: number) => `/categories/${id}`,

  // Analytics
  ANALYTICS_OVERVIEW: `/analytics/overview`,
  ANALYTICS_CHART: `/analytics/chart`,

  // Notifications
  NOTIFICATIONS: `/notifications`,
  NOTIFICATION: (id: number) => `/notifications/${id}`,
  MARK_NOTIFICATION_READ: (id: number) => `/notifications/${id}/read`,
  MARK_ALL_NOTIFICATIONS_READ: `/notifications/read-all`,

  //   Authentication
  REGISTER: "/register",
  LOGIN: "/login",
  SEND_OTP: "/send-otp",
  VERIFY_OTP: "/verify-otp",
  CLIENT_LOGOUT: "/client/logout",
  VENDOR_LOGOUT: "/vendor/logout",
  ADMIN_LOGOUT: "/logout",
  GOOGLE_LOGIN: "/google-auth",

  // Client and vendor 
  CLIENT_DETAILS: "/client/details",
  VENDOR_DETAILS: "/vendor/details",

  //RefreshToken
  CLIENT_REFRESH_TOKEN: `/client/refresh-token`,
  VENDOR_REFRESH_TOKEN: `/vendor/refresh-token`,
  ADMIN_REFRESH_TOKEN: `/admin/refresh-token`,


  VENDOR_CATEGORIES : '/vendor/categories',
  CLIENT_CATEGORIES : '/client/categories'
};
